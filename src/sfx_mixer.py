import os
import sys
import json
import subprocess

def extract_events_from_show_json(show):
    events = []
    
    # 1. Chapters
    for ch in show.get('chapters', []):
        t = float(ch.get('t', 0))
        events.append({'t': t, 'sfx': 'whoosh.mp3', 'vol': 0.45, 'desc': f'chapter: {ch.get("zh")}'})
        
    # 2. Elements
    for el in show.get('elements', []):
        t = float(el.get('at', 0))
        anim = el.get('anim')
        el_type = el.get('type')
        
        if anim == 'stamp':
            events.append({'t': t, 'sfx': 'stamp.mp3', 'vol': 0.70, 'desc': f'stamp: {el.get("id") or el_type}'})
        elif anim == 'grow':
            events.append({'t': t, 'sfx': 'grow.mp3', 'vol': 0.40, 'desc': f'grow: {el.get("id") or el_type}'})
        elif el_type == 'card':
            events.append({'t': t, 'sfx': 'pop.mp3', 'vol': 0.40, 'desc': f'card: {el.get("id")}'})
        elif anim == 'wipe':
            events.append({'t': t, 'sfx': 'swish.mp3', 'vol': 0.35, 'desc': f'wipe: {el.get("id") or el_type}'})
            
        # Element FX
        for f in el.get('fx', []):
            ft = float(f.get('t', 0))
            fdo = f.get('do')
            if fdo in ('pulse', 'squash'):
                events.append({'t': ft, 'sfx': 'pop.mp3', 'vol': 0.45, 'desc': f'fx:{fdo}'})
            elif fdo in ('shake', 'wobble'):
                events.append({'t': ft, 'sfx': 'wrong.mp3', 'vol': 0.40, 'desc': f'fx:{fdo}'})

    # 3. Actors
    for ac in show.get('actors', []):
        keys = ac.get('keys', [])
        for i in range(len(keys) - 1):
            k_curr = keys[i]
            k_next = keys[i + 1]
            if k_next.get('move') == 'jump':
                t_end = float(k_next.get('t', 0))
                dur = float(k_next.get('dur', 0.48))
                t_start = max(float(k_curr.get('t', 0)), t_end - dur)
                # launch sound
                events.append({'t': t_start, 'sfx': 'swish.mp3', 'vol': 0.60, 'desc': 'jump_launch'})
                # land sound
                events.append({'t': t_end, 'sfx': 'land.mp3', 'vol': 0.80, 'desc': 'jump_land'})
            elif k_next.get('move') == 'pop':
                t_pop = float(k_next.get('t', 0))
                events.append({'t': t_pop, 'sfx': 'pop.mp3', 'vol': 0.65, 'desc': 'actor_pop'})
        
        # Acts
        for act in ac.get('acts', []):
            at = float(act.get('t', 0))
            ado = act.get('do')
            if ado == 'bounce':
                events.append({'t': at, 'sfx': 'pop.mp3', 'vol': 0.45, 'desc': 'act:bounce'})
            elif ado in ('shake', 'wobble'):
                events.append({'t': at, 'sfx': 'wrong.mp3', 'vol': 0.45, 'desc': f'act:{ado}'})
            elif ado == 'nod':
                events.append({'t': at, 'sfx': 'swish.mp3', 'vol': 0.25, 'desc': 'act:nod'})

        # Speech bubbles
        for s in ac.get('say', []):
            st = float(s.get('t', 0))
            events.append({'t': st, 'sfx': 'bubble.mp3', 'vol': 0.50, 'desc': f'say:{s.get("text")}'})

    # Sort by time
    events.sort(key=lambda x: x['t'])
    return events

def mix_sfx(events, sfx_dir, duration, voice_path, out_path):
    print(f"[SFX] Total {len(events)} events collected for duration {duration:.2f}s")
    if not events or not os.path.isdir(sfx_dir):
        print("[SFX] No events or sfx_dir missing, skipping SFX mix.")
        return False
        
    # Verify sfx files exist
    valid_events = []
    for e in events:
        p = os.path.join(sfx_dir, e['sfx'])
        if os.path.isfile(p):
            valid_events.append((e['t'], p, e['vol'], e['desc']))
        else:
            print(f"[SFX] Warning: {p} not found, skipping.")

    if not valid_events:
        return False

    # We build an ffmpeg filter_complex to construct the sfx track
    # Generate a silent background audio of length `duration`
    # anullsrc=r=44100:cl=stereo,atrim=duration={duration}[base]
    inputs = []
    filter_parts = [f"anullsrc=r=44100:cl=stereo,atrim=duration={duration:.3f}[base]"]
    mix_inputs = ["[base]"]

    for idx, (t, sfx_file, vol, desc) in enumerate(valid_events):
        delay_ms = int(t * 1000)
        inputs.extend(["-i", sfx_file])
        inp_idx = idx  # inputs start from index 0
        tag = f"s{idx}"
        filter_parts.append(f"[{inp_idx}:a]volume={vol:.2f},adelay={delay_ms}|{delay_ms}[{tag}]")
        mix_inputs.append(f"[{tag}]")

    filter_complex = ";".join(filter_parts) + f";{''.join(mix_inputs)}amix=inputs={len(mix_inputs)}:duration=first:dropout_transition=0:normalize=0[sfx_track]"

    sfx_track_wav = os.path.join(os.path.dirname(out_path), "sfx_track.wav")
    cmd_sfx = ["ffmpeg", "-y", "-loglevel", "error"] + inputs + ["-filter_complex", filter_complex, "-map", "[sfx_track]", sfx_track_wav]
    
    print(f"[SFX] Building SFX track with {len(valid_events)} audio triggers (normalize=0)...")
    res = subprocess.run(cmd_sfx)
    if res.returncode != 0 or not os.path.isfile(sfx_track_wav):
        print("[SFX] Error generating sfx_track.wav")
        return False

    # Now mix voice + sfx_track
    # voice at volume 1.0, sfx_track at volume 1.15
    # Both mixed with normalize=0 so neither is attenuated
    cmd_mix = [
        "ffmpeg", "-y", "-loglevel", "error",
        "-i", voice_path,
        "-i", sfx_track_wav,
        "-filter_complex",
        "[0:a]volume=1.0[v];[1:a]volume=1.15[s];[v][s]amix=inputs=2:duration=first:dropout_transition=0:normalize=0[out]",
        "-map", "[out]",
        "-c:a", "libmp3lame" if out_path.endswith(".mp3") else "aac",
        "-b:a", "192k",
        out_path
    ]
    # In Windows if libmp3lame is missing, fallback to aac
    res_mix = subprocess.run(cmd_mix)
    if res_mix.returncode != 0:
        # try without libmp3lame
        cmd_mix[-3] = "aac"
        cmd_mix[-1] = out_path.replace(".mp3", ".m4a")
        res_mix = subprocess.run(cmd_mix)
        if res_mix.returncode == 0:
            out_path = cmd_mix[-1]

    print(f"[SFX] Successfully generated mixed audio: {out_path}")
    return True

if __name__ == '__main__':
    # Test script standalone
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('--show-json', required=True)
    parser.add_argument('--sfx-dir', required=True)
    parser.add_argument('--voice', required=True)
    parser.add_argument('--out', required=True)
    args = parser.parse_args()

    with open(args.show_json, 'r', encoding='utf-8') as f:
        show = json.load(f)
        
    duration = float(show.get('duration', 51.0))
    events = extract_events_from_show_json(show)
    mix_sfx(events, args.sfx_dir, duration, args.voice, args.out)

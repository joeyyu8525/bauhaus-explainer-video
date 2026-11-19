// Usage: node src/render.mjs <show> --work <dir> [--from s] [--to s] [--stills t1,t2,...] [--audio file] [--out file]
// Renders <work>/shows/<show>.js frame by frame in headless Chrome and pipes PNGs into ffmpeg.
// --res <output width, default 1080> --ss <supersample factor, default 1; 2 = sharper, slower>
// --work defaults to the current directory. --audio / --out are relative to --work; stills go to <work>/out/stills.
import { chromium } from 'playwright-core';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawn, spawnSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const show = args[0];
const opt = (k, d) => { const i = args.indexOf('--' + k); return i > 0 ? args[i + 1] : d; };
if (!show) { console.error('missing show name'); process.exit(2); }
const work = path.resolve(opt('work', process.cwd()));
const showFile = path.join(work, 'shows', show + '.js');
if (!fs.existsSync(showFile)) { console.error('show not found: ' + showFile); process.exit(2); }

const browser = await chromium.launch({
  channel: 'chrome', headless: true,
  args: ['--allow-file-access-from-files', '--ignore-gpu-blocklist', '--use-angle=d3d11', '--force-color-profile=srgb'],
});
const resW = parseInt(opt('res', '1080'), 10), ss = parseFloat(opt('ss', '1'));
const outW = Math.round(resW / 2) * 2, outH = Math.round((resW * 1.25) / 2) * 2;
const dsf = (resW / 768) * ss;
const page = await browser.newPage({ viewport: { width: 768, height: 960 }, deviceScaleFactor: dsf });
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') console.log('[page]', m.text()); });
page.on('pageerror', (e) => console.log('[pageerror]', e.message));
await page.goto(pathToFileURL(path.join(root, 'src/page.html')).href + '?show=' + encodeURIComponent(pathToFileURL(showFile).href));
await page.waitForFunction('window.__ready === true || window.__error', null, { timeout: 60000 });
const err = await page.evaluate('window.__error');
if (err) { console.error('PAGE ERROR:\n' + err); await browser.close(); process.exit(1); }
const meta = await page.evaluate('window.__meta');
console.log('output:', outW + 'x' + outH, 'ss', ss, '| fonts:', await page.evaluate('window.__fonts'), '| meta:', JSON.stringify(meta));
const clip = { x: 0, y: 0, width: 768, height: 960 };

if (args.includes('--check')) {
  // layout check every 0.25 s. A problem is identified by its text without numbers;
  // consecutive samples (gaps up to 0.5 s) merge into one time range, reported with the worst detail.
  const step = 0.25, ranges = [];
  const keyOf = (k) => k.replace(/-?[\d.]+%?/g, '#').replace(/x=\[#,#\]|y1=#/g, '');
  const live = new Map();
  for (let t = 0; t <= meta.duration + 1e-6; t += step) {
    for (const k of await page.evaluate((tt) => window.__check(tt), t)) {
      const id = keyOf(k), cur = live.get(id);
      if (cur && t - cur.b <= 0.5 + 1e-6) { cur.b = t; cur.n++; cur.last = k; }
      else { const r0 = { id, a: t, b: t, n: 1, first: k, last: k }; live.set(id, r0); ranges.push(r0); }
    }
  }
  const list = ranges.filter((x) => x.n >= 2).sort((p, q) => p.a - q.a); // ignore one-sample flickers
  for (const x of list) console.log(`${x.a.toFixed(2).padStart(7)}–${x.b.toFixed(2).padEnd(7)} ${x.last}`);
  console.log(list.length ? `CHECK: ${list.length} problem(s)` : 'CHECK: OK');
  await browser.close(); process.exit(list.length ? 1 : 0);
}

const stills = opt('stills');
if (stills) {
  const dir = path.join(work, 'out', 'stills'); fs.mkdirSync(dir, { recursive: true });
  for (const s of stills.split(',')) {
    const t = parseFloat(s);
    await page.evaluate((tt) => window.__render(tt), t);
    const f = path.join(dir, `${show}_${t.toFixed(2).padStart(7, '0')}.png`);
    await page.screenshot({ path: f, clip, scale: 'device' });
    console.log('still', f);
  }
  await browser.close(); process.exit(0);
}

const fps = meta.fps;
const from = parseFloat(opt('from', '0')), to = parseFloat(opt('to', String(meta.duration)));
const audio = opt('audio');
let finalAudio = audio ? path.resolve(work, audio) : null;

// Auto SFX mixing if sfx assets exist and not disabled
const sfxDir = path.resolve(root, 'assets/sfx');
const workSfxDir = path.resolve(work, 'assets/sfx');
const effectiveSfxDir = fs.existsSync(workSfxDir) ? workSfxDir : fs.existsSync(sfxDir) ? sfxDir : null;
let tmpFiles = [];

if (finalAudio && effectiveSfxDir && !args.includes('--no-sfx')) {
  try {
    const showData = await page.evaluate(() => window.__show);
    const tmpShowJson = path.join(work, 'out', `__tmp_${show}_show.json`);
    fs.mkdirSync(path.dirname(tmpShowJson), { recursive: true });
    fs.writeFileSync(tmpShowJson, JSON.stringify(showData, null, 2), 'utf-8');
    const mixedAudio = path.join(work, 'out', `__tmp_${show}_mixed.m4a`);
    tmpFiles.push(tmpShowJson, mixedAudio, path.join(work, 'out', 'sfx_track.wav'));
    const mixerPy = path.join(root, 'src', 'sfx_mixer.py');
    const pyRes = spawnSync('python', [
      mixerPy,
      '--show-json', tmpShowJson,
      '--sfx-dir', effectiveSfxDir,
      '--voice', finalAudio,
      '--out', mixedAudio
    ], { stdio: 'inherit' });
    if (pyRes.status === 0 && fs.existsSync(mixedAudio)) {
      finalAudio = mixedAudio;
      console.log('[render] Auto SFX mixing enabled! Using mixed audio track.');
    }
  } catch (err) {
    console.log('[render] SFX mixing failed, falling back to original audio:', err.message);
  }
}

const out = path.resolve(work, opt('out', `out/${show}.mp4`));
fs.mkdirSync(path.dirname(out), { recursive: true });
const ff = ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'png', '-i', '-'];
if (finalAudio) ff.push('-ss', String(from), '-i', finalAudio);
ff.push('-vf', `scale=${outW}:${outH}:flags=lanczos`, '-c:v', 'libx264', '-preset', 'medium', '-crf', '16', '-pix_fmt', 'yuv420p', '-r', String(fps));
if (finalAudio) ff.push('-c:a', 'aac', '-b:a', '160k', '-shortest');
ff.push('-movflags', '+faststart', out);
const proc = spawn('ffmpeg', ff, { stdio: ['pipe', 'inherit', 'inherit'] });
const total = Math.round((to - from) * fps);
const t0 = Date.now();
for (let i = 0; i < total; i++) {
  await page.evaluate((tt) => window.__render(tt), from + i / fps);
  const buf = await page.screenshot({ clip, type: 'png' });
  if (!proc.stdin.write(buf)) await new Promise((r) => proc.stdin.once('drain', r));
  if (i % 110 === 0) console.log(`frame ${i}/${total} ${((Date.now() - t0) / 1000).toFixed(0)}s`);
}
proc.stdin.end();
const code = await new Promise((r) => proc.on('close', r));
await browser.close();
for (const f of tmpFiles) { try { if (fs.existsSync(f)) fs.unlinkSync(f); } catch {} }
console.log(`ffmpeg exit ${code}; ${total} frames in ${((Date.now() - t0) / 1000).toFixed(0)}s -> ${out}`);
process.exit(code);

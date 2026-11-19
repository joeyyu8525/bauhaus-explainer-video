// 23s style sample. Audio: audio/tts_test.mp3; line timings from the whisper transcript of that file.
// Figures: Argyle et al. (arXiv 2209.06899v1) Table 1, tetrachoric correlation, full sample.
const LINES = [
  ['a', 0.0, 5.84, '你有没有想过，做问卷调查，能不能不找人，直接找 AI 来填？'],
  ['b', 5.94, 8.5, '啊？让 AI 假装成受访者？'],
  ['a', 8.5, 14.02, '对。2023 年有一篇论文，就给这种做法起了个名字，叫硅基样本。'],
  ['b', 14.86, 16.44, '嗯……那它填得像吗？'],
  ['a', 17.22, 20.54, '在美国大选投票这件事上，还真挺像的。'],
  ['a', 20.62, 23.1, '不过，后面的故事就没这么简单了。'],
];

// one clause per subtitle, time split by character count
export function subsFrom(lines) {
  const out = [];
  for (const [who, s, e, text] of lines) {
    const parts = text.split(/(?<=[，。？！…])/).map((x) => x.trim()).filter(Boolean);
    const merged = [];
    for (const p of parts) {
      if (merged.length && merged[merged.length - 1].replace(/[，。？！…\s]/g, '').length < 3) merged[merged.length - 1] += p;
      else merged.push(p);
    }
    const total = merged.reduce((n, p) => n + p.length, 0);
    let t = s;
    for (const p of merged) {
      const d = ((e - s) * p.length) / total;
      out.push({ t, end: t + d, who, text: p.replace(/[，。]+$/, '') });
      t += d;
    }
  }
  return out;
}

const X = -3.3; // left margin of the text column

export function build(v) {
  const cam = (t, z, extra = {}) => ({ t, x: v.cx ?? 0.3, z: z + (v.dz ?? 0), dist: v.dist, yaw: v.yaw, pitch: v.pitch, ...extra });
  return {
    fps: 22,
    duration: 23.6,
    brand: '睿塔科技 | 周小鱼',
    theme: v.theme, dark: v.dark, shadow: v.shadow,
    chapters: [
      { t: 0, zh: '提问', en: "Today's Question", meta: '问卷 · 被试 · AI', color: 'yellow' },
      { t: 8.5, zh: '硅基样本', en: 'Silicon Sample', meta: 'Argyle et al. · 2023', color: 'red' },
      { t: 17.2, zh: '像不像', en: 'Fidelity', meta: 'ANES 2012 / 2016 / 2020', color: 'blue' },
    ],
    subs: subsFrom(LINES),
    camera: [
      cam(0, 0.2), cam(4.5, 1.2), cam(8.3, 2.6),
      cam(10.2, 9.0), cam(16.4, 10.4),
      cam(18.6, 17.4), cam(23.6, 19.4),
    ],
    actors: [
      { kind: 'human', keys: [{ t: 0.4, x: 4.0, z: 0.6 }, { t: 4.4, x: 4.0, z: 0.6 }, { t: 5.6, x: 4.0, z: 2.6 }, { t: 9.0, x: 4.0, z: 2.6 }, { t: 10.6, x: 4.0, z: 7.0 }, { t: 17.0, x: 4.0, z: 7.0 }, { t: 18.6, x: 3.9, z: 15.6 }] },
      { kind: 'bot', keys: [{ t: 5.9, x: 5.4, z: 4.6 }, { t: 6.9, x: 2.2, z: 4.4 }, { t: 9.2, x: 2.2, z: 4.4 }, { t: 10.8, x: 2.6, z: 11.6 }, { t: 17.2, x: 2.6, z: 11.6 }, { t: 18.8, x: 3.6, z: 18.6 }] },
    ],
    elements: [
      // S1 — the question
      { type: 'text', at: 0.1, x: X, z: -3.5, size: 0.3, font: 'enw', weight: 800, track: 0.3, text: 'WHAT IF NOBODY ANSWERS' },
      { type: 'text', at: 0.5, x: X, z: -2.6, size: 1.05, text: '做问卷调查' },
      { type: 'text', at: 2.7, x: X, z: -1.3, size: 1.05, anim: 'stamp', text: [{ t: '能不能', gap: 0.08 }, { t: '不找人', bg: 'red' }] },
      { type: 'card', at: 1.0, x: -1.4, z: 1.0, w: 3.8, d: 2.5, bar: 0.34, rot: 0 },
      { type: 'rect', at: 1.4, x: -2.95, z: 0.5, y: 0.09, w: 2.6, d: 0.2, color: 'ink' },
      { type: 'rect', at: 1.6, x: -2.95, z: 1.05, y: 0.09, w: 1.9, d: 0.2, color: 'grey' },
      { type: 'rect', at: 1.8, x: -2.95, z: 1.6, y: 0.09, w: 2.3, d: 0.2, color: 'grey' },
      { type: 'cyl', at: 1.9, x: 0.05, z: 1.05, y: 0.08, r: 0.16, h: 0.08, color: 'yellow' },
      { type: 'cyl', at: 2.1, x: 0.05, z: 1.6, y: 0.08, r: 0.16, h: 0.08, color: 'blue' },
      { type: 'text', at: 4.3, x: X, z: 3.2, size: 0.8, text: [{ t: '直接找', gap: 0.08 }, { t: 'AI', bg: 'blue', gap: 0.08 }, { t: '来填？' }] },
      { type: 'text', at: 6.3, x: X, z: 4.3, size: 0.52, text: [{ t: '让 AI ', gap: 0.02 }, { t: '假装', bg: 'yellow', gap: 0.06 }, { t: '成受访者' }] },

      // S2 — the name
      { type: 'text', at: 9.4, x: X, z: 6.0, size: 0.3, font: 'enw', weight: 800, track: 0.3, text: '2023 · POLITICAL ANALYSIS' },
      { type: 'text', at: 10.6, x: X, z: 6.8, size: 0.66, font: 'en', text: 'SILICON SAMPLE' },
      { type: 'text', at: 12.7, x: X, z: 8.2, size: 1.45, anim: 'stamp', text: [{ t: '硅基样本', bg: 'red' }] },
      { type: 'crowd', at: 13.2, x: -0.55, z: 10.4, cols: 11, rows: 3, gap: 0.5, s: 0.3, h: 0.22, span: 1.2, shuffle: true, mix: [['red', 0.4], ['blue', 0.4], ['ink', 0.2]] },
      { type: 'text', at: 15.0, x: X, z: 12.2, size: 0.8, text: [{ t: '填得', gap: 0.06 }, { t: '像吗？', bg: 'yellow' }] },

      // S3 — how close
      { type: 'text', at: 17.4, x: X, z: 14.0, size: 0.66, text: [{ t: '美国大选', bg: 'blue', gap: 0.1 }, { t: '投给了谁' }] },
      { type: 'text', at: 17.9, x: X, z: 14.8, size: 0.26, font: 'enw', weight: 800, track: 0.28, text: 'TETRACHORIC CORRELATION' },
      { type: 'box', at: 18.2, x: -2.3, z: 17.6, w: 1.0, d: 1.0, h: 1.80, color: 'blue', anim: 'grow', dur: 0.7 },
      { type: 'box', at: 18.5, x: -0.4, z: 17.6, w: 1.0, d: 1.0, h: 1.84, color: 'yellow', anim: 'grow', dur: 0.7 },
      { type: 'box', at: 18.8, x: 1.5, z: 17.6, w: 1.0, d: 1.0, h: 1.88, color: 'red', anim: 'grow', dur: 0.7 },
      { type: 'text', at: 18.6, x: -2.3, z: 18.7, size: 0.3, font: 'en', align: 'center', text: '2012' },
      { type: 'text', at: 18.8, x: -0.4, z: 18.7, size: 0.3, font: 'en', align: 'center', text: '2016' },
      { type: 'text', at: 19.0, x: 1.5, z: 18.7, size: 0.3, font: 'en', align: 'center', text: '2020' },
      { type: 'text', at: 19.0, x: -2.3, z: 19.3, size: 0.5, font: 'en', align: 'center', text: '0.90' },
      { type: 'text', at: 19.2, x: -0.4, z: 19.3, size: 0.5, font: 'en', align: 'center', text: '0.92' },
      { type: 'text', at: 19.4, x: 1.5, z: 19.3, size: 0.5, font: 'en', align: 'center', text: [{ t: '0.94', bg: 'red' }] },
      { type: 'text', at: 20.8, x: X, z: 20.6, size: 0.52, text: '后面的故事' },
      { type: 'text', at: 21.5, x: X, z: 21.5, size: 0.95, anim: 'stamp', text: [{ t: '没这么简单', bg: 'yellow' }] },
    ],
  };
}

// v0.2 feature demo (no audio): avatar poses, anchored actors, jump onto a bar, speech bubbles, element fx.
// Figures: Zhou et al. (2025), 60+ share — census 22.8%, Qwen 10.5%, ChatGPT 6.6% (p.168 of the PDF).
const A = (n) => new URL(`../assets/avatar/pose_${n}.png`, import.meta.url).href /* copy assets/avatar into the work dir, or point this at the skill folder */;
const X = -3.3;

export default {
  fps: 22,
  duration: 14,
  brand: '睿塔科技 | 周小鱼',
  chapters: [{ t: 0, zh: '换到中国', en: 'In China', meta: '周穆之等 · 2025 · 智能社会研究', color: 'red' }],
  subs: [
    { t: 0.3, end: 3.6, who: 'a', text: '六十岁以上的人，普查是百分之二十二点八' },
    { t: 3.6, end: 7.4, who: 'a', text: '两个模型只生成了百分之十点五和六点六' },
    { t: 7.4, end: 10.6, who: 'b', text: '老年人被它弄丢了一大半' },
    { t: 10.6, end: 14, who: 'a', text: '知道，但生成的时候没用上' },
  ],
  camera: [
    { t: 0, x: 0.2, z: 0.8, dist: 23.5, yaw: -15, pitch: 50 },
    { t: 14, x: 0.2, z: 2.6, dist: 24, yaw: -14, pitch: 50 },
  ],
  actors: [
    {
      kind: 'avatar', h: 2.5, defaultPose: 'stand',
      poses: { stand: A('stand'), talk: A('talk'), point: A('point'), think: A('think'), shrug: A('shrug'), sign: A('sign') },
      keys: [
        { t: 0.2, to: 'b_census', side: 'right', gap: 1.4 },
        { t: 3.4, to: 'b_census', side: 'right', gap: 1.4 },
        { t: 4.6, to: 'b_gpt', side: 'right', gap: 1.6 },
        { t: 10.4, to: 'b_gpt', side: 'right', gap: 1.6 },
        { t: 11.4, to: 'b_gpt', side: 'right', gap: 0.9, dz: 3.4 },
      ],
      pose: [
        { t: 0.2, p: 'talk' }, { t: 1.2, p: 'point' }, { t: 4.6, p: 'point' },
        { t: 7.4, p: 'shrug' }, { t: 10.6, p: 'think' }, { t: 12.6, p: 'sign' },
      ],
      acts: [{ t: 7.5, do: 'bounce', n: 2, h: 0.18 }],
      say: [{ t: 12.7, end: 14, text: '先验证，再使用', color: 'yellow' }],
    },
    {
      kind: 'bot',
      keys: [
        { t: 3.8, to: 'b_qwen', side: 'front', gap: 0.35, dx: -0.95 },
        { t: 5.4, to: 'b_qwen', side: 'front', gap: 0.35, dx: -0.95 },
        { t: 6.2, to: 'b_qwen', side: 'top', move: 'jump' },
        { t: 9.0, to: 'b_qwen', side: 'top' },
        { t: 9.8, to: 'b_qwen', side: 'front', gap: 0.35, dx: -0.95, move: 'jump', face: 30 },
      ],
      acts: [{ t: 7.6, do: 'shake', dur: 0.7 }, { t: 10.8, do: 'wobble', dur: 0.8 }],
      say: [{ t: 6.4, end: 8.8, text: '我只生成了 10.5%……', color: 'blue' }],
    },
  ],
  elements: [
    { type: 'text', at: 0.1, x: X, z: -3.4, size: 0.28, font: 'enw', weight: 800, track: 0.3, text: 'AGED 60+ · SHARE OF POPULATION' },
    { id: 't_title', type: 'text', at: 0.3, x: X, z: -2.4, size: 0.9, text: [{ t: '六十岁以上', gap: 0.08 }, { t: '占比', bg: 'blue' }] },
    { id: 'b_census', type: 'box', at: 0.6, x: -2.4, z: 1.2, w: 1.1, d: 1.1, h: 2.28, color: 'ink', anim: 'grow', dur: 0.8,
      fx: [{ t: 8.0, do: 'pulse', dur: 0.7 }] },
    { id: 'b_qwen', type: 'box', at: 3.9, x: -0.6, z: 1.2, w: 1.1, d: 1.1, h: 1.05, color: 'yellow', anim: 'grow', dur: 0.7,
      fx: [{ t: 6.6, do: 'squash', dur: 0.5, amt: 0.25 }] },
    { id: 'b_gpt', type: 'box', at: 4.3, x: 1.2, z: 1.2, w: 1.1, d: 1.1, h: 0.66, color: 'red', anim: 'grow', dur: 0.7 },
    { type: 'text', at: 0.9, x: -2.4, z: 2.4, size: 0.3, font: 'zh', weight: 700, align: 'center', text: '人口普查' },
    { type: 'text', at: 4.1, x: -0.6, z: 2.4, size: 0.3, font: 'zh', weight: 700, align: 'center', text: '通义千问' },
    { type: 'text', at: 4.5, x: 1.2, z: 2.4, size: 0.3, font: 'zh', weight: 700, align: 'center', text: 'ChatGPT' },
    { type: 'text', at: 1.1, x: -2.4, z: 3.0, size: 0.5, font: 'en', align: 'center', text: '22.8%' },
    { type: 'text', at: 4.3, x: -0.6, z: 3.0, size: 0.5, font: 'en', align: 'center', text: [{ t: '10.5%', bg: 'yellow' }] },
    { type: 'text', at: 4.7, x: 1.2, z: 3.0, size: 0.5, font: 'en', align: 'center', text: [{ t: '6.6%', bg: 'red' }] },
    { type: 'text', at: 7.6, x: X, z: 4.3, size: 0.85, anim: 'stamp', text: [{ t: '丢了一大半', bg: 'red' }], fx: [{ t: 8.4, do: 'shake', dur: 0.5 }] },
    { id: 'l_know', type: 'text', at: 10.8, x: X, z: 5.4, size: 0.56, text: [{ t: '知道', bg: 'blue', gap: 0.06 }, { t: '≠', gap: 0.06 }, { t: '用上', bg: 'yellow' }] },
  ],
};

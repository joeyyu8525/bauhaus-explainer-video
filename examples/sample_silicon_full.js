// 完整 9 章剧本数据 shows/full.js
// 时长：325.5 秒 (5分25秒)，对应音频 audio/full.mp3
// 风格基准：小样 A (yaw: -15, pitch: 50, dist: 24, cx: 0.0)

const LINES = [
  [
    "a",
    0.0,
    5.22,
    "你有没有想过，做问卷调查，能不能不找人，直接找 AI 来填？"
  ],
  [
    "b",
    5.22,
    8.04,
    "啊？让 AI 假装成受访者？"
  ],
  [
    "a",
    8.04,
    16.26,
    "对。心理学、社会学里，这几年真有一批研究在认真试这件事。今天我们就顺着七篇文献，看看它到底行不行。"
  ],
  [
    "a",
    17.02,
    28.62,
    "起点是二零二三年的一篇论文。作者拿美国大选调查里真实受访者的信息，种族、年龄、党派这些，写成一段第一人称的背景故事，交给 GPT-3。"
  ],
  [
    "b",
    28.62,
    31.7,
    "然后让它接着往下说，我投给了谁？"
  ],
  [
    "a",
    31.88,
    37.18,
    "没错。一个真人，对应一个 AI 分身，他们管这叫硅基样本。"
  ],
  [
    "b",
    37.18,
    39.16,
    "那猜得准吗？"
  ],
  [
    "a",
    39.7,
    46.8,
    "三届大选，它和真人投票的四分相关，是零点九、零点九二、零点九四。"
  ],
  [
    "b",
    46.8,
    48.22,
    "哇，这么高。"
  ],
  [
    "a",
    48.56,
    55.88,
    "但只看纯独立选民，二零二零年这个数只有零点零二。党派信号一弱，它就不灵了。"
  ],
  [
    "b",
    57.26,
    60.94,
    "可是，我得先有每个人的资料，才能造分身吧？"
  ],
  [
    "a",
    61.16,
    72.78,
    "所以二零二四年有人改了一步：只要群体的人口比例，随机拼出虚拟受访者。五千四百四十一份回答，一小时，零点七美元。"
  ],
  [
    "b",
    73.16,
    75.76,
    "这也太便宜了。结果呢？"
  ],
  [
    "a",
    76.3,
    85.12,
    "投票题上，拜登的得票率，真实调查是百分之五十八点九，AI 十次平均是百分之五十七点四。"
  ],
  [
    "b",
    85.12,
    86.3,
    "很接近啊。"
  ],
  [
    "a",
    86.34,
    99.22,
    "可换成十道别的题，只有收入不平等那一道对得上。比如问种族多样性好不好，黑人受访者里百分之五十五说更好，AI 扮演的黑人，百分之九十八说更好。"
  ],
  [
    "b",
    99.48,
    101.78,
    "它在挑最不得罪人的答案。"
  ],
  [
    "a",
    101.87,
    103.12,
    "作者也是这么推测的。"
  ],
  [
    "b",
    103.76,
    105.52,
    "那心理学实验呢？"
  ],
  [
    "a",
    105.68,
    115.08,
    "同样是二零二三年，有一篇短评让 GPT-3.5 给四百六十四个道德情境打分，和人类平均评分的相关是零点九五。"
  ],
  [
    "b",
    115.08,
    117.46,
    "那不就可以替代被试了？"
  ],
  [
    "a",
    117.46,
    128.22,
    "作者自己泼了冷水。他们说这只是一个个案；模型擅长逼近平均值，不擅长捕捉人和人的差异。而且一个模型，说到底只能算一名被试。"
  ],
  [
    "b",
    128.64,
    130.44,
    "所以结论是？"
  ],
  [
    "a",
    130.44,
    133.62,
    "原话是，人类被试暂时是安全的。"
  ],
  [
    "b",
    134.62,
    136.94,
    "这些都是美国数据。换到中国呢？"
  ],
  [
    "a",
    137.14,
    146.38,
    "二零二五年有一项研究，让通义千问和 ChatGPT 扮演二零二零年被随机抽中的中国受访者，再和人口普查比。"
  ],
  [
    "b",
    146.38,
    147.26,
    "对得上吗？"
  ],
  [
    "a",
    147.66,
    158.44,
    "平均年龄对上了，三十九岁左右。可六十岁以上的人，普查是百分之二十二点八，两个模型只生成了百分之十点五和百分之六点六。"
  ],
  [
    "b",
    158.44,
    159.98,
    "老年人被它弄丢了一大半。"
  ],
  [
    "a",
    160.16,
    166.98,
    "更有意思的是，直接问它中国的人口数据，它答得出来。知道，但生成的时候没用上。"
  ],
  [
    "b",
    167.62,
    169.36,
    "那态度题呢？"
  ],
  [
    "a",
    169.36,
    185.32,
    "问社会福利会不会让人变懒，五分是非常不同意。真实调查平均三点二，两个模型是四点三和四点五，而且答得更整齐。作者有一句话：模型输出的是最大可能性的回答，而非具有代表性的回答。"
  ],
  [
    "a",
    186.02,
    195.92,
    "同一期还有一篇，用的是中国综合社会调查里，七千七百二十四个人对医疗卫生的信心。三个模型，每个真人配一个分身。"
  ],
  [
    "b",
    195.92,
    197.54,
    "这回资料给得很细了吧。"
  ],
  [
    "a",
    197.54,
    204.54,
    "很细，连有没有医保、有没有慢性病都给了。可真人和分身的答案，Gamma 系数都不到零点二。"
  ],
  [
    "b",
    204.54,
    205.16,
    "这么低？"
  ],
  [
    "a",
    205.94,
    213.26,
    "真人里选“有一些信心”的是百分之三十二点六，模型在百分之五十七到七十五之间。它们都往中间靠。"
  ],
  [
    "b",
    213.26,
    215.62,
    "那同一个模型，隔两个月再问一遍呢？"
  ],
  [
    "a",
    216.18,
    228.24,
    "也不完全一样，系数在零点八到零点九五之间。还有，有没有医保这个变量，真人数据里几乎没影响，有的模型里却成了很强的正向影响。"
  ],
  [
    "b",
    228.3,
    231.5,
    "平均值偏了，变量之间的关系也变了。"
  ],
  [
    "a",
    231.5,
    233.84,
    "所以标题叫，复现的限度。"
  ],
  [
    "b",
    233.84,
    238.2,
    "那拿来开发量表呢？先让 AI 试填一轮。"
  ],
  [
    "a",
    238.3,
    248.82,
    "二零二六年有人试了。一份批判性思维倾向量表，一边是一千四百七十七名八年级学生，一边是三个模型生成的四千九百三十份答卷。"
  ],
  [
    "b",
    249.22,
    249.82,
    "结果？"
  ],
  [
    "a",
    250.44,
    255.1,
    "“开放包容”这个维度，所有模拟样本的信度系数都是负数。"
  ],
  [
    "b",
    255.88,
    260.42,
    "负数？那这几道题在 AI 那里，根本拧不成一个维度。"
  ],
  [
    "a",
    260.52,
    268.56,
    "而且让模型扮演初中生，整体反而比不给角色更差。有一个模型还会拒答，回收率最低只有百分之五十九。"
  ],
  [
    "b",
    268.56,
    270.82,
    "加人设，不一定更像人。"
  ],
  [
    "b",
    271.28,
    272.4,
    "为什么会这样？"
  ],
  [
    "a",
    272.58,
    283.08,
    "二零二六年一篇综述给了解释。模型是把海量人类文本压缩进去的，它模拟的是人类表达的外在形式，而不是心智的内在机制。"
  ],
  [
    "b",
    283.08,
    285.02,
    "所以它像一个平均的人。"
  ],
  [
    "a",
    285.02,
    289.52,
    "再加上安全对齐，有些它知道的东西，被训练得不那么说出来。"
  ],
  [
    "b",
    289.52,
    291.14,
    "那它还有用吗？"
  ],
  [
    "a",
    291.14,
    303.8,
    "有。综述建议的用法是：正式研究之前做预研究，评估一个实验可不可复制，模拟不方便找真人的敏感议题。前提是，标明数据来自真人还是 AI。"
  ],
  [
    "b",
    304.54,
    305.9,
    "那我总结一下。"
  ],
  [
    "a",
    305.9,
    306.3,
    "你来。"
  ],
  [
    "b",
    307.02,
    311.86,
    "第一，它像，是像在平均值上；人和人的差异，它会抹平。"
  ],
  [
    "a",
    311.96,
    316.14,
    "第二，题目一换、人群一换，像不像就得重新验证。"
  ],
  [
    "b",
    316.38,
    319.4,
    "第三，它是真人研究的补充，不是替代。"
  ],
  [
    "a",
    319.86,
    324.76,
    "七篇读下来，我的感受就一句：先验证，再使用。我是周小鱼，我们下次见。"
  ]
];

// 自动切分短句字幕
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

const X = -3.3; // 左对齐基准线

export function build(v = {}) {
  const cam = (t, z, extra = {}) => ({
    t,
    x: v.cx ?? 0.0,
    z: z + (v.dz ?? 0),
    dist: v.dist ?? 24,
    yaw: v.yaw ?? -15,
    pitch: v.pitch ?? 50,
    ...extra
  });

  return {
    fps: 22,
    duration: 326.0,
    brand: '睿塔科技 | 周小鱼',
    theme: v.theme,
    dark: v.dark,
    shadow: v.shadow ?? 0.2,

    chapters: [
      { t: 0.0,   zh: '提问',     en: "Today's Question", meta: '问卷 · 被试 · AI',                   color: 'yellow' },
      { t: 17.0,  zh: '硅基样本', en: 'Silicon Sample',   meta: 'Argyle et al. · 2023 · arXiv',      color: 'red' },
      { t: 57.2,  zh: '随机抽样', en: 'Random Sampling',  meta: 'Sun et al. · 2024 · arXiv',         color: 'yellow' },
      { t: 103.7, zh: '替代被试', en: 'Human Subjects',   meta: 'Dillion et al. · 2023 · TiCS',      color: 'blue' },
      { t: 134.6, zh: '换到中国', en: 'In China',         meta: '周穆之等 · 2025 · 智能社会研究',     color: 'red' },
      { t: 186.0, zh: '复现限度', en: 'Limits',           meta: '凌宛莹、崔思瞻 · 2025 · 智能社会研究', color: 'blue' },
      { t: 233.8, zh: '量表开发', en: 'Scale Dev',        meta: '李鲁越等 · 2026 · 现代教育技术',     color: 'yellow' },
      { t: 271.2, zh: '机制根源', en: 'Why It Fails',     meta: '谢天、邱林 · 2026 · 心理科学',       color: 'blue' },
      { t: 304.5, zh: '总结',     en: 'Takeaways',        meta: '七篇文献综合归纳 · 2023–2026',       color: 'red' },
    ],

    subs: subsFrom(LINES),

    camera: [
      // Ch 1 (0 - 16.3s)
      cam(0.0, 0.2), cam(5.0, 1.2), cam(15.5, 2.6),
      // Ch 2 (17.0 - 55.9s)
      cam(17.5, 8.5), cam(24.0, 9.8), cam(34.0, 12.0), cam(42.0, 14.8), cam(54.0, 17.5),
      // Ch 3 (57.2 - 103.1s)
      cam(57.5, 23.5), cam(65.0, 25.5), cam(78.0, 28.5), cam(92.0, 31.8), cam(101.5, 34.0),
      // Ch 4 (103.7 - 133.6s)
      cam(104.5, 39.5), cam(112.0, 41.5), cam(122.0, 44.2), cam(132.0, 46.8),
      // Ch 5 (134.6 - 185.3s)
      cam(135.5, 52.8), cam(145.0, 55.0), cam(158.0, 58.5), cam(172.0, 61.8), cam(183.5, 64.0),
      // Ch 6 (186.0 - 233.8s)
      cam(187.0, 69.8), cam(198.0, 72.5), cam(210.0, 75.8), cam(224.0, 78.5), cam(232.0, 80.5),
      // Ch 7 (233.8 - 270.8s)
      cam(235.0, 86.0), cam(245.0, 88.5), cam(257.0, 92.0), cam(269.0, 94.8),
      // Ch 8 (271.2 - 303.8s)
      cam(272.5, 101.2), cam(282.0, 103.5), cam(292.0, 106.8), cam(302.0, 109.5),
      // Ch 9 (304.5 - 325.5s)
      cam(305.5, 116.2), cam(312.0, 118.5), cam(320.0, 122.0), cam(325.5, 124.5),
    ],

    actors: [
      {
        kind: 'human',
        keys: [
          // Ch 1
          { t: 0.4, x: 4.0, z: 0.6 }, { t: 4.4, x: 4.0, z: 0.6 }, { t: 5.6, x: 4.0, z: 2.6 }, { t: 15.0, x: 4.0, z: 2.6 },
          // Ch 2
          { t: 17.5, x: 4.0, z: 8.0 }, { t: 30.0, x: 4.0, z: 11.5 }, { t: 40.0, x: 3.9, z: 15.0 }, { t: 54.0, x: 3.9, z: 17.5 },
          // Ch 3
          { t: 57.5, x: 4.0, z: 24.5 }, { t: 75.0, x: 4.0, z: 28.5 }, { t: 90.0, x: 4.0, z: 32.0 },
          // Ch 4
          { t: 104.5, x: 4.0, z: 40.5 }, { t: 118.0, x: 4.0, z: 44.5 },
          // Ch 5
          { t: 135.5, x: 4.0, z: 54.0 }, { t: 155.0, x: 4.0, z: 58.5 }, { t: 175.0, x: 4.0, z: 62.5 },
          // Ch 6
          { t: 187.0, x: 4.0, z: 71.0 }, { t: 205.0, x: 4.0, z: 75.5 }, { t: 225.0, x: 4.0, z: 79.5 },
          // Ch 7
          { t: 235.0, x: 4.0, z: 87.0 }, { t: 255.0, x: 4.0, z: 92.0 },
          // Ch 8
          { t: 272.5, x: 4.0, z: 102.5 }, { t: 290.0, x: 4.0, z: 107.5 },
          // Ch 9
          { t: 305.5, x: 3.8, z: 117.5 }, { t: 318.0, x: 3.8, z: 122.5 },
        ]
      },
      {
        kind: 'bot',
        keys: [
          // Ch 1
          { t: 5.2, x: 5.2, z: 4.0 }, { t: 6.2, x: 2.2, z: 4.2 }, { t: 15.0, x: 2.2, z: 4.2 },
          // Ch 2
          { t: 17.5, x: 2.4, z: 9.5 }, { t: 28.6, x: 2.4, z: 10.8 }, { t: 37.0, x: 2.4, z: 13.5 }, { t: 46.8, x: 2.5, z: 17.0 },
          // Ch 3
          { t: 57.2, x: 2.4, z: 23.5 }, { t: 73.0, x: 2.4, z: 27.5 }, { t: 85.0, x: 2.4, z: 30.5 }, { t: 99.0, x: 2.4, z: 33.5 },
          // Ch 4
          { t: 103.7, x: 2.4, z: 39.5 }, { t: 115.0, x: 2.4, z: 43.0 }, { t: 128.0, x: 2.4, z: 46.0 },
          // Ch 5
          { t: 134.6, x: 2.4, z: 53.0 }, { t: 147.0, x: 2.4, z: 56.5 }, { t: 167.0, x: 2.4, z: 61.5 },
          // Ch 6
          { t: 186.0, x: 2.4, z: 70.0 }, { t: 195.9, x: 2.4, z: 73.5 }, { t: 215.5, x: 2.4, z: 77.5 },
          // Ch 7
          { t: 233.8, x: 2.4, z: 86.0 }, { t: 249.0, x: 2.4, z: 90.0 }, { t: 268.0, x: 2.4, z: 94.0 },
          // Ch 8
          { t: 271.2, x: 2.4, z: 101.5 }, { t: 283.0, x: 2.4, z: 105.0 }, { t: 291.5, x: 2.4, z: 108.5 },
          // Ch 9
          { t: 304.5, x: 2.2, z: 116.5 }, { t: 316.0, x: 2.2, z: 121.0 },
        ]
      }
    ],

    elements: [
      // ==========================================
      // CHAPTER 1: 提问 (0.00s - 16.26s)
      // ==========================================
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
      { type: 'text', at: 5.5, x: X, z: 4.3, size: 0.52, text: [{ t: '让 AI ', gap: 0.02 }, { t: '假装', bg: 'yellow', gap: 0.06 }, { t: '成受访者' }] },
      { type: 'text', at: 8.5, x: X, z: 5.4, size: 0.56, text: [{ t: '顺着', gap: 0.05 }, { t: '七篇权威文献', bg: 'blue' }] },

      // ==========================================
      // CHAPTER 2: 硅基样本 (17.02s - 55.88s)
      // ==========================================
      { type: 'text', at: 17.2, x: X, z: 7.0, size: 0.3, font: 'enw', weight: 800, track: 0.3, text: '2023 · POLITICAL ANALYSIS' },
      { type: 'text', at: 18.0, x: X, z: 7.8, size: 0.62, font: 'en', text: 'SILICON SAMPLE' },
      { type: 'text', at: 19.5, x: X, z: 8.8, size: 1.25, anim: 'stamp', text: [{ t: '硅基样本', bg: 'red' }] },
      { type: 'text', at: 24.0, x: X, z: 9.8, size: 0.48, text: '真人背景故事交给 GPT-3 模拟投票' },
      { type: 'crowd', at: 26.0, x: -0.55, z: 11.2, cols: 10, rows: 2, gap: 0.5, s: 0.3, h: 0.22, span: 1.0, shuffle: true, mix: [['red', 0.5], ['blue', 0.5]] },
      { type: 'text', at: 32.0, x: X, z: 12.6, size: 0.65, text: [{ t: '一个真人', bg: 'blue', gap: 0.1 }, { t: '对应一个 AI 分身' }] },
      
      // 柱状图：全样本四分相关
      { type: 'text', at: 39.5, x: X, z: 13.8, size: 0.56, text: '三届大选 · 全样本四分相关' },
      { type: 'text', at: 40.0, x: X, z: 14.5, size: 0.26, font: 'enw', weight: 800, track: 0.28, text: 'TETRACHORIC CORRELATION' },
      { type: 'box', at: 40.5, x: -2.3, z: 17.0, w: 1.0, d: 1.0, h: 1.80, color: 'blue', anim: 'grow', dur: 0.7 },
      { type: 'box', at: 40.8, x: -0.4, z: 17.0, w: 1.0, d: 1.0, h: 1.84, color: 'yellow', anim: 'grow', dur: 0.7 },
      { type: 'box', at: 41.1, x: 1.5, z: 17.0, w: 1.0, d: 1.0, h: 1.88, color: 'red', anim: 'grow', dur: 0.7 },
      { type: 'text', at: 41.0, x: -2.3, z: 18.1, size: 0.3, font: 'en', align: 'center', text: '2012' },
      { type: 'text', at: 41.2, x: -0.4, z: 18.1, size: 0.3, font: 'en', align: 'center', text: '2016' },
      { type: 'text', at: 41.4, x: 1.5, z: 18.1, size: 0.3, font: 'en', align: 'center', text: '2020' },
      { type: 'text', at: 41.3, x: -2.3, z: 18.7, size: 0.5, font: 'en', align: 'center', text: '0.90' },
      { type: 'text', at: 41.5, x: -0.4, z: 18.7, size: 0.5, font: 'en', align: 'center', text: '0.92' },
      { type: 'text', at: 41.7, x: 1.5, z: 18.7, size: 0.5, font: 'en', align: 'center', text: [{ t: '0.94', bg: 'red' }] },

      // 转折：独立选民
      { type: 'text', at: 48.5, x: X, z: 19.8, size: 0.52, text: '纯独立选民 (2020 大选)' },
      { type: 'box', at: 49.0, x: 2.7, z: 19.8, w: 0.6, d: 0.6, h: 0.08, color: 'grey', anim: 'grow' },
      { type: 'text', at: 49.3, x: 2.7, z: 20.6, size: 0.42, font: 'en', align: 'center', text: [{ t: '0.02', bg: 'yellow' }] },
      { type: 'text', at: 52.0, x: X, z: 21.3, size: 0.75, anim: 'stamp', text: [{ t: '党派信号一弱，', gap: 0.05 }, { t: '就不灵了', bg: 'yellow' }] },

      // ==========================================
      // CHAPTER 3: 随机硅基抽样 (57.26s - 103.12s)
      // ==========================================
      { type: 'text', at: 57.5, x: X, z: 23.2, size: 0.3, font: 'enw', weight: 800, track: 0.3, text: '2024 · RANDOM SILICON SAMPLING' },
      { type: 'text', at: 61.2, x: X, z: 24.0, size: 0.95, text: [{ t: '按人口比例', bg: 'blue', gap: 0.08 }, { t: '随机拼虚拟受访者' }] },
      
      // 成本卡片
      { type: 'card', at: 68.0, x: -0.7, z: 25.8, w: 5.2, d: 2.0, bar: 0.28 },
      { type: 'text', at: 68.2, x: -3.0, z: 25.3, y: 0.09, size: 0.34, font: 'en', text: '5441 RESPONSES' },
      { type: 'text', at: 68.5, x: -3.0, z: 26.1, y: 0.09, size: 0.44, text: [{ t: '1 小时', bg: 'yellow', gap: 0.1 }, { t: '$0.70 美元', bg: 'red' }] },

      // 拜登得票率对比柱
      { type: 'text', at: 76.0, x: X, z: 27.6, size: 0.52, text: '总统投票 · 拜登得票率' },
      { type: 'box', at: 77.0, x: -1.8, z: 30.2, w: 1.1, d: 1.0, h: 1.77, color: 'blue', anim: 'grow', dur: 0.6 },
      { type: 'box', at: 77.5, x: 0.2, z: 30.2, w: 1.1, d: 1.0, h: 1.72, color: 'yellow', anim: 'grow', dur: 0.6 },
      { type: 'text', at: 77.8, x: -1.8, z: 31.3, size: 0.3, align: 'center', text: '真实调查 ANES' },
      { type: 'text', at: 78.0, x: 0.2, z: 31.3, size: 0.3, align: 'center', text: 'AI 10次平均' },
      { type: 'text', at: 78.2, x: -1.8, z: 31.9, size: 0.46, font: 'en', align: 'center', text: '58.9%' },
      { type: 'text', at: 78.5, x: 0.2, z: 31.9, size: 0.46, font: 'en', align: 'center', text: '57.4%' },

      // 10 题仅 1 题
      { type: 'text', at: 87.0, x: X, z: 32.8, size: 0.65, anim: 'stamp', text: [{ t: '换成十道题：', gap: 0.05 }, { t: '仅 1 题可复现', bg: 'red' }] },

      // 种族多样性极端偏见
      { type: 'text', at: 91.0, x: X, z: 34.0, size: 0.46, text: '种族多样性认可度 (黑人受访者)' },
      { type: 'box', at: 92.0, x: -1.5, z: 36.2, w: 0.9, d: 0.8, h: 1.65, color: 'blue', anim: 'grow' },
      { type: 'box', at: 92.5, x: 0.5, z: 36.2, w: 0.9, d: 0.8, h: 2.94, color: 'red', anim: 'grow' },
      { type: 'text', at: 93.0, x: -1.5, z: 37.2, size: 0.28, align: 'center', text: '真人黑人: 55%' },
      { type: 'text', at: 93.2, x: 0.5, z: 37.2, size: 0.28, align: 'center', text: [{ t: 'AI 扮演: 98%', bg: 'red' }] },
      { type: 'text', at: 99.5, x: X, z: 38.0, size: 0.65, anim: 'stamp', text: [{ t: '挑最不得罪人的答案', bg: 'yellow' }] },

      // ==========================================
      // CHAPTER 4: 能替代被试吗 (103.76s - 133.62s)
      // ==========================================
      { type: 'text', at: 104.0, x: X, z: 39.5, size: 0.3, font: 'enw', weight: 800, track: 0.3, text: '2023 · TRENDS IN COGNITIVE SCIENCES' },
      { type: 'text', at: 105.8, x: X, z: 40.3, size: 0.82, text: [{ t: '464 个道德情境打分', bg: 'blue' }] },
      
      { type: 'box', at: 108.0, x: -0.2, z: 43.0, w: 1.4, d: 1.4, h: 1.9, color: 'blue', anim: 'grow', dur: 0.7 },
      { type: 'text', at: 109.5, x: -0.2, z: 44.2, size: 0.3, align: 'center', text: '与人类均分相关系数' },
      { type: 'text', at: 110.0, x: -0.2, z: 44.9, size: 0.7, font: 'en', align: 'center', text: [{ t: 'r = 0.95', bg: 'red' }] },

      { type: 'text', at: 117.5, x: X, z: 46.2, size: 0.58, text: '作者泼冷水：这只是个案' },
      { type: 'text', at: 121.0, x: X, z: 47.3, size: 0.52, text: [{ t: '擅长逼近平均值', bg: 'yellow', gap: 0.08 }, { t: '不擅捕捉个体差异' }] },
      { type: 'text', at: 125.0, x: X, z: 48.3, size: 0.52, text: [{ t: '一个模型，', gap: 0.05 }, { t: '只能算一名被试', bg: 'blue' }] },
      { type: 'text', at: 130.0, x: X, z: 49.5, size: 0.85, anim: 'stamp', text: [{ t: '人类被试暂时是安全的', bg: 'red' }] },

      // ==========================================
      // CHAPTER 5: 换到中国 (134.62s - 185.32s)
      // ==========================================
      { type: 'text', at: 135.0, x: X, z: 52.0, size: 0.3, font: 'enw', weight: 800, track: 0.3, text: '2025 · CHINESE POPULATION DATA' },
      { type: 'text', at: 137.0, x: X, z: 52.8, size: 0.82, text: [{ t: '通义千问 & ChatGPT', bg: 'blue' }] },
      { type: 'text', at: 140.0, x: X, z: 53.8, size: 0.50, text: '扮演 2020 年抽中的中国受访者' },

      // 年龄 vs 老年人占比
      { type: 'text', at: 147.8, x: X, z: 55.0, size: 0.48, text: '平均年龄: 39 岁 (吻合普查 38.8 岁)' },
      { type: 'text', at: 150.0, x: X, z: 56.0, size: 0.56, text: '60 岁及以上人口占比' },
      
      { type: 'box', at: 151.0, x: -2.3, z: 58.6, w: 1.0, d: 1.0, h: 2.28, color: 'blue', anim: 'grow', dur: 0.6 },
      { type: 'box', at: 151.5, x: -0.4, z: 58.6, w: 1.0, d: 1.0, h: 1.05, color: 'yellow', anim: 'grow', dur: 0.6 },
      { type: 'box', at: 152.0, x: 1.5, z: 58.6, w: 1.0, d: 1.0, h: 0.66, color: 'red', anim: 'grow', dur: 0.6 },
      { type: 'text', at: 152.5, x: -2.3, z: 59.7, size: 0.28, align: 'center', text: '人口普查' },
      { type: 'text', at: 152.7, x: -0.4, z: 59.7, size: 0.28, align: 'center', text: 'GPT-4o' },
      { type: 'text', at: 152.9, x: 1.5, z: 59.7, size: 0.28, align: 'center', text: '通义千问' },
      { type: 'text', at: 153.2, x: -2.3, z: 60.3, size: 0.46, font: 'en', align: 'center', text: '22.8%' },
      { type: 'text', at: 153.4, x: -0.4, z: 60.3, size: 0.46, font: 'en', align: 'center', text: '10.5%' },
      { type: 'text', at: 153.6, x: 1.5, z: 60.3, size: 0.46, font: 'en', align: 'center', text: [{ t: '6.6%', bg: 'red' }] },
      { type: 'text', at: 160.2, x: X, z: 61.5, size: 0.65, anim: 'stamp', text: [{ t: '老年人被弄丢了一大半', bg: 'yellow' }] },
      { type: 'text', at: 164.0, x: X, z: 62.5, size: 0.52, text: [{ t: '直接问它知道数据，', gap: 0.05 }, { t: '生成时却没用上', bg: 'blue' }] },

      // 态度题
      { type: 'text', at: 170.0, x: X, z: 63.8, size: 0.52, text: '福利态度均值 (5分非常不同意)' },
      { type: 'box', at: 173.0, x: -1.6, z: 66.2, w: 0.9, d: 0.8, h: 1.60, color: 'blue', anim: 'grow' },
      { type: 'box', at: 173.4, x: -0.2, z: 66.2, w: 0.9, d: 0.8, h: 2.15, color: 'yellow', anim: 'grow' },
      { type: 'box', at: 173.8, x: 1.2, z: 66.2, w: 0.9, d: 0.8, h: 2.23, color: 'red', anim: 'grow' },
      { type: 'text', at: 174.0, x: -1.6, z: 67.3, size: 0.28, align: 'center', text: 'CGSS真实' },
      { type: 'text', at: 174.2, x: -0.2, z: 67.3, size: 0.28, align: 'center', text: 'GPT-4o' },
      { type: 'text', at: 174.4, x: 1.2, z: 67.3, size: 0.28, align: 'center', text: '通义千问' },
      { type: 'text', at: 174.1, x: -1.6, z: 67.9, size: 0.46, font: 'en', align: 'center', text: '3.2' },
      { type: 'text', at: 174.3, x: -0.2, z: 67.9, size: 0.46, font: 'en', align: 'center', text: '4.3' },
      { type: 'text', at: 174.5, x: 1.2, z: 67.9, size: 0.46, font: 'en', align: 'center', text: [{ t: '4.5', bg: 'red' }] },
      { type: 'text', at: 180.0, x: X, z: 69.2, size: 0.72, anim: 'stamp', text: [{ t: '最大可能性的回答', bg: 'red', gap: 0.08 }, { t: '≠ 具代表性的回答' }] },

      // ==========================================
      // CHAPTER 6: 复现的限度 (186.02s - 233.84s)
      // ==========================================
      { type: 'text', at: 186.2, x: X, z: 70.0, size: 0.3, font: 'enw', weight: 800, track: 0.3, text: '2025 · LIMITS OF REPLICATION' },
      { type: 'text', at: 187.5, x: X, z: 70.8, size: 0.75, text: [{ t: 'CGSS 7724 人', bg: 'blue', gap: 0.08 }, { t: '医疗卫生信心' }] },
      { type: 'text', at: 197.8, x: X, z: 71.8, size: 0.48, text: '给出细粒度资料 (医保、慢性病等)' },
      { type: 'text', at: 201.0, x: X, z: 72.8, size: 0.95, anim: 'stamp', text: [{ t: 'Gamma 系数均 < 0.20', bg: 'red' }] },

      // 中间靠拢柱
      { type: 'text', at: 205.5, x: X, z: 74.0, size: 0.52, text: '选择「有一些信心」比例' },
      { type: 'box', at: 206.5, x: -1.5, z: 76.5, w: 1.1, d: 1.0, h: 1.63, color: 'blue', anim: 'grow' },
      { type: 'box', at: 207.0, x: 0.5, z: 76.5, w: 1.1, d: 1.0, h: 3.3, color: 'yellow', anim: 'grow' },
      { type: 'text', at: 207.5, x: -1.5, z: 77.6, size: 0.3, align: 'center', text: '真人: 32.6%' },
      { type: 'text', at: 207.7, x: 0.5, z: 77.6, size: 0.3, align: 'center', text: [{ t: '模型: 57%~75%', bg: 'yellow' }] },
      { type: 'text', at: 212.0, x: X, z: 78.5, size: 0.65, text: [{ t: '严重往中间靠拢', bg: 'red' }] },

      // 变量关系扭曲
      { type: 'text', at: 220.5, x: X, z: 79.8, size: 0.50, text: '医保主效应扭曲' },
      { type: 'text', at: 223.0, x: X, z: 80.8, size: 0.52, text: [{ t: '真人: -0.06 (无显著影响)', gap: 0.05 }] },
      { type: 'text', at: 225.5, x: X, z: 81.6, size: 0.52, text: [{ t: '模型: +0.60 虚假强关联', bg: 'yellow' }] },
      { type: 'text', at: 229.0, x: X, z: 82.6, size: 0.75, anim: 'stamp', text: [{ t: '平均值偏了，变量关系也变了', bg: 'red' }] },

      // ==========================================
      // CHAPTER 7: 量表开发 (233.84s - 270.82s)
      // ==========================================
      { type: 'text', at: 234.0, x: X, z: 85.5, size: 0.3, font: 'enw', weight: 800, track: 0.3, text: '2026 · PSYCHOMETRIC SCALE' },
      { type: 'text', at: 237.5, x: X, z: 86.3, size: 0.72, text: [{ t: '批判性思维量表', bg: 'blue' }] },
      { type: 'text', at: 242.0, x: X, z: 87.3, size: 0.48, text: '1477 名初中生 vs 4930 份 AI 答卷' },

      { type: 'card', at: 249.5, x: -0.6, z: 89.2, w: 5.4, d: 2.6, bar: 0.32 },
      { type: 'text', at: 250.5, x: -3.0, z: 88.5, y: 0.09, size: 0.42, text: '开放包容维度信度' },
      { type: 'text', at: 252.0, x: -3.0, z: 89.6, y: 0.09, size: 0.68, anim: 'stamp', text: [{ t: '全部为负数！', bg: 'red' }] },

      { type: 'text', at: 256.0, x: X, z: 91.5, size: 0.62, text: '根本拧不成一个维度' },
      { type: 'text', at: 261.0, x: X, z: 92.5, size: 0.52, text: '扮演初中生，比不给角色更差' },
      { type: 'text', at: 264.0, x: X, z: 93.5, size: 0.52, text: [{ t: 'o1-preview 拒答率高，回收率仅 ', gap: 0.05 }, { t: '59.3%', bg: 'yellow' }] },
      { type: 'text', at: 268.5, x: X, z: 94.6, size: 0.85, anim: 'stamp', text: [{ t: '加人设，不一定更像人', bg: 'red' }] },

      // ==========================================
      // CHAPTER 8: 机制根源 (271.28s - 303.80s)
      // ==========================================
      { type: 'text', at: 271.5, x: X, z: 100.5, size: 0.3, font: 'enw', weight: 800, track: 0.3, text: '2026 · UNDERLYING MECHANISMS' },
      { type: 'text', at: 273.0, x: X, z: 101.3, size: 0.75, text: [{ t: '为什么会这样？', bg: 'yellow' }] },
      { type: 'text', at: 276.0, x: X, z: 102.5, size: 0.55, text: [{ t: '压缩海量文本，模拟的是', gap: 0.05 }, { t: '表达的外在形式', bg: 'blue' }] },
      { type: 'text', at: 280.0, x: X, z: 103.6, size: 0.55, text: [{ t: '而非心智的', gap: 0.05 }, { t: '内在机制', bg: 'red', strike: 'ink' }] },
      { type: 'text', at: 283.5, x: X, z: 104.8, size: 0.65, text: [{ t: '它像一个「平均的人」', bg: 'yellow' }] },
      { type: 'text', at: 286.0, x: X, z: 105.8, size: 0.50, text: '安全对齐抑制真实表达' },

      // 建议用法
      { type: 'text', at: 294.0, x: X, z: 107.0, size: 0.52, text: '综述建议的正确定位：' },
      { type: 'text', at: 295.5, x: X, z: 108.0, size: 0.50, text: [{ t: '1. 预研究 · 实验可复制性评估', bg: 'blue' }] },
      { type: 'text', at: 298.0, x: X, z: 109.0, size: 0.50, text: [{ t: '2. 不便找真人的敏感议题模拟', bg: 'blue' }] },
      { type: 'text', at: 301.0, x: X, z: 110.2, size: 0.65, anim: 'stamp', text: [{ t: '前提：必须标明真人还是 AI', bg: 'red' }] },

      // ==========================================
      // CHAPTER 9: 总结 (304.54s - 325.5s)
      // ==========================================
      { type: 'text', at: 305.0, x: X, z: 115.5, size: 0.3, font: 'enw', weight: 800, track: 0.3, text: 'FINAL TAKEAWAYS' },
      { type: 'text', at: 307.2, x: X, z: 116.5, size: 0.60, text: [{ t: '01 像在平均值 · 抹平个体差异', bg: 'blue' }] },
      { type: 'text', at: 312.0, x: X, z: 118.0, size: 0.60, text: [{ t: '02 换题换人群 · 必须重新验证', bg: 'yellow' }] },
      { type: 'text', at: 316.5, x: X, z: 119.5, size: 0.60, text: [{ t: '03 真人研究补充 · 绝非替代', bg: 'ink', color: 'paper' }] },
      { type: 'text', at: 320.5, x: X, z: 121.5, size: 1.15, anim: 'stamp', text: [{ t: '先验证，', gap: 0.08 }, { t: '再使用', bg: 'red' }] },
      { type: 'text', at: 323.0, x: X, z: 123.0, size: 0.35, font: 'enw', weight: 800, track: 0.25, text: 'ZHOU XIAOYU · RUITA TECH' },
    ]
  };
}

export default build({ yaw: -15, pitch: 50, dist: 24, cx: 0.0 });

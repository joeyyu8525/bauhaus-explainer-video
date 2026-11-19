# Bauhaus Explainer Video Engine (包豪斯 3D 知识解说视频引擎)

基于 Three.js + 无头浏览器逐帧渲染 + 双人对谈 TTS 驱动的包豪斯 4:5 竖屏 3D 知识讲解视频自动化流水线。

---

## 🎬 效果演示 (Showcase)

<p align="center">
  <img src="assets/demo_preview.gif" width="45%" alt="3D 舞台互动动效演示" />
  &nbsp;&nbsp;
  <img src="assets/showcase_stills.png" width="45%" alt="多场景成品截图" />
</p>
<p align="center">
  <em>左图：体素小人跳跃、数据柱生长与气泡吐槽交互动效；右图：多章节 3D 舞台真实渲染成片截图</em>
</p>

---

## 🌟 核心特色

- **现代主义包豪斯设计**：暖象牙白底（`#EFE9D8`）配合红黄蓝黑高对比几何构成，斜视角 3D 地面投影。
- **三元叙事动力学**：主讲人形象（框架与定调）+ 双角色对偶视角碰撞，摆脱单向枯燥宣讲。
- **纯代码级可控渲染**：文字、柱状图、人群点阵、几何色带全由声明式数据驱动。
- **毫秒级声画同步**：TTS 自然语言转写，动作与元素出场对齐音频时间戳，内置物理动效音效自动混音。
- **自动化安全质检**：内置 `--check` 静态检测引擎，自动排查文字出界、模型遮挡与字幕冲突。

---

## 📂 项目结构

```text
bauhaus-explainer-video/
├── src/
│   ├── engine.js       # 核心 3D 舞台、材质系统、角色动画与自动质检
│   ├── render.mjs      # 无头 Chrome 逐帧抓取与 ffmpeg 合成
│   ├── page.html       # 渲染容器与 HUD
│   └── sfx_mixer.py    # 音频事件自动混音器
├── assets/
│   ├── avatar/         # 主讲人姿势库
│   ├── fonts/          # 思源黑体与 Archivo 粗体
│   └── sfx/            # 物理拟音音效
├── examples/           # 开箱即用的对谈演练示例
├── references/         # 元素 API 字典与视觉玩法手册
└── SKILL.md            # Agent Skill 完整规程
```

---

## 🚀 快速上手

### 1. 环境准备

- Node.js >= 20
- ffmpeg（已配置在系统 PATH）
- Chrome 浏览器
- Python 3.10+

```bash
# 安装依赖
npm install
```

### 2. 运行示例

```bash
# 1. 运行版面静态安全检查
node src/render.mjs sample_base --work examples --check

# 2. 导出关键静帧
node src/render.mjs sample_base --work examples --stills 3,10,20

# 3. 完整视频渲染 (输出 1080x1350 4:5 视频)
node src/render.mjs sample_base --work examples --out out/sample_base.mp4
```

---

## 📄 开源协议

本项目采用 [MIT License](LICENSE) 开源。

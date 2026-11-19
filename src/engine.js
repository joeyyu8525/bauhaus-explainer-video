// Deterministic stage engine: everything on screen is a pure function of time t (seconds).
// A "show" is plain data: { fps, duration, chapters, subs, camera, elements, actors }.
import * as THREE from 'three';

export const PAL = {
  bg: '#efe9d8', ink: '#141414', red: '#d32a2a', yellow: '#f2b61b', blue: '#1f4faa',
  grey: '#8f8a7d', paper: '#f7f3e6', white: '#ffffff',
};
const col = (c) => PAL[c] || c || PAL.ink;

const clamp01 = (v) => Math.max(0, Math.min(1, v));
const E = {
  lin: (p) => p,
  outCubic: (p) => 1 - Math.pow(1 - p, 3),
  inOutCubic: (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2),
  outBack: (p) => { const c = 1.70158; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); },
  outBounce: (p) => {
    const n = 7.5625, d = 2.75;
    if (p < 1 / d) return n * p * p;
    if (p < 2 / d) return n * (p -= 1.5 / d) * p + 0.75;
    if (p < 2.5 / d) return n * (p -= 2.25 / d) * p + 0.9375;
    return n * (p -= 2.625 / d) * p + 0.984375;
  },
};

const FONT = {
  zh: '"Noto Sans SC","Microsoft YaHei",sans-serif',
  en: '"Archivo Black","Impact","Noto Sans SC",sans-serif',
  enw: '"Archivo Variable","Archivo","Arial",sans-serif',
};
let PX = 150; // texture pixels per world unit (raised with devicePixelRatio in Stage)

// ---------- text -> flat texture ----------
function makeTextTexture(el) {
  const segs = typeof el.text === 'string' ? [{ t: el.text }] : el.text;
  const size = el.size || 0.5;
  const fpx = Math.round(size * PX);
  const fam = FONT[el.font || 'zh'];
  const weight = el.weight || 900;
  const track = (el.track || 0) * fpx;
  const padX = fpx * 0.16, padY = fpx * 0.2;
  const c = document.createElement('canvas');
  const g = c.getContext('2d');
  const setFont = () => { g.font = `${weight} ${fpx}px ${fam}`; };
  setFont();
  const measure = (s) => {
    if (!track) return g.measureText(s).width;
    let w = 0; for (const ch of s) w += g.measureText(ch).width + track; return w;
  };
  let x = padX;
  const layout = segs.map((s) => {
    const w = measure(s.t);
    const bgPad = s.bg ? fpx * 0.12 : 0;
    const o = { ...s, x: x + bgPad, w };
    x += w + bgPad * 2 + (s.gap || 0) * fpx;
    return o;
  });
  c.width = Math.ceil(x + padX);
  c.height = Math.ceil(fpx * 1.18 + padY * 2);
  setFont();
  g.textBaseline = 'alphabetic';
  const base = padY + fpx * 0.92;
  for (const s of layout) {
    if (s.bg) {
      g.fillStyle = col(s.bg);
      g.fillRect(s.x - fpx * 0.12, padY + fpx * 0.02, s.w + fpx * 0.24, fpx * 1.12);
    }
    g.fillStyle = col(s.color || (s.bg ? (s.bg === 'yellow' ? '#141414' : '#f7f3e6') : el.color || 'ink'));
    if (!track) g.fillText(s.t, s.x, base);
    else { let cx = s.x; for (const ch of s.t) { g.fillText(ch, cx, base); cx += g.measureText(ch).width + track; } }
    if (s.strike) { g.fillStyle = col(s.strike); g.fillRect(s.x, padY + fpx * 0.5, s.w, fpx * 0.1); }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 16;
  tex.generateMipmaps = true;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  return { tex, w: c.width / PX, h: c.height / PX, padX: padX / PX };
}

// ---------- voxel actors ----------
function voxelGroup(boxes, unit) {
  const grp = new THREE.Group();
  const mats = {};
  for (const [x, y, z, w, h, d, c] of boxes) {
    mats[c] ||= new THREE.MeshStandardMaterial({ color: col(c), roughness: 0.85 });
    const m = new THREE.Mesh(new THREE.BoxGeometry(w * unit, h * unit, d * unit), mats[c]);
    m.position.set((x + w / 2) * unit, (y + h / 2) * unit, (z + d / 2) * unit);
    m.castShadow = true;
    grp.add(m);
  }
  return grp;
}
const ACTORS = {
  // 人类被试：红衣小人
  human: (u) => voxelGroup([
    [-2, 0, -1, 1.6, 2, 2, '#101010'], [0.4, 0, -1, 1.6, 2, 2, '#101010'],
    [-2.5, 2, -1.5, 5, 4, 3, 'red'],
    [-3.5, 3, -1, 1, 3, 2, 'red'], [2.5, 3, -1, 1, 3, 2, 'red'],
    [-2, 6, -1.5, 4, 3.4, 3, '#f0d9b5'],
    [-2.2, 8.6, -1.7, 4.4, 1.4, 3.4, '#101010'],
    [-1.2, 7.4, 1.5, 0.7, 0.7, 0.15, '#101010'], [0.5, 7.4, 1.5, 0.7, 0.7, 0.15, '#101010'],
  ], u),
  // 硅基样本：蓝色芯片机器人
  bot: (u) => voxelGroup([
    [-2.6, 0, -1.2, 1.4, 1.2, 2.4, '#101010'], [1.2, 0, -1.2, 1.4, 1.2, 2.4, '#101010'],
    [-3, 1.2, -2, 6, 5, 4, 'blue'],
    [-2.2, 2.4, 2, 4.4, 2.8, 0.2, '#101010'],
    [-1.4, 3.4, 2.2, 0.9, 0.9, 0.15, 'white'], [0.5, 3.4, 2.2, 0.9, 0.9, 0.15, 'white'],
    [-3.8, 2.4, -0.6, 0.8, 1.2, 1.2, 'yellow'], [3, 2.4, -0.6, 0.8, 1.2, 1.2, 'yellow'],
    [-0.3, 6.2, -0.3, 0.6, 1.4, 0.6, '#101010'], [-0.7, 7.6, -0.7, 1.4, 1.2, 1.4, 'yellow'],
  ], u),
};

// ---------- stage ----------
export class Stage {
  constructor(canvas, hud, show) {
    this.show = show;
    Object.assign(PAL, show.theme || {});
    this.W = 768; this.H = 960;
    const dpr = window.devicePixelRatio || 1;
    PX = Math.min(340, Math.round(150 * Math.max(1, dpr) * 1.15));
    const r = (this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true }));
    r.setPixelRatio(dpr);
    r.setSize(this.W, this.H);
    r.setClearColor(col('bg'));
    r.shadowMap.enabled = true;
    r.shadowMap.type = THREE.PCFShadowMap;
    this.scene = new THREE.Scene();
    this.cam = new THREE.PerspectiveCamera(26, this.W / this.H, 0.1, 400);

    this.scene.add(new THREE.HemisphereLight(0xffffff, 0xe9e2cf, 1.55));
    const sun = (this.sun = new THREE.DirectionalLight(0xffffff, 2.1));
    sun.castShadow = true;
    sun.shadow.mapSize.set(4096, 4096);
    const sc = sun.shadow.camera; sc.left = -14; sc.right = 14; sc.top = 14; sc.bottom = -14; sc.near = 1; sc.far = 80;
    sun.shadow.bias = -0.0004; sun.shadow.radius = 5;
    this.scene.add(sun); this.scene.add(sun.target);
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(600, 600), new THREE.ShadowMaterial({ opacity: show.shadow ?? 0.2 }));
    ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true;
    this.scene.add(ground);

    this.items = (show.elements || []).map((el, i) => this.build(el, i)).filter(Boolean);
    this.byId = {};
    for (const it of this.items) if (it.el.id) {
      if (this.byId[it.el.id]) throw new Error('duplicate element id: ' + it.el.id);
      this.byId[it.el.id] = it;
    }
    this.actors = (show.actors || []).map((a) => this.buildActor(a));
    this.hud = hud;
    this.buildHud();
  }

  // ----- element factories -----
  build(el, i) {
    const it = { el, node: null, kind: el.type };
    const mat3d = (c) => new THREE.MeshStandardMaterial({ color: col(c), roughness: 0.8 });
    const layerY = 0.012 + (el.layer || 0) * 0.004 + i * 0.00002;
    if (el.type === 'text') {
      const { tex, w, h, padX } = makeTextTexture(el);
      const geo = new THREE.PlaneGeometry(w, h);
      const ax = el.align === 'center' ? 0 : el.align === 'right' ? -w / 2 + padX : w / 2 - padX;
      geo.translate(ax, 0, 0);
      const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false }));
      const g = new THREE.Group();
      m.rotation.x = -Math.PI / 2;
      g.add(m);
      g.position.set(el.x || 0, (el.y || 0) + layerY + 0.01, el.z || 0);
      g.rotation.y = THREE.MathUtils.degToRad(el.rot || 0);
      it.node = g; it.mat = m.material; it.w = w;
    } else if (el.type === 'rect') {
      const geo = new THREE.PlaneGeometry(el.w, el.d);
      geo.translate(el.w / 2, 0, 0);
      const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: col(el.color), transparent: true, depthWrite: false }));
      const g = new THREE.Group();
      m.rotation.x = -Math.PI / 2; g.add(m);
      g.position.set(el.x || 0, (el.y || 0) + layerY, el.z || 0);
      g.rotation.y = THREE.MathUtils.degToRad(el.rot || 0);
      it.node = g; it.mat = m.material;
    } else if (el.type === 'box' || el.type === 'cyl' || el.type === 'prism') {
      let geo, hgt = el.h || 1;
      if (el.type === 'box') geo = new THREE.BoxGeometry(el.w || 1, hgt, el.d || 1);
      else if (el.type === 'cyl') geo = new THREE.CylinderGeometry(el.r || 0.5, el.r || 0.5, hgt, 48);
      else { geo = new THREE.CylinderGeometry(el.r || 0.6, el.r || 0.6, hgt, 3); }
      geo.translate(0, hgt / 2, 0);
      const m = new THREE.Mesh(geo, mat3d(el.color));
      m.castShadow = true; m.receiveShadow = true;
      m.position.set(el.x || 0, el.y || 0, el.z || 0);
      m.rotation.y = THREE.MathUtils.degToRad(el.rot || 0);
      it.node = m; it.mat = m.material;
    } else if (el.type === 'card') {
      // flat framed panel lying on the ground
      const g = new THREE.Group();
      const t = el.t || 0.08, b = el.border || 0.09;
      const frame = new THREE.Mesh(new THREE.BoxGeometry(el.w, t, el.d), mat3d(el.frame || 'ink'));
      frame.position.y = t / 2; frame.castShadow = true;
      const face = new THREE.Mesh(new THREE.PlaneGeometry(el.w - b * 2, el.d - b * 2 - (el.bar || 0)),
        new THREE.MeshBasicMaterial({ color: col(el.color || 'paper') }));
      face.rotation.x = -Math.PI / 2; face.position.set(0, t + 0.002, (el.bar || 0) / 2);
      g.add(frame, face);
      g.position.set(el.x || 0, el.y || 0, el.z || 0);
      g.rotation.y = THREE.MathUtils.degToRad(el.rot || 0);
      it.node = g;
    } else if (el.type === 'crowd') {
      // grid of small tokens; colours follow el.mix = [[color, fraction], ...]
      const n = el.cols * el.rows;
      const geo = el.shape === 'box'
        ? new THREE.BoxGeometry(el.s || 0.2, el.h || 0.16, el.s || 0.2)
        : new THREE.CylinderGeometry((el.s || 0.2) / 2, (el.s || 0.2) / 2, el.h || 0.16, 20);
      geo.translate(0, (el.h || 0.16) / 2, 0);
      const m = new THREE.InstancedMesh(geo, new THREE.MeshStandardMaterial({ roughness: 0.8 }), n);
      m.castShadow = true;
      const order = [];
      const mix = el.mix || [['ink', 1]];
      let acc = 0; const cuts = mix.map(([c, f]) => [c, (acc += f)]);
      const rnd = mulberry(el.seed || 7);
      const slots = [...Array(n).keys()];
      if (el.shuffle) for (let k = n - 1; k > 0; k--) { const j = Math.floor(rnd() * (k + 1)); [slots[k], slots[j]] = [slots[j], slots[k]]; }
      for (let k = 0; k < n; k++) {
        const frac = (k + 0.5) / n;
        const c = (cuts.find(([, cut]) => frac <= cut + 1e-9) || cuts[cuts.length - 1])[0];
        m.setColorAt(slots[k], new THREE.Color(col(c)));
        order[slots[k]] = el.shuffle ? rnd() : k / n;
      }
      m.instanceColor.needsUpdate = true;
      m.position.set(el.x || 0, el.y || 0, el.z || 0);
      m.rotation.y = THREE.MathUtils.degToRad(el.rot || 0);
      it.node = m; it.order = order; it.n = n;
    } else if (el.type === 'image') {
      const g = new THREE.Group();
      const tex = this.show.__tex[el.src];
      const asp = tex.image.width / tex.image.height;
      const w = el.w || (el.h || 1) * asp, h = el.h || w / asp;
      it.iw = w; it.ih = h;
      const geo = new THREE.PlaneGeometry(w, h);
      let m;
      if (el.stand) {
        geo.translate(0, h / 2, 0);
        m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: tex, transparent: true, alphaTest: 0.5, side: THREE.DoubleSide }));
        m.castShadow = true;
        m.customDepthMaterial = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map: tex, alphaTest: 0.5 });
        it.stand = true;
      } else {
        m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: tex, transparent: true }));
        m.rotation.x = -Math.PI / 2;
      }
      g.add(m);
      g.position.set(el.x || 0, (el.y || 0) + (el.stand ? 0 : layerY + 0.05), el.z || 0);
      if (!el.stand) g.rotation.y = THREE.MathUtils.degToRad(el.rot || 0);
      it.node = g; it.mat = m.material;
    } else return null;
    it.base = it.node.position.clone();
    it.node.visible = false;
    this.scene.add(it.node);
    return it;
  }

  buildActor(a) {
    let node, poses = null, head;
    if (a.kind === 'avatar') {
      node = new THREE.Group(); poses = {};
      const h = a.h || 2.4;
      for (const [name, src] of Object.entries(a.poses || {})) {
        const tex = this.show.__tex[src];
        if (!tex) throw new Error('avatar pose texture not loaded: ' + src);
        const asp = tex.image.width / tex.image.height;
        const geo = new THREE.PlaneGeometry(h * asp, h); geo.translate(0, h / 2, 0);
        const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: tex, transparent: true, alphaTest: 0.08, side: THREE.DoubleSide }));
        m.castShadow = true;
        m.customDepthMaterial = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map: tex, alphaTest: 0.4 });
        m.visible = false; m.renderOrder = 5;
        node.add(m); poses[name] = m;
      }
      head = h;
    } else {
      if (!ACTORS[a.kind]) throw new Error('unknown actor kind: ' + a.kind);
      node = ACTORS[a.kind](a.unit || 0.075);
      head = a.kind === 'bot' ? 0.68 : 0.78;
    }
    node.visible = false;
    this.scene.add(node);
    let acc = 0, prev = null;
    const keys = a.keys.map((k0) => {
      const k = this.resolveKey(k0);
      if (prev) acc += Math.hypot(k.x - prev.x, k.z - prev.z);
      prev = k;
      return { ...k, s: acc };
    });
    const sortT = (arr) => [...(arr || [])].sort((p, q) => p.t - q.t);
    return { a, node, keys, poses, head, poseKeys: sortT(a.pose), acts: sortT(a.acts), says: sortT(a.say) };
  }

  // Anchor an actor key to an element:
  // { t, to: 'id', side: 'left'|'right'|'front'|'behind'|'top'|'center', gap, dx, dz }
  resolveKey(k) {
    if (!k.to) return { ...k, x: k.x ?? 0, z: k.z ?? 0, y: k.y ?? 0 };
    const it = this.byId[k.to];
    if (!it) throw new Error('actor anchor element not found: ' + k.to);
    const b = bbox(it);
    const g = k.gap ?? 0.55;
    let x = (b.x0 + b.x1) / 2, z = (b.z0 + b.z1) / 2, y = 0;
    const side = k.side || 'right';
    if (side === 'left') x = b.x0 - g;
    else if (side === 'right') x = b.x1 + g;
    else if (side === 'front') z = b.z1 + g;
    else if (side === 'behind') z = b.z0 - g;
    else if (side === 'top') y = b.top;
    return { ...k, x: x + (k.dx || 0), z: z + (k.dz || 0), y: k.y ?? y };
  }

  buildHud() {
    this.hud.innerHTML = `
      <div id="chap"><div class="zh"></div><div class="en"></div><div class="bar"></div><div class="meta"></div></div>
      <div id="sub"><span class="mk"></span><span class="tx"></span></div>
      <div id="brand"></div>`;
    for (const ac of this.actors) if (ac.says.length) {
      const d = document.createElement('div'); d.className = 'bub'; d.style.opacity = 0;
      this.hud.appendChild(d); ac.bub = d;
    }
    this.$ = (s) => this.hud.querySelector(s);
    this.$('#brand').textContent = this.show.brand || '';
    const hs = this.hud.style, dark = !!this.show.dark;
    hs.setProperty('--ink', PAL.ink); hs.setProperty('--sub-bg', dark ? '#f7f3e6' : '#141414'); hs.setProperty('--sub-fg', dark ? '#141414' : '#ffffff');
    hs.setProperty('--chap-bg', dark ? 'rgba(26,26,26,.86)' : 'rgba(239,233,216,.86)'); hs.setProperty('--meta', dark ? '#c9c3b2' : '#3a3a3a');
    document.body.style.background = PAL.bg;
  }

  // ----- per-frame -----
  renderAt(t) {
    const yaw = this.updateCamera(t);
    for (const it of this.items) this.updateItem(it, t, yaw);
    for (const ac of this.actors) this.updateActor(ac, t, yaw);
    this.updateHud(t);
    this.renderer.render(this.scene, this.cam);
  }

  updateCamera(t) {
    const ks = this.show.camera;
    let a = ks[0], b = ks[0];
    for (let i = 0; i < ks.length; i++) { if (ks[i].t <= t) { a = ks[i]; b = ks[i + 1] || ks[i]; } }
    const p = b === a ? 0 : E.inOutCubic(clamp01((t - a.t) / (b.t - a.t)));
    const L = (k) => (a[k] ?? DEF[k]) + ((b[k] ?? DEF[k]) - (a[k] ?? DEF[k])) * p;
    // gentle constant drift so held shots never look frozen
    const drift = Math.sin(t * 0.35) * 0.06;
    const x = L('x') + drift, z = L('z'), dist = L('dist'), yaw = THREE.MathUtils.degToRad(L('yaw')), pitch = THREE.MathUtils.degToRad(L('pitch'));
    const cy = Math.sin(pitch) * dist, ch = Math.cos(pitch) * dist;
    this.cam.position.set(x + Math.sin(yaw) * ch, cy, z + Math.cos(yaw) * ch);
    this.cam.lookAt(x, 0, z);
    this.sun.position.set(x - 9, 20, z + 5); this.sun.target.position.set(x, 0, z);
    return yaw;
  }

  updateItem(it, t, yaw) {
    const el = it.el, at = el.at ?? 0;
    const out = el.out ?? Infinity;
    if (t < at || t > out + 0.4) { it.node.visible = false; return; }
    it.node.visible = true;
    const dur = el.dur || 0.5;
    let p = clamp01((t - at) / dur);
    const q = t > out ? 1 - clamp01((t - out) / 0.4) : 1; // exit factor
    const anim = el.anim || DEFAULT_ANIM[el.type];
    const n = it.node;
    n.position.copy(it.base); n.scale.set(1, 1, 1);
    if (it.mat && it.mat.transparent) it.mat.opacity = (el.opacity ?? 1) * q;
    if (it.stand) n.rotation.y = yaw;
    if (anim === 'rise') {
      const e = E.outCubic(p);
      if (it.mat) it.mat.opacity = (el.opacity ?? 1) * e * q;
      n.position.z = it.base.z + (1 - e) * 0.35;
    } else if (anim === 'stamp') {
      const e = E.outCubic(p); const s = 1 + (1 - e) * 0.5;
      n.scale.set(s, 1, s);
      if (it.mat) it.mat.opacity = (el.opacity ?? 1) * clamp01(p * 3) * q;
    } else if (anim === 'wipe') {
      n.scale.set(Math.max(0.0001, E.outCubic(p)), 1, 1);
    } else if (anim === 'pop') {
      const s = Math.max(0.0001, E.outBack(p)) * (0.0001 + q);
      n.scale.set(s, s, s);
    } else if (anim === 'grow') {
      n.scale.set(1, Math.max(0.0001, E.outCubic(p)) * (0.0001 + q), 1);
    } else if (anim === 'drop') {
      n.position.y = it.base.y + (1 - E.outBounce(p)) * 3.2;
      const s = 0.0001 + q; n.scale.set(s, s, s);
    } else if (anim === 'crowd') {
      const span = el.span || 1.6, m4 = new THREE.Matrix4(), v = new THREE.Vector3(), sc = new THREE.Vector3(), qt = new THREE.Quaternion();
      const gap = el.gap || 0.3;
      for (let k = 0; k < it.n; k++) {
        const cx = k % el.cols, cz = Math.floor(k / el.cols);
        const lp = clamp01((t - at - it.order[k] * span) / 0.35);
        const s = Math.max(0.0001, E.outBack(lp)) * (0.0001 + q);
        v.set((cx - (el.cols - 1) / 2) * gap, 0, (cz - (el.rows - 1) / 2) * gap);
        sc.set(s, s, s);
        n.setMatrixAt(k, m4.compose(v, qt, sc));
      }
      n.instanceMatrix.needsUpdate = true;
    }
    if (el.fx) for (const f of el.fx) {
      const fd = f.dur || 0.6, fq = (t - f.t) / fd;
      if (fq < 0 || fq > 1) continue;
      const k = Math.sin(Math.PI * fq);
      if (f.do === 'pulse') { const m = 1 + (f.amt || 0.14) * k; n.scale.x *= m; n.scale.z *= m; if (it.kind !== 'text') n.scale.y *= m; }
      else if (f.do === 'squash') { n.scale.y *= 1 - (f.amt || 0.3) * k; n.scale.x *= 1 + 0.12 * k; n.scale.z *= 1 + 0.12 * k; }
      else if (f.do === 'shake') n.position.x += Math.sin(fq * Math.PI * 8) * (f.amt || 0.09) * (1 - fq);
      else if (f.do === 'flash' && it.mat) it.mat.opacity *= 0.35 + 0.65 * Math.abs(Math.cos(fq * Math.PI * 3));
    }
  }

  updateActor(ac, t, yaw) {
    const ks = ac.keys, A = ac.a;
    if (t < ks[0].t || t > (A.out ?? Infinity)) { ac.node.visible = false; if (ac.bub) ac.bub.style.opacity = 0; return; }
    ac.node.visible = true;
    let a = ks[0], b = ks[0];
    for (let i = 0; i < ks.length; i++) if (ks[i].t <= t) { a = ks[i]; b = ks[i + 1] || ks[i]; }
    const dist = Math.hypot(b.x - a.x, b.z - a.z), dy = Math.abs(b.y - a.y);
    const move = b.move || A.move || 'walk';
    let raw = 0;
    if (b !== a && (dist > 0.005 || dy > 0.005)) {
      const span = b.t - a.t;
      const dur = move === 'jump' ? (b.dur || 0.48) :
                  move === 'pop'  ? (b.dur || 0.28) :
                  Math.max(0.35, Math.min(2.0, dist / 3.0));
      const actDur = Math.min(span, dur);
      const tStart = b.t - actDur;
      raw = t < tStart ? 0 : clamp01((t - tStart) / actDur);
    }
    const p = move === 'jump' ? E.inOutCubic(raw) * 0.15 + raw * 0.85 : E.inOutCubic(raw);
    let x = a.x + (b.x - a.x) * p, z = a.z + (b.z - a.z) * p, y = a.y + (b.y - a.y) * p;
    const s = a.s + (b.s - a.s) * p;
    const moving = b !== a && (dist > 0.01 || dy > 0.01) && raw > 0 && raw < 1;
    let sc = E.outBack(clamp01((t - ks[0].t) / 0.45)), sx = 1, sy = 1, rotY = 0, rotZ = 0, xo = 0;
    if (moving && move === 'walk') {
      const stepPhase = s * 3.6;
      const bob = Math.abs(Math.sin(stepPhase));
      y += bob * 0.18;
      rotZ += Math.sin(stepPhase) * 0.08;
      rotY += Math.sin(stepPhase * 0.5) * 0.05;
      sy *= 1 - bob * 0.06;
      sx *= 1 + bob * 0.05;
    } else if (moving && move === 'jump') {
      if (raw < 0.14) {
        // Phase 1: Anticipation crouch / squat before launch
        const q = raw / 0.14;
        const squat = Math.sin(q * Math.PI * 0.5);
        y -= squat * 0.06;
        sy *= 1 - squat * 0.22;
        sx *= 1 + squat * 0.18;
      } else if (raw < 0.86) {
        // Phase 2: Airborne flight arc and vertical stretch
        const q = (raw - 0.14) / 0.72;
        const arc = Math.sin(q * Math.PI);
        y += arc * (1.12 + dy * 0.65 + dist * 0.08);
        const vy = Math.cos(q * Math.PI);
        sy *= 1 + Math.abs(vy) * 0.22;
        sx *= 1 - Math.abs(vy) * 0.14;
      } else {
        // Phase 3: Impact landing & damped spring recovery
        const q = (raw - 0.86) / 0.14;
        const decay = Math.exp(-q * 4.5);
        const bounce = Math.sin(q * Math.PI * 2.5) * decay;
        sy *= 1 - (1 - q) * 0.25 + bounce * 0.15;
        sx *= 1 + (1 - q) * 0.20 - bounce * 0.12;
      }
    } else if (moving && move === 'pop') {
      sc *= raw < 0.5 ? 1 - raw * 2 : raw * 2 - 1;
      x = raw < 0.5 ? a.x : b.x; z = raw < 0.5 ? a.z : b.z; y = raw < 0.5 ? a.y : b.y;
    } else if (!moving) {
      const whoKey = ac.a.kind === 'avatar' ? 'a' : ac.a.kind === 'bot' ? 'b' : 'c';
      const isSpeaking = (this.show.subs || []).some((s) => t >= s.t && t < s.end && (s.who === whoKey || s.who === ac.a.kind || s.who === ac.a.name));

      if (isSpeaking) {
        if (ac.poses) {
          // Avatar speaking: lively micro-sway and subtle nodding
          const spk = Math.sin(t * 8.5);
          sy *= 1 + spk * 0.035;
          rotZ += Math.sin(t * 5.5) * 0.030;
        } else {
          // Voxel bot / human active speaking: rhythmic bouncing, expressive nod and weight shift
          const spk = Math.sin(t * 11.0);
          y += Math.abs(spk) * 0.045;
          sy *= 1 + spk * 0.075;
          sx *= 1 - spk * 0.045;
          rotZ += Math.sin(t * 7.5) * 0.055;
        }
      } else {
        if (ac.poses) {
          // Avatar idle breathing: subtle rhythmic expansion & tiny sway
          const breath = Math.sin(t * 2.2 + ks.length) * 0.016;
          sy *= 1 + breath;
          sx *= 1 - breath * 0.5;
          rotZ += Math.sin(t * 1.5 + ks.length) * 0.012;
        } else {
          // Voxel bot / human idle breathing and weight shifting
          const breath = Math.sin(t * 2.5 + ks.length) * 0.025;
          sy *= 1 + breath;
          sx *= 1 - breath * 0.6;
          y += Math.abs(Math.sin(t * 2.5 + ks.length)) * 0.025;
          rotZ += Math.sin(t * 1.6 + ks.length) * 0.015;
        }
      }
    }
    // one-shot actions: acts: [{ t, do, dur, h, n, amt }]
    for (const act of ac.acts) {
      const d = act.dur || (act.do === 'bounce' ? 1.2 : 0.6), q = (t - act.t) / d;
      if (q < 0 || q > 1) continue;
      const k = Math.sin(Math.PI * q);
      if (act.do === 'jump') {
        y += k * (act.h || 0.7);
        sy *= 1 + (Math.cos(q * Math.PI)) * 0.15;
        sx *= 1 - (Math.cos(q * Math.PI)) * 0.10;
      } else if (act.do === 'bounce') {
        const bp = Math.abs(Math.sin(q * Math.PI * (act.n || 3)));
        y += bp * (act.h || 0.3);
        sy *= 1 + (bp - 0.5) * 0.18;
        sx *= 1 - (bp - 0.5) * 0.12;
      } else if (act.do === 'shake') xo += Math.sin(q * Math.PI * 8) * 0.1 * (1 - q);
      else if (act.do === 'nod') {
        const np = Math.abs(Math.sin(q * Math.PI * (act.n || 2)));
        sy *= 1 - 0.12 * np;
        sx *= 1 + 0.08 * np;
      } else if (act.do === 'spin') rotY += Math.PI * 2 * E.inOutCubic(q);
      else if (act.do === 'wobble') rotZ += Math.sin(q * Math.PI * 6) * 0.16 * (1 - q);
      else if (act.do === 'grow') sc *= 1 + (act.amt || 0.3) * k;
      else if (act.do === 'shrink') sc *= 1 - (act.amt || 0.4) * k;
    }
    ac.node.position.set(x + xo, y, z);
    if (ac.poses) {
      // billboard sprite: always faces the camera; pose switch with a springy overshoot
      let pk = null;
      for (const e of ac.poseKeys) if (e.t <= t) pk = e;
      const name = pk ? pk.p : (A.defaultPose || Object.keys(ac.poses)[0]);
      if (!ac.poses[name]) throw new Error('unknown pose: ' + name);
      for (const [nm, m] of Object.entries(ac.poses)) m.visible = nm === name;
      if (pk) {
        const age = t - pk.t;
        if (age >= 0 && age < 0.32) {
          const q = age / 0.32;
          const decay = Math.exp(-q * 4.8);
          const elastic = Math.sin(q * Math.PI * 2.5) * decay;
          sy *= 1 + elastic * 0.16;
          sx *= 1 - elastic * 0.10;
        }
      }
      const flip = (pk && pk.flip) || false;
      ac.node.rotation.set(0, yaw + rotY, rotZ);
      ac.node.scale.set(Math.max(0.0001, sc * sx) * (flip ? -1 : 1), Math.max(0.0001, sc * sy), Math.max(0.0001, sc));
    } else {
      let targetFace = A.face ?? 20;
      if (moving && dist > 0.01) {
        targetFace = THREE.MathUtils.radToDeg(Math.atan2(b.x - a.x, b.z - a.z));
      } else if (!moving && a.face !== undefined) {
        targetFace = a.face;
      }
      if (ac.currFace === undefined) ac.currFace = targetFace;
      let diff = (targetFace - ac.currFace) % 360;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;
      ac.currFace += diff * 0.20;
      const f = THREE.MathUtils.degToRad(ac.currFace);
      ac.node.rotation.set(0, f + rotY, rotZ);
      ac.node.scale.set(Math.max(0.0001, sc * sx), Math.max(0.0001, sc * sy), Math.max(0.0001, sc));
    }
    // speech bubble projected above the head: say: [{ t, end, text, color }]
    if (ac.bub) {
      const sb = ac.says.find((e) => t >= e.t && t < e.end);
      if (!sb) { ac.bub.style.opacity = 0; return; }
      const v = new THREE.Vector3(x, y + ac.head * Math.max(0.0001, sc) + 0.18, z).project(this.cam);
      if (ac.bub.textContent !== sb.text) ac.bub.textContent = sb.text;
      const half = ac.bub.offsetWidth / 2 + 14;
      const px = Math.max(half, Math.min(this.W - half, ((v.x + 1) / 2) * this.W));
      const py = Math.max(190, ((1 - v.y) / 2) * this.H);
      const age = t - sb.t, pop = E.outBack(clamp01(age / 0.25));
      ac.bub.className = 'bub ' + (sb.color || '');
      ac.bub.style.left = px + 'px'; ac.bub.style.top = py + 'px';
      ac.bub.style.opacity = clamp01(age / 0.12) * clamp01((sb.end - t) / 0.15);
      ac.bub.style.transform = `translate(-50%,-100%) scale(${Math.max(0.0001, pop)})`;
    }
  }

  // Layout check for time t. Returns a list of problems (strings). Used by render.mjs --check.
  check(t) {
    this.renderAt(t);
    const W = this.W, H = this.H, SAFE_TOP = 200, SAFE_BOTTOM = H - 135, M = 6;
    const v = new THREE.Vector3();
    const rectOf = (pts) => {
      let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
      for (const [x, y, z] of pts) {
        v.set(x, y, z).project(this.cam);
        const sx = ((v.x + 1) / 2) * W, sy = ((1 - v.y) / 2) * H;
        x0 = Math.min(x0, sx); x1 = Math.max(x1, sx); y0 = Math.min(y0, sy); y1 = Math.max(y1, sy);
      }
      return { x0, y0, x1, y1 };
    };
    const boxPts = (b) => [[b.x0, 0, b.z0], [b.x1, 0, b.z0], [b.x0, 0, b.z1], [b.x1, 0, b.z1],
      [b.x0, b.top, b.z0], [b.x1, b.top, b.z0], [b.x0, b.top, b.z1], [b.x1, b.top, b.z1]];
    const live = [];
    for (const it of this.items) {
      const el = it.el;
      if (!it.node.visible || t < (el.at ?? 0) + (el.dur || 0.5) || t > (el.out ?? Infinity)) continue;
      if (el.type === 'crowd' && t < (el.at ?? 0) + (el.span || 1.6) + 0.4) continue;
      live.push({ name: el.id || `${el.type}@${el.at}` + (typeof el.text === 'string' ? `「${el.text.slice(0, 8)}」` : Array.isArray(el.text) ? `「${el.text.map((q) => q.t).join('').slice(0, 8)}」` : ''),
        r: rectOf(boxPts(bbox(it))), flat: ['text', 'rect', 'card'].includes(el.type) || (el.type === 'image' && !el.stand), solid: ['box', 'cyl', 'prism'].includes(el.type) || (el.type === 'image' && el.stand), text: el.type === 'text' });
    }
    for (const ac of this.actors) {
      if (!ac.node.visible) continue;
      const p = ac.node.position, hw = ac.poses ? 0.55 : 0.28, hh = ac.head * ac.node.scale.y;
      live.push({ name: 'actor:' + (ac.a.name || ac.a.kind), r: rectOf([[p.x - hw, p.y, p.z], [p.x + hw, p.y, p.z], [p.x - hw, p.y + hh, p.z], [p.x + hw, p.y + hh, p.z]]), actor: true });
    }
    // only judge what is actually on screen (elements from earlier chapters stay in the scene)
    for (let i = live.length - 1; i >= 0; i--) { const r = live[i].r; if (r.x1 < 0 || r.x0 > W || r.y1 < 0 || r.y0 > H) live.splice(i, 1); }
    const out = [];
    const area = (r) => Math.max(0, r.x1 - r.x0) * Math.max(0, r.y1 - r.y0);
    const inter = (a, b) => area({ x0: Math.max(a.x0, b.x0), y0: Math.max(a.y0, b.y0), x1: Math.min(a.x1, b.x1), y1: Math.min(a.y1, b.y1) });
    for (const o of live) {
      const r = o.r;
      if (r.x1 < 0 || r.x0 > W || r.y1 < 0 || r.y0 > H) continue; // fully off screen (scrolled past) is fine
      const exiting = (r.y0 + r.y1) / 2 < SAFE_TOP + 60; // old content sliding out at the top is accepted
      if (o.text && !exiting && (r.x0 < -M || r.x1 > W + M)) out.push(`出界 ${o.name} x=[${r.x0 | 0},${r.x1 | 0}]`);
      if (o.actor && (r.x0 < -M || r.x1 > W + M || r.y0 < -M)) out.push(`角色出界 ${o.name} x=[${r.x0 | 0},${r.x1 | 0}]`);
      if (!o.actor && r.y1 > SAFE_BOTTOM && r.y0 < SAFE_BOTTOM + 40 && r.y1 < H + 40) out.push(`进入字幕区 ${o.name} y1=${r.y1 | 0}`);
    }
    for (let i = 0; i < live.length; i++) for (let j = i + 1; j < live.length; j++) {
      const a = live[i], b = live[j];
      const occl = (a.text && (b.solid || b.actor)) || (b.text && (a.solid || a.actor));
      if (!occl) continue;
      const tx = a.text ? a : b, ob = a.text ? b : a;
      const k = inter(tx.r, ob.r) / Math.max(1, area(tx.r));
      if (k > 0.12) out.push(`遮挡 ${ob.name} 压住 ${tx.name} ${(k * 100) | 0}%`);
    }
    // actor hidden behind a solid that is nearer to the camera
    for (const ac of this.actors) {
      if (!ac.node.visible) continue;
      const me = live.find((o) => o.name === 'actor:' + (ac.a.name || ac.a.kind)); if (!me) continue;
      const myD = ac.node.position.distanceTo(this.cam.position);
      for (const it of this.items) {
        if (!it.node.visible || !['box', 'cyl', 'prism'].includes(it.kind)) continue;
        const b = bbox(it); if (ac.node.position.y > b.top - 0.05) continue; // standing on top is fine
        const c = new THREE.Vector3((b.x0 + b.x1) / 2, b.top / 2, (b.z0 + b.z1) / 2);
        if (c.distanceTo(this.cam.position) >= myD) continue;
        const r = live.find((o) => o.name === (it.el.id || `${it.el.type}@${it.el.at}`)); if (!r) continue;
        const k = inter(me.r, r.r) / Math.max(1, area(me.r));
        if (k > 0.35) out.push(`角色被挡 ${me.name} 在 ${r.name} 后面 ${(k * 100) | 0}%`);
      }
    }
    for (const ac of this.actors) if (ac.bub && ac.bub.style.opacity > 0.5) {
      const b = ac.bub.getBoundingClientRect();
      if (b.left < -2 || b.right > W + 2) out.push(`气泡出界 ${ac.a.kind}`);
    }
    return out;
  }

  updateHud(t) {
    const ch = [...(this.show.chapters || [])].reverse().find((c) => t >= c.t);
    const chap = this.$('#chap');
    if (ch) {
      chap.style.opacity = clamp01((t - ch.t) / 0.3);
      this.$('#chap .zh').textContent = ch.zh;
      this.$('#chap .en').textContent = ch.en;
      this.$('#chap .meta').textContent = ch.meta || '';
      this.$('#chap .bar').style.background = col(ch.color || 'red');
    } else chap.style.opacity = 0;
    const sb = (this.show.subs || []).find((s) => t >= s.t && t < s.end);
    const sub = this.$('#sub');
    if (sb) {
      sub.style.opacity = 1;
      this.$('#sub .tx').textContent = sb.text;
      this.$('#sub .mk').className = 'mk ' + (sb.who || 'a');
    } else sub.style.opacity = 0;
  }
}

const DEF = { x: 0, z: 0, dist: 15, yaw: -16, pitch: 50 };
const DEFAULT_ANIM = { text: 'rise', rect: 'wipe', box: 'pop', cyl: 'pop', prism: 'pop', card: 'pop', crowd: 'crowd', image: 'pop' };

// Ground-plane footprint of an element (ignores rot). Used for actor anchoring and the layout checker.
function bbox(it) {
  const el = it.el, x = el.x || 0, z = el.z || 0, y = el.y || 0;
  const T = it.kind;
  if (T === 'text') {
    const w = it.w || 1, hz = (el.size || 0.5) * 0.62;
    const x0 = el.align === 'center' ? x - w / 2 : el.align === 'right' ? x - w : x;
    return { x0, x1: x0 + w, z0: z - hz, z1: z + hz, top: y };
  }
  if (T === 'rect') return { x0: x, x1: x + el.w, z0: z - el.d / 2, z1: z + el.d / 2, top: y };
  if (T === 'box') return { x0: x - (el.w || 1) / 2, x1: x + (el.w || 1) / 2, z0: z - (el.d || 1) / 2, z1: z + (el.d || 1) / 2, top: y + (el.h || 1) };
  if (T === 'cyl' || T === 'prism') { const r = el.r || (T === 'cyl' ? 0.5 : 0.6); return { x0: x - r, x1: x + r, z0: z - r, z1: z + r, top: y + (el.h || 1) }; }
  if (T === 'card') return { x0: x - el.w / 2, x1: x + el.w / 2, z0: z - el.d / 2, z1: z + el.d / 2, top: y + (el.t || 0.08) };
  if (T === 'crowd') {
    const g = el.gap || 0.3, s = el.s || 0.2;
    const hx = ((el.cols - 1) / 2) * g + s / 2, hz = ((el.rows - 1) / 2) * g + s / 2;
    return { x0: x - hx, x1: x + hx, z0: z - hz, z1: z + hz, top: y + (el.h || 0.16) };
  }
  if (T === 'image') {
    const w = it.iw || el.w || 1, h = it.ih || el.h || 1;
    return el.stand ? { x0: x - w / 2, x1: x + w / 2, z0: z - 0.1, z1: z + 0.1, top: y + h } : { x0: x - w / 2, x1: x + w / 2, z0: z - h / 2, z1: z + h / 2, top: y };
  }
  return { x0: x - 0.5, x1: x + 0.5, z0: z - 0.5, z1: z + 0.5, top: y };
}

function mulberry(a) {
  return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

export async function loadTextures(show) {
  show.__tex = {};
  const srcs = [...new Set([
    ...(show.elements || []).filter((e) => e.type === 'image').map((e) => e.src),
    ...(show.actors || []).flatMap((a) => Object.values(a.poses || {})),
  ])];
  const loader = new THREE.TextureLoader();
  await Promise.all(srcs.map((s) => new Promise((res, rej) => loader.load(s, (tx) => {
    tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 16; show.__tex[s] = tx; res();
  }, undefined, rej))));
}

export async function loadFonts(show) {
  const all = JSON.stringify(show);
  const jobs = [];
  for (const w of [500, 700, 900]) jobs.push(document.fonts.load(`${w} 40px "Noto Sans SC"`, all));
  jobs.push(document.fonts.load('400 40px "Archivo Black"', all));
  jobs.push(document.fonts.load('700 40px "Archivo Variable"', all));
  await Promise.allSettled(jobs);
  await document.fonts.ready;
  return ['Noto Sans SC', 'Archivo Black', 'Archivo Variable'].map((f) => `${f}:${document.fonts.check(`900 40px "${f}"`, '样A')}`).join(' ');
}

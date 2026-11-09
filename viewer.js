(function () {
const T = THREE;
const host = document.getElementById('viewer');
const renderer = new T.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true; renderer.shadowMap.type = T.PCFSoftShadowMap;
host.appendChild(renderer.domElement);
const scene = new T.Scene(); 
scene.fog = new T.Fog(0xe4ebef, 200, 520);
const camera = new T.PerspectiveCamera(40, 1, 0.1, 800);
const controls = new T.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; controls.maxPolarAngle = Math.PI * 0.495; controls.screenSpacePanning = true;

scene.add(new T.HemisphereLight(0xffffff, 0x9d9c94, 0.7));
const sun = new T.DirectionalLight(0xfff3e0, 0.95); sun.position.set(50, 80, 60);
sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -0.0008; sun.shadow.normalBias = 0.06;
Object.assign(sun.shadow.camera, { left: -60, right: 60, top: 60, bottom: -60, near: 1, far: 250 });
sun.target.position.set(10, 0, 15); scene.add(sun, sun.target);
const kitchenLight = new T.PointLight(0xfff0dd, 0.45, 40, 1.5); kitchenLight.position.set(9, 8, 6); scene.add(kitchenLight);

// ---------- materials ----------
const mk = (c, r = .8, m = 0) => new T.MeshStandardMaterial({ color: c, roughness: r, metalness: m });
function canvasTex(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new T.CanvasTexture(c); t.wrapS = t.wrapT = T.RepeatWrapping; t.anisotropy = 8; return t; }
const brickTex = canvasTex(256, 128, (g, w, h) => {
  g.fillStyle = '#b9b4a8'; g.fillRect(0, 0, w, h);
  for (let r = 0; r < 3; r++) for (let b = -1; b < 3; b++) {
    const x = b * 128 + (r % 2 ? 64 : 0), y = r * 42.67; const l = 85 + Math.random() * 14;
    g.fillStyle = `hsl(${8 + Math.random() * 6},${48 + Math.random() * 10}%,${l * 0.36}%)`; g.fillRect(x + 2, y + 2, 124, 38.67);
  }
});
const woodTex = canvasTex(512, 512, (g, w, h) => {
  for (let r = 0; r < 5; r++) { const off = Math.random() * 512; for (let k = 0; k < 2; k++) { const x = (off + k * 256) % 512; const l = 31 + Math.random() * 6, hue = 26 + Math.random() * 5;
    for (const xx of [x, x - 512]) { g.fillStyle = `hsl(${hue},${44 + Math.random() * 8}%,${l - 1}%)`; g.fillRect(xx, r * 102.4 + 1, 256, 100);
      g.strokeStyle = 'rgba(70,32,10,.11)'; g.lineWidth = 1; for (let n = 0; n < 7; n++) { const yy = r * 102.4 + 6 + Math.random() * 90; g.beginPath(); g.moveTo(xx, yy); g.bezierCurveTo(xx + 80, yy + (Math.random() - .5) * 6, xx + 170, yy + (Math.random() - .5) * 6, xx + 256, yy); g.stroke(); }
      if (Math.random() < .35) { g.fillStyle = 'rgba(60,28,8,.35)'; g.beginPath(); g.ellipse(xx + 40 + Math.random() * 170, r * 102.4 + 20 + Math.random() * 60, 3.5, 2.2, 0, 0, 7); g.fill(); } } } }
});
const marbleTex = canvasTex(512, 512, (g, w, h) => {
  g.fillStyle = '#f4f4f2'; g.fillRect(0, 0, w, h);
  for (let n = 0; n < 26; n++) { const x = Math.random() * w, y = Math.random() * h, r = 40 + Math.random() * 90, gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, 'rgba(150,155,160,.10)'); gr.addColorStop(1, 'rgba(150,155,160,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); }
  for (let n = 0; n < 16; n++) { let x = Math.random() * w, y = Math.random() * h, a = Math.random() * 6.28; g.strokeStyle = `rgba(95,100,108,${.18 + Math.random() * .25})`; g.lineWidth = .8 + Math.random() * 2.4; g.beginPath(); g.moveTo(x, y);
    for (let s = 0; s < 14; s++) { a += (Math.random() - .5) * 1.1; x += Math.cos(a) * 34; y += Math.sin(a) * 34; g.lineTo(x, y); } g.stroke(); }
});
woodTex.center.set(.5, .5); woodTex.rotation = Math.PI / 2;
const MAT = {
  brick: new T.MeshStandardMaterial({ map: brickTex, roughness: .95 }), white: mk(0xece9e2, .9), cab: mk(0xe3e1da, .5), panel: mk(0xd6d4cc, .5),
  island: mk(0x5a3825, .42), islandP: mk(0x4a2d1d, .42), marble: new T.MeshStandardMaterial({ map: marbleTex, roughness: .12 }), steel: mk(0xc9ccd0, .38, .5), black: mk(0x141414, .5, .4),
  glass: new T.MeshStandardMaterial({ color: 0x9fc3d6, roughness: .05, transparent: true, opacity: .4 }),
  floor: new T.MeshStandardMaterial({ map: woodTex, roughness: .38 }), joist: mk(0x9a8566), pt: mk(0xa28d68, .85), quartz: mk(0xf3f3f1, .2),
  tile: mk(0xf5f5f3, .2), ground: mk(0x6c7d5f, 1), conc: mk(0x9b9b96, .95), roof: mk(0x3b3f44, .9), trim: mk(0xf2f2ee, .6), door: mk(0x7b2b24, .5)
};

// ---------- helpers (plan coords: x east, y north, z up) ----------
const L = { site: new T.Group(), base: new T.Group(), f1: new T.Group(), f2: new T.Group(), roof: new T.Group(), porch: new T.Group(), porch2: new T.Group(), front: new T.Group(), furn: new T.Group(), ctx: new T.Group(), bathA: new T.Group(), bathB: new T.Group(), furn2: new T.Group() };
Object.values(L).forEach(g => scene.add(g));
function uvFit(g, sx, sy, sz, tw, th) {
  const d = [[sz, sy], [sz, sy], [sx, sz], [sx, sz], [sx, sy], [sx, sy]], uv = g.attributes.uv;
  for (let f = 0; f < 6; f++) for (let v = 0; v < 4; v++) { const i = f * 4 + v; uv.setXY(i, uv.getX(i) * d[f][0] / tw, uv.getY(i) * d[f][1] / th); }
}
function box(x0, x1, y0, y1, z0, z1, mat, grp, src = 'plan', tile = null) {
  const sx = Math.abs(x1 - x0), sy = Math.abs(z1 - z0), sz = Math.abs(y1 - y0);
  if (sx < 1e-4 || sy < 1e-4 || sz < 1e-4) return null;
  const g = new T.BoxGeometry(sx, sy, sz); if (tile) uvFit(g, sx, sy, sz, tile[0], tile[1]);
  const m = new T.Mesh(g, mat); m.position.set((x0 + x1) / 2, (z0 + z1) / 2, -(y0 + y1) / 2);
  m.castShadow = m.receiveShadow = true; m.userData.src = src; grp.add(m); return m;
}
const BR = [1.333, 0.667];
function wallBox(x0, x1, y0, y1, z0, z1, inside, grp, src, rev) {
  const mats = Array(6).fill(MAT.brick); mats[{ '+x': 0, '-x': 1, '+z': 4, '-z': 5 }[inside]] = MAT.white; (rev || []).forEach(i => { mats[i] = MAT.trim; });
  const sx = Math.abs(x1 - x0), sy = Math.abs(z1 - z0), sz = Math.abs(y1 - y0);
  const g = new T.BoxGeometry(sx, sy, sz); uvFit(g, sx, sy, sz, BR[0], BR[1]);
  const m = new T.Mesh(g, mats); m.position.set((x0 + x1) / 2, (z0 + z1) / 2, -(y0 + y1) / 2);
  m.castShadow = m.receiveShadow = true; m.userData.src = src; grp.add(m);
}
function wallOpen(axis, c0, c1, t0, t1, z0, z1, ops, inside, grp, src) {
  const lo = axis === 'x' ? 1 : 4, hi = axis === 'x' ? 0 : 5, P = []; let cur = c0, prev = false;
  [...ops].sort((a, b) => a[0] - b[0]).forEach(([a0, a1, zs, zh]) => {
    P.push([cur, a0, z0, z1, prev ? [lo, hi] : [hi]], [a0, a1, z0, zs, [lo, hi, 2]], [a0, a1, zh, z1, [lo, hi, 3]]); cur = a1; prev = true;
  });
  P.push([cur, c1, z0, z1, prev ? [lo] : []]);
  P.forEach(([a, b, za, zb, rev]) => { if (b - a < 1e-4 || zb - za < 1e-4) return; axis === 'x' ? wallBox(a, b, t0, t1, za, zb, inside, grp, src, rev) : wallBox(t0, t1, a, b, za, zb, inside, grp, src, rev); });
}
function windowAt(x0, x1, zs, zh, grp, src) {
  box(x0 + .07, x1 - .07, .3, .7, zs + .07, zh - .07, MAT.glass, grp, src);
  [[x0, x0 + .07, zs, zh], [x1 - .07, x1, zs, zh], [x0, x1, zs, zs + .07], [x0, x1, zh - .07, zh], [(x0 + x1) / 2 - .02, (x0 + x1) / 2 + .02, zs, zh]].forEach(a => box(a[0], a[1], .2, .8, a[2], a[3], MAT.trim, grp, src));
}

const W = 20.8, YF = -39, YA = -18.5, ZC = 9.0, Z2 = 9.7, ZT = 18.7, G = -3;
// ---------- site + basement ----------
const ground = new T.Mesh(new T.PlaneGeometry(500, 500), MAT.ground); ground.rotation.x = -Math.PI / 2; ground.position.set(10, G - 0.06, 0); ground.receiveShadow = true; L.site.add(ground);
box(-6, W + 6, YF - 6, 8, G - 0.02, G, MAT.conc, L.site, 'assumed');
wallOpen('x', 0, W, 0, 1.03, -9.5, G, [], '+z', L.base, 'assumed'); wallOpen('x', 0, W, YF, YF + 1, -9.5, G, [], '-z', L.base, 'assumed');
wallOpen('y', YF + 1, 0, 0, 1, -9.5, G, [], '+x', L.base, 'assumed'); wallOpen('y', YF + 1, 0, W - 1, W, -9.5, G, [], '-x', L.base, 'assumed');
box(1, W - 1, YF + 1, 0, -9.7, -9.2, MAT.conc, L.base, 'assumed');
[[8.7, -4], [8.7, -12], [8.7, -20]].forEach(([x, y]) => { const c = new T.Mesh(new T.CylinderGeometry(.17, .17, 6.2, 16), MAT.steel); c.position.set(x, -6.3, -y); c.userData.src = 'plan'; L.base.add(c); });
box(8.2, 9.2, YA, 0.5, -3.7, -3.0, MAT.steel, L.base, 'plan');

// ---------- first floor shell ----------
box(0.1, W - 0.1, YF + 0.1, 0.95, -0.8, 0, MAT.joist, L.f1, 'assumed');
box(1, W - 1, YA, 0, -0.02, 0, MAT.floor, L.f1, 'plan', [4, 2.083]);
box(1, W - 1, YF + 1, YA, -0.02, 0, MAT.floor, L.f1, 'assumed', [4, 2.083]);
wallOpen('x', 0, W, 0, 1.03, G, Z2, [[5.05, 7.76, 0, 6.67], [9.72, 11.69, 2.5, 7.5], [16.24, 18.26, 2.5, 7.5]], '+z', L.f1, 'plan');
wallOpen('y', YA, 0, 0, 1, G, Z2, [], '+x', L.f1, 'plan'); wallOpen('y', YF + 1, YA, 0, 1, G, Z2, [], '+x', L.f1, 'assumed');
wallOpen('y', YA, 0, W - 1, W, G, Z2, [[-14.3, -11.3, 2, 8]], '-x', L.f1, 'plan'); wallOpen('y', YF + 1, YA, W - 1, W, G, Z2, [[-29.8, -26.0, 2.5, 7.5]], '-x', L.f1, 'assumed'); [[-29.8, -26.0, 2.5, 7.5]].forEach(([a, b, z0, z1]) => { box(W - .7, W - .35, a + .07, b - .07, z0 + .07, z1 - .07, MAT.glass, L.f1, 'assumed'); [[a, a + .07, z0, z1], [b - .07, b, z0, z1], [a, b, z0, z0 + .07], [a, b, z1 - .07, z1]].forEach(t => box(W - .85, W - .2, t[0], t[1], t[2], t[3], MAT.trim, L.f1, 'assumed')); });
// front wall (assumed): door + two windows
wallOpen('x', 0, W, YF, YF + 1, G, Z2, [[2.0, 4.8, 0, 6.67], [7.9, 11.5, 2.6, 7.4], [11.7, 15.3, 2.6, 7.4]], '-z', L.f1, 'assumed');
windowAt(9.72, 11.69, 2.5, 7.5, L.f1, 'plan'); windowAt(16.24, 18.26, 2.5, 7.5, L.f1, 'plan');
box(5.05, 7.76, .35, .55, 0, 6.67, MAT.trim, L.f1); box(5.3, 7.5, .3, .6, 3.4, 6.2, MAT.glass, L.f1); box(7.4, 7.6, .25, .65, 3.0, 3.2, MAT.steel, L.f1);
box(W - 1.15, W - .95, -14.3, -11.3, 2.0, 8.0, MAT.glass, L.f1);
box(2.0, 4.8, YF + .3, YF + .6, 0, 6.67, MAT.door, L.f1, 'assumed'); box(2.5, 4.3, YF + .25, YF + .65, 3.2, 6.0, MAT.glass, L.f1, 'assumed');
[[7.9, 11.5], [11.7, 15.3]].forEach(([a, b]) => { box(a + .07, b - .07, YF + .3, YF + .7, 2.67, 7.33, MAT.glass, L.f1, 'assumed'); box(a, b, YF + .2, YF + .8, 2.6, 2.75, MAT.trim, L.f1, 'assumed'); box(a, a + .07, YF + .2, YF + .8, 2.6, 7.4, MAT.trim, L.f1, 'assumed'); box(b - .07, b, YF + .2, YF + .8, 2.6, 7.4, MAT.trim, L.f1, 'assumed'); });

// ---------- kitchen (plan A1.1) ----------
const CT = 3.0, TK = 0.33;
function pull(x, y, z, s) { box(x, x + .06 * s, y - .15, y + .15, z - .02, z + .02, MAT.black, L.f1); }
function frontX(xf, s, y0, y1, z0, z1, mat, pm) {
  box(xf, xf + s * .07, y0 + .01, y1 - .01, z0 + .01, z1 - .01, mat, L.f1);
  if (y1 - y0 > .7 && z1 - z0 > .7) box(xf + s * .07, xf + s * .085, y0 + .13, y1 - .13, z0 + .13, z1 - .13, pm, L.f1);
}
function baseRun(xb, d, s, y0, y1, mat, pm) {
  const xf = xb + s * d; box(Math.min(xb, xf), Math.max(xb, xf), y0, y1, TK, CT - .12, mat, L.f1);
  box(Math.min(xb, xf - s * .2), Math.max(xb, xf - s * .2), y0, y1, 0, TK, MAT.black, L.f1);
  const n = Math.max(1, Math.ceil((y1 - y0) / 2.6)), w = (y1 - y0) / n;
  for (let i = 0; i < n; i++) { const a = y0 + i * w, b = a + w; frontX(xf, s, a, b, TK + .02, 2.2, mat, pm); frontX(xf, s, a, b, 2.22, CT - .14, mat, pm); pull(xf + s * .07, (a + b) / 2, 2.0, s); pull(xf + s * .07, (a + b) / 2, 2.6, s); }
}
const XB = 1.0;
baseRun(XB, 2, 1, -5.6, -2.54, MAT.cab, MAT.panel); baseRun(XB, 2, 1, -10.4, -8.2, MAT.cab, MAT.panel);
box(XB, XB + 2.08, -5.6, -2.54, CT - .12, CT, MAT.marble, L.f1, 'plan', [4, 4]); box(XB, XB + 2.08, -10.4, -8.2, CT - .12, CT, MAT.marble, L.f1, 'plan', [4, 4]);
box(XB, XB + 2.3, -8.2, -5.6, 0, CT, MAT.steel, L.f1); box(XB + 2.3, XB + 2.36, -8.0, -5.8, .6, 2.4, MAT.black, L.f1); box(XB + 2.36, XB + 2.5, -8.0, -5.8, 2.5, 2.6, MAT.steel, L.f1);
box(XB, XB + 2.3, -8.2, -5.6, CT, CT + .05, MAT.black, L.f1);
[[.6, -6.2], [.6, -7.6], [1.6, -6.2], [1.6, -7.6]].forEach(([dx, y]) => { const c = new T.Mesh(new T.CylinderGeometry(.3, .3, .06, 20), MAT.black); c.position.set(XB + dx + .2, CT + .08, -y); L.f1.add(c); });
box(XB, XB + 1.6, -7.9, -5.9, 5.6, 6.1, MAT.steel, L.f1); box(XB, XB + .9, -7.4, -6.4, 6.1, ZC, MAT.steel, L.f1);
box(XB, XB + 2.5, -13.7, -10.5, 0, 6.2, MAT.steel, L.f1); box(XB + 2.5, XB + 2.56, -12.15, -12.05, .2, 6.0, MAT.black, L.f1); box(XB, XB + 2.5, -13.7, -10.5, 6.2, ZC, MAT.cab, L.f1);
box(XB, XB + .04, -10.4, -2.54, CT, 4.5, MAT.tile, L.f1);
[[-5.6, -2.54], [-10.4, -8.2]].forEach(([a, b]) => { box(XB, XB + 1, a, b, 4.5, 8.4, MAT.cab, L.f1); frontX(XB + 1, 1, a, b, 4.5, 8.4, MAT.cab, MAT.panel); pull(XB + 1.085, (a + b) / 2, 4.9, 1); });
box(1.0, 3.36, 0, -2.54, 0, ZC, MAT.white, L.f1); frontX(3.36, 1, -2.0, -.5, .05, 6.67, MAT.cab, MAT.panel);
box(1.0, 4.4, YA, -14.0, 0, ZC, MAT.white, L.f1, 'plan'); frontX(4.4, 1, -16.2, -14.2, .05, 6.67, MAT.cab, MAT.panel);
const IX0 = 6.9, IX1 = 10.15, IY0 = -11.5, IY1 = -3.76;
box(IX0, IX1, IY0, IY1, TK, CT - .12, MAT.island, L.f1); box(IX0 + .1, IX1 - .1, IY0 + .1, IY1 - .1, 0, TK, MAT.black, L.f1);
for (let i = 0; i < 4; i++) { const w = (IY1 - IY0) / 4, a = IY0 + i * w, b = a + w;[[IX0, -1], [IX1, 1]].forEach(([xf, s]) => { frontX(xf, s, a, b, TK + .02, 2.2, MAT.island, MAT.islandP); frontX(xf, s, a, b, 2.22, CT - .14, MAT.island, MAT.islandP); pull(xf + s * .07, (a + b) / 2, 2.6, s); }); }
box(IX0 - .1, IX1 + .55, IY0 - .1, IY1 + .1, CT - .12, CT, MAT.marble, L.f1, 'plan', [4, 4]);
box(IX0 + .5, IX1 - .5, -9.0, -6.6, CT - .04, CT + .005, MAT.steel, L.f1); box(IX0 + 1.5, IX0 + 1.6, -6.1, -6.0, CT, CT + 1.2, MAT.steel, L.f1); box(IX0 + 1.0, IX0 + 1.6, -6.1, -6.0, CT + 1.15, CT + 1.25, MAT.steel, L.f1);

// ---------- second floor (assumed massing; rear porch door/windows follow A1.1) ----------
function deck(ya, yb, z0, z1, mat, src, tile) {
  [[ya, Math.max(yb, -24.6), 1], [Math.min(ya, -24.6), Math.max(yb, -36.3), 4.5], [Math.min(ya, -36.3), yb, 1]].forEach(([p, q, x0]) => { if (p - q > 1e-3) box(x0, W - 1, q, p, z0, z1, mat, L.f2, src, tile); });
}
deck(0, YA, ZC, Z2, MAT.white, 'plan'); deck(YA, YF + 1, ZC, Z2, MAT.white, 'assumed');
box(1, W - 1, YF + 1, 0, ZT - .3, ZT, MAT.white, L.roof, 'assumed');
box(8.4, 9.2, YA + 2.5, 0, ZC - 1.17, ZC, MAT.white, L.f2, 'plan');
deck(0, YF + 1, Z2, Z2 + .02, MAT.floor, 'assumed', [4, 2.083]);
wallOpen('x', 0, W, 0, 1.03, Z2, ZT, [[5.4, 7.6, Z2 + 2.5, Z2 + 7.5], [9.72, 11.69, Z2, Z2 + 6.67], [16.24, 18.26, Z2 + 2.5, Z2 + 7.5]], '+z', L.f2, 'plan');
wallOpen('y', YF + 1, 0, 0, 1, Z2, ZT, [], '+x', L.f2, 'assumed'); wallOpen('y', YF + 1, 0, W - 1, W, Z2, ZT, [[-36.9, -34.5, Z2 + 2.4, Z2 + 6.9], [-16.8, -14.4, Z2 + 2.4, Z2 + 6.9], [-10.8, -8.4, Z2 + 2.4, Z2 + 6.9]], '-x', L.f2, 'assumed'); [[-36.9, -34.5], [-16.8, -14.4], [-10.8, -8.4]].forEach(([a, b]) => { box(W - .7, W - .35, a + .07, b - .07, Z2 + 2.47, Z2 + 6.83, MAT.glass, L.f2, 'assumed'); [[a, a + .07], [b - .07, b]].forEach(t => box(W - .85, W - .2, t[0], t[1], Z2 + 2.4, Z2 + 6.9, MAT.trim, L.f2, 'assumed')); });
wallOpen('x', 0, W, YF, YF + 1, Z2, ZT, [[7.9, 11.5, Z2 + 2.4, Z2 + 7.2], [11.7, 15.3, Z2 + 2.4, Z2 + 7.2]], '-z', L.f2, 'assumed');
[[7.9, 11.5], [11.7, 15.3]].forEach(([a, b]) => { box(a + .07, b - .07, YF + .3, YF + .7, Z2 + 2.47, Z2 + 7.13, MAT.glass, L.f2, 'assumed'); box(a, a + .07, YF + .2, YF + .8, Z2 + 2.4, Z2 + 7.2, MAT.trim, L.f2, 'assumed'); box(b - .07, b, YF + .2, YF + .8, Z2 + 2.4, Z2 + 7.2, MAT.trim, L.f2, 'assumed'); });
windowAt(5.4, 7.6, Z2 + 2.5, Z2 + 7.5, L.f2, 'plan'); windowAt(16.24, 18.26, Z2 + 2.5, Z2 + 7.5, L.f2, 'plan');
box(9.72, 11.69, .35, .55, Z2, Z2 + 6.67, MAT.trim, L.f2); box(9.95, 11.45, .3, .6, Z2 + 1.0, Z2 + 6.2, MAT.glass, L.f2);


// ---------- roof: front-to-back gable, gray shingle (from street photos; pitch estimated) ----------
const RISE = 8.0, HALF = W / 2 + .7, SL = Math.hypot(HALF, RISE), RA = Math.atan(RISE / HALF), RL = 41.5;
function roofSet(cx, grp, frontMat) {
  [-1, 1].forEach(s => {
    const m = new T.Mesh(new T.BoxGeometry(SL, .35, RL), MAT.roof); m.position.set(cx + s * HALF / 2, ZT + RISE / 2 + .1, -((YF + 1.03) / 2));
    m.rotation.z = -s * RA; m.castShadow = m.receiveShadow = true; m.userData.src = 'assumed'; grp.add(m);
  });
  [[38.0, frontMat], [-1.03, MAT.brick]].forEach(([zMin, mat]) => {
    const sh = new T.Shape(); sh.moveTo(-W / 2, 0); sh.lineTo(W / 2, 0); sh.lineTo(0, RISE * (W / 2) / HALF); sh.closePath();
    const g = new T.Mesh(new T.ExtrudeGeometry(sh, { depth: 1.0, bevelEnabled: false }), mat);
    g.position.set(cx, ZT, zMin); g.castShadow = g.receiveShadow = true; g.userData.src = 'assumed'; grp.add(g);
  });
}
roofSet(W / 2, L.roof, MAT.trim);
box(W, W + .5, -21, -18, G, ZT, MAT.brick, L.f2, 'assumed'); box(18.9, W + .5, -21, -18, ZT, ZT + 6.8, MAT.brick, L.roof, 'assumed');
box(2.0 - .3, 14.0 + .3, 1.03, 9.3, ZT - .1, ZT + .4, MAT.roof, L.porch2, 'plan');


// ---------- front porch (from Praveen's street photo; dimensions assumed) ----------
box(-0.2, W + 0.2, YF - 7, YF, -.45, -.1, MAT.conc, L.front, 'assumed');
box(.2, .9, YF - 6.9, YF - 6.2, -.1, 8.6, MAT.trim, L.front, 'assumed');
box(18.6, W, YF - 7, YF - 4.8, -.1, 8.6, MAT.trim, L.front, 'assumed');
const fr = new T.Mesh(new T.BoxGeometry(W + .8, .3, 8.2), MAT.roof); fr.position.set(W / 2, 8.7, -(YF - 3.9)); fr.rotation.x = 0.11; fr.castShadow = fr.receiveShadow = true; fr.userData.src = 'assumed'; L.roof.add(fr);
for (let i = 0; i < 5; i++) box(5.0, 10.8, YF - 7 - i * .85, YF - 7 - (i + 1) * .85, G, -.1 - (i + 1) * .58 + .58 - .58, MAT.conc, L.front, 'assumed');
[5.0, 10.8].forEach(x => { const len = Math.hypot(4.25, 2.9); const r = new T.Mesh(new T.BoxGeometry(.12, .15, len), MAT.trim); r.position.set(x, 1.45 + .1, -(YF - 7 - 2.125)); r.rotation.x = Math.atan(2.9 / 4.25); r.castShadow = true; r.userData.src = 'assumed'; L.front.add(r);
  box(x - .1, x + .1, YF - 7.1, YF - 6.9, -.1, 3.0, MAT.trim, L.front, 'assumed'); box(x - .1, x + .1, YF - 11.35, YF - 11.15, G, 0, MAT.trim, L.front, 'assumed');
  for (let t = .3; t < 4.1; t += .5) box(x - .04, x + .04, YF - 7 - t - .04, YF - 7 - t + .04, -.1 - t * .68, 2.8 - t * .68, MAT.trim, L.front, 'assumed'); });

// ---------- rear porches (plan A1.1 / A2.1) ----------
box(2.0, 14.0, 1.03, 9.0, -.45, -.1, MAT.pt, L.porch); box(2.0, 14.0, 1.03, 9.0, 8.9, 9.7, MAT.pt, L.porch2);
[[2.1, 1.3], [2.1, 5.0], [2.1, 8.9], [8.7, 8.9], [13.9, 8.9], [13.9, 5.0], [13.9, 1.3]].forEach(([x, y]) => { box(x - .25, x + .25, y - .25, y + .25, G, Z2 - .8, MAT.pt, L.porch); box(x - .25, x + .25, y - .25, y + .25, Z2 - .8, ZT, MAT.pt, L.porch2); });
function railX(y, a, b, z) { const P = z > 0 ? L.porch2 : L.porch; box(a, b, y - .1, y + .1, z + 3, z + 3.15, MAT.pt, P); box(a, b, y - .1, y + .1, z + .2, z + .35, MAT.pt, P); for (let x = a; x < b; x += .45) box(x, x + .12, y - .05, y + .05, z + .35, z + 3, MAT.pt, P); }
function railY(x, a, b, z) { const P = z > 0 ? L.porch2 : L.porch; box(x - .1, x + .1, a, b, z + 3, z + 3.15, MAT.pt, P); box(x - .1, x + .1, a, b, z + .2, z + .35, MAT.pt, P); for (let y = a; y < b; y += .45) box(x - .05, x + .05, y, y + .12, z + .35, z + 3, MAT.pt, P); }
[0, Z2].forEach(z => { railY(2.1, 1.55, 8.65, z); railY(13.9, 1.55, 8.65, z); railX(8.9, 8.95, 13.65, z); });
railX(8.9, 2.35, 8.45, Z2);
for (let i = 0; i < 5; i++) box(2.3, 8.5, 9.0 + i * .83, 9.0 + (i + 1) * .83, G, -.1 - (4 - i) * .58, MAT.pt, L.porch);

// ---------- context: twin neighbor, street, trees, fence ----------

box(-6, W + 6, YF - 7.2, -63, G - .08, G - .02, MAT.ground, L.ctx, 'assumed');
box(-90, 110, -63, -59, G - .06, G + .04, MAT.conc, L.ctx, 'assumed');
const asphalt = mk(0x4a4c50, .95); box(-90, 110, -90, -63, G - .07, G - .01, asphalt, L.ctx, 'assumed');
for (let x = -85; x < 105; x += 12) box(x, x + 6, -77.3, -76.7, G - .01, G, MAT.trim, L.ctx, 'assumed');
function tree(x, y, s) { const tr = new T.Mesh(new T.CylinderGeometry(.5 * s, .75 * s, 9 * s, 10), mk(0x5a4632, 1)); tr.position.set(x, G + 4.5 * s, -y); tr.castShadow = true; L.ctx.add(tr);
  [[0, 11, 0, 6], [2.5, 9.5, 1, 4.5], [-2.5, 9.8, -1, 4.8]].forEach(([dx, dy, dz, r]) => { const f = new T.Mesh(new T.IcosahedronGeometry(r * s, 2), mk(0x4d7a3c, .9)); f.position.set(x + dx * s, G + dy * s, -y + dz * s); f.castShadow = true; L.ctx.add(f); }); }
[[-24, -68, 1], [62, -74, 1.1], [34, 22, 1.3], [-30, 24, 1.2], [48, -20, 1.2]].forEach(a => tree(...a));
box(-40, 60, 15.5, 16, G, G + 5.5, mk(0x9b7b55, .9), L.ctx, 'assumed');

// ---------- furnishing (illustrative design concept, not in the drawings) ----------
const fab = (c) => mk(c, .95);
function fbox(x0, x1, y0, y1, z0, z1, m) { return box(x0, x1, y0, y1, z0, z1, m, L.furn, 'assumed'); }
const SOFA = fab(0x4b5560), WOODF = mk(0x7a5a3a, .6), RUG = fab(0xb7c0c8);
fbox(8.0, 16.6, -32.6, -23.4, 0.0, .04, RUG);
fbox(14.5, 16.9, -31.6, -24.4, .5, 1.5, SOFA); fbox(16.3, 17.4, -31.6, -24.4, .5, 3.0, SOFA); fbox(14.5, 16.9, -31.9, -31.5, .5, 2.2, SOFA); fbox(14.5, 16.9, -24.5, -24.1, .5, 2.2, SOFA);
fbox(9.4, 12.0, -29.6, -26.4, 1.0, 1.15, WOODF); [[9.6, -29.4], [11.6, -29.4], [9.6, -26.6], [11.6, -26.6]].forEach(([x, y]) => fbox(x, x + .2, y - .2, y, 0, 1.0, WOODF));
fbox(1.0, 2.2, -31.5, -25.5, 0, 1.8, WOODF); fbox(1.0, 1.15, -30.8, -26.2, 2.6, 5.0, MAT.black);
fbox(8.4, 10.4, -35.6, -33.2, .5, 2.3, fab(0xb08a5a)); fbox(8.4, 10.4, -35.6, -35.2, .5, 3.2, fab(0xb08a5a));
fbox(12.6, 16.8, -9.4, -6.0, 2.4, 2.6, WOODF); [[12.8, -9.2], [16.4, -9.2], [12.8, -6.2], [16.4, -6.2]].forEach(([x, y]) => fbox(x - .1, x + .1, y - .1, y + .1, 0, 2.4, WOODF));
[[13.6, -5.0], [15.8, -5.0], [13.6, -10.4], [15.8, -10.4]].forEach(([x, y]) => { fbox(x - .6, x + .6, y - .6, y + .6, 1.5, 1.7, fab(0xd9d4c8)); fbox(x - .6, x + .6, y - (y < -7 ? -.6 : .6), y - (y < -7 ? -.5 : .5), 1.7, 3.2, fab(0xd9d4c8)); });
const glow = new T.MeshStandardMaterial({ color: 0xfff1d6, emissive: 0xffd9a0, emissiveIntensity: 1.2, roughness: .3 });
[-5.4, -7.6, -9.8].forEach(y => { fbox(7.6 - .02, 7.6 + .02, y - .02, y + .02, 6.6, ZC, MAT.black); const s = new T.Mesh(new T.SphereGeometry(.55, 20, 14), glow); s.position.set(7.6, 6.3, -y); L.furn.add(s); s.userData.src = 'assumed'; });
const pl = new T.PointLight(0xffe2b8, 0.7, 30, 1.5); pl.position.set(12, 7, 26); L.furn.add(pl);
const sky = canvasTex(8, 256, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#9fc2e0'); gr.addColorStop(.6, '#d8e6f0'); gr.addColorStop(1, '#f2efe8'); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
sky.wrapS = sky.wrapT = T.ClampToEdgeWrapping; scene.background = sky;

// ---------- controls / presets ----------
const orig = new Map();
function setHighlight(on) {
  Object.values(L).forEach(g => g.traverse(o => {
    if (!o.isMesh || o === ground) return;
    if (on) { if (!orig.has(o)) orig.set(o, o.material); const sr = o.userData.src, plan = sr !== 'assumed'; o.material = new T.MeshStandardMaterial({ color: sr === 'proposed' ? 0xe0a030 : plan ? 0x1f8a94 : 0xc9c9c4, roughness: .7, transparent: !plan, opacity: plan ? 1 : .75 }); }
    else if (orig.has(o)) o.material = orig.get(o);
  }));
}
const MODE = window.MODE || 'house';
window.H = { T, scene, camera, controls, renderer, host, L, MAT, mk, canvasTex, box, wallBox, wallOpen, windowAt, uvFit, BR, frontX, pull, W, YF, YA, ZC, Z2, ZT, G, CT, TK, MODE };
const V = { house: { furn2: 1, bathA: 1, bathB: 0, furn: 1, ctx: 1, front: 1, roof: 1, f2: 1, f1: 1, base: 0, site: 1, porch: 1, porch2: 1 }, f1: { furn2: 0, bathA: 1, bathB: 0, furn: 1, ctx: 0, front: 1, roof: 0, f2: 0, f1: 1, base: 0, site: 1, porch: 1, porch2: 0 },
  f2: { furn2: 1, bathA: 0, bathB: 0, furn: 0, ctx: 0, front: 0, roof: 0, f2: 1, f1: 0, base: 0, site: 1, porch: 0, porch2: 1 }, base: { furn2: 0, bathA: 0, bathB: 0, furn: 0, ctx: 0, front: 0, roof: 0, f2: 0, f1: 0, base: 1, site: 0, porch: 0, porch2: 0 } };
const CAM = {
  house: { front: { c: [46, 17, 112], t: [10.4, 9, 19] }, rear: { c: [-30, 20, -80], t: [10, 8, 0] }, cut: { c: [36, 52, 66], t: [10.4, 0, 14], v: { roof: 0, f2: 0 } }, kitchen: { c: [13.5, 5.4, 17.5], t: [7.5, 4.2, 0] } },
  f1: { overview: { c: [38, 50, 58], t: [10.4, 0, 15] }, kitchenTop: { c: [27, 28, 30], t: [8, 1.5, 7] }, rear: { c: [-14, 16, -48], t: [10, 5, -2] }, inside: { c: [13.5, 5.4, 17.5], t: [7.5, 4.2, 0] } },
  f2: { overview: { c: [44, 46, 70], t: [10.4, 12, 15] }, front: { c: [40, 20, 100], t: [10.4, 14, 19] } },
  base: { overview: { c: [34, 22, 56], t: [10.4, -6, 15] } }
};
const GR = { furn2: L.furn2, bathA: L.bathA, bathB: L.bathB, furn: L.furn, ctx: L.ctx, front: L.front, roof: L.roof, f2: L.f2, f1: L.f1, base: L.base, site: L.site, porch: L.porch, porch2: L.porch2 };
const btn = k => document.querySelector(`[data-t="${k}"]`);
document.querySelectorAll('[data-t]').forEach(b => b.addEventListener('click', () => {
  const k = b.dataset.t, on = b.getAttribute('aria-pressed') !== 'true'; b.setAttribute('aria-pressed', on);
  if (k === 'hl') setHighlight(on);
  else if (k === 'porch') { L.porch.visible = on; if (MODE !== 'f1') L.porch2.visible = on; }
  else if (k === 'ground') { L.site.visible = on; if (MODE === 'house') L.base.visible = !on; }
  else if (k === 'furn') { L.furn.visible = on && MODE !== 'f2'; L.furn2.visible = on && MODE !== 'f1'; }
  else if (k === 'bathA' || k === 'bathB') { const o = k === 'bathA' ? 'bathB' : 'bathA'; GR[k].visible = on; if (on) { GR[o].visible = false; const ob = btn(o); if (ob) ob.setAttribute('aria-pressed', false); } }
  else GR[k].visible = on;
}));
function go(n) {
  const p = CAM[MODE][n], v = { ...V[MODE], ...(p.v || {}) };
  Object.keys(GR).forEach(k => { GR[k].visible = !!v[k]; });
  if (MODE === 'house') L.base.visible = !v.site;
  [['roof', v.roof], ['f2', v.f2], ['porch', v.porch || v.porch2], ['ground', v.site], ['furn', v.furn || v.furn2], ['ctx', v.ctx], ['bathA', v.bathA], ['bathB', v.bathB]].forEach(([k, on]) => { const b = btn(k); if (b) b.setAttribute('aria-pressed', !!on); });
  camera.position.set(...p.c); controls.target.set(...p.t); controls.update();
  document.querySelectorAll('[data-p]').forEach(b => b.setAttribute('aria-pressed', b.dataset.p === n));
}
document.querySelectorAll('[data-p]').forEach(b => b.addEventListener('click', () => { if (H.leaveRoom) H.leaveRoom(true); go(b.dataset.p); }));
H.go = go; H.GR = GR; H.V = V; H.CAM = CAM;
function resize() { const w = host.clientWidth, h = host.clientHeight; renderer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix(); }
addEventListener('resize', resize); resize(); window.__start = () => go(Object.keys(CAM[MODE])[0]);
(function loop() { requestAnimationFrame(loop); controls.update(); renderer.render(scene, camera); })();
window.__ready = true; setTimeout(() => { if (!window.__started) { window.__started = true; window.__start(); } }, 0); window.__scene = scene; window.__L = L;
})();

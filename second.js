// Stairs, second-floor layout and furnishing (design concept, not in the approved drawings). Plan coords, feet.
(function () {
const { T, L, MAT, mk, box, W, YF, YA, ZC, Z2, ZT } = H;
const A = 'assumed', f1 = L.f1, f2 = L.f2, fu = L.furn2, fu1 = L.furn;
const fab = c => mk(c, .95), wood = mk(0x7a5a3a, .6), duvet = fab(0x6f8796), linen = fab(0xeeeae0), rug = fab(0xc8c1b2), glow = new T.MeshBasicMaterial({ color: 0xfff1cf });
const porcelain = mk(0xf6f6f4, .25), mirror = mk(0xdfe8ec, .08, .25);

// ---------- main stair: left wall, rises north, 15 risers x 7.76", 14 treads x 10" ----------
const RISER = 9.7 / 15, TREAD = 0.833, Y0 = -36.3;
for (let i = 0; i < 14; i++) {
  box(1, 4.5, Y0 + i * TREAD, Y0 + (i + 1) * TREAD, 0, (i + 1) * RISER, MAT.floor, f1, A);
  box(1, 4.5, Y0 + i * TREAD, Y0 + i * TREAD + .05, i * RISER, (i + 1) * RISER, MAT.trim, f1, A);
}
const ang = Math.atan(RISER / TREAD), len = Math.hypot(14 * TREAD, 14 * RISER);
const rail = (x, z0, grp) => { const r = new T.Mesh(new T.BoxGeometry(.15, .15, len), MAT.island); r.position.set(x, z0 + 3.0 + 14 * RISER / 2 + RISER, -(Y0 + 14 * TREAD / 2)); r.rotation.x = ang; r.castShadow = true; r.userData.src = A; grp.add(r); };
rail(4.4, 0, f1);
for (let i = 0; i < 14; i++) box(4.37, 4.43, Y0 + i * TREAD + .35, Y0 + i * TREAD + .42, (i + 1) * RISER, (i + 1) * RISER + 2.9 + .0, MAT.trim, f1, A);
box(4.3, 4.5, Y0 - .05, Y0 + .15, 0, 3.4, MAT.island, f1, A);

// ---------- second-floor partitions (white, 5" thick) ----------
function pw(axis, c0, c1, t, ops) {
  const seg = []; let cur = c0;
  ops.slice().sort((a, b) => a[0] - b[0]).forEach(([a0, a1]) => { seg.push([cur, a0, Z2, ZT], [a0, a1, Z2 + 6.67, ZT]); cur = a1; });
  seg.push([cur, c1, Z2, ZT]);
  seg.forEach(([a, b, za, zb]) => { if (Math.abs(b - a) < 1e-3) return; axis === 'x' ? box(a, b, t, t + .4, za, zb, MAT.white, f2, A) : box(t, t + .4, a, b, za, zb, MAT.white, f2, A); });
}
pw('y', -22.4, 0, 4.5, [[-19.8, -17.2], [-5.6, -3.0]]);
pw('x', 4.9, W - 1, -22.4, [[8, 10.6]]); pw('x', 4.9, W - 1, -25.6, [[8, 10.6]]);
pw('x', 4.9, W - 1, -14.4, []);
pw('y', -14.0, 0, 14.0, [[-8.2, -5.6], [-13.2, -10.6]]);
pw('x', 14.4, W - 1, -8.8, []);
// guard rail around the stair opening
box(4.4, 4.52, -36.3, -24.6, Z2, Z2 + .08, MAT.trim, f2, A); box(4.4, 4.5, -36.3, -24.6, Z2 + 3.0, Z2 + 3.12, MAT.island, f2, A); box(1, 4.5, -36.3, -36.18, Z2 + 3.0, Z2 + 3.12, MAT.island, f2, A);
for (let y = -36.2; y < -24.6; y += .5) box(4.43, 4.49, y, y + .06, Z2, Z2 + 3.0, MAT.trim, f2, A);

// ---------- recessed lights + baseboards ----------
[[10, -4], [8, -10], [16.5, -17.5], [11, -18], [8.5, -23.8], [14, -23.8], [10, -31], [15, -31], [10, -36], [2.7, -20], [2.7, -8]].forEach(([x, y]) => { const d = new T.Mesh(new T.CylinderGeometry(.3, .3, .04, 16), glow); d.position.set(x, ZT - .33, -y); d.userData.src = A; f2.add(d); });
[[4.9, 14.0, -.07, 0], [4.9, W - 1, -14.4 - .07, -14.4], [4.9, W - 1, -22.4, -22.4 + .07], [4.9, W - 1, -25.6 - .07, -25.6]].forEach(([a, b, y0, y1]) => box(a, b, y0, y1, Z2, Z2 + .5, MAT.trim, f2, A));

// ---------- furnishing helpers ----------
function bed(x0, x1, y0, y1, head, g, col) {
  const zb = Z2 + .02, B = (a, b, c, d, e, f, m) => box(a, b, c, d, zb + e, zb + f, m, g, A), pil = fab(0xf6f3ea), cov = fab(col);
  B(x0, x1, y0, y1, .35, 1.0, wood); B(x0 + .1, x1 - .1, y0 + .1, y1 - .1, 1.0, 1.7, linen);
  if (head === 'W' || head === 'E') {
    const hx = head === 'W' ? [x0, x0 + .2] : [x1 - .2, x1], px = head === 'W' ? x0 + .3 : x1 - 1.3, h = (y1 - y0) / 2;
    B(hx[0], hx[1], y0, y1, .35, 4.0, wood); [0, 1].forEach(k => B(px, px + 1.0, y0 + .25 + k * h, y0 + h - .1 + k * h, 1.7, 2.1, pil));
    B(head === 'W' ? x0 + 1.5 : x0 + .1, head === 'W' ? x1 - .1 : x1 - 1.5, y0 + .05, y1 - .05, 1.7, 1.86, cov);
  } else {
    const hy = head === 'N' ? [y1 - .2, y1] : [y0, y0 + .2], py = head === 'S' ? y0 + .3 : y1 - 1.3, h = (x1 - x0) / 2;
    B(x0, x1, hy[0], hy[1], .35, 4.0, wood); [0, 1].forEach(k => B(x0 + .25 + k * h, x0 + h - .1 + k * h, py, py + 1.0, 1.7, 2.1, pil));
    B(x0 + .05, x1 - .05, head === 'S' ? y0 + 1.5 : y0 + .1, head === 'S' ? y1 - .1 : y1 - 1.5, 1.7, 1.86, cov);
  }
}
const z = Z2 + .02, F = (x0, x1, y0, y1, a, b, m) => box(x0, x1, y0, y1, z + a, z + b, m, fu, A);
const night = (x, y) => { F(x - .6, x + .6, y - .6, y + .6, 0, 1.9, wood); F(x - .6, x + .6, y - .6, y + .6, 1.9, 1.95, mk(0x5a3a22, .6)); F(x - .12, x + .12, y - .12, y + .12, 1.95, 2.7, MAT.steel); F(x - .4, x + .4, y - .4, y + .4, 2.7, 3.3, fab(0xf3ecd8)); };
const dresser = (x0, x1, y0, y1) => { F(x0, x1, y0, y1, 0, 3.0, wood); F(x0 - .02, x1 + .02, y0 - .02, y1 + .02, 3.0, 3.08, mk(0x5a3a22, .6)); };

// ---------- primary bedroom (X 4.9-14.0, Y 0 to -14.0) ----------
F(6.2, 13.0, -12.2, -4.0, 0, .03, rug); bed(7.4, 12.6, -13.9, -7.6, 'S', fu, 0x6f8796);
night(6.5, -13.0); night(13.4, -13.0); dresser(4.9, 6.4, -2.6, -7.0);
F(5.5, 7.1, -.7, -2.2, 0, 1.4, fab(0x9a6b4a)); F(5.5, 7.1, -.7, -.9, 1.4, 3.2, fab(0x9a6b4a));
// ---------- ensuite (X 14.4-19.8, Y 0 to -8.4) ----------
F(14.4, W - 1, -8.4, 0, 0, .03, MAT.tile);
F(15.0, 19.8, -2.9, -.5, 0, 1.9, porcelain); F(15.15, 19.65, -2.75, -.65, 1.0, 1.92, mk(0xcfe3ea, .1));
F(14.4, 16.4, -6.6, -3.7, 0, 2.7, MAT.cab); F(14.38, 16.42, -6.62, -3.68, 2.7, 2.85, MAT.marble); F(14.5, 14.56, -6.2, -4.1, 3.6, 6.8, mirror);
F(18.2, W - 1, -6.2, -4.9, .9, 2.7, porcelain); F(16.8, 18.2, -6.1, -5.0, 0, 1.45, porcelain);
// ---------- closet (X 14.4-19.8, Y -8.8 to -14.0) ----------
F(14.5, 19.7, -13.9, -13.3, 5.7, 5.8, MAT.steel); F(14.5, 19.7, -14.0, -13.2, 6.7, 6.8, wood);
[[15.0, 0x3c4a5c], [15.9, 0xc9c1b0], [16.8, 0x7a2f2f], [17.7, 0x3d6a52], [18.6, 0xd9d4c8]].forEach(([x, c]) => F(x, x + .7, -13.8, -13.4, 3.0, 5.6, fab(c)));
F(14.5, 19.7, -13.9, -13.5, 1.0, 1.06, wood);
// ---------- bedroom 2 (X 4.9-19.8, Y -14.4 to -22.0) ----------
F(8, 17, -15.0, -21.2, 0, .03, rug); bed(14.2, 19.7, -20.9, -15.4, 'E', fu, 0x8a7a63); night(17, -21.6 + 0.0);
dresser(4.9, 6.4, -15.5, -19.0); F(11.0, 14.0, -21.4, -19.9, 0, 2.5, wood); F(11.0, 14.0, -21.4, -19.9, 2.5, 2.58, mk(0x5a3a22, .6)); F(11.8, 13.2, -19.7, -19.1, 0, 1.6, fab(0x3c4a5c));
// ---------- bedroom 1 (X 4.9-19.8, Y -25.6 to -37.0) ----------
F(7.5, 16.5, -27.0, -34.5, 0, .03, rug); bed(9.2, 14.8, -31.8, -25.8, 'N', fu, 0x3f5565); night(7.9, -26.6); night(16.1, -26.6);
dresser(18.8, 19.8, -29.5, -34.0); F(5.4, 7.6, -33.6, -35.7, 0, 1.4, fab(0xb08a5a)); F(5.4, 5.7, -33.6, -35.7, 1.4, 3.3, fab(0xb08a5a));
F(8.2, 15.0, -36.5, -35.0, 0, 1.4, fab(0x5a6670));
// ---------- landing runner ----------
F(2.0, 3.6, -22.0, -2.0, 0, .03, fab(0x8f8a7a)); F(5.6, 18.6, -23.2, -24.6, 0, .03, fab(0x8f8a7a));
})();

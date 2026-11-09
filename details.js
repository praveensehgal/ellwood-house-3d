// First-floor detailing, proposed half bath, exterior details. Plan coords: x east, y north, z up (feet).
(function () {
const { T, L, MAT, mk, box, canvasTex, BR, W, YF, YA, ZC, Z2, ZT, G } = H;
const f1 = L.f1, fu = L.furn, A = 'assumed', P = 'proposed';
const glow = new T.MeshBasicMaterial({ color: 0xfff1cf });
const porcelain = mk(0xf6f6f4, .25), mirror = mk(0xdfe8ec, .08, .25), leaf = mk(0x4f7a3a, .9), pot = mk(0x8a5a3a, .8);

// ---------- baseboards + crown ----------
[[3.4, 5.05, 0, -.07, 'plan'], [7.76, W - 1, 0, -.07, 'plan'], [1, 2.0, YF + 1, YF + 1.07, A], [4.8, W - 1, YF + 1, YF + 1.07, A]].forEach(([a, b, y0, y1, s]) => box(a, b, y0, y1, 0, .5, MAT.trim, f1, s));
box(W - 1.07, W - 1, YF + 1, 0, 0, .5, MAT.trim, f1, A); box(1, 1.07, YF + 1, -36.4, 0, .5, MAT.trim, f1, A);
[[3.4, W - 1, 0, -.1], [1, W - 1, YF + 1, YF + 1.1]].forEach(([a, b, y0, y1]) => box(a, b, y0, y1, ZC - .32, ZC, MAT.trim, f1, A));
box(W - 1.1, W - 1, YF + 1, 0, ZC - .32, ZC, MAT.trim, f1, A);

// ---------- recessed lighting ----------
[5, 12.5, 16.5].forEach(x => [-3, -8, -13].forEach(y => { const d = new T.Mesh(new T.CylinderGeometry(.33, .33, .04, 20), glow); d.position.set(x, ZC - .02, -y); d.userData.src = 'plan'; f1.add(d); }));
[6.5, 12, 16.5].forEach(x => [-21, -28, -34].forEach(y => { const d = new T.Mesh(new T.CylinderGeometry(.33, .33, .04, 20), glow); d.position.set(x, ZC - .02, -y); d.userData.src = A; f1.add(d); }));

// ---------- kitchen finish detail ----------
box(1.04, 1.07, -8.2, -5.6, 3.0, 5.6, MAT.marble, f1, 'plan', [4, 4]);
[[-5.6, -2.54], [-10.4, -8.2]].forEach(([a, b]) => box(1.0, 2.0, a, b, 4.42, 4.5, glow, f1, A));
box(6.8, 10.7, -3.78, -3.66, .33, 2.88, MAT.marble, f1, 'plan', [4, 4]); box(6.8, 10.7, -11.6, -11.48, .33, 2.88, MAT.marble, f1, 'plan', [4, 4]);
box(6.81, 6.9, -11.3, -9.77, .4, 2.9, MAT.steel, f1, 'plan'); box(6.78, 6.81, -11.1, -9.9, 2.65, 2.72, MAT.steel, f1, 'plan');
box(3.5, 3.56, -13.7, -10.5, 2.2, 2.26, MAT.black, f1, 'plan'); [-12.4, -11.8].forEach(y => box(3.5, 3.62, y, y + .1, 3.0, 5.5, MAT.steel, f1, 'plan'));
[-5.6, -7.6, -9.6].forEach(y => { box(11.35, 12.25, y - .45, y + .45, 2.18, 2.38, MAT.island, fu, A); [[11.45, -.35], [12.05, -.35], [11.45, .35], [12.05, .35]].forEach(([x, dy]) => box(x, x + .08, y + dy - .04, y + dy + .04, 0, 2.18, MAT.black, fu, A)); box(11.5, 12.1, y - .3, y + .3, 1.05, 1.1, MAT.black, fu, A); });

// ---------- fireplace on right wall (chimney breast per side photo) ----------
box(18.9, W - 1, -21.5, -17.5, 0, 4.7, MAT.trim, f1, A); box(19.3, W - 1, -19.9, -18.5, .15, 3.0, MAT.black, f1, A);
box(18.7, W - 1, -21.7, -17.3, 4.7, 4.95, MAT.island, f1, A); box(19.2, W - 1, -21.3, -17.7, 4.95, ZC, MAT.trim, f1, A); box(18.1, W - 1, -21.7, -17.3, 0, .12, MAT.conc, f1, A);

// ---------- living room decor ----------
const art = [[8.2, 11.4], [12.8, 15.9]];
art.forEach(([a, b]) => { box(a, b, YF + 1, YF + 1.06, 3.7, 6.3, mk(0xd8d2c4, .8), fu, A); box(a + .15, b - .15, YF + 1.06, YF + 1.08, 3.9, 6.1, mk(0x5d7c8a, .9), fu, A); });
[[17.6, -35.2], [7.4, -24.9]].forEach(([x, y]) => { box(x - .45, x + .45, y - .45, y + .45, 0, 1.0, pot, fu, A); const s = new T.Mesh(new T.IcosahedronGeometry(1.1, 1), leaf); s.position.set(x, 2.4, -y); s.castShadow = true; s.userData.src = A; fu.add(s); });
box(17.0, 18.6, -37.4, -37.0, 5.6, 5.64, MAT.trim, fu, A);

// ---------- proposed half bath (user request): 5x5 or 3x6 at the left wall south of the basement stair ----------
function bath(g, w, d, door, fix) {
  const x1 = 1 + w, y1 = YA - d, [d0, d1] = door;
  [[YA, d0], [d1, y1 - .4]].forEach(([a, b]) => box(x1, x1 + .4, a, b, 0, ZC, MAT.white, g, P));
  box(x1, x1 + .4, d0, d1, 6.67, ZC, MAT.white, g, P); box(1, x1 + .4, y1, y1 - .4, 0, ZC, MAT.white, g, P);
  box(1, x1, YA, y1, 0, .03, MAT.tile, g, P);
  [[x1 + .4, d0 + .02], [x1 + .4, d1 - .02]].forEach(([x, y]) => box(x - .05, x + .05, y - .03, y + .03, 0, 6.67, MAT.trim, g, P));
  box(x1 - .1, x1 + .5, d0, d1, 6.67, 6.82, MAT.trim, g, P);
  const f = new T.Mesh(new T.CylinderGeometry(.5, .5, .06, 20), glow); f.position.set((1 + x1) / 2, ZC - .03, -((YA + y1) / 2)); f.userData.src = P; g.add(f);
  fix(g, x1, y1);
}
function toiletW(g, yc) { box(1, 1.75, yc - .6, yc + .6, .9, 2.7, porcelain, g, P); box(1.75, 3.35, yc - .55, yc + .55, 0, 1.45, porcelain, g, P); const c = new T.Mesh(new T.CylinderGeometry(.55, .55, 1.45, 20), porcelain); c.position.set(3.35, .725, -yc); c.userData.src = P; c.castShadow = true; g.add(c); box(1.75, 3.4, yc - .5, yc + .5, 1.45, 1.52, MAT.trim, g, P); }
function vanity(g, x0, x1, y0, y1) { box(x0, x1, y0, y1, 0, 2.7, MAT.cab, g, P); box(x0 - .02, x1 + .02, y0 + .02, y1 - .02, 2.7, 2.85, MAT.marble, g, P, [4, 4]); box(x0 + .3, x1 - .3, y0 - .3 + .35, y1 + .3 - .35, 2.82, 2.86, MAT.steel, g, P); box((x0 + x1) / 2 - .04, (x0 + x1) / 2 + .04, y1 - .02, y1 - .12, 2.85, 3.5, MAT.steel, g, P); }
bath(L.bathA, 5, 5, [-19.0, -21.6], (g, x1, y1) => {
  toiletW(g, -20.0); vanity(g, 3.2, 5.4, -21.9, -23.5); box(3.3, 5.3, y1 + .4, y1 + .45, 4.0, 6.6, mirror, g, P);
  [3.5, 5.0].forEach(x => box(x - .1, x + .1, y1 + .4, y1 + .5, 6.7, 6.9, glow, g, P)); box(1, 1.04, -19.5, -19.0, 3.5, 3.55, MAT.steel, g, P);
});
bath(L.bathB, 3, 6, [-19.0, -21.6], (g, x1, y1) => {
  const yc = y1 + .45, x = 2.5;
  box(x - .6, x + .6, -24.5, -23.8, .9, 2.7, porcelain, g, P); box(x - .55, x + .55, -23.8, -22.1, 0, 1.45, porcelain, g, P);
  const c = new T.Mesh(new T.CylinderGeometry(.55, .55, 1.45, 20), porcelain); c.position.set(x, .725, 22.1); c.userData.src = P; g.add(c);
  box(1, 2.5, -19.3, -20.8, 0, 2.7, MAT.cab, g, P); box(.98, 2.52, -19.28, -20.82, 2.7, 2.85, MAT.marble, g, P, [4, 4]); box(1, 1.04, -19.5, -20.6, 3.7, 6.5, mirror, g, P);
});

// ---------- exterior details ----------
const ctx = L.ctx, roofG = L.roof;
box(-.95, -.65, YF - .6, 1.0, ZT + .05, ZT + .35, MAT.trim, roofG, A); box(W + .65, W + .95, YF - .6, 1.0, ZT + .05, ZT + .35, MAT.trim, roofG, A);
[[-.8, YF - .15], [W + .8, YF - .15], [-.8, 1.3], [W + .8, 1.3]].forEach(([x, y]) => { box(x - .1, x + .1, y - .1, y + .1, G, Z2, MAT.trim, f1, A); box(x - .1, x + .1, y - .1, y + .1, Z2, ZT + .1, MAT.trim, L.f2, A); });
box(7.7, 15.5, YF - .3, YF, 2.5, 2.64, MAT.conc, f1, A); box(7.7, 15.5, YF - .3, YF, Z2 + 2.4, Z2 + 2.54, MAT.conc, L.f2, A);
const num = canvasTex(128, 64, (g, w, h) => { g.fillStyle = '#f2f0ea'; g.fillRect(0, 0, w, h); g.fillStyle = '#222'; g.font = 'bold 40px Georgia'; g.textAlign = 'center'; g.fillText('3437', w / 2, 46); });
const np = new T.Mesh(new T.PlaneGeometry(1.1, .55), new T.MeshBasicMaterial({ map: num })); np.position.set(5.9, 5.3, -(YF - .03)); np.userData.src = A; f1.add(np);
box(5.0, 10.8, -59, -43.4, G - .02, G + .02, MAT.conc, ctx, A); box(-6, 4.6, -56.5, -55.9, G, G + 2.3, MAT.brick, ctx, A, BR); box(11.2, 26, -56.5, -55.9, G, G + 2.3, MAT.brick, ctx, A, BR);
[[-1.2, -47.5, 1.3], [12.5, -47.3, 1.2], [16.5, -47.4, 1.5], [19.8, -46.5, 1.2], [1.8, -47.4, 1.0]].forEach(([x, y, s]) => { const b = new T.Mesh(new T.IcosahedronGeometry(s, 1), mk(0x4a7a3a, .9)); b.position.set(x, G + s * .8, -y); b.castShadow = true; b.userData.src = A; ctx.add(b); });
box(2.6, 3.4, -57.8, -57.2, G, G + 3.6, MAT.island, ctx, A); box(2.3, 3.7, -58.0, -57.0, G + 3.6, G + 4.4, MAT.black, ctx, A);
box(21.5, 24.5, 2.5, 5.0, G, G + 2.8, mk(0xc9cccf, .6), ctx, A);
})();

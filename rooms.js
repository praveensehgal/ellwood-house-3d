// Click a window (or a room button) to step inside that room. Plan coords -> three: (x, y, z) -> (x, z, -y).
(function () {
const { T, camera, controls, host, L, MAT, MODE } = H;
const pc = (x, y, z) => [x, z, -y];
const U = 9.7;
const TAG = { plan: 'From plans', pick: 'Your pick', concept: 'Concept' };
const ROOMS = {
  kitchen: { name: 'Kitchen', floor: 1, cam: pc(14.5, -14.5, 5.6), tgt: pc(5.5, -2.5, 3.6), size: 'About 18\' × 15\', 9\'-0" ceiling',
    feats: [['plan', 'Island 3\'-3" × 7\'-9" with sink, 4\'-0" aisle to the range wall (A1.1)'], ['plan', 'New dropped LVL beam, 2-ply 1¾" × 14", over the island line (S1.1)'], ['plan', '30" range, dishwasher in the island, pantry, basement stair door'], ['plan', 'Rear door 2\'-8" × 6\'-8" and two 2\'-0" × 5\'-0" windows onto the porch'],
      ['pick', 'Walnut thin-shaker island with white shaker cabinets everywhere else'], ['pick', 'White marble counters with waterfall ends, full-height marble behind the range'], ['pick', 'Bosch appliance package: range, dishwasher, French-door refrigerator, wall hood'], ['pick', 'Early American pine plank floor'],
      ['concept', 'Three globe pendants, recessed lights, under-cabinet lighting, counter stools']] },
  dining: { name: 'Dining area', floor: 1, cam: pc(10.6, -13.5, 5.2), tgt: pc(16.5, -7.5, 3.2), size: 'About 9\' × 11\', open to the kitchen',
    feats: [['plan', 'Window on the right wall (3\'-0" × 6\'-0", sheet A1.1)'], ['plan', 'Open sightline from the island to the end wall (9\'-4½" clear)'], ['pick', 'Early American pine floor, white marble waterfall end on the island'], ['concept', 'Table for four and counter seating on the island overhang']] },
  living: { name: 'Living room and entry', floor: 1, cam: pc(6.0, -37.0, 5.4), tgt: pc(15, -24, 3.2), size: 'About 19\' × 20\', open to the dining area',
    feats: [['concept', 'Layout is an estimate: the existing floor plan (A1.0) is not in the plan set'], ['concept', 'Fireplace on the right wall under the existing chimney'], ['concept', 'Main stair rises along the left wall from the front door'], ['concept', 'Sofa, TV wall, armchair and rug to show scale'], ['pick', 'Early American pine floor continues through the whole level']] },
  halfbath: { name: 'Half bath (proposed)', floor: 1, cam: pc(5.7, -18.9, 6.3), tgt: pc(2.4, -22.2, 2.2), fov: 80, size: '5\' × 5\' interior, or 3\' × 6\' with the other layout',
    feats: [['concept', 'Left wall, south of the basement stair enclosure: drain drops straight to the basement'], ['concept', 'Toilet 24" from the vanity and 18" from the north wall; 2\'-7" clear in front (code minimums are 15" and 21")'], ['concept', 'Door opens off the living area, not the kitchen'], ['concept', 'Needs a 50 cfm vented fan or window, and a permit revision for the plumbing']] },
  primary: { name: 'Primary bedroom', floor: 2, cam: pc(13.6, -13.4, U + 5.4), tgt: pc(7, -3, U + 3.4), size: 'About 9\' × 14\', porch door to the rear porch',
    feats: [['plan', 'Opens to the second-level porch through the existing rear door (A1.1)'], ['plan', 'Rear window matches the first-floor window below it'], ['concept', 'Layout and partitions are my design; there are no drawings of this floor'], ['concept', 'King bed, nightstands, dresser, reading chair'], ['pick', 'Early American pine floor']] },
  ensuite: { name: 'Primary bath', floor: 2, cam: pc(14.7, -8.0, U + 5.6), tgt: pc(18, -2, U + 3.0), size: 'About 5\' × 8\', window on the rear wall',
    feats: [['plan', 'Window on the rear wall lines up with the plan window below'], ['concept', 'Tub under the window, vanity with marble top, toilet'], ['concept', 'Walk-in closet behind, with its own window on the right wall']] },
  bed2: { name: 'Bedroom 2', floor: 2, cam: pc(18.8, -14.8, U + 5.4), tgt: pc(5.5, -20, U + 3.0), size: 'About 15\' × 8\'',
    feats: [['concept', 'Window on the right wall, bed, dresser and desk to show scale'], ['concept', 'Door to the hall beside the stair landing']] },
  bed1: { name: 'Bedroom 1', floor: 2, cam: pc(18.8, -26.4, U + 5.4), tgt: pc(7.5, -35.5, U + 3.5), size: 'About 15\' × 12\', front of the house',
    feats: [['photo', 'Paired front windows as shown in the street photo'], ['concept', 'King bed on the north wall, nightstands, dresser, armchair']] }
};
TAG.photo = 'From photos';

// ---------- panel ----------
host.style.position = 'relative';
const panel = document.createElement('div'); panel.className = 'roomPanel'; panel.hidden = true;
panel.innerHTML = '<div class="rp-head"><h3 id="rpName"></h3><button type="button" id="rpBack">Back to whole house</button></div><p id="rpSize" class="rp-size"></p><ul id="rpList"></ul>';
host.appendChild(panel);
const hint = document.createElement('div'); hint.className = 'viewHint'; hint.textContent = 'Click a window to step inside'; host.appendChild(hint);
const light = new T.PointLight(0xfff0dd, 0, 0, 0); H.scene.add(light);

let anim = null, current = null;
function fly(c, t, ms) {
  const c0 = camera.position.clone(), t0 = controls.target.clone(), c1 = new T.Vector3(...c), t1 = new T.Vector3(...t), s = performance.now();
  anim = () => { const k = Math.min(1, (performance.now() - s) / ms), e = k * k * (3 - 2 * k); camera.position.lerpVectors(c0, c1, e); controls.target.lerpVectors(t0, t1, e); controls.update(); if (k >= 1) anim = null; };
}
(function tick() { requestAnimationFrame(tick); if (anim) anim(); })();

function enter(id) {
  const r = ROOMS[id]; if (!r) return;
  if (MODE === 'house') { ['roof', 'f2'].forEach(k => { H.GR[k].visible = true; }); }
  if (MODE === 'f1') H.GR.f2.visible = true;
  if (MODE === 'f2') H.GR.roof.visible = true;
  camera.fov = r.fov || 62; camera.updateProjectionMatrix();
  current = id; panel.hidden = false; hint.hidden = true;
  panel.querySelector('#rpName').textContent = r.name; panel.querySelector('#rpSize').textContent = r.size;
  panel.querySelector('#rpList').innerHTML = r.feats.map(([k, t]) => `<li><span class="tg tg-${k}">${TAG[k]}</span> ${t}</li>`).join('');
  light.position.set(r.cam[0] * .5 + r.tgt[0] * .5, r.floor === 1 ? 8.2 : 18, r.cam[2] * .5 + r.tgt[2] * .5); light.intensity = .4;
  fly(r.cam, r.tgt, 1000);
  document.querySelectorAll('[data-room]').forEach(b => b.setAttribute('aria-pressed', b.dataset.room === id));
  document.querySelectorAll('[data-p]').forEach(b => b.setAttribute('aria-pressed', false));
}
H.leaveRoom = function (silent) {
  current = null; panel.hidden = true; hint.hidden = false; light.intensity = 0; anim = null; camera.fov = 40; camera.updateProjectionMatrix();
  document.querySelectorAll('[data-room]').forEach(b => b.setAttribute('aria-pressed', false));
  if (!silent) H.go(Object.keys(H.CAM[MODE])[0]);
};
panel.querySelector('#rpBack').addEventListener('click', () => H.leaveRoom(false));
addEventListener('keydown', e => { if (e.key === 'Escape' && current) H.leaveRoom(false); });
document.querySelectorAll('[data-room]').forEach(b => b.addEventListener('click', () => enter(b.dataset.room)));

// ---------- windows: tag, hover, click ----------
function roomAt(p) {
  const py = -p.z, up = p.y > 9.7;
  if (py > -1.5 && py < 1.6) return up ? (p.x < 14 ? 'primary' : 'ensuite') : (p.x < 13 ? 'kitchen' : 'dining');
  if (py < -37.5) return up ? 'bed1' : 'living';
  if (p.x > 19) { if (up) return py > -12 ? 'primary' : py > -20 ? 'bed2' : 'bed1'; return py > -20 ? 'dining' : 'living'; }
  return null;
}
const targets = [];
H.scene.traverse(o => { if (o.isMesh && o.material === MAT.glass) { const r = roomAt(o.position); if (r) { o.userData.room = r; targets.push(o); } } });
const hi = new T.MeshStandardMaterial({ color: 0xbfe6ff, emissive: 0x58b8ff, emissiveIntensity: .8, roughness: .05, transparent: true, opacity: .75 });
const dom = H.renderer.domElement, ray = new T.Raycaster(), m = new T.Vector2();
let hov = null, down = null;
function pick(e) {
  const b = dom.getBoundingClientRect(); m.set(((e.clientX - b.left) / b.width) * 2 - 1, -((e.clientY - b.top) / b.height) * 2 + 1);
  ray.setFromCamera(m, camera);
  const vis = targets.filter(o => { let p = o; while (p) { if (p.visible === false) return false; p = p.parent; } return true; });
  const hit = ray.intersectObjects(vis, false)[0]; return hit ? hit.object : null;
}
dom.addEventListener('pointermove', e => { if (e.buttons) return; const o = pick(e); if (o === hov) return; if (hov) hov.material = MAT.glass; hov = o; if (o) o.material = hi; dom.style.cursor = o ? 'pointer' : ''; });
dom.addEventListener('pointerdown', e => { down = [e.clientX, e.clientY]; });
dom.addEventListener('pointerup', e => { if (!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 6) return; const o = pick(e); if (o) enter(o.userData.room); });
dom.addEventListener('pointerleave', () => { if (hov) { hov.material = MAT.glass; hov = null; } });
if (!window.__started) { window.__started = true; window.__start(); }
})();

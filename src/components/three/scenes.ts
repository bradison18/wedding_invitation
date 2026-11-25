import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export type Kind = 'river' | 'rings' | 'kalasham' | 'night';
export interface Ctl { frame(t: number, dt: number, progress: number, px: number, py: number): void; resize(w: number, h: number): void; tap(): void; add(): void; dispose(): void }

const gold = () => new THREE.MeshStandardMaterial({ color: '#d9a13a', metalness: 1, roughness: 0.22 });
const matte = (c: string) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.85 });

function glowTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const g = c.getContext('2d')!, r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  r.addColorStop(0, 'rgba(255,226,150,1)'); r.addColorStop(0.25, 'rgba(240,165,40,.6)'); r.addColorStop(1, 'rgba(224,120,20,0)');
  g.fillStyle = r; g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}
/** Clay lamp with a live flame. */
function makeDiyas() {
  const tex = glowTexture();
  const bowl = new THREE.LatheGeometry([[0, 0], [0.3, 0.02], [0.46, 0.16], [0.52, 0.28], [0.46, 0.28], [0.3, 0.14], [0, 0.12]].map(p => new THREE.Vector2(p[0], p[1])), 24);
  const clay = matte('#9E4A2B'); clay.side = THREE.DoubleSide;
  const flameG = new THREE.SphereGeometry(0.1, 12, 12); flameG.scale(1, 2.2, 1);
  const flameM = new THREE.MeshBasicMaterial({ color: '#FFD777' });
  return (glow = 1.8) => {
    const g = new THREE.Group(); g.add(new THREE.Mesh(bowl, clay));
    const f = new THREE.Mesh(flameG, flameM); f.position.set(0, 0.46, 0); g.add(f);
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); s.scale.setScalar(glow); s.position.y = 0.5; g.add(s);
    const seed = Math.random() * 9;
    g.userData.tick = (t: number) => { const k = 1 + Math.sin(t * 7 + seed) * 0.08 + Math.sin(t * 13 + seed) * 0.05; f.scale.set(1, k, 1); s.material.opacity = 0.75 * k; };
    return g;
  };
}
const WATER_VS = `varying vec3 w;varying float f;uniform float t;
void main(){vec3 p=position;p.y+=sin(p.x*.35+t*.8)*.07+sin(p.z*.6-t*.6+p.x*.15)*.08;vec4 m=modelMatrix*vec4(p,1.);w=m.xyz;vec4 v=viewMatrix*m;f=-v.z;gl_Position=projectionMatrix*v;}`;
const WATER_FS = `varying vec3 w;varying float f;uniform float t,far;uniform vec3 deep,light,haze;uniform vec2 sun;
float n(vec2 p){return sin(p.x*1.3+t*.7)*sin(p.y*2.1-t*.5)+.5*sin(p.x*3.1-t*.9+p.y*1.7);}
void main(){float r=n(w.xz*vec2(.6,1.6))*.5+.5;vec3 c=mix(deep,light,.25+.3*r);
float path=exp(-pow((w.x-sun.x)/(1.2+f*.06),2.))*smoothstep(.45,1.,n(w.xz*vec2(1.2,4.))*.5+.6);
c=mix(c,vec3(1.,.83,.45),path*.85);c+=.04*smoothstep(.8,1.,r);
gl_FragColor=vec4(mix(c,haze,smoothstep(far*.35,far,f)),1.);
#include <colorspace_fragment>
}`;
function makeWater(deep: string, light: string, haze: string, sunX: number, far: number) {
  const u = { t: { value: 0 }, far: { value: far }, deep: { value: new THREE.Color(deep) }, light: { value: new THREE.Color(light) }, haze: { value: new THREE.Color(haze) }, sun: { value: new THREE.Vector2(sunX, 0) } };
  const g = new THREE.PlaneGeometry(160, 90, 120, 70); g.rotateX(-Math.PI / 2);
  const m = new THREE.Mesh(g, new THREE.ShaderMaterial({ vertexShader: WATER_VS, fragmentShader: WATER_FS, uniforms: u })); m.position.z = -34;
  return { m, u };
}
/** The repeating arches of Prakasam Barrage, as one extruded block. */
function barrage(color: string, n: number, w: number) {
  const s = new THREE.Shape(); s.moveTo(0, 0); s.lineTo(w, 0); s.lineTo(w, 2); s.lineTo(0, 2); s.lineTo(0, 0);
  const h = new THREE.Path(); h.moveTo(w * 0.16, 0.01); h.lineTo(w * 0.16, 0.9); h.absarc(w / 2, 0.9, w * 0.34, Math.PI, 0, true); h.lineTo(w * 0.84, 0.01); h.lineTo(w * 0.16, 0.01); s.holes.push(h);
  const im = new THREE.InstancedMesh(new THREE.ExtrudeGeometry(s, { depth: 0.8, bevelEnabled: false, curveSegments: 10 }), matte(color), n);
  const m = new THREE.Matrix4(); for (let i = 0; i < n; i++) im.setMatrixAt(i, m.makeTranslation((i - n / 2) * w, -0.3, 0)); return im;
}
/** Petals that tumble down and settle. */
function petals(n: number, area: () => [number, number, number], colors: string[]) {
  const sh = new THREE.Shape(); sh.moveTo(0, 0); sh.bezierCurveTo(0.16, 0.1, 0.16, 0.32, 0, 0.42); sh.bezierCurveTo(-0.16, 0.32, -0.16, 0.1, 0, 0);
  const g = new THREE.ShapeGeometry(sh, 6), pos = g.attributes.position; for (let i = 0; i < pos.count; i++) pos.setZ(i, pos.getX(i) ** 2 * 3); g.computeVertexNormals();
  const im = new THREE.InstancedMesh(g, new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }), n); im.frustumCulled = false;
  const ps = Array.from({ length: n }, (_, i) => { im.setColorAt(i, new THREE.Color(colors[i % colors.length])); return { p: new THREE.Vector3(...area()), r: new THREE.Euler(Math.random() * 6, Math.random() * 6, 0), v: 0.35 + Math.random() * 0.5, s: Math.random() * 9 }; });
  const o = new THREE.Object3D();
  return { im, tick(t: number, dt: number, floor: number, top: number) {
    ps.forEach((q, i) => { q.p.y -= q.v * dt; q.p.x += Math.sin(t + q.s) * 0.25 * dt; q.r.x += dt * q.v; q.r.y += dt * 0.7; if (q.p.y < floor) { const a = area(); q.p.set(a[0], top, a[2]); } o.position.copy(q.p); o.rotation.copy(q.r); o.updateMatrix(); im.setMatrixAt(i, o.matrix); });
    im.instanceMatrix.needsUpdate = true;
  } };
}

export function mugguPoints(c: number, r: number) {
  const W = 2 * c, H = 2 * r; let x = 1, y = 0, dx = 1, dy = 1; const pts: [number, number][] = [];
  do { pts.push([x, y]); if (x + dx > W || x + dx < 0) dx = -dx; if (y + dy > H || y + dy < 0) dy = -dy; x += dx; y += dy; } while (!(x === 1 && y === 0) && pts.length < 999);
  return pts;
}

export function build(kind: Kind, canvas: HTMLCanvasElement): Ctl {
  const R = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  R.setPixelRatio(Math.min(devicePixelRatio, 1.6)); R.toneMapping = THREE.ACESFilmicToneMapping;
  const S = new THREE.Scene(), cam = new THREE.PerspectiveCamera(40, 1, 0.1, 200);
  let wide = true, tick: Ctl['frame'] = () => {}, tap = () => {}, add = () => {}, onSize = () => {};
  const env = () => { const pm = new THREE.PMREMGenerator(R), room = new RoomEnvironment(); S.environment = pm.fromScene(room, 0.04).texture; room.dispose(); pm.dispose(); };
  const tickLamps = (g: THREE.Object3D[], t: number) => g.forEach(d => d.userData.tick(t));

  if (kind === 'river') {
    R.toneMapping = THREE.NoToneMapping;
    S.fog = new THREE.Fog('#EFCFAE', 24, 74);
    S.add(new THREE.HemisphereLight('#fff1dc', '#8a6a5a', 2.2)); const dl = new THREE.DirectionalLight('#ffcf8a', 2); dl.position.set(8, 8, -10); S.add(dl);
    const { m, u } = makeWater('#38587a', '#93a9b3', '#EFCFAE', 0, 72); S.add(m);
    const sun = new THREE.Mesh(new THREE.CircleGeometry(11, 64), new THREE.MeshBasicMaterial({ color: '#EFB04E', fog: false })); sun.position.set(0, 3, -70); S.add(sun);
    // Low, layered hills: kept well below the text.
    [[-24, -64, 26, 3.2, '#D3AE98'], [6, -60, 20, 3.6, '#C79C88'], [30, -62, 24, 3, '#D3AE98']].forEach(([x, z, rx, ry, c]) => { const h = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 16), new THREE.MeshBasicMaterial({ color: c as string, fog: false })); h.scale.set(rx as number, ry as number, 3); h.position.set(x as number, -0.6, z as number); S.add(h); });
    const br = barrage('#A34B36', 34, 2.4); br.position.z = -36; S.add(br);
    const boats = [[-4, -20, 0.6], [5, -24, 0.8], [13, -22, 0.8]].map(([x, z, s]) => {
      const g = new THREE.Group(); const hull = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 10, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), matte('#8E2A22')); hull.scale.set(1.5, 0.5, 0.5); hull.position.y = 0.4; g.add(hull);
      const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.9), matte('#4b2f20')); mast.position.y = 1.2; g.add(mast);
      const sh = new THREE.Shape(); sh.moveTo(0, 0); sh.lineTo(0, 1.6); sh.quadraticCurveTo(0.9, 0.7, 0.95, 0); const sail = new THREE.Mesh(new THREE.ShapeGeometry(sh), new THREE.MeshStandardMaterial({ color: '#FBF0D8', side: THREE.DoubleSide })); sail.position.set(0.05, 0.5, 0); g.add(sail);
      g.position.set(x, 0, z); g.scale.setScalar(s); S.add(g); return g;
    });
    const mk = makeDiyas(); const lamps = Array.from({ length: 16 }, () => { const d = mk(1.5); d.position.set((Math.random() - 0.5) * 20, 0.02, -3 - Math.random() * 12); d.userData.s = Math.random() * 9; S.add(d); return d; });
    // Petals fall around the portrait, never across the names.
    const pt = petals(70, () => [(Math.random() - 0.5) * 4.4, Math.random() * 8, -7 - Math.random() * 4], ['#E0A11B', '#E8B23A', '#D9702A', '#F8E9EC', '#E79BB5']); S.add(pt.im);
    onSize = () => { pt.im.visible = wide; };
    tick = (t, dt, p, px, py) => {
      u.t.value = t; cam.position.set(px * 0.9, 1.7 + p * 2.6 - py * 0.2, 7 - p * 9); cam.lookAt(px * 0.3, (wide ? 8.2 : 7.4) + p * 2.6, -20);
      boats.forEach((b, i) => { b.position.x += dt * (0.16 + i * 0.06); if (b.position.x > 20) b.position.x = -20; b.rotation.z = Math.sin(t * 0.9 + i) * 0.05; b.position.y = Math.sin(t + i * 2) * 0.06; });
      lamps.forEach(d => { d.position.x += dt * 0.12; if (d.position.x > 11) d.position.x = -11; d.position.y = Math.sin(t + d.userData.s) * 0.06; }); tickLamps(lamps, t);
      if (wide) pt.tick(t, dt, 0, 8);
    };
  }

  if (kind === 'rings') {
    env(); S.add(new THREE.PointLight('#ffb65a', 60)); const sp = new THREE.DirectionalLight('#fff0d0', 1.6); sp.position.set(3, 5, 4); S.add(sp);
    const ring = (r: number) => {
      const g = new THREE.Group(); const band = new THREE.Mesh(new THREE.LatheGeometry([[r - 0.1, -0.16], [r, -0.19], [r + 0.07, -0.1], [r + 0.09, 0], [r + 0.07, 0.1], [r, 0.19], [r - 0.1, 0.16], [r - 0.12, 0], [r - 0.1, -0.16]].map(p => new THREE.Vector2(p[0], p[1])), 96), gold()); g.add(band);
      // Carved beads, like the engagement bands in the photograph.
      const im = new THREE.InstancedMesh(new THREE.SphereGeometry(0.045, 10, 10), gold(), 96), m = new THREE.Matrix4();
      for (let i = 0; i < 96; i++) { const a = (i / 48) * Math.PI * 2; im.setMatrixAt(i, m.makeTranslation(Math.cos(a) * (r + 0.09), i < 48 ? -0.07 : 0.07, Math.sin(a) * (r + 0.09))); } g.add(im);
      S.add(g); return g;
    };
    const a = ring(1.05), b = ring(0.92);
    const N = 420, grainG = new THREE.SphereGeometry(0.035, 8, 6); grainG.scale(2, 0.8, 0.8);
    const rice = new THREE.InstancedMesh(grainG, new THREE.MeshStandardMaterial({ roughness: 0.55 }), N); rice.frustumCulled = false; S.add(rice);
    const gr = Array.from({ length: N }, (_, i) => { rice.setColorAt(i, new THREE.Color(i % 9 ? '#D48A08' : '#FFF6E6')); return { p: new THREE.Vector3(0, -50, 0), v: new THREE.Vector3(), r: new THREE.Euler(), live: false }; });
    let next = 0, drip = 0; const o = new THREE.Object3D(), FL = -1.75;
    const drop = (n: number) => { for (let i = 0; i < n; i++) { const g = gr[next = (next + 1) % N]; g.p.set((Math.random() - 0.5) * (wide ? 6 : 3), 3 + Math.random() * 1.5, (Math.random() - 0.5) * 2.5); g.v.set((Math.random() - 0.5) * 0.8, -Math.random(), (Math.random() - 0.5) * 0.6); g.live = true; } };
    tap = () => drop(120);
    tick = (t, dt, p, px, py) => {
      const e = THREE.MathUtils.smootherstep(p, 0.05, 0.72), far = wide ? 3.4 : 2.2;
      a.position.set(THREE.MathUtils.lerp(-far, -0.5, e), 0.25 + Math.sin(t * 0.8) * 0.05, 0); b.position.set(THREE.MathUtils.lerp(far, 0.5, e), 0.25 + Math.sin(t * 0.8 + 1) * 0.05, 0);
      a.rotation.set(Math.PI / 2 - 0.35 + (1 - e) * 5, (1 - e) * 3, 0.3); b.rotation.set(Math.PI / 2 + 0.95 - (1 - e) * 5, (1 - e) * -3, -0.4);
      S.rotation.y = px * 0.25 + Math.sin(t * 0.3) * 0.12; cam.position.set(0, 0.3 + py * 0.2, wide ? 6.4 : 9); cam.lookAt(0, 0, 0);
      if (p > 0.6 && (drip += dt) > 0.05) { drip = 0; drop(2); }
      gr.forEach((g, i) => {
        if (g.live) {
          g.v.y -= 7 * dt; g.p.addScaledVector(g.v, dt); g.r.x += g.v.z * dt * 4; g.r.z += g.v.x * dt * 5;
          for (const k of [a, b]) { // glance off the bands
            const dx = g.p.x - k.position.x, dy = g.p.y - k.position.y, d = Math.hypot(dx, dy); if (Math.abs(g.p.z) < 0.25 && Math.abs(d - 1.05) < 0.12 && g.v.y < 0) { g.v.y *= -0.3; g.v.x += dx * 0.8; g.v.z += (Math.random() - 0.5) * 1.5; }
          }
          if (g.p.y < FL) { g.p.y = FL; if (g.v.y < -0.6) { g.v.y *= -0.32; g.v.x *= 0.6; g.v.z *= 0.6; } else { g.live = false; g.r.set(0, Math.random() * 6, 0); } }
        }
        o.position.copy(g.p); o.rotation.copy(g.r); o.updateMatrix(); rice.setMatrixAt(i, o.matrix);
      });
      rice.instanceMatrix.needsUpdate = true;
    };
  }

  if (kind === 'kalasham') {
    env(); S.add(new THREE.HemisphereLight('#fff3da', '#7a3b22', 1.2)); const l = new THREE.DirectionalLight('#ffe0a8', 2); l.position.set(3, 6, 5); S.add(l);
    const floor = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.5, 0.16, 72), matte('#4A1C12')); floor.position.y = -1.42; S.add(floor);
    const pts = mugguPoints(7, 6).map(([x, y]) => new THREE.Vector3((x / 14 - 0.5) * 4.7, -1.32, (y / 12 - 0.5) * 4.7));
    const tubeG = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true, 'catmullrom', 0.35), 900, 0.026, 5, true);
    S.add(new THREE.Mesh(tubeG, new THREE.MeshBasicMaterial({ color: '#FBF5E6' }))); const total = tubeG.index!.count;
    const dots = new THREE.InstancedMesh(new THREE.SphereGeometry(0.05, 8, 8), new THREE.MeshBasicMaterial({ color: '#FBF5E6' }), 42), mx = new THREE.Matrix4();
    for (let i = 0; i < 42; i++) dots.setMatrixAt(i, mx.makeTranslation(((1 + 2 * (i % 7)) / 14 - 0.5) * 4.7, -1.32, ((1 + 2 * Math.floor(i / 7)) / 12 - 0.5) * 4.7)); S.add(dots);
    const K = new THREE.Group(); S.add(K);
    K.add(new THREE.Mesh(new THREE.LatheGeometry([[0, -1.3], [0.55, -1.3], [0.6, -1.2], [0.4, -1.1], [0.85, -0.85], [1.08, -0.4], [1.02, 0], [0.72, 0.32], [0.5, 0.45], [0.52, 0.55], [0.78, 0.68], [0.76, 0.72], [0.45, 0.62]].map(p => new THREE.Vector2(p[0], p[1])), 72), gold()));
    [[-0.4, 1.085], [-0.12, 1.06]].forEach(([y, r], i) => { const t = new THREE.Mesh(new THREE.TorusGeometry(r, 0.035, 10, 72), matte(i ? '#E0A11B' : '#C8102E')); t.rotation.x = Math.PI / 2; t.position.y = y; K.add(t); });
    const coco = new THREE.Mesh(new THREE.SphereGeometry(0.52, 32, 24), matte('#7A4A26')); coco.scale.y = 1.15; coco.position.y = 1.05; K.add(coco);
    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.55, 20), matte('#5f371b')); tip.position.y = 1.78; K.add(tip);
    const ls = new THREE.Shape(); ls.moveTo(0, 0); ls.bezierCurveTo(0.34, 0.35, 0.28, 0.9, 0, 1.35); ls.bezierCurveTo(-0.28, 0.9, -0.34, 0.35, 0, 0);
    const lg = new THREE.ShapeGeometry(ls, 12), lp = lg.attributes.position; for (let i = 0; i < lp.count; i++) { const y = lp.getY(i); lp.setZ(i, 0.28 * y * y - Math.abs(lp.getX(i)) * 0.35); } lg.computeVertexNormals();
    const lm = new THREE.MeshStandardMaterial({ color: '#1B5228', envMapIntensity: 0.35, side: THREE.DoubleSide, roughness: 0.5 });
    for (let i = 0; i < 9; i++) { const h = new THREE.Group(), f = new THREE.Mesh(lg, lm); f.position.set(0, 0.6, 0.45); f.rotation.x = 0.5; h.rotation.y = (i / 9) * Math.PI * 2; h.add(f); K.add(h); }
    const mk = makeDiyas(), lamps = [0, 1, 2, 3, 4, 5].map(i => { const d = mk(1.4), a = (i / 6) * Math.PI * 2; d.position.set(Math.cos(a) * 2.9, -1.34, Math.sin(a) * 2.9); d.scale.setScalar(0.7); S.add(d); return d; });
    let spin = 0, drawn = 0; tap = () => { spin += 6; };
    tick = (t, dt, p, px, py) => { spin *= 0.97; K.rotation.y += dt * (0.25 + spin); drawn = Math.min(1, drawn + dt / 6); tubeG.setDrawRange(0, Math.floor((total * drawn) / 3) * 3); tickLamps(lamps, t); cam.position.set(px * 1.6, 4.2 - py * 0.6, wide ? 9.6 : 11); cam.lookAt(0, -0.05, 0); };
  }

  if (kind === 'night') {
    S.fog = new THREE.Fog('#16294A', 20, 62); S.add(new THREE.HemisphereLight('#5b74a8', '#1a1420', 1.6));
    const { m, u } = makeWater('#0d1b36', '#27406b', '#16294A', 0, 60); u.sun.value.x = 200; S.add(m);
    const br = barrage('#0b1630', 40, 2.4); br.position.z = -38; S.add(br);
    const tex = glowTexture(); for (let i = 0; i < 24; i++) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, blending: THREE.AdditiveBlending, depthWrite: false, fog: false })); s.position.set((i - 12) * 2.6, 2.1, -37); s.scale.setScalar(1.2); S.add(s); const r = s.clone(); r.position.y = -0.6; r.position.z = -33; r.scale.set(0.5, 3.4, 1); S.add(r); }
    const n = 500, sp = new Float32Array(n * 3); for (let i = 0; i < n; i++) sp.set([(Math.random() - 0.5) * 120, 4 + Math.random() * 40, -55 - Math.random() * 20], i * 3);
    const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.BufferAttribute(sp, 3)); S.add(new THREE.Points(sg, new THREE.PointsMaterial({ color: '#F4E8CF', size: 0.28, fog: false, transparent: true, opacity: 0.9 })));
    const mk = makeDiyas(), lamps: THREE.Group[] = [];
    const float = (x: number, z: number) => { const d = mk(2.4); d.position.set(x, 0, z); d.userData.s = Math.random() * 9; S.add(d); lamps.push(d); if (lamps.length > 60) S.remove(lamps.shift()!); };
    for (let i = 0; i < 34; i++) float((Math.random() - 0.5) * 34, -1 - Math.random() * 28);
    add = () => float(0, 2.5); tap = () => float((Math.random() - 0.5) * 5, 1.5);
    tick = (t, dt, p, px, py) => { u.t.value = t; lamps.forEach(d => { d.position.z -= dt * 0.35; d.position.x += Math.sin(t * 0.4 + d.userData.s) * dt * 0.15; d.position.y = Math.sin(t + d.userData.s) * 0.07; d.rotation.y += dt * 0.2; if (d.position.z < -32) { d.position.z = 2; d.position.x = (Math.random() - 0.5) * 16; } }); tickLamps(lamps, t); cam.position.set(px * 1.4, 3 - py * 0.3, 8); cam.lookAt(px * 0.4, 2.6, -18); };
  }

  return {
    frame(t, dt, p, px, py) { tick(t, dt, p, px, py); R.render(S, cam); },
    resize(w, h) { wide = w / h > 0.95; cam.aspect = w / h; cam.fov = wide ? 40 : kind === 'kalasham' ? 46 : 54; cam.updateProjectionMatrix(); R.setSize(w, h, false); onSize(); },
    tap: () => tap(), add: () => add(),
    dispose() { S.traverse(x => { const q = x as THREE.Mesh; q.geometry?.dispose(); ([] as THREE.Material[]).concat(q.material ?? []).forEach(k => { (k as THREE.SpriteMaterial).map?.dispose(); k.dispose(); }); }); S.environment?.dispose(); R.dispose(); },
  };
}

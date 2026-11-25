import type { ReactNode } from 'react';

/* Pedana block-print kit: every shape is a dye block printed slightly off its iron-black outline. */
export const C = { cream: '#F4E8CF', raw: '#FBF5E6', madder: '#9E2B25', kumkuma: '#C8102E', turmeric: '#E0A11B', leaf: '#2F5D3A', indigo: '#16294A', ink: '#221A16', zari: '#B88A3B', skin: '#B9784A', dusk: '#C98F6B' };

export function P({ d, f, w = 2, o = 2 }: { d: string; f: string; w?: number; o?: number }) {
  return <><path d={d} fill={f} transform={`translate(${o} ${o * 0.7})`} /><path d={d} fill="none" stroke={C.ink} strokeWidth={w} strokeLinejoin="round" strokeLinecap="round" /></>;
}
const circ = (x: number, y: number, r: number, ry = r) => `M${x - r} ${y}a${r} ${ry} 0 1 0 ${r * 2} 0a${r} ${ry} 0 1 0 ${-r * 2} 0Z`;

export type Arm = 'down' | 'namaste' | 'raise' | 'offer';
/** A Kondapalli toy. Origin is the middle of its base; about 200 units tall. */
export function Toy({ x, y, s = 1, kind, arm = 'down', flip = false, hue }: { x: number; y: number; s?: number; kind: 'bride' | 'groom' | 'elder' | 'mother'; arm?: Arm; flip?: boolean; hue?: string }) {
  const fem = kind === 'bride' || kind === 'mother';
  const body = hue ?? { bride: C.madder, groom: C.raw, elder: C.raw, mother: C.leaf }[kind];
  const top = fem ? (kind === 'bride' ? C.leaf : C.madder) : kind === 'groom' ? C.turmeric : C.dusk;
  const hand = { down: 'M22-112Q38-92 31-64', namaste: 'M22-112Q34-84 8-88', raise: 'M22-112Q46-118 40-152', offer: 'M22-112Q36-90 58-98' }[arm];
  const end = { down: [31, -62], namaste: [6, -90], raise: [40, -156], offer: [60, -98] }[arm];
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <P d="M-34 0h68v8h-68Z" f={C.turmeric} />
      {fem && <path d="M-9-152Q-34-120-25-72" stroke={C.ink} strokeWidth="9" fill="none" strokeLinecap="round" />}
      {fem && <path d="M-17-138Q-29-112-26-84" stroke={C.raw} strokeWidth="5" strokeDasharray="1 7" strokeLinecap="round" fill="none" />}
      <path d="M-22-112Q-36-92-28-66" stroke={C.ink} strokeWidth="13" fill="none" strokeLinecap="round" />
      <path d="M-22-112Q-36-92-28-66" stroke={C.skin} strokeWidth="9" fill="none" strokeLinecap="round" />
      {fem ? <P d="M-18-82C-30-50-38-24-32 0H32C38-24 30-50 18-82Z" f={body} /> : <P d="M-20-82C-25-50-28-25-25 0H-3L0-40 3 0H25C28-25 25-50 20-82Z" f={body} />}
      <P d="M-24-120Q0-130 24-120L19-78Q0-72-19-78Z" f={top} />
      {fem ? <><P d="M14-121L26-113Q10-92-20-78L-19-92Q4-102 14-121Z" f={body} w={1.6} /><path d="M-33-12Q0-4 33-12M-32-7Q0 1 32-7" stroke={C.turmeric} strokeWidth="2.5" fill="none" /><g fill={C.turmeric}>{[[-14, -30], [2, -26], [16, -34], [-6, -50], [9, -54]].map(([a, c]) => <circle key={a} cx={a} cy={c} r="2.2" />)}</g></>
        : <><P d="M-22-120L-12-124 -6-44 -17-44Z" f={kind === 'groom' ? C.madder : C.leaf} w={1.6} /><P d="M12-124L22-120 17-44 7-44Z" f={kind === 'groom' ? C.madder : C.leaf} w={1.6} /></>}
      <path d={hand} stroke={C.ink} strokeWidth="13" fill="none" strokeLinecap="round" />
      <path d={hand} stroke={C.skin} strokeWidth="9" fill="none" strokeLinecap="round" />
      <circle cx={end[0]} cy={end[1]} r="6" fill={C.skin} stroke={C.ink} strokeWidth="2" />
      <P d="M-6-132h12v12h-12Z" f={C.skin} o={0} />
      <P d={circ(0, -150, 22, 24)} f={C.skin} />
      <path d={fem ? 'M-23-150C-24-184 24-184 23-150C18-164 8-168 0-169C-8-168-18-164-23-150Z' : 'M-23-154C-22-182 22-182 23-154C10-166-8-165-23-154Z'} fill={kind === 'elder' ? '#8C8378' : C.ink} />
      {fem && <path d="M0-168v8" stroke={C.turmeric} strokeWidth="3" strokeLinecap="round" />}
      <g fill={C.raw} stroke={C.ink} strokeWidth="1.4"><path d="M-15-150Q-9-156-3-150Q-9-146-15-150ZM3-150Q9-156 15-150Q9-146 3-150Z" /></g>
      <circle cx="-8" cy="-150.500" r="2.200" fill={C.ink} /><circle cx="10" cy="-150.500" r="2.200" fill={C.ink} />
      <path d="M-5-138Q0-134 5-138" stroke={C.madder} strokeWidth="2.500" fill="none" strokeLinecap="round" />
      {!fem && <path d="M-9-142Q0-147 9-142" stroke={kind === 'elder' ? '#8C8378' : C.ink} strokeWidth="3.500" fill="none" strokeLinecap="round" />}
      <path d={fem ? 'M0-159v.1' : 'M0-163v6'} stroke={C.kumkuma} strokeWidth={fem ? 5 : 3} strokeLinecap="round" />
      {(kind === 'bride' || kind === 'groom') && <path d="M-17-120Q0-70 17-120" stroke={C.raw} strokeWidth="6" strokeDasharray="1 7.500" strokeLinecap="round" fill="none" />}
    </g>
  );
}
export const Lamp = ({ x, y, s = 1, lit = true }: { x: number; y: number; s?: number; lit?: boolean }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {lit && <g className="flame"><circle cy="-64" r="24" fill={C.turmeric} opacity=".25" /><path d="M0-82Q10-66 0-57Q-10-66 0-82Z" fill={C.turmeric} stroke={C.madder} strokeWidth="1.500" /></g>}
    <P d="M-20-56Q0-40 20-56Q12-36 5-34L6-12Q18-8 20 0H-20Q-18-8-6-12L-5-34Q-12-36-20-56Z" f={C.zari} />
  </g>
);
export const Kalasham = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[-48, -24, 0, 24, 48].map(a => <g key={a} transform={`translate(0 -46) rotate(${a})`}><P d="M0 0Q-12-20 0-40Q12-20 0 0Z" f={C.leaf} w={1.500} /></g>)}
    <P d={circ(0, -58, 14)} f={C.dusk} /><P d="M-16-46H16L11-38Q32-24 22-4Q0 4-22-4Q-32-24-11-38Z" f={C.zari} />
    <path d="M-24-20Q0-12 24-20" stroke={C.kumkuma} strokeWidth="3" fill="none" />
  </g>
);
export const Fire = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}><g className="flame"><P d="M-16-18C-26-44-6-48-4-72C14-58 24-38 16-18Z" f={C.turmeric} /><path d="M-6-18C-12-34 0-40 2-50C10-38 12-28 8-18Z" fill={C.madder} /></g><P d="M-30-18H30L24 0H-24Z" f={C.dusk} /></g>
);
export const Palm = ({ x, y, s = 1, tone = C.ink }: { x: number; y: number; s?: number; tone?: string }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill="none" stroke={tone} strokeLinecap="round"><path d="M0 0Q14-70 4-140" strokeWidth="8" />
    {[['M4-140Q-30-176-66-146'], ['M4-140Q-40-150-60-112'], ['M4-140Q-10-186-40-190'], ['M4-140Q30-188 66-168'], ['M4-140Q46-156 70-120'], ['M4-140Q10-190 34-200'], ['M4-140Q30-130 46-98']].map(([d]) => <path key={d} d={d} strokeWidth="7" />)}</g>
);
export const Footprint = ({ x, y, r = 0, s = 1, f = C.madder }: { x: number; y: number; r?: number; s?: number; f?: string }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} fill={f}><path d="M-7 14C-12 0-9-14 2-14C12-12 8 0 7 14C5 24-5 24-7 14Z" /><circle cx="-7" cy="-21" r="4.500" /><circle cx="1" cy="-23" r="3.300" /><circle cx="8" cy="-20" r="2.800" /><circle cx="13" cy="-15" r="2.300" /></g>
);
export const Arches = ({ n, w, h, fill }: { n: number; w: number; h: number; fill: string }) => (
  <g fill={fill}>{Array.from({ length: n }, (_, i) => <path key={i} fillRule="evenodd" d={`M${i * w} 0h${w}v${h}h${-w}ZM${i * w + 8} ${h}V${h * 0.5}a${w / 2 - 8} ${h * 0.3} 0 0 1 ${w - 16} 0V${h}Z`} />)}</g>
);
export function Thoranam({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 1200 90" preserveAspectRatio="xMidYMin slice" aria-hidden="true">
      <path d="M0 6Q600 22 1200 6" stroke={C.zari} strokeWidth="3" fill="none" />
      {Array.from({ length: 34 }, (_, i) => {
        const x = 18 + i * 35.5, y = 6 + 8 * (1 - ((x - 600) / 600) ** 2);
        return <g key={i} transform={`translate(${x} ${y})`}><g className="sway" style={{ animationDelay: `${-i * 0.23}s` }}>
          {i % 4 === 2 ? <>{[8, 22, 36].map((c, j) => <P key={c} d={circ(0, c, 8)} f={j % 2 ? C.raw : C.turmeric} w={1.500} />)}</> : <><P d="M0 0Q-15 28 0 62Q15 28 0 0Z" f={C.leaf} w={1.500} /><path d="M0 4V54" stroke={C.ink} strokeWidth="1" /></>}
        </g></g>;
      })}
    </svg>
  );
}
export function Vine({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 160 160" aria-hidden="true">
      <path d="M8 152C20 70 70 20 152 8" fill="none" stroke={C.ink} strokeWidth="2.500" />
      {[[18, 112, -60], [34, 76, -50], [64, 44, -35], [104, 20, -20], [50, 90, 60], [82, 62, 50]].map(([a, c, r]) => <g key={a} transform={`translate(${a} ${c}) rotate(${r})`}><P d="M0 0Q12-16 32-4Q16 12 0 0Z" f={C.leaf} w={1.500} /></g>)}
      <g transform="translate(62 102)">{[0, 72, 144, 216, 288].map(r => <g key={r} transform={`rotate(${r})`}><P d="M0-4Q-14-18 0-30Q14-18 0-4Z" f={C.madder} w={1.500} /></g>)}<P d={circ(0, 0, 7)} f={C.turmeric} w={1.500} /></g>
    </svg>
  );
}

/** Undavalli pillar rhythm as a frame. */
function Frame({ children, night }: { children: ReactNode; night?: boolean }) {
  return (
    <svg viewBox="0 0 440 340" className="w-full h-auto" aria-hidden="true">
      <path d="M30 330V70Q220-30 410 70V330Z" fill={night ? C.indigo : C.raw} />
      <path d="M30 70Q220-30 410 70" fill="none" stroke={C.madder} strokeWidth="9" /><path d="M36 82Q220-14 404 82" fill="none" stroke={C.zari} strokeWidth="2" />
      {[6, 396].map(x => <g key={x} transform={`translate(${x} 66)`}><P d="M0 0H38V16H30V40L38 52V74H30V196L38 208V236H0V208L8 196V74H0V52L8 40V16H0Z" f={C.dusk} /><path d="M12 84H26M12 188H26M12 136H26" stroke={C.ink} strokeWidth="2" /><P d={circ(19, 112, 9)} f={C.madder} w={1.500} /><P d={circ(19, 162, 9)} f={C.turmeric} w={1.500} /></g>)}
      {children}
      <P d="M0 302H440V334H0Z" f={C.madder} /><path d="M8 318H432" stroke={C.turmeric} strokeWidth="8" strokeDasharray="2 14" strokeLinecap="round" />
    </svg>
  );
}
const couple = (a: Arm = 'down', gap = 54) => <><Toy x={220 - gap} y={296} kind="groom" arm={a} /><Toy x={220 + gap} y={296} kind="bride" arm={a} flip /></>;
const rice = (n: number) => Array.from({ length: n }, (_, i) => <ellipse key={i} cx={150 + (i * 47) % 146} cy={86 + (i * 61) % 176} rx="5" ry="2.200" transform={`rotate(${i * 53} ${150 + (i * 47) % 146} ${86 + (i * 61) % 176})`} fill={i % 6 ? C.turmeric : C.raw} stroke={C.ink} strokeWidth=".8" />);

export function RitualArt({ id }: { id: string }) {
  switch (id) {
    case 'snathakam': return <Frame><Toy x={165} y={296} kind="groom" arm="namaste" /><Toy x={300} y={296} kind="elder" arm="offer" flip s={0.94} /><Fire x={232} y={302} s={0.8} /></Frame>;
    case 'kashi': return <Frame><Toy x={250} y={296} kind="groom" arm="raise" /><path d="M290 296V86" stroke={C.ink} strokeWidth="4" /><P d="M226 100Q290 24 354 100Q338 90 322 100Q306 90 290 100Q274 90 258 100Q242 90 226 100Z" f={C.turmeric} /><Toy x={130} y={296} kind="groom" arm="offer" hue={C.dusk} s={0.9} /></Frame>;
    case 'gauri': return <Frame><Toy x={150} y={296} kind="bride" arm="namaste" /><P d="M232 270H352V302H232Z" f={C.turmeric} /><Kalasham x={292} y={268} s={1.200} /><Lamp x={372} y={302} s={0.8} /></Frame>;
    case 'kanyadanam': return <Frame><Toy x={92} y={296} kind="elder" arm="offer" s={0.9} /><Toy x={178} y={296} kind="bride" arm="offer" s={0.95} /><Toy x={330} y={296} kind="groom" arm="offer" flip s={0.95} /><path d="M246 120Q252 160 252 196" stroke={C.indigo} strokeWidth="4" fill="none" strokeDasharray="10 5" /><g transform="translate(246 122) rotate(38)"><Kalasham x={0} y={0} s={0.7} /></g></Frame>;
    case 'jeelakarra': return <Frame>{couple('raise', 76)}<P d="M204 108H236V302H204Z" f={C.raw} /><path d="M204 288H236M204 280H236M204 118H236" stroke={C.turmeric} strokeWidth="5" /><P d="M220 50Q190 70 220 100Q250 70 220 50Z" f={C.leaf} /><circle cx="220" cy="76" r="8" fill="#6B3A1E" /></Frame>;
    case 'mangalasutra': return <Frame>{couple('offer', 78)}<path d="M150 70Q220 150 290 70" fill="none" stroke={C.turmeric} strokeWidth="6" /><P d={circ(204, 108, 12)} f={C.turmeric} /><P d={circ(236, 108, 12)} f={C.turmeric} /><path d="M202 198Q220 210 238 198" stroke={C.turmeric} strokeWidth="4" fill="none" /></Frame>;
    case 'talambralu': return <Frame>{couple('raise', 78)}{rice(34)}<P d="M190 284H250Q246 302 220 302Q194 302 190 284Z" f={C.zari} /></Frame>;
    case 'saptapadi': return <Frame><Toy x={240} y={280} kind="groom" s={0.9} /><Toy x={310} y={280} kind="bride" flip s={0.9} /><Fire x={130} y={282} />{[0, 1, 2, 3, 4, 5, 6].map(i => <Footprint key={i} x={72 + i * 48} y={290 + (i % 2) * 6} r={90} s={0.5} />)}</Frame>;
    case 'arundhati': return <Frame night>{[[90, 90], [150, 66], [196, 74], [240, 84], [262, 122], [330, 116], [338, 72], [110, 150], [370, 160]].map(([a, c], i) => <circle key={i} cx={a} cy={c} r={i === 1 ? 6 : 3} fill={C.cream} />)}<circle cx="162" cy="57" r="4" fill={C.turmeric} /><path d="M90 90L150 66 196 74 240 84 262 122 330 116 338 72 240 84" fill="none" stroke={C.zari} strokeDasharray="3 5" /><Toy x={190} y={296} kind="groom" arm="raise" s={0.8} /><Toy x={262} y={296} kind="bride" flip s={0.8} /></Frame>;
    case 'appagintalu': return <Frame><Toy x={100} y={296} kind="elder" arm="offer" s={0.9} /><Toy x={164} y={296} kind="mother" arm="offer" s={0.88} /><Toy x={252} y={296} kind="bride" arm="offer" flip s={0.95} /><Toy x={338} y={296} kind="groom" flip s={0.95} /></Frame>;
    case 'gruha': return <Frame><P d="M232 302V108H376V302Z" f={C.dusk} /><P d="M252 302V132H356V302Z" f="#5A2230" /><g>{[0, 1, 2, 3, 4, 5].map(i => <g key={i} transform={`translate(${256 + i * 20} 128)`}><P d="M0 0Q-9 16 0 34Q9 16 0 0Z" f={C.leaf} w={1.500} /></g>)}</g><Toy x={130} y={296} kind="bride" s={0.95} arm="namaste" /><g transform="translate(224 300) rotate(62)"><Kalasham x={0} y={0} s={0.7} /></g>{[0, 1, 2, 3, 4, 5, 6, 7].map(i => <ellipse key={i} cx={252 + i * 11} cy={294 - (i % 3) * 3} rx="4" ry="2" fill={C.turmeric} />)}<Lamp x={320} y={302} s={0.9} /></Frame>;
  }
}

export function StoryArt({ scene }: { scene: string }) {
  return (
    <svg viewBox="0 0 320 250" className="w-full h-auto toy-scene" aria-hidden="true">
      <path d="M18 236V90Q160-30 302 90V236Z" fill={scene === 'meet' ? '#E9B98A' : C.raw} /><path d="M18 236V90Q160-30 302 90V236" fill="none" stroke={C.ink} strokeWidth="2.500" />
      {scene === 'bride' && <><g stroke={C.ink} strokeWidth="2"><path d="M40 92H280" /><P d="M60 92H120V176Q90 186 60 176Z" f={C.madder} /><P d="M214 92H268V170Q240 180 214 170Z" f={C.indigo} /></g><g fill={C.turmeric}>{[0, 1, 2, 3, 4, 5].map(i => <circle key={i} cx={74 + (i % 2) * 30} cy={110 + Math.floor(i / 2) * 22} r="6" />)}</g></>}
      {scene === 'groom' && <><path d="M18 214Q90 196 160 212T302 206V236H18Z" fill={C.indigo} /><Palm x={70} y={216} s={0.8} tone={C.leaf} /><P d="M206 196Q250 222 290 190L280 214H222Z" f={C.madder} /></>}
      {scene === 'families' && <><P d="M120 196H200V206H120Z" f={C.turmeric} /><P d="M130 206H138V234H130ZM182 206H190V234H182Z" f={C.dusk} /><P d="M142 180H154V196H142ZM166 180H178V196H166Z" f={C.zari} /><Toy x={64} y={228} kind="elder" arm="offer" s={0.75} /><Toy x={256} y={228} kind="mother" arm="offer" flip s={0.75} /></>}
      {scene === 'meet' && <><circle cx="160" cy="110" r="42" fill={C.turmeric} /><g transform="translate(20 150)"><Arches n={7} w={40} h={62} fill={C.madder} /></g><path d="M18 212H302V236H18Z" fill={C.indigo} /></>}
      {scene === 'rings' && <><circle cx="146" cy="72" r="20" fill="none" stroke={C.zari} strokeWidth="7" /><circle cx="174" cy="72" r="20" fill="none" stroke={C.turmeric} strokeWidth="7" /></>}
      <g className="toy-turn">
        {scene === 'bride' && <Toy x={166} y={228} kind="bride" s={0.85} arm="offer" />}
        {scene === 'groom' && <Toy x={160} y={224} kind="groom" s={0.8} arm="raise" />}
        {scene === 'meet' && <><Toy x={130} y={228} kind="groom" s={0.72} /><Toy x={190} y={228} kind="bride" flip s={0.72} /></>}
        {scene === 'rings' && <><Toy x={110} y={228} kind="groom" s={0.72} arm="offer" /><Toy x={210} y={228} kind="bride" flip s={0.72} arm="offer" /></>}
      </g>
      <P d="M8 232H312V246H8Z" f={C.turmeric} />
    </svg>
  );
}

export function DishArt({ id }: { id: string }) {
  const bowl = (f: string, extra?: ReactNode) => <><P d={circ(50, 50, 38)} f={C.zari} /><P d={circ(50, 50, 29)} f={f} w={1.500} />{extra}</>;
  const heap = (f: string, extra?: ReactNode) => <><P d="M14 62Q12 34 34 30Q50 14 68 30Q90 36 86 62Q70 80 50 78Q28 80 14 62Z" f={f} />{extra}</>;
  const bits = (f: string, n = 9) => Array.from({ length: n }, (_, i) => <circle key={i} cx={50 + Math.cos(i * 2.4) * (5 + i * 2.2)} cy={50 + Math.sin(i * 2.4) * (5 + i * 2)} r="2.600" fill={f} />);
  const art: Record<string, ReactNode> = {
    pulihora: heap(C.turmeric, <>{bits('#6B3A1E')}<path d="M40 38l8 5M62 56l7-4" stroke={C.leaf} strokeWidth="4" /></>),
    gongura: bowl('#3E4A1E', <path d="M36 50Q50 38 64 50" stroke={C.madder} strokeWidth="6" fill="none" strokeLinecap="round" />),
    pappu: heap('#E9C55A', <ellipse cx="50" cy="46" rx="15" ry="9" fill="#F7DF8F" stroke={C.zari} strokeWidth="2" />),
    vankaya: <>{[[32, 40], [66, 38], [50, 64]].map(([a, c]) => <g key={a}><P d={circ(a, c, 19, 17)} f="#4A2140" /><path d={`M${a - 8} ${c - 14}Q${a} ${c - 6} ${a + 8} ${c - 14}`} stroke="#8DB36B" strokeWidth="6" fill="none" strokeLinecap="round" /></g>)}</>,
    ulava: bowl('#4B2412', <path d="M38 46Q50 56 62 46" stroke={C.cream} strokeWidth="4" fill="none" strokeLinecap="round" />),
    perugu: bowl(C.raw, <path d="M36 52Q50 44 64 52" stroke="#D9CBA8" strokeWidth="3" fill="none" />),
    bobbatlu: <><P d={circ(44, 46, 32)} f="#E3B04B" /><P d={circ(57, 56, 32)} f="#D99A34" />{[[50, 46], [66, 60], [48, 68]].map(([a, c]) => <circle key={a} cx={a} cy={c} r="5" fill="#9A5B1C" />)}</>,
    pootha: <>{[22, 42, 62].map(a => <g key={a} transform={`rotate(-18 50 50)`}><P d={`M${a - 8} 20H${a + 9}V80H${a - 8}Z`} f={C.raw} /><path d={`M${a} 22V78`} stroke={C.zari} strokeWidth="1.500" /></g>)}</>,
    laddu: <>{[[34, 60], [66, 60], [50, 34]].map(([a, c]) => <g key={a}><P d={circ(a, c, 18)} f="#D98E1F" /><circle cx={a - 3} cy={c - 5} r="3" fill={C.cream} /></g>)}</>,
  };
  return <svg viewBox="0 0 104 104" className="w-full h-full" aria-hidden="true">{art[id]}</svg>;
}

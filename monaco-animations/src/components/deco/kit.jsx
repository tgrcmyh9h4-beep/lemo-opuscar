import { useMemo } from 'react'
import { motion } from 'framer-motion'

/* ---------------------------------------------------------------- tokens */

export const C = {
  lacquer: '#070504',
  navy: '#0a1224',
  navyDeep: '#060b17',
  navyMid: '#14223f',
  burgundy: '#4a1020',
  burgundyDeep: '#2a0811',
  ivory: '#f2e6cc',
  gold: '#d4af5a',
  goldHot: '#fbe9b0',
  goldDark: '#7a5518',
  engrave: '#1a0f04',
  steel: '#8a909b',
}

/** Mechanical ease-in-out (doors, dials, machinery) and a soft settle. */
export const MECH = [0.65, 0, 0.35, 1]
export const SETTLE = [0.16, 1, 0.3, 1]

export function rng(seed = 7) {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  return () => (s = (s * 16807) % 2147483647) / 2147483647
}

/* --------------------------------------------------------------- defs */

const airbrush = (id, top, bottom, mid) => (
  <linearGradient id={id} key={id} x1="0" y1="0" x2="0.35" y2="1">
    <stop offset="0" stopColor={top} />
    {mid && <stop offset="0.45" stopColor={mid} />}
    <stop offset="1" stopColor={bottom} />
  </linearGradient>
)

const vgrad = (id, stops) => (
  <linearGradient id={id} key={id} x1="0" y1="0" x2="0" y2="1">
    {stops.map(([o, c, op = 1]) => (
      <stop key={o} offset={o} stopColor={c} stopOpacity={op} />
    ))}
  </linearGradient>
)

/**
 * Shared gradients and filters. Mounted once (always) so every scene's SVG
 * can reference url(#gold), url(#glow) and friends.
 */
export function DecoDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true">
      <defs>
        {/* Banded metal: dark – light – hot – light – dark, repeating across the canvas */}
        <linearGradient id="gold" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="190" y2="120" spreadMethod="reflect">
          <stop offset="0" stopColor="#6e4a14" />
          <stop offset="0.35" stopColor="#c99a3c" />
          <stop offset="0.55" stopColor="#fbe6a6" />
          <stop offset="0.75" stopColor="#d4a84a" />
          <stop offset="1" stopColor="#8a5e1c" />
        </linearGradient>
        {vgrad('goldV', [
          [0, '#fff3c8'],
          [0.32, '#e8c063'],
          [0.52, '#9a6b22'],
          [0.7, '#f3d58a'],
          [1, '#7a5114'],
        ])}
        <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fffaf0" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fffaf0" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fffaf0" stopOpacity="0" />
        </linearGradient>

        {vgrad('skyDawn', [
          [0, '#03060e'],
          [0.45, '#0a1630'],
          [0.78, '#2a1834'],
          [1, '#6e3426'],
        ])}
        {vgrad('skyStreet', [
          [0, '#050912'],
          [0.6, '#0f1d3d'],
          [1, '#3a1a30'],
        ])}
        {vgrad('sea', [
          [0, '#1a2a4e'],
          [1, '#040812'],
        ])}
        {vgrad('asphalt', [
          [0, '#0d1322'],
          [1, '#070a12'],
        ])}
        {vgrad('burgFrame', [
          [0, '#45101d'],
          [1, '#1c050b'],
        ])}
        {vgrad('burgWall', [
          [0, '#3d0d1a'],
          [1, '#16040a'],
        ])}
        {vgrad('navyFacade', [
          [0, '#1c2d55'],
          [1, '#080f22'],
        ])}
        {vgrad('floorShade', [
          [0, '#000', 0.65],
          [1, '#000', 0],
        ])}
        <linearGradient id="burgPanel" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#24060e" />
          <stop offset="0.8" stopColor="#4d1222" />
          <stop offset="1" stopColor="#64182b" />
        </linearGradient>
        <radialGradient id="sunGlow">
          <stop offset="0" stopColor="#ffd98a" stopOpacity="0.6" />
          <stop offset="0.45" stopColor="#e7a24c" stopOpacity="0.18" />
          <stop offset="1" stopColor="#e7a24c" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="warm" cx="0.5" cy="0.62" r="0.6">
          <stop offset="0" stopColor="#ffcf7a" stopOpacity="0.5" />
          <stop offset="1" stopColor="#ffcf7a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="vignette" cx="0.5" cy="0.5" r="0.75">
          <stop offset="0.55" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.7" />
        </radialGradient>

        {/* Airbrushed car / figure bodies: light from the upper left */}
        {airbrush('bodyNavy', '#4a64a0', '#0b1630', '#1d3060')}
        {airbrush('bodyBurg', '#d43a58', '#3e0714', '#8a1a30')}
        {airbrush('bodyIvory', '#fffaf0', '#8f8166', '#e6dabd')}
        {airbrush('bodySilver', '#ffffff', '#6a7482', '#c9d0da')}
        {airbrush('bodyBlack', '#4a505c', '#050609', '#1a1d24')}
        {airbrush('bodyEmerald', '#3aa088', '#062520', '#145a4a')}
        {airbrush('bodyRed', '#ff4050', '#4a050e', '#b0142a')}
        {airbrush('bodyGrey', '#6b717c', '#33373e')}
        {airbrush('navyFig', '#33508a', '#08112a', '#16274f')}
        {airbrush('leaf', '#1f6b5c', '#06231e')}
        {airbrush('porcelain', '#fffaf0', '#b8a888', '#efe4cb')}

        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="bigGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="16" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix values="0 0 0 0 1  0 0 0 0 0.92  0 0 0 0 0.8  0 0 0 0.5 0" />
        </filter>
      </defs>
    </svg>
  )
}

/* ------------------------------------------------------------ primitives */

/** The signature engraved gold stroke, drawing itself on. */
export function GLine({ d, delay = 0, dur = 1.2, w = 3, glow = false, opacity = 1, ease = MECH, cap = 'square' }) {
  const init = { pathLength: 0, opacity: 0 }
  const anim = { pathLength: 1, opacity }
  const tr = { pathLength: { delay, duration: dur, ease }, opacity: { delay, duration: 0.2 } }
  const common = { d, fill: 'none', strokeLinecap: cap, strokeLinejoin: 'miter', initial: init, animate: anim, transition: tr }
  return (
    <g filter={glow ? 'url(#glow)' : undefined}>
      <motion.path {...common} stroke={C.engrave} strokeWidth={w + 1.6} />
      <motion.path {...common} stroke="url(#gold)" strokeWidth={w} />
      <motion.path {...common} stroke="#fff3cf" strokeOpacity={0.55} strokeWidth={Math.max(0.6, w * 0.22)} />
    </g>
  )
}

export function Fade({ delay = 0, dur = 0.8, to = 1, y = 0, x = 0, ease = SETTLE, children, ...rest }) {
  return (
    <motion.g
      initial={{ opacity: 0, y, x }}
      animate={{ opacity: to, y: 0, x: 0 }}
      transition={{ delay, duration: dur, ease }}
      {...rest}
    >
      {children}
    </motion.g>
  )
}

/** Unfold from the centre axis (the Art Deco way every element arrives). */
export function Unfold({ delay = 0, dur = 0.7, axis = 'x', children }) {
  const k = axis === 'x' ? 'scaleX' : 'scaleY'
  return (
    <motion.g initial={{ [k]: 0, opacity: 0 }} animate={{ [k]: 1, opacity: 1 }} transition={{ delay, duration: dur, ease: MECH }}>
      {children}
    </motion.g>
  )
}

const stepped = (w, h, s) =>
  [
    [-w / 2 + s, -h / 2],
    [w / 2 - s, -h / 2],
    [w / 2 - s, -h / 2 + s],
    [w / 2, -h / 2 + s],
    [w / 2, h / 2 - s],
    [w / 2 - s, h / 2 - s],
    [w / 2 - s, h / 2],
    [-w / 2 + s, h / 2],
    [-w / 2 + s, h / 2 - s],
    [-w / 2, h / 2 - s],
    [-w / 2, -h / 2 + s],
    [-w / 2 + s, -h / 2 + s],
  ]
    .map((p) => p.join(','))
    .join(' ')

/** Stepped lacquer title bar with a double gold keyline; unfolds, then the text rises. */
export function Plaque({
  x,
  y,
  w,
  h = 64,
  text,
  size = 30,
  font = 'Poiret One',
  color = C.ivory,
  spacing = 8,
  delay = 0,
  fill = 'rgba(6,4,3,0.88)',
}) {
  const s = Math.min(14, h * 0.22)
  return (
    <g transform={`translate(${x} ${y})`}>
      <Unfold delay={delay}>
        <polygon points={stepped(w, h, s)} fill={fill} stroke="url(#gold)" strokeWidth="2.5" />
        <polygon points={stepped(w - 14, h - 14, s * 0.7)} fill="none" stroke="url(#gold)" strokeWidth="1" opacity="0.65" />
      </Unfold>
      <motion.text
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily={font}
        fontSize={size}
        letterSpacing={spacing}
        fill={color}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 2 }}
        transition={{ delay: delay + 0.45, duration: 0.6, ease: SETTLE }}
      >
        {text}
      </motion.text>
    </g>
  )
}

/** Marquee lettering: each letter is a bulb that ignites in counted order. */
export function BulbText({ x, y, text, size = 64, delay = 0, step = 0.09, font = 'Limelight', spacing = 10, anchor = 'middle' }) {
  let k = 0
  return (
    <text x={x} y={y} textAnchor={anchor} fontFamily={font} fontSize={size} letterSpacing={spacing} filter="url(#glow)">
      {[...text].map((ch, i) => {
        const d = delay + (ch === ' ' ? k : k++) * step
        return (
          <motion.tspan
            key={i}
            initial={{ fill: '#3b2a12' }}
            animate={{ fill: ['#3b2a12', '#fffbe8', '#e9c46a'] }}
            transition={{ delay: d, duration: 0.32, times: [0, 0.3, 1] }}
          >
            {ch}
          </motion.tspan>
        )
      })}
    </text>
  )
}

/** Radiating sunburst rays; rotates slowly around its own centre. */
export function Sunburst({ cx, cy, r = 1400, n = 36, opacity = 0.16, spin = 8, dur = 15, delay = 0, fill = 'url(#gold)' }) {
  const d = useMemo(() => {
    let s = ''
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2
      const w = (Math.PI / n) * 0.45
      s += `M${cx} ${cy}L${cx + r * Math.cos(a - w)} ${cy + r * Math.sin(a - w)}L${cx + r * Math.cos(a + w)} ${cy + r * Math.sin(a + w)}Z`
    }
    return s
  }, [cx, cy, r, n])
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity }} transition={{ delay, duration: 1.6 }}>
      <motion.path d={d} fill={fill} initial={{ rotate: 0 }} animate={{ rotate: spin }} transition={{ duration: dur, ease: 'linear' }} />
    </motion.g>
  )
}

/** Marquee bulbs around a rectangle: ignite in a run, then chase. */
export function BulbBorder({ x, y, w, h, gap = 34, r = 5.5, delay = 0, chase = true }) {
  const pts = useMemo(() => {
    const per = 2 * (w + h)
    const n = Math.round(per / gap)
    return Array.from({ length: n }, (_, i) => {
      const d = (i * per) / n
      if (d < w) return [x + d, y]
      if (d < w + h) return [x + w, y + d - w]
      if (d < 2 * w + h) return [x + w - (d - w - h), y + h]
      return [x, y + h - (d - 2 * w - h)]
    })
  }, [x, y, w, h, gap])
  return (
    <g filter="url(#glow)">
      {pts.map(([px, py], i) => (
        <motion.g
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1] }}
          transition={{ delay: delay + i * 0.006, duration: 0.25, times: [0, 0.4, 1] }}
        >
          <motion.circle
            cx={px}
            cy={py}
            r={r}
            fill="#fff1c4"
            animate={chase ? { opacity: [1, 0.3, 1] } : undefined}
            transition={chase ? { duration: 1.2, repeat: Infinity, delay: delay + 0.8 + (i % 6) * 0.2, ease: 'easeInOut' } : undefined}
          />
        </motion.g>
      ))}
    </g>
  )
}

export function zigzag(x0, x1, y, a = 10, p = 28) {
  let d = `M${x0} ${y}`
  for (let x = x0; x < x1; x += p) d += `L${x + p / 2} ${y - a}L${x + p} ${y}`
  return d
}

/** Four-point deco sparkle that pops in. */
export function Sparkle({ x, y, s = 1, delay = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <motion.path
        d="M0 -34 L6 -6 L34 0 L6 6 L0 34 L-6 6 L-34 0 L-6 -6 Z"
        fill="#fff3cf"
        filter="url(#glow)"
        initial={{ scale: 0, rotate: -45, opacity: 0 }}
        animate={{ scale: [0, 1.5, 1], rotate: 0, opacity: 1 }}
        transition={{ delay, duration: 0.45, ease: SETTLE }}
      />
    </g>
  )
}

/* -------------------------------------------------------- architecture */

/** Buildings as flat lacquer masses with gold keylines and lit windows. */
export function Buildings({ rects, seed = 11, delay = 0, fill = 'url(#navyFacade)', winGap = [18, 24] }) {
  const windows = useMemo(() => {
    const r = rng(seed)
    const out = []
    rects.forEach(([x, y, w, h]) => {
      for (let wx = x + 10; wx < x + w - 10; wx += winGap[0])
        for (let wy = y + 14; wy < y + h - 12; wy += winGap[1]) {
          const v = r()
          if (v < 0.42) out.push({ x: wx, y: wy, o: 0.25 + r() * 0.7, tw: v < 0.05, d: r() * 4, p: 2 + r() * 3 })
        }
    })
    return out
  }, [rects, seed, winGap])
  return (
    <Fade delay={delay} dur={1.2}>
      {rects.map(([x, y, w, h], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} fill={fill} stroke="url(#gold)" strokeWidth="1.4" strokeOpacity="0.6" />
      ))}
      {windows.map((w, i) =>
        w.tw ? (
          <motion.rect
            key={i}
            x={w.x}
            y={w.y}
            width="5"
            height="9"
            fill="#f3c86a"
            initial={{ opacity: w.o }}
            animate={{ opacity: [w.o, 0.08, w.o] }}
            transition={{ duration: w.p, repeat: Infinity, delay: w.d }}
          />
        ) : (
          <rect key={i} x={w.x} y={w.y} width="5" height="9" fill="#f3c86a" opacity={w.o} />
        ),
      )}
    </Fade>
  )
}

export function Palm({ x, y, h = 260, delay = 0 }) {
  const top = y - h
  const trunk = useMemo(() => {
    let d = ''
    for (let yy = y - 10; yy > top + 10; yy -= 22) d += `M${x - 8} ${yy}L${x} ${yy - 8}L${x + 8} ${yy}`
    return d
  }, [x, y, top])
  const fronds = [-165, -140, -115, -65, -40, -15].map((deg) => {
    const a = (deg * Math.PI) / 180
    const L = 130
    const ex = x + L * Math.cos(a)
    const ey = top + L * Math.sin(a) + 40 * Math.abs(Math.cos(a))
    const mx = (x + ex) / 2
    const my = (top + ey) / 2
    const px = -Math.sin(a) * 12
    const py = Math.cos(a) * 12
    return `M${x} ${top}L${mx + px} ${my + py}L${ex} ${ey}L${mx - px} ${my - py}Z`
  })
  return (
    <Fade delay={delay} dur={1}>
      <rect x={x - 7} y={top} width="14" height={h} fill="#0a1222" stroke="url(#gold)" strokeWidth="1" strokeOpacity="0.6" />
      <path d={trunk} fill="none" stroke="url(#gold)" strokeWidth="1.6" opacity="0.8" />
      {fronds.map((d, i) => (
        <path key={i} d={d} fill="url(#leaf)" stroke="url(#gold)" strokeWidth="1.3" />
      ))}
      <circle cx={x} cy={top} r="7" fill="url(#gold)" />
    </Fade>
  )
}

export function Lamp({ x, y, h = 190, delay = 0 }) {
  return (
    <Fade delay={delay}>
      <circle cx={x} cy={y - h - 14} r="46" fill="url(#sunGlow)" />
      <rect x={x - 3} y={y - h} width="6" height={h} fill="#151008" stroke="url(#gold)" strokeWidth="1" />
      <path
        d={`M${x - 16} ${y - h} L${x + 16} ${y - h} L${x + 12} ${y - h - 26} L${x + 6} ${y - h - 26} L${x + 6} ${y - h - 34} L${x - 6} ${y - h - 34} L${x - 6} ${y - h - 26} L${x - 12} ${y - h - 26} Z`}
        fill="#2a1d0a"
        stroke="url(#gold)"
        strokeWidth="1.6"
      />
      <circle cx={x} cy={y - h - 12} r="6" fill="#fff1c4" filter="url(#glow)" />
      <rect x={x - 12} y={y - 8} width="24" height="8" fill="url(#gold)" />
    </Fade>
  )
}

/* ---------------------------------------------------------------- cars */

const PATHS = {
  stream: {
    body: 'M -235 -22 C -240 -70 -215 -100 -160 -112 C -120 -150 -60 -168 -10 -166 C 40 -165 70 -150 95 -122 C 150 -116 205 -100 228 -70 C 240 -52 238 -30 230 -22 Z',
    glass: 'M -128 -118 C -90 -148 -40 -158 -5 -157 C 30 -156 55 -146 80 -124 Z',
    pillar: 'M -20 -157 L -20 -120',
    whiskers: 'M -205 -64 L 110 -64 M -195 -52 L 80 -52 M -185 -40 L 50 -40',
    wheels: [-150, 140],
    skirt: 'M -205 -22 C -203 -74 -97 -74 -95 -22 Z',
    fender: 'M 86 -22 C 92 -78 188 -78 196 -22',
    head: [214, -74],
  },
  hyper: {
    body: 'M -244 -18 C -248 -46 -234 -70 -194 -80 L -84 -112 C -40 -124 22 -122 64 -104 L 204 -62 C 236 -52 250 -36 248 -18 Z',
    glass: 'M -74 -106 C -32 -117 14 -116 52 -102 L 12 -86 L -92 -88 Z',
    pillar: '',
    whiskers: 'M -220 -50 L 180 -50 M -200 -38 L 140 -38',
    wheels: [-150, 150],
    skirt: '',
    fender: 'M -196 -22 C -190 -80 -110 -80 -104 -22 M 104 -22 C 110 -80 190 -80 196 -22',
    spoiler: 'M -246 -84 L -176 -86 L -182 -96 L -250 -96 Z',
    head: [232, -50],
  },
  sedan: {
    body: 'M -215 -22 L -215 -74 L -130 -80 L -80 -128 L 60 -128 L 112 -82 L 210 -74 L 214 -22 Z',
    glass: 'M -118 -84 L -74 -120 L -8 -120 L -8 -84 Z M 4 -84 L 4 -120 L 54 -120 L 94 -84 Z',
    wheels: [-140, 135],
  },
  pickup: {
    body: 'M -235 -22 L -235 -84 L -30 -84 L -30 -140 L 75 -140 L 118 -92 L 222 -84 L 226 -22 Z',
    glass: 'M -18 -92 L -18 -130 L 68 -130 L 104 -92 Z',
    wheels: [-150, 150],
  },
}

function Wheel({ x, spin, dull }) {
  const line = dull ? '#7c828d' : 'url(#gold)'
  return (
    <g transform={`translate(${x} -20)`}>
      <circle r="34" fill="#05070c" stroke={dull ? '#2b2f36' : C.engrave} strokeWidth="3" />
      <motion.g
        animate={spin ? { rotate: 360 } : undefined}
        transition={spin ? { duration: spin, repeat: Infinity, ease: 'linear' } : undefined}
      >
        <circle r="23" fill="none" stroke={line} strokeWidth="3" />
        {[0, 45, 90, 135].map((a) => (
          <line key={a} x1="-23" y1="0" x2="23" y2="0" transform={`rotate(${a})`} stroke={line} strokeWidth="2" />
        ))}
        <circle r="7" fill={line} />
      </motion.g>
    </g>
  )
}

/**
 * Streamline-moderne car silhouette, facing right, wheels on y≈14.
 * kind: stream | rolls | hyper | sedan | pickup (the last two are the "ordinary" cars).
 */
export function DecoCar({ kind = 'stream', body = 'url(#bodyNavy)', spin = 0.45, trail = false }) {
  const dull = kind === 'sedan' || kind === 'pickup'
  const P = PATHS[kind === 'rolls' ? 'stream' : kind]
  const keyline = dull ? '#4a5059' : 'url(#gold)'
  return (
    <g>
      {trail && (
        <g opacity="0.75">
          {[-40, -70, -100, -125].map((yy, i) => (
            <path key={yy} d={`M -260 ${yy} L ${-900 + i * 90} ${yy}`} stroke="url(#gold)" strokeWidth={4 - i * 0.6} strokeLinecap="round" />
          ))}
        </g>
      )}
      <ellipse cx="0" cy="16" rx="235" ry="11" fill="#000" opacity="0.5" />
      <path d={P.body} fill={dull ? 'url(#bodyGrey)' : body} />
      <path d={P.body} fill="none" stroke={keyline} strokeWidth="2.4" />
      <path d={P.glass} fill={dull ? '#22262d' : '#0a1222'} stroke={keyline} strokeWidth="1.6" />
      {P.pillar && <path d={P.pillar} stroke={keyline} strokeWidth="1.6" />}
      {P.whiskers && <path d={P.whiskers} stroke="url(#gold)" strokeWidth="2" fill="none" />}
      {P.spoiler && <path d={P.spoiler} fill={body} stroke="url(#gold)" strokeWidth="1.6" />}
      <Wheel x={P.wheels[0]} spin={spin} dull={dull} />
      {P.skirt && <path d={P.skirt} fill={body} stroke="url(#gold)" strokeWidth="1.8" />}
      <Wheel x={P.wheels[1]} spin={spin} dull={dull} />
      {P.fender && <path d={P.fender} fill="none" stroke="url(#gold)" strokeWidth="2" />}
      {kind === 'rolls' && (
        <>
          <path d="M 210 -100 L 226 -96 L 230 -40 L 214 -40 Z" fill="url(#gold)" stroke={C.engrave} strokeWidth="1" />
          <path d="M 214 -100 L 220 -116 L 224 -100" fill="none" stroke="url(#gold)" strokeWidth="2" />
        </>
      )}
      {!dull && P.head && (
        <>
          <circle cx={P.head[0]} cy={P.head[1]} r="7" fill="#fff4cf" filter="url(#glow)" />
          <rect x="-240" y="-62" width="8" height="14" fill="#ff4a5a" />
        </>
      )}
    </g>
  )
}

/**
 * Moves a car across the frame. `x` is a keyframe array. Cars face right; `flip`
 * drives right-to-left. `label` is drawn unflipped above the roof.
 */
export function Drive({ y, x, dur, delay = 0, scale = 1, flip = false, ease = 'linear', times, label, children }) {
  return (
    <motion.g initial={{ x: x[0] }} animate={{ x }} transition={{ delay, duration: dur, ease, times }}>
      <g transform={`translate(0 ${y}) scale(${flip ? -scale : scale} ${scale})`}>{children}</g>
      {label && <g transform={`translate(0 ${y}) scale(${scale})`}>{label}</g>}
    </motion.g>
  )
}

/* ------------------------------------------------------------- figures */

const FIG = {
  man: 'M -58 -332 L 58 -332 L 46 -210 L 36 -14 L 10 0 L -10 0 L -36 -14 L -46 -210 Z',
  woman: 'M -50 -330 L 50 -330 L 34 -205 L 72 0 L -72 0 L -34 -205 Z',
}
const HATS = {
  tophat: 'M -24 -452 L 24 -452 L 22 -404 L 42 -404 L 42 -396 L -42 -396 L -42 -404 L -22 -404 Z',
  fedora: 'M -28 -430 C -26 -452 26 -452 28 -430 L 30 -412 L 52 -406 L 52 -398 L -52 -398 L -52 -406 L -30 -412 Z',
  cloche: 'M -36 -390 C -40 -444 40 -444 36 -390 L 46 -382 L -46 -382 Z',
}

function FigureLayer({ body, hat, hi, paper }) {
  const fill = hi ? 'url(#goldV)' : 'url(#navyFig)'
  const line = hi ? '#fff1c2' : 'url(#gold)'
  const face = hi ? '#5a3a0e' : C.ivory
  return (
    <g filter={hi ? 'url(#glow)' : undefined}>
      <rect x="-8" y="-346" width="16" height="16" fill={fill} stroke={line} strokeWidth="1.5" />
      <path d={FIG[body]} fill={fill} stroke={line} strokeWidth="2.5" strokeOpacity={hi ? 1 : 0.8} />
      {body === 'man' ? (
        <path d="M -36 -332 L 0 -262 L 36 -332 M 0 -262 L 0 -40 M -52 -320 L -44 -150 M 52 -320 L 44 -150" fill="none" stroke={line} strokeWidth="1.6" opacity="0.8" />
      ) : (
        <path d="M -30 -330 Q 0 -300 30 -330 M -34 -205 L 34 -205 M -20 -205 L -40 -2 M 20 -205 L 40 -2" fill="none" stroke={line} strokeWidth="1.6" opacity="0.8" />
      )}
      <ellipse cx="0" cy="-372" rx="26" ry="32" fill={fill} stroke={line} strokeWidth="2" />
      <path d="M -14 -376 Q -9 -371 -4 -376 M 4 -376 Q 9 -371 14 -376 M 0 -370 L -3 -358 L 2 -358" fill="none" stroke={face} strokeWidth="1.6" />
      <path d={HATS[hat]} fill={hi ? 'url(#goldV)' : '#0b0f1c'} stroke={line} strokeWidth="1.8" />
      {paper && (
        <g>
          <rect x="-46" y="-300" width="92" height="74" fill="#efe2c4" stroke="url(#gold)" strokeWidth="1.5" />
          <path d="M -36 -286 L 36 -286 M -36 -272 L 20 -272 M -36 -258 L 30 -258 M -36 -244 L 10 -244" stroke="#6b5a3a" strokeWidth="2" />
        </g>
      )}
    </g>
  )
}

/**
 * A ~7-heads-tall streamline figure, feet at (0,0). `hiAt` = delay (s) at which
 * the figure ignites in gold; `dimAt` dims it.
 */
export function DecoFigure({ x = 0, y = 0, scale = 1, body = 'man', hat = 'tophat', hiAt, dimAt, paper = false }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <motion.g
        initial={{ opacity: 1 }}
        animate={dimAt != null ? { opacity: 0.4 } : undefined}
        transition={dimAt != null ? { delay: dimAt, duration: 0.6 } : undefined}
      >
        <FigureLayer body={body} hat={hat} paper={paper} />
      </motion.g>
      {hiAt != null && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0.85, 1] }} transition={{ delay: hiAt, duration: 0.6, times: [0, 0.3, 0.6, 1] }}>
          <FigureLayer body={body} hat={hat} paper={paper} hi />
        </motion.g>
      )}
    </g>
  )
}

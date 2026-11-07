import { memo, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Clapperboard, Maximize, Play, RotateCcw } from 'lucide-react'
import { Cue, ProgressBar, Stage, TimelineProvider, useClock } from './deco/timeline'
import {
  BulbBorder,
  BulbText,
  Buildings,
  C,
  DecoCar,
  DecoDefs,
  DecoFigure,
  Drive,
  Fade,
  GLine,
  Lamp,
  MECH,
  Palm,
  Plaque,
  SETTLE,
  Sparkle,
  Sunburst,
  Unfold,
  zigzag,
} from './deco/kit'

/*
 * BATCH 1 — "The Baseline of Wealth" (60 s, Art Deco, Monaco)
 *
 *  0:00–0:15  Scene 1  Balcony at dawn → camera tilts down to the street
 *  0:15–0:30  Scene 2a Street: no Camrys / F-150s → the endless parade
 *  0:30–0:40  Scene 2b Mercedes as an Uber → V12 hyper-car, heads turned: 0
 *  0:40–0:50  Scene 3  Café (marquee frame scales open) → "a statistical anomaly"
 *  0:50–1:00  Scene 4  1 in 3 figures → MONACO: THE BASELINE OF WEALTH
 *
 * All times below are absolute seconds on the master clock. Inside a <Cue>,
 * framer-motion `delay`s are relative to the cue's own start.
 */

export const DURATION = 60

const CHAPTERS = [
  { at: 0, label: 'BALCONY' },
  { at: 15, label: 'THE PARADE' },
  { at: 30, label: 'MERCEDES · V12' },
  { at: 40, label: 'THE CAFÉ' },
  { at: 50, label: '1 IN 3' },
]

const VO = [
  { at: 0, text: 'Imagine waking up in a foreign country, stepping out onto the sun-drenched balcony of your hotel, and looking down at the street below.' },
  { at: 15, text: "You don't see Toyota Camrys or Ford F-150s. Instead, you watch a casual, endless parade of Bugattis, Rolls-Royces, and Ferraris rolling by." },
  { at: 30, text: "Over here, a brand-new Mercedes is basically used as an Uber. These hyper-cars are so unbelievably common that the locals don't even turn their heads when a screaming V12 engine drives past." },
  { at: 40, text: 'You walk downstairs to grab a morning coffee, and as you look around the café, you realize a statistical anomaly...' },
  { at: 50, text: "...every third person sitting around you is a multimillionaire. Welcome to a place where extreme wealth isn't the exception. It is the baseline." },
]

const Full = ({ children }) => (
  <svg viewBox="0 0 1920 1080" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
    {children}
  </svg>
)

/* ================================================================ SCENE 1 */

const ARCH_LEFT = [
  [300, 1720],
  [300, 330],
  [380, 330],
  [380, 260],
  [480, 260],
  [480, 200],
  [620, 200],
  [620, 150],
  [780, 150],
  [780, 110],
]
const archPath = (inset = 0) => {
  const L = ARCH_LEFT.map(([x, y], i) => [x + inset, i === 0 ? y : y + inset])
  const R = [...ARCH_LEFT].reverse().map(([x, y], i, a) => [1920 - x - inset, i === a.length - 1 ? y : y + inset])
  return 'M' + [...L, ...R].map((p) => p.join(' ')).join(' L ')
}

const CITY_L = [
  [300, 470, 60, 170],
  [360, 430, 60, 210],
  [420, 455, 50, 185],
  [470, 400, 90, 240],
  [495, 368, 40, 32],
  [560, 470, 80, 170],
  [640, 520, 120, 120],
  [760, 580, 100, 60],
]
const CITY_R = CITY_L.map(([x, y, w, h]) => [1920 - x - w, y - 30, w, h + 30])

const balusters = (() => {
  let d = ''
  for (let i = 0; i < 22; i++) {
    const cx = 330 + i * 60
    d += `M${cx - 9} 828 L${cx + 9} 828 L${cx + 9} 860 L${cx + 17} 900 L${cx + 9} 940 L${cx + 9} 990 L${cx - 9} 990 L${cx - 9} 940 L${cx - 17} 900 L${cx - 9} 860 Z`
  }
  return d
})()

const fan = (cx, cy, r, from, to, step) => {
  let d = ''
  for (let a = from; a <= to; a += step) {
    const t = (a * Math.PI) / 180
    d += `M${cx} ${cy} L${cx + r * Math.cos(t)} ${cy + r * Math.sin(t)}`
  }
  return d
}

function Yacht({ x, y, delay }) {
  return (
    <Fade delay={delay}>
      <motion.g initial={{ x: 0 }} animate={{ x: 60 }} transition={{ duration: 15, ease: 'linear' }}>
        <path d={`M${x - 40} ${y} L${x + 40} ${y} L${x + 30} ${y + 10} L${x - 32} ${y + 10} Z`} fill="#0b1222" stroke="url(#gold)" strokeWidth="1.5" />
        <path d={`M${x} ${y} L${x} ${y - 52} L${x + 26} ${y - 6} Z`} fill={C.ivory} opacity="0.85" />
      </motion.g>
    </Fade>
  )
}

const Scene1 = memo(function Scene1() {
  return (
    <Full>
      <rect width="1920" height="1080" fill="#03050b" />
      {/* camera: hold on the view, then tilt down to the street */}
      <motion.g initial={{ y: 0 }} animate={{ y: [0, 0, -560] }} transition={{ duration: 15, times: [0, 0.62, 0.985], ease: ['linear', MECH] }}>
        {/* sky + sunrise */}
        <motion.rect x="0" y="-60" width="1920" height="760" fill="url(#skyDawn)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.8 }} />
        <Sunburst cx={960} cy={540} r={1400} n={40} opacity={0.17} spin={9} dur={15} delay={0.8} />
        <motion.g initial={{ y: 230 }} animate={{ y: 0 }} transition={{ delay: 0.4, duration: 7.5, ease: SETTLE }}>
          <circle cx="960" cy="540" r="360" fill="url(#sunGlow)" />
          <circle cx="960" cy="540" r="150" fill="none" stroke="url(#gold)" strokeWidth="2" opacity="0.6" />
          <circle cx="960" cy="540" r="128" fill="none" stroke="url(#gold)" strokeWidth="1.2" opacity="0.5" />
          <circle cx="960" cy="540" r="108" fill="url(#goldV)" filter="url(#glow)" />
          {/* deco sunset bars cut through the lower disc */}
          {[566, 584, 600, 614, 626].map((y, i) => (
            <rect key={y} x="840" y={y} width="240" height={3 + i * 1.6} fill="#2a1834" />
          ))}
        </motion.g>
        {/* the Riviera: mountains, the Rock and terraced towers */}
        <Fade delay={0.9} dur={1.6}>
          <path d="M 300 640 L 300 560 L 420 540 L 520 500 L 640 520 L 760 470 L 900 520 L 1020 480 L 1160 520 L 1300 470 L 1440 500 L 1560 450 L 1620 470 L 1620 640 Z" fill="#101a35" />
          <path d="M 300 560 L 420 540 L 520 500 L 640 520 L 760 470 L 900 520 L 1020 480 L 1160 520 L 1300 470 L 1440 500 L 1560 450 L 1620 470" fill="none" stroke="url(#gold)" strokeWidth="1.2" opacity="0.45" />
        </Fade>
        <Buildings rects={CITY_L} seed={3} delay={1.3} />
        <Buildings rects={CITY_R} seed={9} delay={1.5} />
        {/* sea */}
        <rect x="0" y="640" width="1920" height="420" fill="url(#sea)" />
        <g>
          {Array.from({ length: 16 }, (_, i) => {
            const half = 150 - i * 7 + (i % 2) * 18
            const y = 654 + i * 13
            return (
              <motion.line
                key={i}
                x1={960 - half}
                x2={960 + half}
                y1={y}
                y2={y}
                stroke="url(#gold)"
                strokeWidth="2.6"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.85, 0.35, 0.85] }}
                transition={{ delay: 2 + i * 0.05, duration: 3, repeat: Infinity, repeatType: 'mirror' }}
              />
            )
          })}
        </g>
        <GLine d="M 300 640 L 1620 640" delay={1.0} dur={1.4} w={2} />
        <Yacht x={560} y={700} delay={2.4} />
        <Yacht x={1380} y={740} delay={2.8} />
        <motion.rect x="0" y="-60" width="1920" height="1100" fill="url(#warm)" style={{ mixBlendMode: 'screen' }} initial={{ opacity: 0 }} animate={{ opacity: 0.55 }} transition={{ delay: 2.5, duration: 5 }} />

        {/* the street far below (revealed by the tilt) */}
        <rect x="0" y="1060" width="1920" height="700" fill="#060a14" />
        <rect x="0" y="1190" width="1920" height="60" fill="#141222" />
        {[420, 820, 1100, 1500].map((x) => (
          <Lamp key={x} x={x} y={1250} h={140} />
        ))}
        <rect x="0" y="1250" width="1920" height="200" fill="url(#asphalt)" />
        <path d="M 0 1250 L 1920 1250 M 0 1450 L 1920 1450" stroke="url(#gold)" strokeWidth="3" />
        <path d={Array.from({ length: 16 }, (_, i) => `M${i * 140} 1352 h60`).join(' ')} stroke={C.gold} strokeWidth="5" opacity="0.5" />
        <rect x="0" y="1450" width="1920" height="80" fill="#120d16" />
        <Drive y={1340} x={[-400, 2300]} dur={6} delay={9.3} scale={0.55}>
          <DecoCar body="url(#bodyBurg)" />
        </Drive>
        <Drive y={1440} x={[2300, -400]} dur={6.5} delay={10.4} scale={0.6} flip>
          <DecoCar kind="rolls" body="url(#bodyIvory)" />
        </Drive>
        <Drive y={1340} x={[-400, 2300]} dur={5} delay={12.2} scale={0.55}>
          <DecoCar kind="hyper" body="url(#bodyRed)" spin={0.25} />
        </Drive>

        {/* balcony slab with chevron frieze */}
        <rect x="0" y="1000" width="1920" height="64" fill={C.burgundyDeep} />
        <rect x="0" y="1064" width="1920" height="60" fill="url(#floorShade)" />
        <GLine d="M 0 1004 L 1920 1004" delay={2.8} dur={1.2} w={2.4} />
        <path d={zigzag(0, 1920, 1046, 14, 34)} fill="none" stroke="url(#gold)" strokeWidth="2" opacity="0.75" />
        {/* balustrade */}
        <Fade delay={2.4} dur={1}>
          <path d={balusters} fill="#22070f" stroke="url(#gold)" strokeWidth="1.6" />
          <rect x="300" y="800" width="1320" height="28" fill="#3a0d18" />
          <rect x="300" y="988" width="1320" height="14" fill="#3a0d18" />
        </Fade>
        <GLine d="M 300 800 L 1620 800 M 300 828 L 1620 828" delay={2.6} dur={1.4} w={2.4} />

        {/* the arch frame (burgundy lacquer with an engraved double keyline) */}
        <path d={`M -10 -80 H 1930 V 1760 H -10 Z ${archPath(0)} Z`} fill="url(#burgFrame)" fillRule="evenodd" />
        <GLine d={archPath(0)} delay={0.8} dur={2.2} w={3.4} />
        <GLine d={archPath(18)} delay={1.1} dur={2.2} w={1.6} opacity={0.8} />
        <GLine d="M 0 62 L 1920 62 M 0 78 L 1920 78" delay={1.4} dur={1.6} w={1.6} />
        {[150, 190, 230, 270].flatMap((x) => [x, 1920 - x]).map((x, i) => (
          <GLine key={x} d={`M ${x} 400 L ${x} 1720`} delay={1.6 + (i % 4) * 0.12} dur={2.2} w={2} opacity={0.85} />
        ))}
        <GLine d={`${zigzag(120, 290, 370, 16, 34)} ${zigzag(1630, 1800, 370, 16, 34)}`} delay={2.4} dur={1} w={2} />
        <GLine d={fan(960, 112, 150, 196, 344, 12)} delay={2.2} dur={1.4} w={1.8} opacity={0.9} />
        <GLine d="M 900 112 A 60 60 0 0 1 1020 112 M 860 112 A 100 100 0 0 1 1060 112" delay={2.4} dur={1.2} w={1.8} />

        <Plaque x={960} y={252} w={560} h={78} text="MONTE-CARLO" size={40} font="Limelight" color={C.goldHot} spacing={12} delay={2.4} />
        <Fade delay={3.4} y={8}>
          <text x="960" y="322" textAnchor="middle" fontFamily="Josefin Sans" fontWeight="300" fontSize="22" letterSpacing="10" fill={C.ivory}>
            SEVEN A.M. · THE RIVIERA
          </text>
        </Fade>
      </motion.g>

      {/* opening: a point becomes a hairline on the centre axis */}
      <motion.line
        x1="960"
        x2="960"
        y1="540"
        y2="540"
        stroke={C.goldHot}
        strokeWidth="2"
        filter="url(#glow)"
        initial={{ opacity: 0 }}
        animate={{ x1: [960, 960, 300], x2: [960, 960, 1620], opacity: [0, 1, 1, 0] }}
        transition={{ duration: 2.2, times: [0, 0.15, 0.55, 1], ease: MECH }}
      />
    </Full>
  )
})

/* ================================================================ SCENE 2 */

const TOWER = [
  [640, 620, 140],
  [480, 530, 90],
  [340, 460, 70],
  [220, 400, 60],
  [120, 350, 50],
].map(([w, y, h]) => [960 - w / 2, y, w, h])
const SIDES = [
  [60, 500, 320, 260],
  [110, 470, 220, 30],
  [160, 445, 120, 25],
  [400, 590, 200, 170],
  [1540, 500, 320, 260],
  [1590, 470, 220, 30],
  [1640, 445, 120, 25],
  [1320, 590, 200, 170],
]

const FAR = 878 // far lane (left → right)
const NEAR = 968 // near lane (right → left)

const StreetSet = memo(function StreetSet() {
  return (
    <g>
      <rect width="1920" height="800" fill="url(#skyStreet)" />
      <Sunburst cx={960} cy={420} r={1400} n={36} opacity={0.13} spin={14} dur={25} delay={0.2} />
      <Buildings rects={SIDES} seed={21} delay={0.1} />
      <Buildings rects={TOWER} seed={5} delay={0.1} />
      <Fade delay={0.3}>
        <polygon points="960,250 980,350 940,350" fill="url(#goldV)" filter="url(#glow)" />
        {TOWER.map(([x, y, w]) => (
          <path key={y} d={`M ${x + 14} ${y} L ${x + 14} 760 M ${x + w - 14} ${y} L ${x + w - 14} 760`} stroke="url(#gold)" strokeWidth="1.6" opacity="0.7" />
        ))}
        <path d="M 960 350 L 960 640" stroke="url(#gold)" strokeWidth="4" />
        <rect x="720" y="666" width="480" height="60" fill="rgba(6,4,3,0.85)" stroke="url(#gold)" strokeWidth="2" />
      </Fade>
      <BulbText x={960} y={709} text="HÔTEL RIVIERA" size={36} delay={0.6} step={0.06} spacing={8} />
      <Palm x={150} y={790} h={330} delay={0.3} />
      <Palm x={1770} y={790} h={330} delay={0.3} />
      <Palm x={640} y={790} h={250} delay={0.4} />
      <Palm x={1280} y={790} h={250} delay={0.4} />
      <Lamp x={470} y={800} delay={0.4} />
      <Lamp x={1450} y={800} delay={0.4} />
      {/* far sidewalk, road, near sidewalk */}
      <rect x="0" y="760" width="1920" height="40" fill="#1a1626" />
      <rect x="0" y="800" width="1920" height="200" fill="url(#asphalt)" />
      <GLine d="M 0 762 L 1920 762" delay={0.2} dur={1} w={2} />
      <GLine d="M 0 800 L 1920 800 M 0 1000 L 1920 1000" delay={0.3} dur={1.2} w={3} />
      <path d={Array.from({ length: 15 }, (_, i) => `M${i * 140 + 20} 902 h64`).join(' ')} stroke={C.gold} strokeWidth="5" opacity="0.45" />
      <rect x="0" y="1000" width="1920" height="80" fill="#120d16" />
      <path d={zigzag(0, 1920, 1046, 12, 32)} fill="none" stroke="url(#gold)" strokeWidth="2" opacity="0.6" />
    </g>
  )
})

function Strike({ x, delay }) {
  const d1 = `M ${x - 210} 830 L ${x + 210} 990`
  const d2 = `M ${x + 210} 830 L ${x - 210} 990`
  const tr = (k) => ({ pathLength: { delay: delay + k * 0.18, duration: 0.3, ease: MECH }, opacity: { delay: delay + k * 0.18, duration: 0.05 } })
  return (
    <g filter="url(#glow)">
      {[d1, d2].map((d, k) => (
        <g key={k}>
          <motion.path d={d} stroke="#b0213d" strokeWidth="14" strokeLinecap="square" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={tr(k)} />
          <motion.path d={d} stroke="url(#gold)" strokeWidth="3" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={tr(k)} />
        </g>
      ))}
    </g>
  )
}

function Gauge({ swingAt }) {
  const ticks = Array.from({ length: 13 }, (_, i) => -120 + i * 20)
  return (
    <g transform="translate(960 250)">
      <circle r="104" fill="#070b16" stroke="url(#gold)" strokeWidth="3" />
      <circle r="90" fill="none" stroke="url(#gold)" strokeWidth="1" opacity="0.6" />
      <path d={`M ${80 * Math.sin((80 * Math.PI) / 180)} ${-80 * Math.cos((80 * Math.PI) / 180)} A 80 80 0 0 1 ${80 * Math.sin((120 * Math.PI) / 180)} ${-80 * Math.cos((120 * Math.PI) / 180)}`} stroke="#c22a40" strokeWidth="9" fill="none" />
      {ticks.map((a) => (
        <line key={a} x1="0" y1="-66" x2="0" y2={a % 40 === 0 ? -84 : -78} transform={`rotate(${a})`} stroke="url(#gold)" strokeWidth="2.4" />
      ))}
      <text y="48" textAnchor="middle" fontFamily="Poiret One" fontSize="22" letterSpacing="4" fill={C.goldHot}>
        V12
      </text>
      <text y="-30" textAnchor="middle" fontFamily="Josefin Sans" fontSize="12" letterSpacing="4" fill={C.ivory} opacity="0.7">
        RPM ×1000
      </text>
      <motion.g
        initial={{ rotate: -120 }}
        animate={{ rotate: [-120, -120, 112, 96, 108, -110] }}
        transition={{ duration: 6, times: [0, swingAt / 6, (swingAt + 0.35) / 6, (swingAt + 0.6) / 6, (swingAt + 0.9) / 6, 1], ease: MECH }}
      >
        <circle r="80" fill="none" />
        <path d="M -4 6 L 0 -76 L 4 6 Z" fill="#fff4dc" filter="url(#glow)" />
        <circle r="9" fill="url(#goldV)" />
      </motion.g>
    </g>
  )
}

function TaxiSign({ delay }) {
  return (
    <g transform="translate(-10 -194)">
      <path d="M -34 26 L -28 14 M 34 26 L 28 14" stroke="url(#gold)" strokeWidth="3" />
      <rect x="-70" y="-24" width="140" height="40" fill="#0b0805" stroke="url(#gold)" strokeWidth="2.5" />
      <BulbText x={0} y={7} text="TAXI" size={28} delay={delay} step={0.16} spacing={8} />
    </g>
  )
}

const Scene2 = memo(function Scene2() {
  return (
    <Full>
      <StreetSet />

      {/* 0:15.5 — "You don't see Toyota Camrys or Ford F-150s." */}
      <Cue at={15.5} until={19.8} exit={0.4}>
        <Plaque x={960} y={92} w={620} h={62} text="NOT ON THIS STREET" size={30} delay={0.2} />
        <Fade delay={0.4} x={-40} dur={0.9}>
          <g transform={`translate(620 ${NEAR})`}>
            <DecoCar kind="sedan" spin={0} />
          </g>
          <Plaque x={620} y={760} w={220} h={46} text="CAMRY" size={24} font="Josefin Sans" color={C.steel} delay={0.2} />
        </Fade>
        <Fade delay={1.5} x={40} dur={0.9}>
          <g transform={`translate(1300 ${NEAR})`}>
            <DecoCar kind="pickup" spin={0} />
          </g>
          <Plaque x={1300} y={760} w={220} h={46} text="F-150" size={24} font="Josefin Sans" color={C.steel} delay={0.2} />
        </Fade>
        <Strike x={620} delay={1.9} />
        <Strike x={1300} delay={2.9} />
      </Cue>

      {/* 0:19.6 — "Instead … an endless parade of Bugattis, Rolls-Royces, and Ferraris" */}
      <Cue at={19.6} until={37.6} exit={0.5}>
        {/* far lane, left → right */}
        <Drive y={FAR} x={[-700, 2620]} dur={6.5} delay={1.15} scale={0.8}>
          <DecoCar body="url(#bodyNavy)" spin={0.35} />
        </Drive>
        <Drive y={FAR} x={[-700, 2620]} dur={5.5} delay={4.75} scale={0.8}>
          <DecoCar kind="hyper" body="url(#bodyRed)" spin={0.25} />
        </Drive>
        <Drive y={FAR} x={[-700, 2620]} dur={6} delay={8} scale={0.8}>
          <DecoCar body="url(#bodyEmerald)" />
        </Drive>
        <Drive y={FAR} x={[-700, 2620]} dur={6.5} delay={11} scale={0.8}>
          <DecoCar body="url(#bodyBlack)" />
        </Drive>
        {/* near lane, right → left */}
        <Drive y={NEAR} x={[2620, -700]} dur={6} delay={0.2} flip>
          <DecoCar body="url(#bodyBlack)" />
        </Drive>
        <Drive y={NEAR} x={[2620, -700]} dur={7} delay={2.5} flip>
          <DecoCar kind="rolls" body="url(#bodyIvory)" spin={0.6} />
        </Drive>
        <Drive y={NEAR} x={[2620, -700]} dur={5.8} delay={6.6} flip>
          <DecoCar body="url(#bodyNavy)" />
        </Drive>
      </Cue>
      <Cue at={19.9} until={29.7} exit={0.3}>
        <Plaque x={960} y={92} w={640} h={62} text="AN ENDLESS PARADE" size={30} delay={0.1} />
      </Cue>
      <Cue at={23.2} until={24.9} exit={0.25}>
        <BulbText x={960} y={210} text="BUGATTI" size={84} step={0.08} />
      </Cue>
      <Cue at={24.9} until={26.6} exit={0.25}>
        <BulbText x={960} y={210} text="ROLLS-ROYCE" size={84} step={0.06} />
      </Cue>
      <Cue at={26.6} until={29.6} exit={0.4}>
        <BulbText x={960} y={210} text="FERRARI" size={84} step={0.08} />
      </Cue>

      {/* 0:30 — "a brand-new Mercedes is basically used as an Uber" */}
      <Cue at={30} until={34.3} exit={0.3}>
        <Plaque x={960} y={92} w={600} h={62} text="THE MORNING UBER" size={30} delay={0.2} />
      </Cue>
      <Cue at={30} until={35.4} exit={0.3}>
        <Cue at={30.2} until={34.4}>
          <BulbText x={960} y={210} text="MERCEDES-BENZ" size={76} step={0.055} />
        </Cue>
        <Drive
          y={NEAR}
          x={[2620, 960, 960, -700]}
          dur={5.2}
          times={[0, 2 / 5.2, 4.3 / 5.2, 1]}
          ease={[SETTLE, 'linear', [0.55, 0, 1, 0.45]]}
          flip
          label={<TaxiSign delay={1.9} />}
        >
          <DecoCar body="url(#bodySilver)" spin={0.5} />
        </Drive>
        <Cue at={32.1} until={34.3} exit={0.25}>
          <Plaque x={960} y={696} w={560} h={66} text="YOUR RIDE HAS ARRIVED" size={22} font="Josefin Sans" spacing={6} color={C.goldHot} />
        </Cue>
      </Cue>

      {/* 0:34.4 — "the locals don't even turn their heads when a screaming V12 drives past" */}
      <Cue at={34.4} until={40.8} exit={0.4} late>
        <Plaque x={960} y={92} w={720} h={62} text="NOBODY TURNS THEIR HEAD" size={30} delay={0.2} />
        <Fade delay={0.8} dur={0.8}>
          <Gauge swingAt={2.75} />
        </Fade>
        {/* hyper-car #1 (near lane) with speed lines + V12 flash */}
        <Drive y={NEAR} x={[2800, -900]} dur={1.15} delay={2.55} flip>
          <DecoCar kind="hyper" body="url(#bodyBurg)" spin={0.12} trail />
        </Drive>
        <motion.text
          x="960"
          y="660"
          textAnchor="middle"
          fontFamily="Limelight"
          fontSize="300"
          letterSpacing="30"
          fill="none"
          stroke="url(#gold)"
          strokeWidth="3"
          filter="url(#glow)"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: [0, 1, 0], scale: [0.7, 1.05, 1.25] }}
          transition={{ delay: 2.9, duration: 1.1, ease: 'easeOut' }}
        >
          V12
        </motion.text>
        <motion.rect width="1920" height="1080" fill={C.goldHot} initial={{ opacity: 0 }} animate={{ opacity: [0, 0.16, 0] }} transition={{ delay: 3.05, duration: 0.35 }} />
        {/* hyper-car #2 (far lane) */}
        <Drive y={FAR} x={[-900, 2800]} dur={1.3} delay={4.4} scale={0.8}>
          <DecoCar kind="hyper" body="url(#bodyBlack)" spin={0.12} />
        </Drive>
        {/* the locals: eyes closed, newspaper up, utterly unbothered */}
        <Fade delay={0.3} y={20}>
          <DecoFigure x={420} y={1078} scale={0.64} body="man" hat="fedora" paper />
          <DecoFigure x={1500} y={1078} scale={0.64} body="woman" hat="cloche" />
        </Fade>
        <Cue at={38.4} until={40.8} exit={0.3}>
          <Plaque x={960} y={420} w={520} h={86} text="HEADS TURNED : 0" size={38} font="Poiret One" color={C.goldHot} spacing={6} />
        </Cue>
      </Cue>
    </Full>
  )
})

/* ================================================================ SCENE 3 */

const FRAME = { x: 110, y: 60, w: 1700, h: 960 }
const WIN_LEFT = [
  [760, 640],
  [760, 320],
  [800, 320],
  [800, 280],
  [850, 280],
  [850, 250],
  [910, 250],
  [910, 226],
]
const winPath = (() => {
  const R = [...WIN_LEFT].reverse().map(([x, y]) => [1920 - x, y])
  return 'M' + [...WIN_LEFT, ...R].map((p) => p.join(' ')).join(' L ') + ' Z'
})()
const sideArch = (cx) => `M ${cx - 80} 620 L ${cx - 80} 360 L ${cx - 50} 360 L ${cx - 50} 330 L ${cx - 20} 330 L ${cx - 20} 306 L ${cx + 20} 306 L ${cx + 20} 330 L ${cx + 50} 330 L ${cx + 50} 360 L ${cx + 80} 360 L ${cx + 80} 620 Z`

const PATRONS = [
  { x: 440, body: 'man', hat: 'tophat' },
  { x: 600, body: 'woman', hat: 'cloche' },
  { x: 880, body: 'man', hat: 'fedora' },
  { x: 1040, body: 'woman', hat: 'cloche' },
  { x: 1320, body: 'man', hat: 'tophat' },
  { x: 1480, body: 'man', hat: 'fedora' },
]

function Table({ x }) {
  return (
    <g>
      <path d={`M ${x - 12} 816 L ${x + 12} 816 L ${x + 12} 930 L ${x + 40} 944 L ${x + 40} 956 L ${x - 40} 956 L ${x - 40} 944 L ${x - 12} 930 Z`} fill="#1b0710" stroke="url(#gold)" strokeWidth="1.6" />
      <ellipse cx={x} cy="804" rx="130" ry="18" fill="#22080f" stroke="url(#gold)" strokeWidth="2.4" />
      {/* table lamp */}
      <circle cx={x} cy="738" r="60" fill="url(#sunGlow)" />
      <path d={`M ${x} 800 L ${x} 760`} stroke="url(#gold)" strokeWidth="3" />
      <path d={`M ${x - 26} 762 L ${x + 26} 762 L ${x + 12} 730 L ${x - 12} 730 Z`} fill="url(#goldV)" stroke={C.engrave} strokeWidth="1" />
    </g>
  )
}

const floorLines = (() => {
  const vp = [960, 520]
  let d = ''
  for (let bx = -440; bx <= 2360; bx += 175) {
    const x0 = vp[0] + ((bx - vp[0]) * (690 - vp[1])) / (1020 - vp[1])
    d += `M ${x0} 690 L ${bx} 1020 `
  }
  return d + 'M 110 724 L 1810 724 M 110 772 L 1810 772 M 110 842 L 1810 842 M 110 940 L 1810 940'
})()

const Scene3 = memo(function Scene3() {
  const { x, y, w, h } = FRAME
  return (
    <Full>
      <defs>
        <clipPath id="cafeClip">
          <rect x={x} y={y} width={w} height={h} />
        </clipPath>
        <clipPath id="winClip">
          <path d={winPath} />
        </clipPath>
      </defs>
      {/* backdrop closes over the street once the frame is open */}
      <motion.rect width="1920" height="1080" fill="#0a0507" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75, duration: 0.5 }} />
      <Fade delay={1.0}>
        <path d={fan(110, 1020, 260, 270, 360, 10) + fan(1810, 1020, 260, 180, 270, 10)} stroke="url(#gold)" strokeWidth="1.4" opacity="0.5" />
      </Fade>

      {/* the marquee frame scales open from the centre */}
      <motion.g initial={{ scale: 0.04, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.35, ease: MECH, opacity: { duration: 0.2 } }}>
        <g clipPath="url(#cafeClip)">
          <rect x={x} y={y} width={w} height={h} fill="url(#burgWall)" />
          <Sunburst cx={960} cy={540} r={1000} n={30} opacity={0.08} spin={6} dur={10} />
          {/* window onto the sea */}
          <g clipPath="url(#winClip)">
            <rect x="760" y="220" width="400" height="420" fill="url(#skyDawn)" />
            <circle cx="960" cy="560" r="78" fill="url(#goldV)" filter="url(#glow)" />
            {[546, 562, 576].map((yy, i) => (
              <rect key={yy} x="860" y={yy} width="200" height={3 + i * 1.5} fill="#2a1834" />
            ))}
            <rect x="760" y="580" width="400" height="60" fill="url(#sea)" />
            {[592, 606, 620].map((yy, i) => (
              <line key={yy} x1={900 + i * 14} x2={1020 - i * 14} y1={yy} y2={yy} stroke="url(#gold)" strokeWidth="2" opacity="0.7" />
            ))}
          </g>
          <path d={winPath} fill="none" stroke="url(#gold)" strokeWidth="3.4" />
          <path d={sideArch(450) + sideArch(1470)} fill="#14060c" stroke="url(#gold)" strokeWidth="2.4" />
          <path d={fan(450, 620, 230, 220, 320, 10) + fan(1470, 620, 230, 220, 320, 10)} stroke="url(#gold)" strokeWidth="1.2" opacity="0.45" />
          {/* pilasters + sconces */}
          {[300, 620, 1300, 1620].map((px) => (
            <g key={px}>
              <path d={`M ${px - 8} 60 L ${px - 8} 670 M ${px + 8} 60 L ${px + 8} 670`} stroke="url(#gold)" strokeWidth="2" />
              <path d={zigzag(px - 26, px + 26, 236, 10, 26)} fill="none" stroke="url(#gold)" strokeWidth="2" />
            </g>
          ))}
          {[300, 1620].map((px) => (
            <g key={px}>
              <circle cx={px} cy="410" r="90" fill="url(#sunGlow)" />
              <path d={fan(px, 440, 60, 200, 340, 20)} stroke="url(#gold)" strokeWidth="2.4" filter="url(#glow)" />
              <path d={`M ${px - 30} 440 L ${px + 30} 440`} stroke="url(#gold)" strokeWidth="4" />
            </g>
          ))}
          {/* dado + mode-7 floor */}
          <rect x={x} y="690" width={w} height="330" fill="#12040a" />
          <path d={floorLines} stroke="url(#gold)" strokeWidth="1.4" opacity="0.4" />
          <path d="M 110 672 L 1810 672 M 110 690 L 1810 690" stroke="url(#gold)" strokeWidth="2.4" />
          <path d={zigzag(110, 1810, 686, 8, 24)} fill="none" stroke="url(#gold)" strokeWidth="1.4" opacity="0.7" />
          {/* patrons behind tables (every third one turns gold at 0:48.5) */}
          {PATRONS.map((p, i) => (
            <Fade key={p.x} delay={1.2 + i * 0.08} y={14}>
              <DecoFigure x={p.x} y={900} scale={0.46} body={p.body} hat={p.hat} hiAt={i % 3 === 2 ? 8.5 + (i === 5 ? 0.25 : 0) : undefined} />
            </Fade>
          ))}
          {[520, 960, 1400].map((tx) => (
            <Table key={tx} x={tx} />
          ))}
          {/* foreground coffee cup on the centre axis */}
          <motion.g initial={{ y: 220 }} animate={{ y: 0 }} transition={{ delay: 1.1, duration: 1.1, ease: SETTLE }}>
            {[920, 960, 1000].map((sx, i) => (
              <motion.path
                key={sx}
                d={`M ${sx} 852 C ${sx - 22} 812 ${sx + 22} 782 ${sx} 742 C ${sx - 22} 702 ${sx + 22} 672 ${sx} 632`}
                stroke={C.ivory}
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: [0, 1, 1], opacity: [0, 0.6, 0] }}
                transition={{ delay: 2 + i * 0.5, duration: 2.6, repeat: Infinity, ease: 'easeOut' }}
              />
            ))}
            <ellipse cx="960" cy="1002" rx="240" ry="32" fill="url(#porcelain)" stroke="url(#gold)" strokeWidth="2.4" />
            <path d="M 1084 892 L 1136 892 L 1136 954 L 1066 954" fill="none" stroke={C.ivory} strokeWidth="16" />
            <path d="M 1084 892 L 1136 892 L 1136 954 L 1066 954" fill="none" stroke="url(#gold)" strokeWidth="2" />
            <path d="M 826 868 L 1094 868 L 1062 990 L 858 990 Z" fill="url(#porcelain)" stroke="url(#gold)" strokeWidth="2.4" />
            <path d="M 830 886 L 1090 886 M 852 968 L 1068 968" stroke="url(#gold)" strokeWidth="5" />
            <path d={zigzag(840, 1080, 930, 10, 30)} fill="none" stroke="url(#gold)" strokeWidth="2" />
            <ellipse cx="960" cy="868" rx="134" ry="13" fill="#2a1408" stroke="url(#gold)" strokeWidth="2" />
          </motion.g>
        </g>
        {/* marquee border + keylines */}
        <rect x={x} y={y} width={w} height={h} fill="none" stroke="url(#gold)" strokeWidth="5" />
        <rect x={x + 26} y={y + 26} width={w - 52} height={h - 52} fill="none" stroke="url(#gold)" strokeWidth="1.6" opacity="0.8" />
        <BulbBorder x={x + 13} y={y + 13} w={w - 26} h={h - 26} gap={36} delay={0.9} />
        <rect x="630" y="98" width="660" height="88" fill="rgba(6,4,3,0.88)" stroke="url(#gold)" strokeWidth="2" />
        <BulbText x={960} y={160} text="LE CAFÉ DU MATIN" size={50} delay={1.4} step={0.05} spacing={6} />
      </motion.g>

      {/* 0:43.4 — "as you look around the café…" a lens scans the room */}
      <Cue at={43.4} until={47.2} exit={0.4}>
        <motion.g
          initial={{ x: 440, y: 728, opacity: 0 }}
          animate={{ x: [440, 600, 880, 1040, 1320, 1480], opacity: 1 }}
          transition={{ duration: 3.4, ease: 'easeInOut', opacity: { duration: 0.3 } }}
          filter="url(#glow)"
        >
          <circle r="70" fill="rgba(255,240,200,0.06)" stroke={C.goldHot} strokeWidth="3" />
          <circle r="56" fill="none" stroke="url(#gold)" strokeWidth="1.2" />
          <path d="M 0 -86 L 0 -60 M 0 60 L 0 86 M -86 0 L -60 0 M 60 0 L 86 0" stroke={C.goldHot} strokeWidth="3" />
        </motion.g>
      </Cue>

      {/* 0:46.4 — "you realize a statistical anomaly…" */}
      <Cue at={46.4} until={50.6} exit={0.3} late>
        <g transform="translate(960 520)">
          <Unfold dur={0.6}>
            <rect x="-600" y="-62" width="1200" height="124" fill="rgba(6,4,3,0.9)" stroke="url(#gold)" strokeWidth="3" />
            <rect x="-588" y="-50" width="1176" height="100" fill="none" stroke="url(#gold)" strokeWidth="1.2" opacity="0.7" />
          </Unfold>
        </g>
        <BulbText x={960} y={544} text="A STATISTICAL ANOMALY" size={60} delay={0.45} step={0.065} spacing={8} />
        <BulbText x={960} y={620} text="·  ·  ·" size={44} delay={1.9} step={0.3} spacing={4} />
      </Cue>
      <Cue at={48.5} until={50.6} exit={0.3}>
        <Sparkle x={880} y={664} s={0.8} />
        <Sparkle x={1480} y={664} s={0.8} delay={0.25} />
      </Cue>
    </Full>
  )
})

/* ================================================================ SCENE 4 */

const FIGS = [
  { x: 620, body: 'man', hat: 'tophat' },
  { x: 960, body: 'woman', hat: 'cloche', hi: true },
  { x: 1300, body: 'man', hat: 'fedora' },
]

function Plinth({ x }) {
  return (
    <path
      d={`M ${x - 75} 800 L ${x + 75} 800 L ${x + 75} 818 L ${x + 95} 818 L ${x + 95} 840 L ${x + 115} 840 L ${x + 115} 866 L ${x - 115} 866 L ${x - 115} 840 L ${x - 95} 840 L ${x - 95} 818 L ${x - 75} 818 Z`}
      fill="#0b1328"
      stroke="url(#gold)"
      strokeWidth="2"
    />
  )
}

const Scene4 = memo(function Scene4() {
  return (
    <Full>
      <defs>
        <clipPath id="titleClip">
          <text x="960" y="818" textAnchor="middle" fontFamily="Limelight" fontSize="168" letterSpacing="18">
            MONACO:
          </text>
        </clipPath>
      </defs>
      <rect width="1920" height="1080" fill={C.navyDeep} />
      <Sunburst cx={960} cy={560} r={1400} n={44} opacity={0.12} spin={10} dur={10} />
      <GLine d="M 50 50 L 1870 50 L 1870 1030 L 50 1030 Z" dur={1.6} w={2.6} delay={0.3} />
      <GLine d="M 68 68 L 1852 68 L 1852 1012 L 68 1012 Z" dur={1.6} w={1.2} delay={0.45} opacity={0.75} />
      <GLine d={`${fan(50, 50, 140, 0, 90, 15)} ${fan(1870, 50, 140, 90, 180, 15)} ${fan(50, 1030, 140, 270, 360, 15)} ${fan(1870, 1030, 140, 180, 270, 15)}`} delay={0.8} dur={1.2} w={1.6} />

      {/* the data: 1 in 3 — shrinks up to make room for the title at 0:55.2 */}
      <motion.g initial={{ scale: 1, y: 0 }} animate={{ scale: 0.52, y: -228 }} transition={{ delay: 5.2, duration: 1.0, ease: MECH }}>
        <rect x="200" y="40" width="1520" height="920" fill="none" />
        <Plaque x={960} y={100} w={620} h={64} text="EVERY THIRD PERSON" size={32} delay={0.7} />
        {/* the halo behind the highlighted figure */}
        <motion.g initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 2.6, duration: 0.9, ease: SETTLE }}>
          <Sunburst cx={960} cy={560} r={330} n={28} opacity={0.55} spin={40} dur={8} fill="url(#goldV)" />
          <circle cx="960" cy="560" r="240" fill="url(#sunGlow)" />
          <circle cx="960" cy="560" r="210" fill="none" stroke="url(#gold)" strokeWidth="2.4" />
        </motion.g>
        {FIGS.map((f, i) => (
          <Fade key={f.x} delay={0.6 + i * 0.18} y={70} dur={1.0}>
            <Plinth x={f.x} />
            <DecoFigure x={f.x} y={800} body={f.body} hat={f.hat} hiAt={f.hi ? 2.6 : undefined} dimAt={f.hi ? undefined : 2.8} />
          </Fade>
        ))}
        <Fade delay={2.9} y={16}>
          <text x="960" y="282" textAnchor="middle" fontFamily="Italiana" fontSize="120" letterSpacing="16" fill="url(#goldV)" filter="url(#glow)">
            1 IN 3
          </text>
        </Fade>
        <Fade delay={3.3} y={12}>
          <text x="960" y="928" textAnchor="middle" fontFamily="Poiret One" fontSize="44" letterSpacing="12" fill={C.goldHot}>
            MULTIMILLIONAIRE
          </text>
        </Fade>
      </motion.g>

      {/* 0:56 — MONACO: THE BASELINE OF WEALTH */}
      <Cue at={56} late>
        <motion.line x1="960" x2="960" y1="652" y2="652" stroke={C.goldHot} strokeWidth="2" filter="url(#glow)" animate={{ x1: 330, x2: 1590 }} transition={{ duration: 0.6, ease: MECH }} />
        <motion.line x1="960" x2="960" y1="928" y2="928" stroke={C.goldHot} strokeWidth="2" filter="url(#glow)" animate={{ x1: 330, x2: 1590 }} transition={{ duration: 0.6, ease: MECH }} />
        <g transform="translate(960 790)">
          <Unfold delay={0.3} dur={0.6} axis="y">
            <polygon points="-620,-120 620,-120 620,-96 644,-96 644,96 620,96 620,120 -620,120 -620,96 -644,96 -644,-96 -620,-96" fill="rgba(5,4,3,0.9)" stroke="url(#gold)" strokeWidth="3" />
            <polygon points="-604,-106 604,-106 604,-84 626,-84 626,84 604,84 604,106 -604,106 -604,84 -626,84 -626,-84 -604,-84" fill="none" stroke="url(#gold)" strokeWidth="1.2" opacity="0.7" />
          </Unfold>
        </g>
        <motion.g initial={{ opacity: 0, y: 46 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.9, ease: SETTLE }}>
          <text x="960" y="818" textAnchor="middle" fontFamily="Limelight" fontSize="168" letterSpacing="18" fill="url(#goldV)" stroke="#2a1806" strokeWidth="2" paintOrder="stroke" filter="url(#glow)">
            MONACO:
          </text>
        </motion.g>
        <g clipPath="url(#titleClip)">
          <motion.rect y="650" width="300" height="200" fill="url(#sheen)" initial={{ x: -400 }} animate={{ x: 2000 }} transition={{ delay: 1.5, duration: 1.3, ease: 'easeInOut' }} />
        </g>
        <BulbText x={960} y={894} text="THE BASELINE OF WEALTH" size={48} font="Poiret One" delay={1.5} step={0.045} spacing={14} />
        {/* wings */}
        <GLine d="M 300 790 L 250 750 L 270 790 L 250 830 Z M 240 790 L 190 760 L 206 790 L 190 820 Z M 1620 790 L 1670 750 L 1650 790 L 1670 830 Z M 1680 790 L 1730 760 L 1714 790 L 1730 820 Z" delay={0.9} dur={0.8} w={2.2} />
        <BulbBorder x={300} y={656} w={1320} h={268} gap={30} r={4.5} delay={2.4} />
        <Sparkle x={330} y={656} s={0.9} delay={2.9} />
        <Sparkle x={1590} y={924} s={0.9} delay={3.1} />
      </Cue>
    </Full>
  )
})

/* ============================================================ TRANSITIONS */

const DoorPanel = () => (
  <g>
    <rect x="-4" y="0" width="964" height="1080" fill="url(#burgPanel)" />
    <path d={fan(960, 540, 420, 90, 270, 9)} stroke="url(#gold)" strokeWidth="1.6" opacity="0.7" />
    <path d="M 960 120 A 420 420 0 0 0 960 960 M 960 300 A 240 240 0 0 0 960 780 M 960 420 A 120 120 0 0 0 960 660" fill="none" stroke="url(#gold)" strokeWidth="2.4" />
    <path d="M 948 0 L 948 1080 M 930 0 L 930 1080" stroke="url(#gold)" strokeWidth="3" />
    <path d={`${zigzag(0, 900, 60, 16, 40)} ${zigzag(0, 900, 1040, 16, 40)}`} fill="none" stroke="url(#gold)" strokeWidth="2" opacity="0.8" />
    <path d="M 0 90 L 900 90 M 0 990 L 900 990" stroke="url(#gold)" strokeWidth="1.4" />
  </g>
)

/** Threshold doors: close on the centre seam at `at`, hold, open. */
function Doors({ at }) {
  const tr = { duration: 1.5, times: [0, 0.4, 0.55, 1], ease: [MECH, 'linear', MECH] }
  return (
    <Cue at={at - 0.6} until={at + 0.95} as="div" className="absolute inset-0 z-30" exit={0.01}>
      <Full>
        <motion.g initial={{ x: -980 }} animate={{ x: [-980, 0, 0, -980] }} transition={tr}>
          <DoorPanel />
        </motion.g>
        <motion.g initial={{ x: 980 }} animate={{ x: [980, 0, 0, 980] }} transition={tr}>
          <g transform="translate(1920 0) scale(-1 1)">
            <DoorPanel />
          </g>
        </motion.g>
        <motion.line x1="960" x2="960" y1="0" y2="1080" stroke={C.goldHot} strokeWidth="4" filter="url(#bigGlow)" initial={{ opacity: 0 }} animate={{ opacity: [0, 0, 1, 0] }} transition={{ duration: 1.5, times: [0, 0.38, 0.45, 0.6] }} />
      </Full>
    </Cue>
  )
}

/* ================================================================= BATCH */

const SceneLayer = memo(function SceneLayer() {
  return (
    <>
      <Cue at={0} until={15} late as="div" className="absolute inset-0 z-[1]" exit={0.3}>
        <Scene1 />
      </Cue>
      <Cue at={15} until={41.4} late as="div" className="absolute inset-0 z-[2]" exit={0.3}>
        <Scene2 />
      </Cue>
      <Cue at={40} until={50.6} late as="div" className="absolute inset-0 z-[3]" exit={0.3}>
        <Scene3 />
      </Cue>
      <Cue at={50} late as="div" className="absolute inset-0 z-[4]">
        <Scene4 />
      </Cue>
      <Doors at={15} />
      <Doors at={50} />
    </>
  )
})

/** Film grain + vignette (static, cheap). */
const Finish = memo(function Finish() {
  return (
    <svg viewBox="0 0 1920 1080" className="pointer-events-none absolute inset-0 z-[35] h-full w-full">
      <rect width="1920" height="1080" fill="url(#vignette)" />
      <rect width="1920" height="1080" filter="url(#grain)" opacity="0.07" />
    </svg>
  )
})

function Splash({ onStart, fontsReady }) {
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#060b17]">
      <div className="absolute inset-10 border-2 border-[#d4af5a]/70" />
      <div className="absolute inset-14 border border-[#d4af5a]/40" />
      <p className="font-josefin text-[22px] tracking-[0.6em] text-[#d4af5a]">BATCH · 01</p>
      <h1 className="text-gold-metal mt-6 font-deco text-[120px] leading-none tracking-[0.12em]">MONACO</h1>
      <p className="mt-6 font-poiret text-[34px] tracking-[0.35em] text-[#f2e6cc]">THE BASELINE OF WEALTH</p>
      <button
        onClick={() => onStart(0)}
        disabled={!fontsReady}
        className="mt-16 flex items-center gap-4 border-2 border-[#d4af5a] bg-[#2a0811] px-12 py-5 font-josefin text-[24px] tracking-[0.4em] text-[#fbe9b0] transition hover:bg-[#4a1020] disabled:opacity-40"
      >
        <Play size={26} /> {fontsReady ? 'START · 60 SEC' : 'LOADING FONTS…'}
      </button>
      <div className="mt-10 flex gap-3">
        {CHAPTERS.map((c) => (
          <button
            key={c.at}
            onClick={() => onStart(c.at)}
            disabled={!fontsReady}
            className="border border-[#d4af5a]/50 px-4 py-2 font-josefin text-[15px] tracking-[0.2em] text-[#d4af5a] hover:border-[#fbe9b0] hover:text-[#fbe9b0]"
          >
            {Math.floor(c.at / 60)}:{String(c.at % 60).padStart(2, '0')} · {c.label}
          </button>
        ))}
      </div>
      <p className="mt-12 font-josefin text-[17px] tracking-[0.15em] text-[#f2e6cc]/60">
        SPACE start / restart · 1–5 chapters · H hide HUD · P progress bar · V script cue · F fullscreen · ESC menu
      </p>
    </div>
  )
}

export default function Batch1() {
  const clock = useClock(DURATION)
  const { t, from, started, playing, runId, play, reset } = clock
  const [hud, setHud] = useState(true)
  const [bar, setBar] = useState(true)
  const [script, setScript] = useState(false)
  const [fontsReady, setFontsReady] = useState(false)

  useEffect(() => {
    let alive = true
    const fams = ['Limelight', 'Poiret One', 'Italiana', 'Josefin Sans']
    Promise.all(fams.map((f) => document.fonts.load(`40px "${f}"`)))
      .catch(() => {})
      .finally(() => alive && setFontsReady(true))
    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.code === 'Space') {
        e.preventDefault()
        play(0)
      } else if (e.key >= '1' && e.key <= '5') play(CHAPTERS[Number(e.key) - 1].at)
      else if (e.key === 'h' || e.key === 'H') setHud((v) => !v)
      else if (e.key === 'p' || e.key === 'P') setBar((v) => !v)
      else if (e.key === 'v' || e.key === 'V') setScript((v) => !v)
      else if (e.key === 'f' || e.key === 'F') {
        if (document.fullscreenElement) document.exitFullscreen()
        else document.documentElement.requestFullscreen?.()
      } else if (e.key === 'Escape') reset()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [play, reset])

  const tl = useMemo(() => ({ t, from }), [t, from])
  const line = [...VO].reverse().find((v) => t >= v.at)

  return (
    <Stage className={playing ? 'cursor-none' : ''}>
      <DecoDefs />
      <TimelineProvider value={tl}>
        {started && (
          <div key={runId} className="absolute inset-0">
            <SceneLayer />
          </div>
        )}
      </TimelineProvider>
      <Finish />

      {started && bar && <ProgressBar t={t} duration={DURATION} marks={CHAPTERS} />}

      {started && script && line && (
        <div className="absolute inset-x-[260px] top-6 z-40 border border-[#d4af5a]/60 bg-black/80 px-6 py-3 text-center font-josefin text-[22px] leading-snug text-[#f2e6cc]">
          {line.text}
        </div>
      )}

      {started && hud && !playing && (
        <div className="absolute right-8 top-8 z-50 flex gap-3">
          <button onClick={() => play(0)} className="flex items-center gap-2 border border-[#d4af5a] bg-black/70 px-4 py-2 font-josefin text-[16px] tracking-[0.2em] text-[#fbe9b0]">
            <RotateCcw size={18} /> REPLAY
          </button>
          <button onClick={reset} className="flex items-center gap-2 border border-[#d4af5a] bg-black/70 px-4 py-2 font-josefin text-[16px] tracking-[0.2em] text-[#fbe9b0]">
            <Clapperboard size={18} /> MENU
          </button>
          <button
            onClick={() => document.documentElement.requestFullscreen?.()}
            className="flex items-center gap-2 border border-[#d4af5a] bg-black/70 px-4 py-2 font-josefin text-[16px] tracking-[0.2em] text-[#fbe9b0]"
          >
            <Maximize size={18} />
          </button>
        </div>
      )}

      {!started && (
        <Splash
          fontsReady={fontsReady}
          onStart={(at) => {
            document.activeElement?.blur?.()
            play(at)
          }}
        />
      )}
    </Stage>
  )
}

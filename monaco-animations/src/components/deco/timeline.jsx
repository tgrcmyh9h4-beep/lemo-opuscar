import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

/*
 * A tiny master clock for screen-recorded motion pieces.
 *
 * - `useClock(duration)` drives a single `t` (seconds) with requestAnimationFrame.
 * - `<Cue at until>` mounts its children when the clock reaches `at` and unmounts
 *   them (with an exit fade, via AnimatePresence) at `until`. Everything inside a
 *   cue uses ordinary framer-motion `delay`s, measured from the moment it mounts,
 *   so each cue is a self-contained sequence locked to the master clock.
 * - Cues that start before the playback start point are skipped (unless `late`),
 *   so jumping to a chapter never shows half-finished animations.
 */

const TimelineContext = createContext({ t: 0, from: 0 })
export const useTimeline = () => useContext(TimelineContext)
export const TimelineProvider = TimelineContext.Provider

export function useClock(duration) {
  const [state, setState] = useState({ t: 0, from: 0, playing: false, started: false, runId: 0 })
  const raf = useRef(0)
  const origin = useRef(0)

  const stopRaf = () => cancelAnimationFrame(raf.current)

  const play = useCallback(
    (from = 0) => {
      stopRaf()
      origin.current = performance.now() - from * 1000
      setState((s) => ({ t: from, from, playing: true, started: true, runId: s.runId + 1 }))
      const tick = () => {
        // read performance.now() (not the rAF timestamp) so the clock shares a time base with `origin`
        const t = Math.min(duration, (performance.now() - origin.current) / 1000)
        setState((s) => ({ ...s, t, playing: t < duration }))
        if (t < duration) raf.current = requestAnimationFrame(tick)
      }
      raf.current = requestAnimationFrame(tick)
    },
    [duration],
  )

  const reset = useCallback(() => {
    stopRaf()
    setState((s) => ({ t: 0, from: 0, playing: false, started: false, runId: s.runId + 1 }))
  }, [])

  useEffect(() => stopRaf, [])
  return { ...state, play, reset }
}

export function Cue({ at, until = Infinity, late = false, exit = 0.4, as = 'g', className, style, children }) {
  const { t, from } = useTimeline()
  const canJoin = late || from <= at + 0.15
  const show = canJoin && t >= at && t < until
  const M = as === 'div' ? motion.div : motion.g
  return (
    <AnimatePresence>
      {show && (
        <M
          key="cue"
          className={className}
          style={style}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: exit, ease: 'easeInOut' } }}
        >
          {children}
        </M>
      )}
    </AnimatePresence>
  )
}

/** A fixed 1920×1080 stage, scaled to fit the window (letterboxed). */
export function Stage({ children, className = '' }) {
  const [scale, setScale] = useState(1)
  useLayoutEffect(() => {
    const fit = () => setScale(Math.min(window.innerWidth / 1920, window.innerHeight / 1080))
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])
  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-[#030201]">
      <div
        className={`relative flex-none overflow-hidden ${className}`}
        style={{ width: 1920, height: 1080, transform: `scale(${scale})` }}
      >
        {children}
      </div>
    </div>
  )
}

const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

/** Art Deco progress bar for syncing a voiceover take. */
export function ProgressBar({ t, duration, marks }) {
  const p = Math.min(1, t / duration)
  const current = [...marks].reverse().find((m) => t >= m.at) ?? marks[0]
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 h-[46px] bg-gradient-to-t from-black/90 to-black/0 px-10">
      <div className="absolute bottom-[14px] left-10 right-[190px] h-[6px]">
        <div className="absolute inset-0 border border-[#7a5518]/80 bg-black/60" />
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-b from-[#fff0bd] via-[#d4a84a] to-[#7a5114] shadow-[0_0_12px_rgba(244,210,130,0.7)]"
          style={{ width: `${p * 100}%` }}
        />
        {marks.map((m) => (
          <div key={m.at} className="absolute top-[-9px] h-[24px]" style={{ left: `${(m.at / duration) * 100}%` }}>
            <div className="h-full w-[2px] -translate-x-1/2 bg-[#d4af5a]" />
            <div
              className={`absolute bottom-[26px] left-1 whitespace-nowrap font-josefin text-[13px] tracking-[0.25em] ${
                current.at === m.at ? 'text-[#fbe9b0]' : 'text-[#d4af5a]/55'
              }`}
            >
              {fmt(m.at)} · {m.label}
            </div>
          </div>
        ))}
        {/* playhead diamond */}
        <div
          className="absolute top-1/2 h-[14px] w-[14px] -translate-x-1/2 -translate-y-1/2 rotate-45 border border-[#fff0bd] bg-[#d4af5a]"
          style={{ left: `${p * 100}%` }}
        />
      </div>
      <div className="absolute bottom-[6px] right-10 font-poiret text-[24px] tracking-[0.12em] text-[#fbe9b0] tabular-nums">
        {fmt(t)}.{String(Math.floor((t % 1) * 10))} <span className="text-[#d4af5a]/60">/ {fmt(duration)}</span>
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Film } from 'lucide-react'
import Batch1 from './components/Batch1.jsx'

/*
 * Batch registry. To add the next segment:
 *   1. create src/components/Batch2.jsx (copy Batch1's structure)
 *   2. add { id: 'batch-2', label: 'Batch 2', title: '…', Component: Batch2 } below
 * Switch batches with the hover menu at the top-centre edge of the screen, the [ / ] keys,
 * or the URL hash (#batch-1, #batch-2, …).
 */
const BATCHES = [{ id: 'batch-1', label: 'Batch 1', title: 'The Baseline of Wealth', Component: Batch1 }]

const fromHash = () => {
  const id = window.location.hash.replace('#', '')
  return Math.max(0, BATCHES.findIndex((b) => b.id === id))
}

export default function App() {
  const [index, setIndex] = useState(fromHash)

  useEffect(() => {
    const onHash = () => setIndex(fromHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const go = (i) => {
    const n = (i + BATCHES.length) % BATCHES.length
    window.location.hash = BATCHES[n].id
    setIndex(n)
  }

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === '[') go(index - 1)
      if (e.key === ']') go(index + 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const { Component, id } = BATCHES[index]

  return (
    <>
      {/* key forces a clean remount (fresh clock) when switching batches */}
      <Component key={id} />

      {/* Batch switcher: invisible until the mouse touches the top edge, so it never shows up in a recording */}
      <div className="group fixed left-1/2 top-0 z-[100] flex h-14 w-[640px] -translate-x-1/2 justify-center">
        <nav className="mt-3 flex items-center gap-2 border border-[#d4af5a]/70 bg-black/85 px-3 py-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <button onClick={() => go(index - 1)} className="p-1 text-[#d4af5a] hover:text-[#fbe9b0]" aria-label="Previous batch">
            <ChevronLeft size={18} />
          </button>
          <Film size={16} className="text-[#d4af5a]" />
          {BATCHES.map((b, i) => (
            <button
              key={b.id}
              onClick={() => go(i)}
              className={`px-3 py-1 font-josefin text-[14px] tracking-[0.2em] ${
                i === index ? 'bg-[#4a1020] text-[#fbe9b0]' : 'text-[#d4af5a] hover:text-[#fbe9b0]'
              }`}
            >
              {b.label.toUpperCase()} · {b.title.toUpperCase()}
            </button>
          ))}
          <button onClick={() => go(index + 1)} className="p-1 text-[#d4af5a] hover:text-[#fbe9b0]" aria-label="Next batch">
            <ChevronRight size={18} />
          </button>
        </nav>
      </div>
    </>
  )
}

# monaco-animations

Code-driven Art Deco motion graphics for a screen-recorded Monaco documentary.
Built with Vite + React, Tailwind CSS v4, framer-motion and lucide-react.

```sh
npm install
npm run dev        # open http://localhost:5173
```

## Batch 1 — "The Baseline of Wealth" (60 s)

| Time | Scene |
|---|---|
| 0:00–0:15 | Art Deco balcony at sunrise; the camera tilts down to the street |
| 0:15–0:30 | No Camrys / F-150s → the parade (Bugatti, Rolls-Royce, Ferrari) |
| 0:30–0:40 | The Mercedes "Uber" → a V12 hyper-car passes, heads turned: 0 |
| 0:40–0:50 | The café: a marquee frame scales open → "a statistical anomaly" |
| 0:50–1:00 | 1 in 3 figures in gold → MONACO: THE BASELINE OF WEALTH |

### Recording controls

| Key | Action |
|---|---|
| Space | Start / restart from 0:00 |
| 1–5 | Jump to a chapter (0:00, 0:15, 0:30, 0:40, 0:50) |
| H | Hide / show the HUD buttons |
| P | Hide / show the 60-second progress bar |
| V | Show the voiceover line for the current section (teleprompter) |
| F | Fullscreen |
| Esc | Back to the start screen |
| [ / ] | Previous / next batch (also: hover the top-centre edge, or `#batch-1` in the URL) |

The stage is a fixed 1920×1080 canvas scaled to the window, so record in fullscreen at 16:9.

## Structure

- `src/App.jsx`: batch registry and switching (add `Batch2` there)
- `src/components/Batch1.jsx`: the four scenes and their timeline
- `src/components/deco/timeline.jsx`: master clock, `<Cue at until>`, stage, progress bar
- `src/components/deco/kit.jsx`: Art Deco drawing kit (gold gradients, engraved lines, sunbursts, marquee bulbs, cars, figures)

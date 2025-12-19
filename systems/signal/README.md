# Signal System

Particles, glitch, and generative elements. Rules come from expressive math and philosophical meaning.

---

## Base Unit: 3px (GRID)

```javascript
const GRID = 3; // Non-negotiable

function drawPixel(ctx, x, y, color, alpha) {
  const px = Math.floor(x / GRID) * GRID;
  const py = Math.floor(y / GRID) * GRID;
  ctx.fillStyle = `rgba(${color}, ${alpha})`;
  ctx.fillRect(px, py, GRID - 1, GRID - 1);
}
```

**Why 3px?**
- Creates visible quantization
- Evokes CRT phosphor dots
- Different from Structure's 4px (intentionally)

---

## Contents

| Folder | Purpose |
|--------|---------|
| `particles/` | Core particle system + platform behaviors |
| `glitch/` | Glitch effects (scanlines, aberration, noise) |

---

## Platform Particle Behaviors

| ID | Platform | Motion | Character |
|----|----------|--------|-----------|
| `axis-flow` | Astrolabe | Diagonal axis flow | Star chart navigation |
| `radial-organic` | Atlas | Radial breathing | Bioluminescent specimen |
| `horizontal-flow` | Ledger Dark | Horizontal scanline | Data stream |
| `clustered` | Ledger Light | Clustered topology | Semantic breathing |

---

## Glitch Levels

| Level | Effect | When to Use |
|-------|--------|-------------|
| 0 | Clean | Reading, primary content |
| 1 | Noise/grain | Ambient atmosphere, backgrounds |
| 2 | Scanlines | Loading, processing states |
| 3 | Displacement | Transitions, state changes |
| 4 | Chromatic aberration | Errors, warnings, dramatic moments |

---

## Glitch Parameters

- **Duration:** 50-150ms
- **Displacement:** 1-3px
- **Direction:** Horizontal bias (scanline heritage)
- **Frequency:** Sparse — glitch is punctuation, not prose

---

## Source Files

- `particles/core.js` — Base particle renderer
- `particles/behaviors/` — Platform-specific behaviors
- `glitch/effects.css` — CSS glitch implementations
- `../../particles/` — Full particle system code

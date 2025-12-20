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

| File/Folder | Purpose |
|-------------|---------|
| `generative-sigils.md` | Algorithmic identity system for entities/categories |
| `domain-nebulae.md` | Strange attractor particle systems for domains |
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

---

## Generative Systems

Two algorithmic systems create unique visual identities:

### Generative Sigils
**Purpose:** Unique visual identity for each entity/category

| Aspect | Description |
|--------|-------------|
| **Input** | Domain name + entity ID |
| **Output** | Deterministic particle cluster |
| **Pattern types** | constellation, scatter, grid, cross, spiral |
| **Seeded** | Same input → same sigil (always) |
| **Glitch** | 1-3px displacements as signature |

→ See: `generative-sigils.md`

### Domain Nebulae (Strange Attractors)
**Purpose:** Distinctive particle field for each domain/category

| Aspect | Description |
|--------|-------------|
| **Input** | Attractor type + configuration |
| **Output** | 3D rotating particle cloud |
| **Attractor types** | Lorenz, Thomas, Halvorsen, Aizawa, Sprott, Rössler, Dadras, Galaxy |
| **Character** | Deterministic chaos — complex but predictable |
| **Rendering** | 3D rotation with perspective projection |

→ See: `domain-nebulae.md`

---

## Source Files

- `particles/core.js` — Base particle renderer
- `particles/behaviors/` — Platform-specific behaviors
- `glitch/effects.css` — CSS glitch implementations
- `../../particles/` — Full particle system code
- `../../icons/core/GenerativeSigil.tsx` — Sigil component
- `../../particles/StrangeAttractor.ts` — Attractor module

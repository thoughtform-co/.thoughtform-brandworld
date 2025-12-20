# Generative Sigils

Algorithmic particle clusters that create unique visual identities. Each domain/category gets a base pattern; each entity/item gets a deterministic variation.

---

## Philosophy

> **Identity through algorithm.** Rather than designing static icons, we generate them mathematically. Same input always produces same output, but each input produces a unique result.

Sigils serve the **LIVING_GEOMETRY** anchor — math that behaves organically. They also activate **SIGNAL** — pattern emerging from mathematical structure.

---

## The DNA System

Every sigil has DNA that controls its generation:

```typescript
interface PatternDNA {
  pattern: 'constellation' | 'scatter' | 'grid' | 'cross' | 'spiral';
  baseParticles: number;    // 15-50 typical
  spread: number;           // 0.3-0.8 of container
  glitchChance: number;     // 0.02-0.25
  rotation: number;         // 0-360 degrees
  hasCore: boolean;         // Central bright particle?
  densityFalloff: number;   // 0.3-0.8 (edge fade)
  arms?: number;            // For spiral: 2-5
}
```

---

## Pattern Types

### Constellation
**Character:** Radiating star pattern, points connected by implied lines

```
        ·
      · ● ·
    ·   |   ·
      · ● ·
        ·
```

**DNA:** `{ pattern: 'constellation', baseParticles: 20, glitchChance: 0.05, hasCore: true }`

**Use for:** Primary entities, navigation waypoints, focal elements

---

### Scatter
**Character:** Organic cloud, naturalistic distribution

```
      ·   ·
    ·   ·   ·
  ·   ·   ·   ·
    ·   ·   ·
      ·   ·
```

**DNA:** `{ pattern: 'scatter', baseParticles: 30, spread: 0.7, densityFalloff: 0.5 }`

**Use for:** Ambient elements, backgrounds, secondary entities

---

### Grid
**Character:** Corrupted data pattern, digital interference

```
  ■ · ■ · ■
  · ■ · ■ ·
  ■ · ■ · ■
  · ■ · ■ ·
```

**DNA:** `{ pattern: 'grid', baseParticles: 25, glitchChance: 0.25, rotation: 45 }`

**Use for:** Technical/system entities, data categories, Ledger elements

---

### Cross
**Character:** Gateway X, threshold marker

```
      ·
    · ● ·
  ·   ●   ·
    · ● ·
      ·
```

**DNA:** `{ pattern: 'cross', baseParticles: 20, glitchChance: 0.12, hasCore: true }`

**Use for:** Transitions, portals, threshold entities

---

### Spiral
**Character:** Fibonacci arms, organic evolution

```
      · ·
    ·     ·
  ·   ●     ·
    ·     ·
      · ·
```

**DNA:** `{ pattern: 'spiral', baseParticles: 25, arms: 3, glitchChance: 0.10 }`

**Use for:** Evolution/progress, time-based entities, growth indicators

---

## Domain → Pattern Mapping

| Domain/Category | Pattern | Glitch | Character |
|-----------------|---------|--------|-----------|
| **Atlas: Starhaven Reaches** | constellation | 5% | Celestial navigation |
| **Atlas: The Gradient Throne** | scatter | 8% | Ethereal organic |
| **Atlas: The Lattice** | grid | 25% | Data structure |
| **Atlas: The Threshold** | cross | 12% | Gateway/portal |
| **Ledger: Income** | spiral | 10% | Growth/accumulation |
| **Ledger: Expenses** | scatter | 8% | Dispersal |
| **Astrolabe: Documents** | constellation | 5% | Knowledge nodes |

---

## Seeded Randomness

**Critical:** Same seed always produces same sigil.

```typescript
// Hash function converts any string to number
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

// Seeded random from entity ID
function seededRandom(seed: number): () => number {
  return () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

// Usage
const entitySeed = hashCode(entityId);
const random = seededRandom(entitySeed);
// random() now returns deterministic values
```

**Why this matters:**
- Entity "abc-123" always gets the exact same sigil
- No need to store generated patterns
- Consistent across page loads, platforms, exports

---

## Entity Variations

Base domain pattern + entity ID creates unique variation:

```typescript
function generateEntitySigil(domain: string, entityId: string) {
  const baseDNA = DOMAIN_DNA[domain];
  const entitySeed = hashCode(entityId);
  const random = seededRandom(entitySeed);
  
  // Entity modifies base DNA
  return {
    ...baseDNA,
    rotation: baseDNA.rotation + (random() - 0.5) * 30, // ±15°
    spread: baseDNA.spread * (0.9 + random() * 0.2),    // ±10%
    baseParticles: baseDNA.baseParticles + Math.floor((random() - 0.5) * 6),
  };
}
```

---

## The Glitch Signature

Every sigil includes subtle 1-3px displacements — the Thoughtform signature.

```typescript
function applyGlitch(particle: Particle, glitchChance: number): Particle {
  if (Math.random() > glitchChance) return particle;
  
  return {
    ...particle,
    glitchX: Math.floor((Math.random() - 0.5) * 3) * GRID,  // -3, 0, or +3px
    glitchY: Math.floor((Math.random() - 0.5) * 2) * GRID,  // -3 or +3px (less vertical)
  };
}
```

**Why glitch?**
- Breaks mathematical perfection
- Echoes wordmark cuts and vector interruptions
- Signals liminality — data at the boundary of meaning
- Makes algorithmic output feel alive

---

## Rendering

### SVG Implementation

```tsx
<svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
  {particles.map((p, i) => {
    const x = p.x + (p.glitchX || 0);
    const y = p.y + (p.glitchY || 0);
    const gx = Math.floor((x + center) / GRID) * GRID;
    const gy = Math.floor((y + center) / GRID) * GRID;
    
    return (
      <rect
        key={i}
        x={gx}
        y={gy}
        width={GRID - 1}
        height={GRID - 1}
        fill={`rgba(${color}, ${p.alpha})`}
      />
    );
  })}
</svg>
```

### Size Scale

| Size | Use Case | Particle Count |
|------|----------|----------------|
| 16px | Inline badges | 8-12 |
| 24px | List items | 12-18 |
| 32px | Card headers | 15-25 |
| 48px | Featured display | 20-35 |
| 96px | Hero/detail view | 30-50 |
| 128px | Export/print | 40-60 |

---

## Platform Colors

| Platform | Color RGB | Hex |
|----------|-----------|-----|
| Atlas (default) | `236, 227, 214` | Dawn |
| Atlas (gold accent) | `202, 165, 84` | Gold |
| Ledger Dark | `43, 78, 64` | Verde |
| Ledger Light | `61, 139, 122` | Teal |
| Astrolabe | `202, 165, 84` | Gold |

---

## Animation

### Breathing (Idle)

```typescript
const pulseAlpha = 1 + pulse * 0.2 * Math.sin(i * 0.5 + time);
```

**Parameters:**
- Frequency: 0.002 (slow breath)
- Amplitude: ±20% alpha
- Phase offset per particle: Creates shimmer

### Hover

- Scale: 1.05×
- Alpha: +15%
- Transition: 200ms ease-out

---

## Component API

```tsx
interface GenerativeSigilProps {
  domain: string;           // Base pattern selector
  entityId?: string;        // Creates variation
  color?: string;           // RGB triplet override
  size?: number;            // Pixel size (default 48)
  className?: string;
  opacity?: number;         // 0-1 (default 1)
  pulse?: number;           // Animation intensity 0-1
}

<GenerativeSigil 
  domain="Starhaven Reaches" 
  entityId="entity-abc-123"
  size={32}
/>
```

---

## Files

| File | Purpose |
|------|---------|
| `icons/core/GenerativeSigil.tsx` | Main component |
| `icons/presets/GenerativeSigilPresets.ts` | Platform color/DNA presets |
| `philosophy/GENERATIVE-PATTERNS.md` | Mathematical foundations |

---

*Same seed, same sigil. Different seed, different sigil. Always Thoughtform.*

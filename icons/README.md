# Thoughtform Particle Icon System

A geometric sigil vocabulary for the Thoughtform ecosystem. "Thoughts to Form" — icons emerge from simple geometric primitives, creating a visual language that feels mathematical and intentional.

## Two Systems

### 1. Generative Sigils (Recommended)

**Algorithmic particle clusters** that create unique visual identities from deterministic mathematical processes.

```tsx
import { GenerativeSigil } from '@/icons/core/GenerativeSigil';

// Category determines pattern type, uniqueId creates variant
<GenerativeSigil
  category="Starhaven Reaches"
  uniqueId="entity-123"
  color="202, 165, 84"
  size={24}
/>
```

**Features:**
- Infinite unique sigils from seeded randomness
- 5 pattern types: constellation, scatter, grid, cross, spiral
- Glitch offsets echo Thoughtform brand language
- Golden ratio + fibonacci for organic distributions
- Same input always produces same output

**See:** `philosophy/GENERATIVE-PATTERNS.md` for full documentation.

### 2. Geometric Icons (Legacy)

**Three-layer static system** for simpler use cases.

## Core Principles

- **GRID = 3**: All icons snap to a 3px grid (sacred constant)
- **Geometric Primitives**: Simple polygons, not organic curves
- **Three-Layer System**: Domain → Role → Entity (like atomic structure)
- **Unique & Distinct**: Each element is instantly recognizable

## Three-Layer Architecture

```
┌─────────────────────────────────────────┐
│  Layer 3: ORBITAL (Entity variation)    │
│  ┌───────────────────────────────────┐  │
│  │  Layer 2: ROLE (Function)         │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │  Layer 1: DOMAIN (Base)     │  │  │
│  │  │                             │  │  │
│  │  │       △  ◇  ⬠  ⬡           │  │  │
│  │  │                             │  │  │
│  │  └─────────────────────────────┘  │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

## Quick Start

```tsx
import { DomainSigil, EntityGlyph, ParticleIcon } from '@/components/shared';

// Domain-only sigil (Layer 1)
<DomainSigil domain="Starhaven Reaches" size={24} />

// Entity glyph with role (Layer 1 + 2)
<EntityGlyph 
  domain="The Gradient Throne" 
  entityClass="Herald" 
  size={18} 
/>

// Full entity with orbital (Layer 1 + 2 + 3)
<EntityGlyph 
  domain="The Lattice" 
  entityClass="Architect"
  showOrbital={true}
  size={24} 
/>

// Custom composition
<ParticleIcon
  domain="triangle"
  role="center"
  orbital="dots-3"
  color="202, 165, 84"
  size={24}
/>
```

## Layer 1: Domain Shapes

| Domain | Shape | Meaning |
|--------|-------|---------|
| Starhaven Reaches | △ Triangle | Ascension, direction, purpose |
| The Gradient Throne | ◇ Diamond | Stability, balance, foundation |
| The Lattice | ⬠ Pentagon | Pattern, structure, interconnection |
| The Threshold | ⬡ Hexagon | Gateway, boundary, transition |

## Layer 2: Role Modifiers

| Role | Modifier | Visual |
|------|----------|--------|
| Herald, Observer | `center` | Single dot at center |
| Keeper, Guardian | `inner-ring` | Small concentric circle |
| Weaver, Eigensage | `cross` | + axis through center |
| Voidwalker, Fatebinder | `diagonal` | × axis through center |
| Seeker, Wanderer | `corners` | Points at shape corners |
| Signal-Speaker | `edges` | Points at edge midpoints |
| Architect | `brackets` | Corner bracket marks |

## Layer 3: Orbital Elements

| Type | Description |
|------|-------------|
| `dots-3` | 3 surrounding points (triangular) |
| `dots-4` | 4 surrounding points (square) |
| `dots-6` | 6 surrounding points (hexagonal) |
| `spokes` | Radial lines extending outward |

## File Structure

```
icons/
├── core/
│   ├── GenerativeSigil.tsx    # ★ Algorithmic particle sigils (recommended)
│   ├── shapes.ts              # Geometric shape generators
│   └── ParticleIcon.tsx       # Core SVG renderer (legacy)
├── presets/
│   ├── GenerativeSigilPresets.ts  # Platform-specific DNA mappings
│   ├── DomainSigil.tsx            # Domain-specific presets
│   └── EntityGlyph.tsx            # Entity compositions
├── examples/
│   └── gallery.html           # Visual reference
└── README.md
```

## Adding New Domains

1. Add color to `DOMAIN_COLORS` in `DomainSigil.tsx`:
   ```tsx
   'New Domain': '123, 45, 67',
   ```

2. Add shape mapping to `DOMAIN_SHAPES`:
   ```tsx
   'New Domain': 'hexagon', // or triangle, square, pentagon
   ```

3. (Optional) Add shape generator in `shapes.ts` if needed.

## Adding New Roles

Add role to `ROLE_MODIFIERS` in `EntityGlyph.tsx`:

```tsx
'New Role': 'cross', // center, inner-ring, cross, diagonal, corners, edges, brackets
```

## Design Philosophy

The icon system embraces **"Thoughts to Form"**:

1. **Geometric Foundation**: Simple polygons (triangle, square, pentagon, hexagon) as base units. No organic curves.

2. **Layered Composition**: Like atomic structure — nucleus (domain), electron shell (role), orbital (entity). Each layer adds specificity.

3. **Instant Recognition**: Each domain shape is visually distinct. A triangle is never confused with a hexagon.

4. **Modular & Predictable**: Combining layers creates consistent results. Same role modifier looks similar across domains.

5. **Pixel-Perfect**: GRID=3 snapping ensures crisp rendering at all sizes.

## Color Palette (RGB Triplets)

```
Gold (Starhaven):     202, 165, 84
Silver (Gradient):    180, 200, 200
Blue-white (Lattice): 184, 196, 208
Amber (Threshold):    139, 115, 85
Dawn (default):       236, 227, 214
```

## Visual Examples

### Domain Only (Layer 1)
```
  △        ◇        ⬠        ⬡
 gold    silver   blue    amber
```

### With Role (Layer 1 + 2)
```
  △•       ◇+       ⬠×       ⬡○
center   cross   diagonal  ring
```

### Full Entity (Layer 1 + 2 + 3)
```
 ·△·      ·◇·
  •        +
 Herald  Weaver
 (dots)  (no orb)
```

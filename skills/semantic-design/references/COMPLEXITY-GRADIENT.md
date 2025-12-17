# Complexity Gradient

Brand elements exist on a spectrum from simple/rigid to complex/expressive. Each level has appropriate degrees of freedom.

---

## Part 1: Universal Framework

### The Gradient

```
TOKENS ──────► GRIDS ──────► COMPONENTS ──────► PARTICLES
simple                                           complex
rigid                                            expressive
use as specified                                 semantic logic guides
```

### Why This Matters

Design systems typically have two failure modes:

**Over-rigid:** Everything specified, no room for expression, outputs feel mechanical and lifeless.

**Under-rigid:** Everything flexible, brand coherence dissolves, outputs feel random.

The complexity gradient solves this by:
1. Specifying *where* rigidity lives (tokens)
2. Specifying *where* expression lives (particles)
3. Making the spectrum explicit

### The Four Levels

#### Level 1: Tokens

**What they are:** Atomic units—colors, fonts, spacing values, non-negotiable rules.

**Freedom:** None. Use exactly as specified.

**Why rigid:** Tokens are the DNA. Change a token, change everything downstream. Consistency requires constancy.

**Examples:**
- Color values (hex codes)
- Font families
- Base spacing unit
- Border-radius rule (0 for Thoughtform)
- Primary accent color

**Decision pattern:**
```
"What color should this button be?"
→ Look up token
→ Use token
→ Done
```

#### Level 2: Grids

**What they are:** Structural scaffolding—layout systems, navigation frames, positioning logic.

**Freedom:** Medium. Adapt to context but preserve relationships.

**Why semi-rigid:** Grids create rhythm and predictability. Breaking grid should be intentional, not accidental.

**Examples:**
- Page layout structures
- Navigation grid frames
- Content zones (where things go)
- Spacing between major sections

**Decision pattern:**
```
"Where should this panel go?"
→ Check grid system
→ Find appropriate zone
→ Place within zone
→ Adjust if content demands
```

#### Level 3: Components

**What they are:** Composed elements—cards, dialogs, buttons, panels.

**Freedom:** Medium. Compose from primitives, adapt structure to content.

**Why flexible:** Components serve content. Different content needs different structures. But components use tokens, so brand coherence is inherited.

**Examples:**
- Card layouts
- Dialog structures
- Navigation elements
- Data displays

**Decision pattern:**
```
"How should this card look?"
→ Start from component template
→ Compose using tokens
→ Adapt structure to content
→ Verify still feels like brand
```

#### Level 4: Particles

**What they are:** Living systems—motion, ambient effects, behavioral elements.

**Freedom:** High. Semantic logic guides, not pixel specs.

**Why expressive:** Particles make brands feel alive. Over-specification kills the organic quality. Better to specify *meaning* and let system express.

**Examples:**
- Particle systems (flow, clustering)
- Ambient animations
- Transition behaviors
- Interactive feedback

**Decision pattern:**
```
"How should particles behave here?"
→ What does this moment mean semantically?
→ What anchor does this activate?
→ Let meaning guide behavior
→ Tune by feel, not by spec
```

---

### Cross-Level Coherence

Each level inherits constraints from below:

```
PARTICLES
    ↓ use
COMPONENTS
    ↓ use
GRIDS
    ↓ use
TOKENS
```

- Components use Tokens (colors, fonts, spacing)
- Grids position Components
- Particles respect Grid boundaries
- Particles use Token colors

**Breaking upward inheritance breaks brand coherence.**

### Deciding Freedom Level

| Situation | Level | Freedom |
|-----------|-------|---------|
| "What color for this?" | Token | None—use specified |
| "Where does this go?" | Grid | Low—follow zones |
| "How should this card look?" | Component | Medium—compose |
| "How should this feel?" | Particle | High—semantic guidance |

**Default principle:** Start rigid (lower level), relax only when meaning requires it.

---

## Part 2: Thoughtform Tokens

The following are Thoughtform-specific token values. Use MCP tools for programmatic access:
- `thoughtform-design:get_design_tokens` — Full token sets
- `thoughtform-design:get_color_css` — CSS custom properties

### Colors

**Core Palette (All Platforms)**

| Token | Hex | Usage |
|-------|-----|-------|
| Void | `#0D0C0B` | Background, depth |
| Dawn | `#ECE3D6` | Primary text |
| Gold | `#CAA554` | Accent, highlights, interactive |

**Platform Accents**

| Platform | Accent | Hex |
|----------|--------|-----|
| Astrolabe | Gold | `#CAA554` |
| Atlas | Dawn | `#ECE3D6` |
| Ledger Dark | Verde | `#2B4E40` |
| Ledger Light | Teal | `#3D8B7A` |
| Marketing | Gold | `#CAA554` |

**Light Mode (Ledger Light only)**

| Token | Hex | Usage |
|-------|-----|-------|
| Paper | `#F0EFEC` | Background |
| Ink | `#3A3835` | Primary text |
| Signal | `#B85C4A` | Alert, negative |

**Opacity Variants**

Generate with token + opacity: `rgba(236, 227, 214, 0.3)` for Dawn at 30%.

Standard stops: 8%, 12%, 20%, 30%, 50%, 70%

### Typography

| Role | Font | Weight | Usage |
|------|------|--------|-------|
| Coordinates | PT Mono | 400 | Technical readouts, labels, navigation |
| Body (Astrolabe) | IBM Plex Sans | 400 | Prose, descriptions |
| Body (Atlas) | Crimson Pro | 400 | Scholarly, specimen text |
| Body (Ledger) | IBM Plex Mono | 400 | Terminal aesthetic |
| Headlines | PT Mono | 400-600 | Section headers |

**Type Scale**

| Token | Size | Usage |
|-------|------|-------|
| `--text-xs` | 9px | Micro labels |
| `--text-sm` | 10px | Secondary labels |
| `--text-base` | 11px | Default body |
| `--text-md` | 12px | Body, comfortable |
| `--text-lg` | 14px | Emphasis |
| `--text-xl` | 16px | Section headers |
| `--text-2xl` | 18px | Page headers |
| `--text-3xl` | 24px | Major headers |
| `--text-stat` | 32px | Hero statistics |

**Letter Spacing**

| Token | Value | Usage |
|-------|-------|-------|
| `--tracking-tight` | -0.01em | Large headlines |
| `--tracking-normal` | 0 | Body text |
| `--tracking-wide` | 0.05em | Small caps |
| `--tracking-wider` | 0.08em | Mono labels |
| `--tracking-widest` | 0.12em | Micro labels |

### Spacing

Base unit: **4px**

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | 4px | Tight internal |
| `--space-sm` | 8px | Related elements |
| `--space-md` | 12px | Component padding |
| `--space-lg` | 24px | Section separation |
| `--space-xl` | 48px | Major divisions |

### Geometry

**Non-negotiable:** `border-radius: 0` — Sharp corners everywhere. No exceptions.

**Border:** 1px solid, opacity varies by emphasis:
- Subtle: 8% opacity
- Normal: 12% opacity
- Emphasis: 20% opacity

### Animation

**Timing**

| Duration | Usage |
|----------|-------|
| 150ms | Default transitions |
| 200ms | Panel reveals |
| 300ms | Page transitions |
| 500ms+ | Dramatic moments |

**Easing**

| Type | Curve | Usage |
|------|-------|-------|
| Default | `ease` | Most transitions |
| Instrument | `cubic-bezier(0.16, 1, 0.3, 1)` | Snappy start, gentle settle |
| Organic | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Breathing, particle motion |

---

## Part 3: Thoughtform Grids

### Navigation Grid

The signature Thoughtform frame. Creates instrument-like viewport.

**Elements:**
- Corner brackets (define viewport bounds)
- Vertical rails (measurement, status)
- Scale ticks (position indication)

```
┌─                                                        ─┐
│                                                          │
│  0 ─┬─                                              ─┬─  │
│     │                                                │   │
│  2 ─┼─              [CONTENT AREA]                  ─┼─  │
│     │                                                │   │
│  5 ─┼─                                              ─┼─  │
│     │                                                │   │
│  7 ─┼─                                              ─┼─  │
│     │                                                │   │
│ 10 ─┴─  ARCHITECT                        LANDMARK   ─┴─  │
│         WANDERER              semantic terrain / ...     │
└─                                                        ─┘
```

**Semantic function:** Frame transforms content into "reading" on an instrument. User is operator, not just viewer.

**Customization variables:**
- `--grid-color`: Accent color
- `--corner-size`: Bracket size (40px default)
- `--rail-width`: Rail width (60px default)
- `--hud-padding`: Edge padding (32px default)

**When to use:** Full-page views, immersive interfaces, keynote slides.
**When to skip:** Embedded components, dialogs, dense data views.

### Content Grid

For positioning text, logos, navigation within the frame.

**Zones:**
- Top-left: Brand mark, breadcrumb
- Top-center: Primary navigation
- Top-right: Status indicators (SIGNAL %)
- Bottom-left: Current context, mode
- Bottom-right: Landmark, location

**Principle:** Corners and edges for navigation/status. Center for content.

---

## Part 4: Thoughtform Components

### Dialog/Panel

```
┌─────────────────────────────────────┐
│ ■ SECTION LABEL                     │
├─────────────────────────────────────┤
│                                     │
│  Title Text                         │
│                                     │
│  Body content goes here.            │
│  Can span multiple lines.           │
│                                     │
│  [ACTION]              [ACTION]     │
│                                     │
└─────────────────────────────────────┘
```

**Structure:**
- Gold square + label in header
- Sharp corners (always)
- Void background with subtle border
- Actions right-aligned or distributed

### Status Indicator

```
SIGNAL 74%
```

**Structure:**
- Label in PT Mono, muted
- Value in PT Mono, accent color
- Optional: percentage bar below

### Breadcrumb

```
THOUGHTFORM / MANIFESTO
```

**Structure:**
- Path in PT Mono uppercase
- Current section in accent color
- Separator: ` / `

### Diamond Markers

Rotated squares, not circles, for status indicators.

```css
.marker {
  width: 8px;
  height: 8px;
  transform: rotate(45deg);
  background: var(--accent);
}
```

---

## Part 5: Thoughtform Particles

The most complex and expressive layer. Semantic logic guides behavior.

### Principles

Particles are **living geometry**—they make the LIVING GEOMETRY anchor visible.

**Core behaviors:**
- Particles have position in semantic space
- Movement follows meaning vectors
- Clustering reflects conceptual proximity
- Flow direction has semantic content

### Platform Dialects

**Astrolabe:**
- Flow along diagonal axes (Vector I)
- Gold color, warm glow
- Represents documents/concepts as navigable points
- Calm, deliberate motion

**Atlas:**
- Radial emanation from entity centers
- Bioluminescent character
- Represents entity "radiation" or presence
- Organic, breathing rhythm

**Ledger Dark:**
- Horizontal flow (data movement)
- Verde color with trails
- Represents transactions, data streams
- Faster, data-flow rhythm

**Ledger Light:**
- Clustered topology
- Teal markers
- Represents spending patterns
- Static with subtle pulse

**Marketing:**
- Scattered symbols (Greek letters, math)
- Gathering toward focal points
- Represents meaning crystallizing
- Dramatic timing, scroll-triggered

### Parameters

| Parameter | Semantic Meaning |
|-----------|------------------|
| Density | Information richness |
| Velocity | Rate of change, activity |
| Direction | Semantic vector, trend |
| Clustering | Conceptual grouping |
| Glow/Trail | Emphasis, recency |

### Implementation

Canvas rendering with **3px grid quantization** (non-negotiable).

```javascript
// Snap to GRID=3
const GRID = 3;
const snappedX = Math.round(x / GRID) * GRID;
const snappedY = Math.round(y / GRID) * GRID;

// Particle structure
particle = {
  x, y,           // Screen position (snapped)
  vx, vy,         // Velocity
  semantic: {     // Meaning coordinates
    concept: [...embedding...],
    intensity: 0.8,
    cluster: 'navigation'
  }
}
```

**Particles respond to:**
- User focus (gather toward attention)
- Semantic events (pulse on resonance discovery)
- Scroll position (marketing: reveal on scroll)
- Time (breathing, drift)

---

*Tokens are vocabulary. Grids are grammar. Components are sentences. Particles are poetry.*

# Complexity Gradient

Brand elements exist on a spectrum from simple/rigid to complex/expressive. Each level has appropriate degrees of freedom.

```
TOKENS ──────► GRIDS ──────► COMPONENTS ──────► PARTICLES
simple                                           complex
rigid                                            expressive
use as specified                                 semantic logic guides
```

---

## Level 1: Tokens

The atomic units. Use exactly as specified.

### Colors

Access via `thoughtform-design:get_color_css` for platform-specific values.

**Core palette (all platforms):**

| Token | Hex | Usage |
|-------|-----|-------|
| Void | `#0D0C0B` | Background, depth |
| Dawn | `#ECE3D6` | Primary text |
| Gold | `#CAA554` | Accent, highlights, interactive |

**Platform accents:**

| Platform | Accent | Hex |
|----------|--------|-----|
| Astrolabe | Gold | `#CAA554` |
| Atlas | Gold | `#CAA554` |
| Ledger | Verde | `#2DD4BF` |
| Marketing | Gold | `#CAA554` |

**Opacity variants:** 30%, 50%, 70% for layered depth.

### Typography

| Role | Font | Weight | Usage |
|------|------|--------|-------|
| Data/Coordinates | PT Mono | 400 | Technical readouts, labels, navigation |
| Body | IBM Plex Sans | 400 | Prose, descriptions |
| Headlines | IBM Plex Sans | 600 | Section headers |
| Mono (Ledger) | IBM Plex Mono | 400 | Terminal aesthetic |

**Sizes:** Use platform tokens. Generally: 9px labels, 12px body small, 14px body, 18px headers.

### Spacing

Base unit: 4px

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | 4px | Tight internal |
| `--space-sm` | 8px | Related elements |
| `--space-md` | 12px | Component padding |
| `--space-lg` | 24px | Section separation |
| `--space-xl` | 48px | Major divisions |

### Geometry

**Non-negotiable:** `border-radius: 0` — Sharp corners everywhere. No exceptions.

**Border:** 1px solid, opacity varies by emphasis.

---

## Level 2: Grids

Structural scaffolding. Adapt to context but preserve relationships.

### Navigation Grid

The signature Thoughtform frame. Creates instrument-like viewport.

**Elements:**
- Corner brackets (define viewport bounds)
- Vertical rails (measurement, status)
- Scale ticks (position indication)

**Semantic function:** Frame transforms content into "reading" on an instrument. User is operator, not just viewer.

**Implementation:** See `assets/navigation-grid.css`

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

**Principle:** Corners and edges are for navigation/status. Center is for content.

### Entity Grid (Atlas)

For positioning entity cards in constellation view.

**Behavior:**
- Cards positioned by semantic coordinates
- Dotted lines connect related entities
- Clustering emerges from embedding proximity
- Zoom affects density, not position logic

---

## Level 3: Components

Composed from tokens and grids. Medium freedom—adapt structure to content.

### Entity Card (Atlas)

```
┌────────────────────────┐
│                        │
│      [ENTITY IMAGE]    │
│                        │
├────────────────────────┤
│ ENTITY NAME            │
│ Epithet / Short desc   │
├────────────────────────┤
│ TYPE: ████████  THREAT │
│ ABUNDANCE  █  PHASE    │
└────────────────────────┘
```

**Structure:**
- 4:5 aspect ratio image
- Name in PT Mono, bold
- Epithet in IBM Plex Sans, muted
- Parameter bar with gradient indicators

### Dialog/Panel

```
┌─────────────────────────────┐
│ ■ SECTION LABEL             │
├─────────────────────────────┤
│                             │
│  Title Text                 │
│                             │
│  Body content goes here.    │
│  Can span multiple lines.   │
│                             │
│  [ACTION]      [ACTION]     │
│                             │
└─────────────────────────────┘
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

---

## Level 4: Particles

The most complex and expressive layer. Semantic logic guides behavior.

### Particle System Principles

Particles are **living geometry**—they make the LIVING GEOMETRY anchor visible.

**Core behaviors:**
- Particles have position in semantic space
- Movement follows meaning vectors
- Clustering reflects conceptual proximity
- Flow direction has semantic content

### Platform Particle Dialects

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

**Ledger:**
- Horizontal flow (money movement)
- Verde/teal color with trails
- Represents transactions, data streams
- Faster, data-flow rhythm

**Marketing:**
- Scattered symbols (Greek letters, math)
- Gathering toward focal points
- Represents meaning crystallizing
- Dramatic timing, scroll-triggered

### Particle Parameters

| Parameter | Meaning |
|-----------|---------|
| Density | Information richness |
| Velocity | Rate of change, activity |
| Direction | Semantic vector, trend |
| Clustering | Conceptual grouping |
| Glow/Trail | Emphasis, recency |

### Implementation Notes

Canvas rendering with 3px grid quantization (non-negotiable).

**Basic structure:**
```javascript
// Particle has semantic position
particle = {
  x, y,           // Screen position
  vx, vy,         // Velocity
  semantic: {     // Meaning coordinates
    concept: [...embedding...],
    intensity: 0.8,
    cluster: 'navigation'
  }
}
```

Particles respond to:
- User focus (gather toward attention)
- Semantic events (pulse on resonance discovery)
- Scroll position (marketing: reveal on scroll)
- Time (breathing, drift)

---

## Cross-Level Coherence

Each level inherits constraints from below:

- **Components** use **Tokens** (colors, fonts, spacing)
- **Grids** position **Components**
- **Particles** respect **Grid** boundaries
- **Particles** use **Token** colors

Breaking upward inheritance breaks brand coherence.

---

## Deciding Freedom Level

| Situation | Level | Freedom |
|-----------|-------|---------|
| "What color for this button?" | Token | Low—use Gold |
| "How to lay out this page?" | Grid | Medium—follow patterns |
| "How should this card look?" | Component | Medium—compose from primitives |
| "How should particles behave here?" | Particle | High—semantic logic guides |

When uncertain, start rigid (lower level) and relax only when meaning requires it.

---

*Tokens are vocabulary. Grids are grammar. Components are sentences. Particles are poetry.*


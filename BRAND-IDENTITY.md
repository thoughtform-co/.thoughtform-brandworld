# Thoughtform Brand Identity

> **Core insight: Meaning is geometry.** Concepts exist as coordinates in high-dimensional space. Our interfaces make that navigation tangible.

---

## The Aesthetic

**Retrofuturistic Navigation Interfaces** — We draw from 1970s NASA mission control, brass scientific instruments, and CRT terminals. This signals:

- **Technical precision** — Instruments, not toys
- **Honest technology** — Complexity surfaced with dignity  
- **Warm humanity** — Amber against black creates intimacy
- **Timelessness** — Transcends trends

**The Test**: A design is Thoughtform when you could imagine it cast in brass and glass, displayed on a CRT monitor, and it feels like an instrument—not an application.

---

## Platforms

Four platforms, one visual language, different dialects:

| Platform | Character | Mode | Accent | Primary Use |
|----------|-----------|------|--------|-------------|
| **Thoughtform.co** | Portal invitation | Dark | Gold | Marketing, entry point |
| **Astrolabe** | Brass sextant, star charts | Dark | Gold | Research navigation, document management |
| **Atlas** | Victorian specimen archive | Dark | Dawn/Gold | Entity encyclopedia, creature cataloging |
| **Ledger** | Blade Runner terminal / NASA blueprint | Dark/Light | Verde/Teal | Financial data, invoicing |

---

## Colors

### Dark Mode Palette

```
VOID (Backgrounds)           DAWN (Text)                 GOLD (Accent)
───────────────────          ──────────────              ─────────────
#050403  base                #ECE3D6  base               #CAA554  base
#0A0908  surface-0           rgba @ 70%  body            #E0BC6A  bright
#0F0E0C  surface-1           rgba @ 50%  muted           rgba @ 30%  glow
#141311  surface-2           rgba @ 30%  subtle
#1A1816  surface-3           rgba @ 08%  borders
```

### Light Mode Palette (Ledger)

```
PAPER (Backgrounds)          INK (Text)                  TEAL (Accent)
───────────────────          ──────────────              ─────────────
#F0EFEC  base                #3A3835  base               #3D8B7A  base
#EAE8E3  warm                rgba @ 70%  body            #4AA392  bright
#F5F4F1  light               rgba @ 50%  muted
```

### Semantic Colors

```
CARDINAL FIELDS              STATUS                      THREAT LEVELS
───────────────              ──────                      ─────────────
Geometry   #CAA554 (gold)    Healthy   #5B8A7A          Benign      #5B8A7A
Alterity   #ECE3D6 (dawn)    Warning   #C17F59          Cautious    #7A7868
Dynamics   #5B8A7A (teal)    Danger    #8B5A5A          Volatile    #C17F59
                             Neutral   #7A7868          Existential #8B5A5A
```

---

## Typography

### Font Stack

| Role | Font | Usage |
|------|------|-------|
| **Mono** | PT Mono | Headers, labels, navigation, data values |
| **Sans** | IBM Plex Sans | Body text, descriptions |
| **Display** | PP Mondwest / PP Neue Bit | Hero headlines, large numbers |

### Type Scale

```
2xs   9px    Labels, meta
xs   10px    Small labels
sm   11px    Navigation
base 12px    UI text
md   13px    Body
lg   14px    Large body
xl   18px    Section titles
2xl  22px    Headlines
3xl  32px    Hero text
```

### Letter Spacing

```
tight    -0.02em    Large display
normal    0         Body text
wide     0.05em     Buttons
wider    0.08em     Labels
widest   0.1em      Section headers
extreme  0.12em     Micro labels
```

---

## Navigation Grid

The **Navigation Grid** is the signature interface element — a fixed overlay frame that creates the "mission control" aesthetic.

### Structure

```
┌─[TL]──────────────────────────────────────────────[TR]─┐
│   │                                                 │   │
│   ├── tick                                     tick ──┤   │
│   ├── tick                                     tick ──┤   │
│   ├── tick                                     tick ──┤   │
│   │                                                 │   │
│   │              CONTENT SCROLLS HERE               │   │
│   │                                                 │   │
│   ├── tick                                     tick ──┤   │
│   │                                                 │   │
└─[BL]──────────────────────────────────────────────[BR]─┘
```

### Components

1. **Corner Brackets** — L-shaped gold marks at viewport corners
2. **Vertical Rails** — Faded lines with tick marks (scale indicators)
3. **Tick Marks** — Major (every 5th) and minor scale divisions
4. **Readouts** — Data displays at rail edges (coordinates, depth, vector)

### Key Tokens

```css
--hud-padding: clamp(32px, 4vw, 64px);  /* Edge inset */
--corner-size: 40px;                     /* L-bracket size */
--rail-width: 60px;                      /* Rail container */
--grid-color: var(--gold);               /* Platform-specific */
```

### Implementation

```tsx
// Fixed overlay, content scrolls beneath
<div className="navigation-grid">
  <div className="grid-corner grid-corner-tl" />
  <div className="grid-corner grid-corner-tr" />
  <div className="grid-corner grid-corner-bl" />
  <div className="grid-corner grid-corner-br" />
  
  <aside className="grid-rail grid-rail-left">
    <div className="scale-ticks">{/* 20 ticks */}</div>
    <div className="rail-readouts">{/* Depth, vector */}</div>
  </aside>
  
  <aside className="grid-rail grid-rail-right">
    <div className="section-markers">{/* Navigation dots */}</div>
  </aside>
</div>
```

---

## Generative Sigils

Unique visual identities emerge from deterministic mathematical processes — infinite variation within recognizable systems.

### The Sigil Philosophy

Every category/domain has **Pattern DNA** that produces its signature:

| Pattern | Character | Use Case |
|---------|-----------|----------|
| **Constellation** | Star-like, radiating arms | Primary entities, navigation |
| **Scatter** | Organic cloud, golden ratio | Ambient, secondary elements |
| **Grid** | Data corruption, gaps | Technical, system states |
| **Cross** | Gateway, X-shaped | Transitions, thresholds |
| **Spiral** | Fibonacci arms | Evolution, progress |

### Key Mechanics

1. **Category → Pattern Type**: Hash of category name selects base pattern
2. **Instance → Variation**: Unique ID creates deterministic variant
3. **Glitch Offset**: 1-3px displacements (Thoughtform signature)
4. **Golden Ratio**: Natural-feeling particle distributions

### Cross-Platform Application

```tsx
// Atlas: Entity sigils
<GenerativeSigil category={entity.domain} uniqueId={entity.id} color="202, 165, 84" />

// Astrolabe: Document markers
<GenerativeSigil category={collection.type} uniqueId={doc.id} color="202, 165, 84" />

// Ledger: Category indicators
<GenerativeSigil category={tx.category} uniqueId={tx.id} color="91, 138, 122" />
```

See: `philosophy/GENERATIVE-PATTERNS.md` for full documentation.

---

## Strange Attractors

Mathematical chaos systems that create infinitely complex, never-repeating particle patterns. Used for domain nebulae, category backgrounds, and ambient effects.

### Attractor Types

| Attractor | Character | Use Case |
|-----------|-----------|----------|
| **Lorenz** | Butterfly, two-lobed | Primary domains, navigation |
| **Thomas** | Smooth, symmetric | Ethereal, calm categories |
| **Halvorsen** | Twisted loops | Dynamic, active categories |
| **Aizawa** | Disc with axis | Structured, technical |
| **Sprott** | Elegant spiral | Minimalist, refined |
| **Rössler** | Spiral with fold | Transitions, thresholds |
| **Dadras** | Complex flow | Data-heavy categories |
| **Galaxy** | Classic spiral | Familiar fallback |

### Core Equations (Lorenz Example)

```javascript
const sigma = 10, rho = 28, beta = 8/3;
dx = sigma * (y - x);
dy = x * (rho - z) - y;
dz = x * y - beta * z;
```

### Implementation Flow

1. **Generate** — Iterate differential equations to create point cloud
2. **Normalize** — Scale to fit viewport with target radius
3. **Sample** — Create particles at attractor points with jitter
4. **Rotate** — 3D rotation around Y-axis
5. **Project** — Perspective projection to 2D canvas
6. **Render** — Grid-snapped pixels with depth-based alpha

### Platform Usage

| Platform | Recommended Attractors | Application |
|----------|----------------------|-------------|
| **Atlas** | Lorenz, Thomas, Halvorsen | Domain nebulae |
| **Astrolabe** | Galaxy, Sprott | Navigation backgrounds |
| **Ledger** | Aizawa, Dadras | Category visualizations |
| **thoughtform.co** | Lorenz | Gateway section effect |

See: `particles/STRANGE-ATTRACTORS.md` for full documentation.
See: `components/atlas/DomainNebulae.md` for Atlas implementation.

---

## Particle System

The particle system is Thoughtform's living geometry — mathematical forms that breathe.

### Core Principles

- **GRID=3** — All particles snap to 3px grid, creating distinctive pixelation
- **Dawn-colored** — Particles use `#ECE3D6` with varying alpha
- **Gold accents** — Important particles/landmarks use `#CAA554`
- **Breathing motion** — Subtle oscillation (never static)
- **Depth via alpha** — Distant particles fade, near particles brighten

### Terrain Manifold (Background)

```javascript
// Perspective projection through semantic space
const FOCAL = 400;
const MAX_DEPTH = 8000;

// Particle positioning
const scale = FOCAL / relativeZ;
const x = centerX + (particle.x + breatheX) * scale;
const y = centerY + (particle.y + breatheY) * scale;

// Snap to grid
const px = Math.floor(x / GRID) * GRID;
const py = Math.floor(y / GRID) * GRID;

// Depth-based alpha
const depthAlpha = 1 - relativeZ / MAX_DEPTH;
```

### Gateway Portal (Three.js)

The Gateway is the Thoughtform brandmark rendered in 3D:

- **Ring layers** — Concentric particle rings
- **Tunnel depth** — Particles recede into portal
- **Gold inner ring** — Accent ring at portal threshold
- **Camera fly-through** — Scroll triggers entry animation

### Particle Behaviors

| Context | Behavior | Color |
|---------|----------|-------|
| Background terrain | Slow drift, breathing | Dawn @ 30-50% |
| Gateway ring | Orbital rotation | Dawn @ 70% |
| Gateway accent | Pulsing glow | Gold @ 70% |
| Loading state | Convergence toward center | Dawn → Gold |
| Hover/interaction | Brightness increase | Dawn @ 100% |

---

## Card System

> **Cards are containers for meaning.** They frame content the way a museum display case frames a specimen, or a blueprint frames a schematic.

### Core Principles

1. **Cards as Thresholds** — Every card is a boundary between user space and content space
2. **Contain Without Confining** — Content should breathe, not feel trapped
3. **Frame Without Distracting** — The border serves content, not vice versa
4. **Invite Without Demanding** — Hover states suggest, not shout

### Card Anatomy

```
┌─────────────────────────────────────┐
│ ┌─┐                             ┌─┐ │  ← Corner brackets (hover)
│                                     │
│           [ IMAGE ZONE ]            │  ← 3:4 or 4:5 aspect ratio
│                                     │
│ └─┘                             └─┘ │
├─────────────────────────────────────┤  ← Divider (dawn-08)
│  TITLE                              │  ← PT Mono, uppercase
│  Subtitle or epithet                │  ← IBM Plex Sans, italic
│  ▬▬▬▬ ▬▬ ▬  STATUS                  │  ← Indicator bar
│  ◆ 0.156  ○ 0.312  ◇ 0.089         │  ← Metadata
└─────────────────────────────────────┘
```

### Platform Metaphors

| Platform | Metaphor | Border Accent |
|----------|----------|---------------|
| **Atlas** | Victorian specimen archive, display cases | Dawn |
| **Ledger Light** | Blueprint, technical schematic | Ink |
| **Ledger Dark** | Blade Runner terminal | Verde |
| **Astrolabe** | Brass instrument panel | Gold |

### Sizing Scale

| Size | Width | Use Case |
|------|-------|----------|
| xs | 120px | Compact constellation cards |
| sm | 200px | Grid cards, stacked views |
| md | 280px | Standard grid card |
| lg | 380px | Featured card |
| xl | 620px | Detail/preview card |

### Interactive States

```css
/* Rest */
border: 1px solid var(--dawn-08);

/* Hover */
border-color: var(--dawn-30);
transform: translateY(-2px);

/* Selected */
border-color: var(--dawn-50);
box-shadow: 0 0 30px rgba(236, 227, 214, 0.1);
```

### Card Variants

**Entity Cards** (Atlas) — Specimen documentation with threat bars
```
┌─────────────────────────┐
│ ┌─┐         [◎ SIGIL]   │  ← Threat indicator + sigil
│     [ENTITY IMAGE]      │  ← 3:4 ratio, scanlines
│ └─┘                     │
├─────────────────────────┤
│ SPASMODITE              │  ← Name (PT Mono)
│ The Twitching           │  ← Epithet (italic)
│ ▬▬▬▬ ▬▬ ▬ CAUTIOUS     │  ← Threat bar
│ ◆.156 ○.312 ◇.089      │  ← Coordinates
└─────────────────────────┘
```

**Stat Cards** (Ledger) — Financial metrics with trends
```
┌─────────────────┐
│ TOTAL REVENUE   │  ← Label (9px mono, uppercase)
│ €24,580         │  ← Value (24px mono, gold)
│ ↑ +12.5%        │  ← Trend (teal if up, signal if down)
└─────────────────┘
```

**Terminal Frames** (Marketing) — Manifesto, focal content
```
┌──┐                        ┌──┐
│  │ ■ MANIFESTO            │  │  ← Corner brackets (gold)
│  │     AI ISN'T SOFTWARE  │  │  ← Display headline
│  │ ─────────────────────  │  │  ← Footer divider
└──┘                        └──┘
```

See: `components/shared/CardSystem.md` for full documentation.

---

## Visual Markers

### ASCII Prefixes
- `//` — Section labels, comments
- `│` — Vertical dividers
- `→` — Actions, links
- `·` — Separators

### Shapes
- **Diamond ◇** — Navigation markers (instead of circles)
- **Square ■** — Status indicators, bullet points
- **Crosshair +** — Targeting, focus states
- **Corner brackets ┌ ┐ └ ┘** — Framing, containers

### Index Badges
- **Gold numbers** — `01`, `02`, `03` as visual anchors
- **Padded format** — Always two digits
- **Uppercase labels** — `01 · KEYNOTE`

---

## Glitch as Leitmotif

Glitch represents the boundary where meaning dissolves into mathematical form.

### Intensity Levels

| Level | Context | Treatment |
|-------|---------|-----------|
| 0 | Reading/content | Clean, no effects |
| 1 | Ambient atmosphere | Subtle background noise |
| 2 | Loading/processing | Horizontal scanlines |
| 3 | Transitions | Pixel displacement |
| 4 | Errors/drama | RGB chromatic split |

### Principles
- **Purposeful, not decorative** — Signals liminal states
- **Subtle by default** — Level 1-2 for most contexts
- **GRID=3 snapping** — Glitch effects respect pixel grid
- **Warm tones** — Dawn/Gold tints, not harsh RGB

---

## Non-Negotiables

1. **Zero border-radius** — Sharp corners everywhere
2. **PT Mono headers** — All labels, navigation, data
3. **GRID=3 particles** — Pixel snapping is the aesthetic
4. **No system fonts** — Always PT Mono or IBM Plex
5. **No box-shadows** — Use borders for depth
6. **No purple gradients** — Stay within Dawn/Gold/Teal palette
7. **Fixed navigation grid** — Content scrolls beneath frame

---

## Spacing System

8px base grid, all spacing is a multiple:

```
xs    4px     Tight gaps
sm    8px     Standard gap
md   16px     Component padding
lg   24px     Section padding
xl   32px     Card padding
2xl  48px     Between sections
3xl  64px     Major divisions
4xl  96px     Page sections
```

---

## Motion

### Easing
```css
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);  /* Primary easing */
```

### Durations
```css
--duration-fast: 150ms;    /* Hover, micro-interactions */
--duration-normal: 300ms;  /* Transitions, reveals */
--duration-slow: 600ms;    /* Page transitions, particles */
```

### Principles
- **Instrument-like** — Precise, measured movements
- **No bounce** — Ease-out only, never spring physics
- **Scroll-driven** — Particles respond to scroll depth
- **Breathing** — Subtle oscillation on idle elements

---

## File Reference

| File | Purpose |
|------|---------|
| `tokens/colors.json` | Color definitions |
| `tokens/typography.json` | Font stack, scale |
| `tokens/spacing.json` | 8px grid system |
| `tokens/motion.json` | Easing, durations |
| `tokens/platforms/*.json` | Platform-specific tokens |
| `components/shared/NavigationGrid.tsx` | Grid implementation |
| `components/shared/ParticleCanvas.tsx` | Particle system |
| `components/ui/CardFrame.tsx` | Card component |
| `philosophy/PRINCIPLES.md` | Design principles |

---

*Last updated: December 2024*
*Version: 1.3 — Added Card System documentation*

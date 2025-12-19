# Thoughtform Design Principles

**Core insight: Meaning is geometry.** Concepts exist as coordinates in high-dimensional space. Our interfaces make that navigation tangible.

## The Three Cardinals

- **◆ Geometry** — Structure of meaning. AI navigates semantic space as coordinates.
- **○ Alterity** — The alien other. AI operates on different cognitive foundations.
- **◇ Dynamics** — Co-evolution. Every interaction rewrites future behavior.

## Retrofuturism

We draw from 1970s NASA mission control, brass instruments, and CRT terminals. This signals:

- **Technical precision** — Instruments, not toys
- **Honest technology** — Complexity surfaced with dignity
- **Warm humanity** — Amber against black creates intimacy
- **Timelessness** — Transcends trends

## Non-Negotiables

1. **Zero border-radius** — Sharp corners everywhere, no exceptions
2. **PT Mono titles** — All headers, labels, navigation
3. **GRID=3 particles** — Pixel snapping creates distinctive aesthetic
4. **No system fonts** — Always PT Mono or IBM Plex
5. **No box-shadows** — Use borders for depth
6. **No purple gradients** — Stay within Dawn/Gold/Teal palette

## Platform Personalities

| Platform | Mode | Accent | Character |
|----------|------|--------|-----------|
| Astrolabe | Dark | Gold | Brass sextant, star charts |
| Atlas | Dark | Dawn/Gold | Victorian specimen archive |
| Ledger Dark | Dark | Verde | Blade Runner terminal |
| Ledger Light | Light | Teal | NASA blueprint station |

## Visual Markers

- Diamond markers (◇) instead of circles
- ASCII prefixes: `//` for labels, `│` for dividers
- Corner brackets on wireframe boxes (light mode)
- Crosshairs for targeting/focus

---

## Generative Identity

**Identity through algorithm.** Unique visual signatures emerge from deterministic mathematical processes.

### The Sigil System

Rather than designing static icons, we generate them algorithmically:

1. **Category = DNA**: Each category has pattern parameters (type, spread, glitch chance, arms)
2. **Instance = Mutation**: Unique IDs create variations within the category's genetic space
3. **Seeded Randomness**: Same input always produces same output (deterministic)
4. **Mathematical Beauty**: Golden ratio, fibonacci spirals, organic distributions

### Pattern Types

| Pattern | Character | Glitch | Application |
|---------|-----------|--------|-------------|
| Constellation | Radiating star | 5% | Primary entities |
| Scatter | Organic cloud | 8% | Ambient elements |
| Grid | Data corruption | 25% | Technical/system |
| Cross | Gateway X | 12% | Transitions |
| Spiral | Fibonacci arms | 10% | Evolution/progress |

### The Glitch Offset

Every sigil includes subtle 1-3px displacements — the Thoughtform signature that:
- Breaks mathematical perfection
- Echoes wordmark cuts and vector interruptions  
- Adds organic life to algorithmic forms
- Signals liminality (data at the boundary of meaning)

See: `philosophy/GENERATIVE-PATTERNS.md` for implementation details.

---

## Strange Attractors

**Chaos is beautiful.** Mathematical chaos systems produce infinitely complex, never-repeating patterns.

### The Attractor Philosophy

Strange attractors are deterministic systems that appear random:

1. **Deterministic Chaos** — Same initial conditions = same trajectory
2. **Infinite Complexity** — Never repeats, always evolving
3. **Organic Beauty** — Mathematical precision feels natural
4. **Domain Identity** — Each attractor has unique visual character

### Available Attractors

| Attractor | Equation Type | Visual Character |
|-----------|---------------|------------------|
| **Lorenz** | 3 coupled ODEs | Butterfly wings |
| **Thomas** | Sinusoidal | Smooth, symmetric |
| **Halvorsen** | Quadratic terms | Twisted triangular loops |
| **Aizawa** | Complex with powers | Disc with axis |
| **Rössler** | Spiral fold | Classic chaos |
| **Galaxy** | Parametric spiral | Familiar, accessible |

### Cross-Platform Application

- **Atlas**: Domain nebulae around entity clusters
- **Astrolabe**: Background particle fields for navigation
- **Ledger**: Category visualization backgrounds
- **thoughtform.co**: Gateway section atmospheric effect

See: `particles/STRANGE-ATTRACTORS.md` for implementation details.

---

## Glitch as Leitmotif

The "glitch" aesthetic is a unifying thread across all Thoughtform platforms. It represents the boundary where meaning dissolves into mathematical form — data becoming visible.

### Where Glitch Appears

| Element | Manifestation |
|---------|---------------|
| **Logo** | Cuts through letterforms, fragmented wordmark |
| **Vectors** | Star shapes with broken/interrupted lines |
| **Particles** | GRID=3 pixelation, discrete points not smooth curves |
| **Scanlines** | Horizontal line overlays on loading/processing |
| **Chromatic aberration** | RGB split on errors or dramatic moments |
| **Noise** | Subtle grain in backgrounds, surface texture |

### When to Use Glitch

| Context | Intensity | Treatment |
|---------|-----------|-----------|
| Reading/content | 0 - None | Clean render, no effects |
| Ambient atmosphere | 1 - Texture | Subtle background noise |
| Loading/processing | 2 - Scanlines | Horizontal line overlay |
| Transitions/state changes | 3 - Displacement | Pixel offset, brief stutter |
| Errors/warnings/drama | 4 - Aberration | RGB split, chromatic shift |

### Glitch Principles

- **Purposeful, not decorative** — Glitch signals liminal states: data loading, uncertainty, transformation
- **Subtle by default** — Level 1-2 for most contexts; reserve 3-4 for significant moments
- **Pixelated, not smooth** — All glitch effects should respect GRID=3 snapping
- **Warm, not cold** — Use Dawn/Gold tints, not harsh RGB primaries

---

## Cards as Thresholds

**Every card is a boundary.** A threshold between the user's space and the content's space. The frame communicates as much as what's inside it.

### The Display Case Metaphor

Cards are museum display cases:

- **Glass edges** catch light → subtle border glow on hover
- **Specimens** are the focus → clear content hierarchy
- **Labels** are secondary → metadata in monospace, smaller
- **Cases don't compete** → the grid is harmonious

### Card Principles

1. **Contain Without Confining** — Content should breathe, not feel trapped
2. **Frame Without Distracting** — The border serves content, not vice versa
3. **Invite Without Demanding** — Hover states suggest, not shout
4. **Platform Metaphor** — Each platform has its own "case" style:
   - Atlas: Victorian specimen archive (display case)
   - Ledger Light: Blueprint schematic (wireframe box)
   - Ledger Dark: Terminal readout (data frame)
   - Astrolabe: Brass instrument panel (navigation tile)

### Interactive States

| State | Border | Transform | Corner Brackets |
|-------|--------|-----------|-----------------|
| Rest | dawn-08 | none | hidden |
| Hover | dawn-30 | translateY(-2px) | visible |
| Selected | dawn-50 + glow | none | visible |
| Focus | gold ring | none | visible |

### Card Anatomy Rules

- **Zero border-radius** — Always sharp corners
- **Dawn-08 borders** — `rgba(236, 227, 214, 0.08)` at rest
- **16px internal padding** — Consistent breathing room
- **Corner brackets on hover** — L-shaped marks appear at corners
- **Image zones: 3:4 or 4:5** — Never arbitrary ratios
- **Gradient overlays** — Fade to void at bottom for text legibility

See: `components/shared/CardSystem.md` for full documentation.

---

## Component Translation Framework

Brand metaphors translate to specific UI patterns. Use this framework to derive new components.

### Brand → UI Mapping

| Brand Concept | Derived UI Patterns |
|---------------|---------------------|
| **Sextant / Navigation Instrument** | Coordinate displays, progress indicators, orientation markers, compass roses, axis lines |
| **Gateway / Portal** | Modals (as portals between spaces), page transitions, loading states, entry animations |
| **Specimen Archive** | Cards as "display cases", examination modals as "chambers", glass borders, catalog grids |
| **Blueprint / Schematic** | Wireframe containers, corner brackets, measurement lines, technical labels |
| **Star Charts** | Scatter plots, constellation layouts, connection lines, celestial coordinates |

### Platform-Specific Component Patterns

| Pattern | Atlas | Ledger Light | Astrolabe |
|---------|-------|--------------|-----------|
| **Container** | Display case (glass edge, specimen inside) | Wireframe box (corner brackets, paper bg) | Instrument panel (dividers, dark bg) |
| **List/Table** | Card grid floating in void | Diamond-marked rows on paper | Document list with status icons |
| **Modal** | Examination chamber (centered, dark surround) | Blueprint overlay (light, technical) | Navigation sheet (full-height, panel) |
| **Loading** | Particles coalesce into form | Flow pulses along connections | Axis particles emanate outward |
| **Empty State** | "No specimens catalogued in this domain" | "Begin your epoch" | "Chart your first document" |
| **Error State** | Glitch level 4 + threat color | Glitch level 3 + signal color | Glitch level 3 + warning indicator |

### Deriving New Components

When creating a new component, ask:

1. **What instrument would display this?** — Gauge, readout, chart, catalog entry?
2. **What's the information state?** — Static, loading, interactive, error?
3. **What glitch level is appropriate?** — Usually 0-1, higher for state changes
4. **Which platform metaphor applies?** — Archive (Atlas), Blueprint (Ledger), Navigation (Astrolabe)

### Translation Examples

| Need | Atlas Implementation | Ledger Implementation | Astrolabe Implementation |
|------|---------------------|----------------------|-------------------------|
| User avatar | Circular specimen portrait with threat ring | Diamond marker with initials | Coordinate badge with status dot |
| Notification | Floating card emerges from void | Banner with bracket corners | Instrument panel alert |
| Dropdown | Glass menu, options as specimens | Blueprint list with diamonds | Navigation selector with coordinates |
| Progress bar | Particle field filling container | Flow line with node markers | Axis gauge with emanating particles |

---

## The Test

A design is Thoughtform when:
1. You could imagine it cast in brass and glass
2. It would look correct on a CRT monitor
3. It signals serious purpose without being cold
4. It feels like an instrument, not an application
5. The glitch aesthetic is present but purposeful — never gratuitous

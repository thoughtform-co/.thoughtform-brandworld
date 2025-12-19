# Thoughtform Brandworld

A semantic design system for all Thoughtform platforms: Astrolabe, Atlas, Ledger, and thoughtform.co.

**Key insight:** Traditional brand guidelines *restrict*. Semantic brand systems *interpret*. We define meanings, not just aesthetics.

---

## Navigation

| Layer | Purpose | Start Here |
|-------|---------|------------|
| **[semantic/](semantic/)** | Meaning layer — anchors, translations, dialects | Understanding the brand |
| **[systems/](systems/)** | Primitives — structure (4px), signal (3px), typography | Building components |
| **[registry/](registry/)** | Asset catalog — machine-readable source of truth | Finding existing patterns |
| **[references/](references/)** | Reference library — inspiration with semantic metadata | Adding new references |
| **[tokens/](tokens/)** | Token values — colors, spacing, motion | Getting exact values |
| **[components/](components/)** | Component implementations — React/TSX code | Copy-paste ready code |
| **[particles/](particles/)** | Particle system — GRID=3 renderer, attractors | Ambient effects |
| **[philosophy/](philosophy/)** | Design philosophy — principles, vision | Deep understanding |

---

## The Semantic Design Workflow

```
Reference → Anchor Scoring → Translation Selection → Physical Pattern → Implementation
```

1. **Score the reference** against the six anchors (see `semantic/anchors/`)
2. **Select translations** from `semantic/translations/translation-table.json`
3. **Choose physical patterns** that implement those translations
4. **Implement** using the appropriate dialect's tokens

---

## Structure

```
.thoughtform-brandworld/
├── semantic/                        # MEANING LAYER (stable)
│   ├── anchors/                     # The six semantic anchors
│   ├── translations/                # Anchor → Physical Pattern mappings
│   ├── dialects/                    # Platform-specific expressions
│   ├── models/                      # Material states, layer architecture
│   └── antipatterns.md              # Never/always rules
│
├── systems/                         # PRIMITIVES (executable)
│   ├── structure/                   # Layout, spacing, grid (4px base)
│   ├── signal/                      # Particles, glitch (GRID=3)
│   └── typography/                  # Font rules, fallbacks
│
├── registry/                        # ASSET CATALOG (source of truth)
│   ├── assets.schema.json           # Asset schema
│   ├── assets.json                  # All registered assets
│   └── validation.json              # Tests + anti-patterns
│
├── references/                      # REFERENCE LIBRARY
│   ├── entries/                     # Reference markdown files
│   ├── assets/                      # Preview images
│   └── index/                       # Search index
│
├── build/                           # GENERATED OUTPUTS
│   └── skills/                      # Generated Claude skill files
│
├── tokens/                          # TOKEN VALUES
│   ├── colors.json
│   ├── typography.json
│   ├── spacing.json
│   └── platforms/                   # Platform-specific tokens
│
├── components/                      # IMPLEMENTATIONS
│   ├── atlas/
│   ├── ledger/
│   ├── astrolabe/
│   └── shared/
│
├── particles/                       # PARTICLE SYSTEM
│   ├── core.js
│   └── STRANGE-ATTRACTORS.md
│
├── philosophy/                      # PHILOSOPHY
│   ├── PRINCIPLES.md
│   └── SEMANTIC-BRAND-VISION.md
│
├── skills/                          # CLAUDE SKILLS
│   └── semantic-design/
│
└── mcp-server/                      # MCP SERVER
```

## Quick Reference

### Platforms

| Platform | Mode | Background | Accent | Character |
|----------|------|------------|--------|-----------|
| Astrolabe | Dark | `#050403` | Gold `#CAA554` | Brass sextant |
| Atlas | Dark | `#050403` | Gold `#CAA554` | Specimen archive |
| Ledger Dark | Dark | `#050403` | Verde `#2B4E40` | Blade Runner |
| Ledger Light | Light | `#F0EFEC` | Teal `#3D8B7A` | NASA blueprint |
| thoughtform.co | Dark | `#050504` | Gold `#CAA554` | Mission control HUD |

### Design Primitives

**Navigation Grid** — Fixed overlay frame system with corner brackets and vertical rails
- See: `components/shared/NavigationGrid.md`
- Component: `components/shared/NavigationGrid.tsx`
- CSS: `components/shared/navigation-grid.css`
- Platform-agnostic: Change colors, keep structure consistent

**Generative Sigils** — Algorithmic particle clusters for unique visual identities
- See: `philosophy/GENERATIVE-PATTERNS.md`
- Component: `icons/core/GenerativeSigil.tsx`
- 5 pattern types: constellation, scatter, grid, cross, spiral
- Seeded randomness: Same input → same output
- Glitch offsets: 1-3px displacements echo brand language
- Cross-platform: Atlas entities, Astrolabe documents, Ledger categories

**Strange Attractors** — Mathematical chaos systems for domain particle nebulae
- See: `particles/STRANGE-ATTRACTORS.md`
- Atlas implementation: `components/atlas/DomainNebulae.md`
- 8 attractor types: Lorenz, Thomas, Halvorsen, Aizawa, Sprott, Rössler, Dadras, Galaxy
- Deterministic chaos: Complex but predictable patterns
- 3D rotation with perspective projection
- Cross-platform: Domain clusters, category backgrounds, ambient effects

**Card System** — Unified card design across all platforms
- See: `components/shared/CardSystem.md`
- Cards as thresholds: Containers that frame content like museum display cases
- Zero border-radius, dawn-08 borders, corner brackets on hover
- Platform variants: Atlas (specimen archive), Ledger (blueprint), Astrolabe (instrument panel)
- Sizing scale: xs (120px) to xl (620px)
- Interactive states: rest, hover, selected, focus, disabled

**Semantic Brand Architecture** — Meaning-based design system vision
- See: `philosophy/SEMANTIC-BRAND-VISION.md`
- See: `skills/semantic-design/SKILL.md` for methodology
- 6 Semantic Anchors: Navigation, Threshold, Instrument, Living Geometry, Gradient, Signal
- Platform dialects: Same anchors, different expressions
- Translation protocol: Reference → Extract meaning → Map to anchors → Render in dialect
- Future vision: Embeddings for automatic brand alignment checking

### Non-Negotiables

1. **Zero border-radius** — Sharp corners everywhere
2. **PT Mono titles** — All headers, labels, navigation
3. **GRID=3 particles** — Pixel snapping at 3px
4. **No system fonts** — Always PT Mono or IBM Plex
5. **No box-shadows** — Use borders for depth
6. **Navigation Grid positioning** — Always fixed, scales with viewport
7. **User menu in top-right corner** — Universal position for logged-in user display (`[USERNAME]: ACTIVE ▼`)

### Core Colors

**Dark mode:**
- Void: `#050403`
- Dawn: `#ECE3D6`
- Gold: `#CAA554`

**Light mode:**
- Paper: `#F0EFEC`
- Ink: `#3A3835`
- Teal: `#3D8B7A`

## MCP Server

The MCP server allows Claude.ai and Cursor to access these design tokens directly.

```bash
cd mcp-server
npm install
npm run build
```

See `mcp-server/README.md` for configuration instructions.

## Usage

### In Cursor/Claude

Once the MCP server is configured, the AI can access resources like:

- `thoughtform://tokens/colors` — Color palette
- `thoughtform://tokens/atlas` — Atlas-specific tokens
- `thoughtform://philosophy` — Design principles
- `thoughtform://particles` — Particle system code

### Example Prompts for Claude.ai

Copy these prompts to quickly leverage the Thoughtform design system:

**Getting Started:**
```
Read the Thoughtform design philosophy and summarize the key principles.
```

```
Get the complete design tokens for Atlas and explain the color system.
```

**Building Components:**
```
Show me the Navigation Grid primitive and apply it to my Astrolabe platform
with verde color instead of gold.
```

```
Show me the Ledger WireframeBox component and create a similar container
component for a settings panel.
```

```
Get all Atlas components and create a new ProfileCard component that
follows the same patterns and design tokens.
```

```
Read the ParticleCanvas component and help me add a new particle behavior
for a "pulse" effect.
```

**Generating Styles:**
```
Generate CSS custom properties for Ledger Dark mode.
```

```
Get the typography tokens and create a Tailwind config that matches
the Thoughtform type scale.
```

**Platform-Specific Work:**
```
I'm building a new page for Astrolabe. Get the Astrolabe design tokens
and InstrumentPanel component, then help me create a dashboard layout.
```

```
Read the Ledger StatCard and DataTable components. I need a new
TransactionHistory component that displays recent financial activity.
```

```
Get the Atlas EntityCard and ThreatBadge components. Create a variant
for displaying organization entities instead of individual threats.
```

**Understanding the System:**
```
Compare the design tokens between Ledger Dark and Ledger Light modes.
What are the key differences?
```

```
Read the GlitchEffects component and explain how to add scanline
effects to any component.
```

```
Get the motion tokens and explain the timing curves available
for animations.
```

### Manual Import

Copy `particles/core.js` into your project, or reference the tokens directly:

```javascript
import tokens from './.thoughtform-brandworld/tokens/colors.json';
```

## Platform-Specific Implementations

### thoughtform.co

The thoughtform.co website implements a **3D scroll-driven navigation cockpit** with an **admin-controllable particle system**:

#### 3D Particle System V2

Config-driven particle rendering with live admin controls:

- **Manifold (Terrain)**: Semantic Dawn topology grid (configurable 140×60 default) that scrolls through the journey
- **Landmarks**: Section-specific structures (Gateway, Tower, Helix, Sphere, Ring) in Tensor Gold
- **Admin Panel**: Floating draggable panel for real-time adjustments
- **Persistence**: Settings saved to Vercel KV (Upstash Redis)

**Documentation:**
- See: `particles/thoughtform-co-3d.md`
- Reference: `components/thoughtform-co/3d-particle-system.tsx`

#### Navigation HUD

Fixed overlay interface with radar-style indicators:
- See: `components/thoughtform-co/NAVIGATION_HUD.md`
- Pattern: `components/thoughtform-co/NavigationCockpit.tsx`

#### Key Features

| Feature | Description |
|---------|-------------|
| **Config-driven** | All particle settings controllable via admin panel |
| **Manifold topology** | Multi-wave terrain with evolving phase |
| **Landmark shapes** | Gateway, Tower, Helix, Sphere, Ring |
| **Proximity boost** | Nearby particles get 80% brightness increase |
| **Breathing animation** | Subtle oscillation for organic feel |
| **Y-culling** | Terrain only renders in lower 65% of screen |
| **Full clear render** | No motion blur, clean each frame |
| **Section visibility** | Landmarks fade based on scroll position |

#### Admin Panel Controls

**Manifold:**
- Color (preset or custom hex)
- Rows/Columns (density)
- Wave amplitude/frequency (topology)
- Spread X/Z (scale)
- Opacity

**Landmarks:**
- Shape selection
- Color
- Density (particle count)
- Scale
- Position (Z depth)
- Enable/disable

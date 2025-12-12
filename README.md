# Thoughtform Brandworld

Centralized design system for all Thoughtform platforms: Astrolabe, Atlas, Ledger, and thoughtform.co.

## Structure

```
.thoughtform-brandworld/
├── tokens/
│   ├── colors.json           # Canonical color definitions
│   ├── typography.json       # Font stacks, scale, tracking
│   ├── spacing.json          # 4px grid system
│   └── platforms/
│       ├── astrolabe.json    # Gold accent, dark mode
│       ├── atlas.json        # Dawn/Gold, dark mode
│       ├── ledger-dark.json  # Verde accent
│       └── ledger-light.json # Teal accent, paper mode
├── particles/
│   └── core.js               # Shared GRID=3 renderer
├── philosophy/
│   └── PRINCIPLES.md         # Core design tenets
├── skills/
│   └── SKILL.md              # Claude/Cursor skill
└── mcp-server/               # MCP server for AI access
```

## Quick Reference

### Platforms

| Platform | Mode | Background | Accent | Character |
|----------|------|------------|--------|-----------|
| Astrolabe | Dark | `#050403` | Gold `#CAA554` | Brass sextant |
| Atlas | Dark | `#050403` | Gold `#CAA554` | Specimen archive |
| Ledger Dark | Dark | `#050403` | Verde `#2B4E40` | Blade Runner |
| Ledger Light | Light | `#F0EFEC` | Teal `#3D8B7A` | NASA blueprint |

### Non-Negotiables

1. **Zero border-radius** — Sharp corners everywhere
2. **PT Mono titles** — All headers, labels, navigation
3. **GRID=3 particles** — Pixel snapping at 3px
4. **No system fonts** — Always PT Mono or IBM Plex
5. **No box-shadows** — Use borders for depth

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

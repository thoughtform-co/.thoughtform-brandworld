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

### Manual Import

Copy `particles/core.js` into your project, or reference the tokens directly:

```javascript
import tokens from './.thoughtform-brandworld/tokens/colors.json';
```

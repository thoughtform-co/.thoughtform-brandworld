# Thoughtform Design MCP Server

MCP server that serves the Thoughtform design system to Claude.ai and Cursor.

## Installation

```bash
cd mcp-server
npm install
npm run build
```

## Configuration

### Claude.ai Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "thoughtform-design": {
      "command": "node",
      "args": ["C:/Users/buyss/Dropbox/03_Thoughtform/01_Thoughtform Branding/07_Artifacts/.thoughtform-brandworld/mcp-server/dist/index.js"]
    }
  }
}
```

### Cursor

Add to Cursor's MCP settings (Settings > MCP):

```json
{
  "thoughtform-design": {
    "command": "node",
    "args": ["C:/Users/buyss/Dropbox/03_Thoughtform/01_Thoughtform Branding/07_Artifacts/.thoughtform-brandworld/mcp-server/dist/index.js"]
  }
}
```

## Available Resources

### Design Tokens

| URI | Description |
|-----|-------------|
| `thoughtform://tokens/colors` | Canonical color definitions |
| `thoughtform://tokens/typography` | Font stacks and scale |
| `thoughtform://tokens/spacing` | 4px grid system |
| `thoughtform://tokens/astrolabe` | Astrolabe platform tokens |
| `thoughtform://tokens/atlas` | Atlas platform tokens |
| `thoughtform://tokens/ledger-dark` | Ledger Dark platform tokens |
| `thoughtform://tokens/ledger-light` | Ledger Light platform tokens |

### Documentation

| URI | Description |
|-----|-------------|
| `thoughtform://philosophy` | Core design principles |
| `thoughtform://particles` | Particle system code |
| `thoughtform://skill` | Claude/Cursor design skill |

### Reference Components

| URI | Description |
|-----|-------------|
| `thoughtform://components/atlas/EntityCard` | Entity card with threat indicators (3:4 aspect) |
| `thoughtform://components/atlas/ThreatBadge` | Threat level indicator badge |
| `thoughtform://components/ledger/WireframeBox` | Blueprint container with corner brackets |
| `thoughtform://components/ledger/StatCard` | Financial metric card with trends |
| `thoughtform://components/ledger/DataTable` | Table with diamond markers |
| `thoughtform://components/astrolabe/InstrumentPanel` | Navigation panel with status indicators |
| `thoughtform://components/shared/ParticleCanvas` | GRID=3 particle system for all platforms |

## Available Tools

### `get_design_tokens`
Get complete design tokens for a platform.

```
Arguments:
  platform: "astrolabe" | "atlas" | "ledger-dark" | "ledger-light"
```

### `get_color_css`
Generate CSS custom properties for a platform.

```
Arguments:
  platform: "astrolabe" | "atlas" | "ledger-dark" | "ledger-light"
```

### `get_platform_components`
Get all reference component code for a platform.

```
Arguments:
  platform: "atlas" | "ledger" | "astrolabe"
  includeShared: boolean (default: true) - Include ParticleCanvas
```

## Usage in Claude/Cursor

Once configured, you can ask:

**Design Tokens:**
- "Read the Thoughtform color tokens"
- "Get the Atlas platform design tokens"
- "Generate CSS variables for Ledger Light"

**Reference Components:**
- "Show me the Atlas EntityCard component"
- "Get all Ledger components"
- "How does the ParticleCanvas work?"

**Creating New Components:**
- "Create a new card component for Atlas following the design system"
- "Build a data visualization for Ledger Light"
- "Add a status panel to Astrolabe"

The AI will automatically access the design system resources and reference implementations to ensure consistency.

## Rebuilding

After making changes to the source:

```bash
npm run build
```

Then restart Claude Desktop or Cursor to pick up the changes.

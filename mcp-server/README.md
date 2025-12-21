# Thoughtform Unified MCP Server v3.0

One MCP to rule them all. Serves the complete Thoughtform ecosystem to Claude.ai and Cursor:

- **Design System** - Tokens, components, semantic anchors, translations
- **Design Navigation** - Match references to components, project across platforms, explore design space
- **Semantic Search** - Query philosophy and patterns by meaning (Voyage AI)
- **Captain's Log** - Voice-driven thought capture with platform routing
- **Cross-Repo Access** - Read/write files across all Thoughtform projects

## Features

- **Design Tokens** - Colors, typography, spacing, motion
- **Platform Specs** - Astrolabe, Atlas, Ledger Dark/Light, Marketing
- **Reference Components** - TSX implementations
- **Semantic Anchors** - NAVIGATION, INSTRUMENT, THRESHOLD, LIVING_GEOMETRY, GRADIENT, SIGNAL
- **Translation Tables** - Anchor → Pattern mappings
- **Semantic Search** - Query philosophy and patterns by meaning
- **Drift Detection** - Validate designs against platform identity
- **Design Validation** - Full pipeline: detect platform → activate anchors → check drift → suggest patterns
- **Design Navigation** - Two complementary modes:
  - **Match** - Find similar components, get implementation guidance
  - **Navigate** - Project references across platforms, interpolate between designs, explore semantic space
- **Component Graph** - 120 components, 2800+ relationship edges
- **Captain's Log** - Record insights with voice triggers, semantic search through thought history
- **Filesystem Access** - Read, write, search files across atlas, ledger, astrolabe, thoughtform-co, brandworld

## Installation

```bash
cd mcp-server
npm install
npm run build
```

### Environment Variables

Create a `.env.local` file in the workspace root (optional but recommended):

```env
VOYAGE_API_KEY=pa-your-voyage-key   # Enables semantic search
```

Without Voyage key, semantic tools use keyword-based fallback. Core functionality still works.

## Configuration

### One Config for Everything

The unified MCP gives you design tools, semantic search, Captain's Log, AND cross-repo file access.

### Claude Desktop (Global - Recommended)

Add to `%APPDATA%\Claude\claude_desktop_config.json` (Windows) or `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS):

```json
{
  "mcpServers": {
    "thoughtform": {
      "command": "node",
      "args": ["C:/Users/buyss/Dropbox/03_Thoughtform/01_Thoughtform Branding/07_Artifacts/.thoughtform-brandworld/mcp-server/dist/index.js"],
      "env": {
        "VOYAGE_API_KEY": "pa-your-voyage-key"
      }
    }
  }
}
```

This makes all tools available in **every Claude conversation**.

### Cursor (Per Workspace or Global)

Add to `.cursor/mcp.json` in any workspace, or to global Cursor settings:

```json
{
  "mcpServers": {
    "thoughtform": {
      "command": "node",
      "args": ["C:/Users/buyss/Dropbox/03_Thoughtform/01_Thoughtform Branding/07_Artifacts/.thoughtform-brandworld/mcp-server/dist/index.js"],
      "env": {
        "VOYAGE_API_KEY": "pa-your-voyage-key"
      }
    }
  }
}
```

### macOS Paths

Replace the Windows path with:
```
/Users/voidwalker/Library/CloudStorage/Dropbox/03_Thoughtform/01_Thoughtform Branding/07_Artifacts/.thoughtform-brandworld/mcp-server/dist/index.js
```

### Custom Repo Paths (Optional)

Override default repo paths with `THOUGHTFORM_REPOS` env var:

```json
{
  "env": {
    "VOYAGE_API_KEY": "pa-...",
    "THOUGHTFORM_REPOS": "atlas=/custom/path/atlas,ledger=/custom/path/ledger"
  }
}
```

## Available Tools

### Design Tools

| Tool | Description |
|------|-------------|
| `get_design_tokens(platform)` | Get complete tokens for a platform |
| `get_color_css(platform)` | Generate CSS custom properties |
| `get_platform_components(platform, includeShared?)` | Get reference component code |
| `search_references(anchors?, dialect?, mode?, tags?)` | Search reference library |
| `suggest_translation(referenceId)` | Get pattern suggestions |
| `get_translation_chain(anchor)` | Get anchor → pattern chain |

### Semantic Tools

| Tool | Description |
|------|-------------|
| `search_philosophy(query, category?, limit?)` | Semantic search through philosophy corpus |
| `check_platform_alignment(platform, description)` | Check drift score (0-1) |
| `activate_anchors(request)` | Get anchor weights for a design request |
| `detect_platform(request)` | Auto-detect best platform |
| `validate_design(request, platform?)` | **Full validation pipeline** |
| `get_fingerprint(platform)` | Get platform semantic fingerprint |

### Design Navigation Tools ✨ NEW

Two complementary modes for navigating the design space:

**MODE 1: MATCH (Grounded Search)**
| Tool | Description |
|------|-------------|
| `match_reference(description, platform?, limit?)` | Find similar existing components and get implementation guidance |

**MODE 2: NAVIGATE (Generative Exploration)**
| Tool | Description |
|------|-------------|
| `project_reference(description, platforms?)` | Project a reference into platform-specific expressions |
| `interpolate_designs(componentA, componentB, steps?)` | Blend between two design points |
| `explore_space(terminal_organic?, cool_warm?, ...)` | Navigate design space with semantic sliders |

**Utility Tools**
| Tool | Description |
|------|-------------|
| `get_component(id)` | Get details for a specific component |
| `list_components(platform?)` | List all embedded components |
| `get_design_space_info()` | Get design space axes and platform positions |

### Captain's Log Tools

| Tool | Description |
|------|-------------|
| `captains_log(transcription, platform?, context?)` | Record a log entry with auto-routing |
| `search_captains_log(query, platform?, limit?)` | Semantic search through thought history |
| `get_log_timeline(platform?, limit?)` | Get recent entries by platform |
| `get_log_platforms()` | List platforms and voice triggers |

**Voice Triggers:** "Captain's Log:", "Atlas entry:", "Ledger note:", "Astrolabe log:", "Journal this:"

### Filesystem Tools

| Tool | Description |
|------|-------------|
| `read_repo_file(path)` | Read file from any repo (e.g., `atlas:src/App.tsx`) |
| `write_repo_file(path, content)` | Write file to any repo |
| `list_repo_dir(path)` | List directory contents |
| `search_repo_files(pattern, repo?)` | Search files by glob pattern |
| `get_repo_tree(repo, maxDepth?)` | Get directory tree structure |
| `list_repos()` | List all configured repos |

**Default Repos:**
- `atlas` - Atlas creature bestiary
- `ledger` - Ledger financial interface  
- `astrolabe` - Astrolabe navigation system
- `thoughtform-co` - Thoughtform.co website
- `brandworld` - This design system
- `groundtruth` - Groundtruth documents

## Usage Examples

**Design Navigation (Match Mode):**
```
match_reference "a wireframe terrain with flowing particles"
match_reference "oscilloscope waveform display" --platform atlas
```

**Design Navigation (Navigate Mode):**
```
project_reference "a grid of cards with hover effects"
interpolate_designs "EntityCard" "StatCard" --steps 5
explore_space --terminal_organic=-0.5 --cool_warm=0.8
```

**Design:**
```
get_design_tokens atlas
validate_design "a threat level indicator with gradient colors"
```

**Captain's Log:**
```
captains_log "Captain's Log: The Cardinals are finally crystallizing..."
search_captains_log "embeddings navigation"
get_log_timeline --platform atlas
```

**Filesystem:**
```
read_repo_file "atlas:src/App.tsx"
search_repo_files "**/*.tsx" --repo ledger
get_repo_tree astrolabe
```

## Rebuilding

After making changes to the source:

```bash
npm run build
```

Then restart Claude Desktop or Cursor to pick up the changes.

## Updating Design Navigation Data

If you've added new components or modified existing ones:

```bash
# Step 1: Extract component metadata from all repos
npx tsx scripts/extract-components.ts

# Step 2: Generate embeddings (requires VOYAGE_API_KEY)
npx tsx scripts/embed-components.ts
```

This will:
- Scan all Thoughtform repos for component files
- Extract semantic metadata (tokens, patterns, visual characteristics)
- Calculate semantic positions in design space
- Build the component relationship graph
- Generate Voyage AI embeddings for semantic search

**Output files:**
- `semantic/components/index.json` - Component metadata
- `semantic/components/embeddings.json` - Vector embeddings
- `semantic/component-graph.json` - Relationship graph
- `semantic/design-space.json` - Axis definitions

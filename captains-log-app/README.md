# Captain's Log Voice Interface

A Star Trek-inspired voice logging system for capturing thoughts, insights, and ideas across Thoughtform platforms.

## Features

- **Voice Recording**: Push-to-talk recording with browser microphone access
- **Wispr Flow Integration**: Optional API integration for high-quality voice transcription
- **Platform Detection**: Automatically routes entries based on voice triggers
- **Local Storage**: Works offline with browser localStorage
- **Thoughtform Design**: Uses brand tokens (PT Mono, Tensor Gold, Navigation Grid)

## Voice Triggers

| Trigger Phrase | Routes To | Use For |
|----------------|-----------|---------|
| "Captain's Log" | Thoughtform | General insights and philosophy |
| "Atlas entry" | Atlas | Creature/entity concepts |
| "Ledger note" | Ledger | Terminal aesthetics, financial UI |
| "Astrolabe log" | Astrolabe | Navigation, Canon knowledge base |
| "Starhaven log" | Starhaven | Creative works, art direction |
| "Journal this" | Journal | Personal journey reflections |

## Usage

### Quick Start

1. Open `index.html` in a browser
2. Click the record button (or press Space)
3. Say "Captain's Log: [your insight]"
4. Click Save Entry (or press Ctrl+Enter)

### With Wispr Flow API

1. Get an API key from [api-docs.wisprflow.ai](https://api-docs.wisprflow.ai)
2. Enter the key in the configuration modal
3. Your voice will be transcribed automatically after recording

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Space | Toggle recording |
| Ctrl+Enter | Save entry |
| Escape | Clear transcription |

## Configuration

On first launch, a configuration modal appears:

- **Wispr Flow API Key**: For voice-to-text transcription
- **Supabase URL**: For cloud storage (optional)
- **Supabase Anon Key**: For cloud storage (optional)

Click "Skip" to use local storage mode without API integration.

## Integration with MCP Server

Entries saved here can be accessed via the MCP server tools:

```bash
# In Claude/Cursor with MCP configured
captains_log "Captain's Log: The Cardinals are crystallizing..."
search_captains_log "embeddings navigation"
get_log_timeline --platform atlas
```

## Design System

Uses Thoughtform brand tokens:

- **Colors**: Void (#050403), Dawn (#ECE3D6), Tensor Gold (#CAA554)
- **Typography**: PT Mono (headers), IBM Plex Sans (body)
- **Frame**: Navigation Grid with corner brackets
- **Motion**: Smooth cubic-bezier easing

## Stardate Format

Follows Star Trek TNG-style stardates:

```
Format: YYYYF.F
Example: 20259.6 (December 21, 2025)
```

Where:
- YYYY = Current year
- F.F = Fraction of year elapsed (0.0 to 9.9)

## Development

This is a single-file HTML application. To modify:

1. Edit `index.html`
2. Styles are in `<style>` tag
3. JavaScript is in `<script type="module">` tag

No build process required.

## Future Enhancements

- [ ] WebSocket streaming for real-time transcription
- [ ] Supabase sync for cloud storage
- [ ] Semantic search across entries
- [ ] Export to Markdown/JSON
- [ ] Mobile-optimized layout


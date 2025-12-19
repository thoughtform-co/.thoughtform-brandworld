# Typography System

Font rules, fallback chains, and licensed font handling.

---

## The Three Voices

| Voice | Primary Font | Fallback | Use |
|-------|--------------|----------|-----|
| **System** | PP Mondwest | PT Mono, monospace | Navigation, labels, coordinates, instruments |
| **Content** | PP Neue Montreal | IBM Plex Sans, sans-serif | Body text, descriptions, reading |
| **Scholarly** | Crimson Pro | Georgia, serif | Atlas specimen descriptions only |

---

## Font Rules

### System Voice (PP Mondwest / PT Mono)

Use for:
- Section labels (with `// ` prefix)
- Navigation elements
- Coordinates and values
- Badges and tags
- Button text
- Anything that says "instrument"

```css
.system-voice {
  font-family: 'PP Mondwest', 'PT Mono', monospace;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
```

### Content Voice (PP Neue Montreal / IBM Plex Sans)

Use for:
- Body paragraphs
- Descriptions
- Long-form content
- Dialog text

```css
.content-voice {
  font-family: 'PP Neue Montreal', 'IBM Plex Sans', sans-serif;
  letter-spacing: 0;
  text-transform: none;
}
```

### Scholarly Voice (Crimson Pro)

Use only in Atlas for:
- Entity descriptions
- Specimen notes
- Scholarly annotations

```css
.scholarly-voice {
  font-family: 'Crimson Pro', Georgia, serif;
  font-style: italic;
}
```

---

## Licensed Fonts

**PP Mondwest** and **PP Neue Montreal** are licensed fonts from Pangram Pangram.

### Storage
- Font files are NOT stored in this repo
- Each project loads them from licensed hosting or local installation
- See `FONTS-README.md` for licensing details

### Fallback Chain
Always include fallbacks that maintain the aesthetic:

```css
/* If PP fonts not available, fall back gracefully */
--font-system: 'PP Mondwest', 'PT Mono', 'JetBrains Mono', monospace;
--font-content: 'PP Neue Montreal', 'IBM Plex Sans', 'Inter', sans-serif;
```

---

## Source Files

- `font-rules.md` — Detailed usage rules
- `fallback-chains.json` — Machine-readable fallback specs
- `FONTS-README.md` — Licensing and installation notes
- `../../tokens/typography.json` — Canonical typography tokens

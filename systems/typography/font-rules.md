# Font Rules

Detailed typography usage rules for Thoughtform platforms.

---

## The Three Voices

### System Voice

**Fonts:** PP Mondwest → PT Mono → JetBrains Mono → monospace

**Use for:**
- Section labels (with `// ` prefix)
- Navigation elements
- Coordinates and values
- Badges and tags
- Button text
- Status indicators
- Anything that says "instrument"

**Styling:**
```css
.system-voice {
  font-family: var(--font-system);
  font-size: 9px;          /* xs scale */
  font-weight: 400;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  line-height: 1.2;
}
```

**Examples:**
```
// NAVIGATION
01 · KEYNOTE
X: 0.156  Y: 0.312
[ACTIVE] [PROCESSING]
```

---

### Content Voice

**Fonts:** PP Neue Montreal → IBM Plex Sans → system-ui → sans-serif

**Use for:**
- Body paragraphs
- Descriptions
- Long-form content
- Dialog text
- Explanatory text

**Styling:**
```css
.content-voice {
  font-family: var(--font-content);
  font-size: 14px;         /* base scale */
  font-weight: 400;
  letter-spacing: 0;
  text-transform: none;
  line-height: 1.6;
}
```

**Examples:**
```
Thoughtform helps organizations navigate the emerging AI landscape
with clarity and purpose. We translate complex capabilities into
practical applications.
```

---

### Scholarly Voice

**Fonts:** Crimson Pro → Georgia → serif

**Use for (Atlas only):**
- Entity descriptions
- Specimen notes
- Scholarly annotations
- Epithet text

**Styling:**
```css
.scholarly-voice {
  font-family: var(--font-scholarly);
  font-size: 14px;
  font-weight: 400;
  font-style: italic;
  letter-spacing: 0.01em;
  line-height: 1.7;
}
```

**Examples:**
```
The Spasmodite manifests as involuntary twitches in otherwise
coherent output—a signature of underlying instability.
```

---

## Type Scale

| Token | Size | Line Height | Use |
|-------|------|-------------|-----|
| `2xs` | 7px | 1.1 | Coordinate values, glyphs |
| `xs` | 9px | 1.2 | Labels, badges, navigation |
| `sm` | 11px | 1.3 | Secondary text, metadata |
| `base` | 13px | 1.5 | Body text (compact) |
| `md` | 14px | 1.6 | Body text (default) |
| `lg` | 17px | 1.7 | Long-form reading |
| `xl` | 18px | 1.4 | Section titles |
| `2xl` | 24px | 1.3 | Page titles |
| `3xl` | 28px | 1.2 | Display headings |

---

## Letter Spacing

| Context | Tracking |
|---------|----------|
| System labels (uppercase) | `0.05em` to `0.1em` |
| Body text | `0` |
| Display headings | `-0.01em` to `0` |
| Scholarly text | `0.01em` |

---

## Platform-Specific Rules

### Astrolabe
- System voice for navigation, labels, coordinates
- Content voice for document summaries
- No scholarly voice

### Atlas
- System voice for labels, threat levels, metadata
- Scholarly voice for entity descriptions
- Content voice minimal

### Ledger
- System voice for everything
- Content voice for transaction descriptions
- Mono for all values and amounts

### Marketing
- System voice for section labels
- Content voice for body
- Display headings in system voice, larger scale

---

## CSS Variables

```css
:root {
  /* Font families */
  --font-system: 'PP Mondwest', 'PT Mono', 'JetBrains Mono', monospace;
  --font-content: 'PP Neue Montreal', 'IBM Plex Sans', system-ui, sans-serif;
  --font-scholarly: 'Crimson Pro', Georgia, serif;
  
  /* Type scale */
  --text-2xs: 7px;
  --text-xs: 9px;
  --text-sm: 11px;
  --text-base: 13px;
  --text-md: 14px;
  --text-lg: 17px;
  --text-xl: 18px;
  --text-2xl: 24px;
  --text-3xl: 28px;
}
```

---

## Anti-Patterns

- **Never** use Inter, Arial, Helvetica, or system-ui as primary
- **Never** use sans-serif for labels/navigation
- **Never** mix voices within a single text block
- **Never** use letter-spacing > 0.15em (too spaced out)
- **Never** use line-height < 1.4 for body text

---

## Related Files

- `fallback-chains.json` — Machine-readable fallback specs
- `FONTS-README.md` — Licensed font handling
- `../../tokens/typography.json` — Canonical token values

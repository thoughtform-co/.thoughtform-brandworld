# Font Licensing

Thoughtform uses licensed fonts that cannot be stored in public repositories.

---

## Licensed Fonts

### PP Mondwest
- **Foundry:** Pangram Pangram
- **License:** Commercial license required
- **Use:** System voice (navigation, labels, coordinates)

### PP Neue Montreal
- **Foundry:** Pangram Pangram
- **License:** Commercial license required
- **Use:** Content voice (body text, descriptions)

---

## Installation Options

### Option 1: Self-Hosted (Recommended for Production)
1. Purchase license from Pangram Pangram
2. Host font files on your CDN or Vercel/Netlify
3. Reference in CSS via `@font-face`

### Option 2: Adobe Fonts
If you have Creative Cloud, some Pangram fonts may be available.

### Option 3: Development Fallback
For development without licensed fonts, use the fallback chain:
- PT Mono (Google Fonts, free)
- IBM Plex Sans (Google Fonts, free)

---

## Fallback Fonts (Free)

These fonts are close enough for development and provide graceful degradation:

| Primary | Fallback | Source |
|---------|----------|--------|
| PP Mondwest | PT Mono | Google Fonts |
| PP Neue Montreal | IBM Plex Sans | Google Fonts |
| Crimson Pro | Georgia | System font |

---

## CSS Example

```css
/* With licensed fonts */
@font-face {
  font-family: 'PP Mondwest';
  src: url('/fonts/PPMondwest-Regular.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
}

/* Fallback chain */
:root {
  --font-system: 'PP Mondwest', 'PT Mono', 'JetBrains Mono', monospace;
  --font-content: 'PP Neue Montreal', 'IBM Plex Sans', system-ui, sans-serif;
}
```

---

## Important

- Never commit licensed font files to public repos
- Each project must handle font loading independently
- Always test with fallback fonts to ensure degradation is acceptable

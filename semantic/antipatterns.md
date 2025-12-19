# Anti-Patterns

Things that immediately break Thoughtform. These are non-negotiable.

---

## Never

### Border Radius
```css
/* ❌ NEVER */
border-radius: 8px;
border-radius: 4px;
border-radius: 2px;

/* ✓ ALWAYS */
border-radius: 0;
```
Sharp corners everywhere. No exceptions. This is the instrument aesthetic — precision, not friendliness.

---

### Pure Black or White
```css
/* ❌ NEVER */
background: #000000;
color: #FFFFFF;

/* ✓ ALWAYS */
background: #070604;  /* warm void */
color: #ECE3D6;       /* dawn */
```
Pure black is cold and digital. Thoughtform's void is warm, inhabited.

---

### Generic AI Gradients
```css
/* ❌ NEVER */
background: linear-gradient(135deg, #667eea, #764ba2);
background: linear-gradient(to right, #6366F1, #8B5CF6);

/* ✓ ALWAYS */
/* Use solid colors or subtle dawn/void gradients */
background: linear-gradient(180deg, rgba(7,6,4,0) 0%, #070604 100%);
```
Purple/indigo gradients scream "generic AI startup." Stay within Dawn/Gold/Verde/Teal.

---

### System Fonts
```css
/* ❌ NEVER */
font-family: Inter, system-ui, sans-serif;
font-family: Arial, Helvetica, sans-serif;
font-family: -apple-system, BlinkMacSystemFont;

/* ✓ ALWAYS */
font-family: 'PP Mondwest', 'PT Mono', monospace;  /* system voice */
font-family: 'PP Neue Montreal', 'IBM Plex Sans', sans-serif;  /* content voice */
```
Inter is the font of a thousand AI landing pages. We are not that.

---

### Heavy Shadows
```css
/* ❌ NEVER */
box-shadow: 0 10px 25px rgba(0,0,0,0.2);
box-shadow: 0 4px 12px rgba(0,0,0,0.15);

/* ✓ ALWAYS */
/* Use borders and transparency for depth */
border: 1px solid rgba(236, 227, 214, 0.08);
background: rgba(7, 6, 4, 0.85);
```
Shadows are soft and modern. We are sharp and retrofuturistic.

---

### Emoji
```
❌ NEVER: ✨ 🚀 ⭐ 🎯 💡 🔥

✓ ALWAYS: Use ASCII markers
// Label
◆ Selected
◇ Unselected
│ Divider
├── Tree
```
Emoji break the terminal/instrument aesthetic. Use geometric markers.

---

### Circular Elements
```css
/* ❌ NEVER */
border-radius: 50%;  /* circles */
border-radius: 9999px;  /* pills */

/* ✓ Exception: 5px threat dots in Atlas */
.threat-dot { width: 5px; height: 5px; border-radius: 50%; }
```
Circles are friendly. Diamonds are precise. Use diamonds (rotated squares) instead.

---

## Always

### Sharp Corners
```css
border-radius: 0;
```

### Warm Colors
```css
--void: #070604;
--dawn: #ECE3D6;
--gold: #CAA554;
```

### Monospace for System Elements
```css
.label, .coordinate, .navigation {
  font-family: 'PP Mondwest', 'PT Mono', monospace;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
```

### ASCII Structural Markers
```css
.section-label::before {
  content: '// ';
  color: var(--dawn-30);
}
```

### Diamond Markers
```css
.marker::before {
  content: '◆';  /* or ◇ for outline */
}
```

### Opacity Variations for Depth
```css
border: 1px solid rgba(236, 227, 214, 0.08);  /* dawn-08 */
border: 1px solid rgba(236, 227, 214, 0.15);  /* dawn-15 */
```

---

## The Tests

### Instrument Test
> "Could this exist in brass and glass?"

If the answer is no, it's too digital, not enough retrofuturism.

### Ctrl Creep Test
> "Does it express mutual human-machine alienness?"

- If it could be from any generic tech brand → **not Thoughtform**
- If it's incomprehensibly weird → **lost the human side**
- Sweet spot: **instrument for navigating alien intelligence**

### Material State Check
For any element, you should be able to say:
- "This is **X% SIGNAL**" (where X is 0-100)
- "The threshold is **here**" (pointing to where meaning emerges)

If you can't answer these, the composition isn't clear.

---

## See Also

- `../registry/validation.json` — Machine-checkable rules with regex patterns
- `../../philosophy/PRINCIPLES.md` — Full design philosophy

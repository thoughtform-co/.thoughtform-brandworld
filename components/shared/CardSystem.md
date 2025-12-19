# Card Design System

> **Cards are containers for meaning.** They frame content the way a museum display case frames a specimen, or a blueprint frames a schematic. The frame itself communicates as much as the content.

---

## Philosophy

### Cards as Thresholds

Every card is a **threshold** — a boundary between the user's space and the content's space. This threshold should:

1. **Contain without confining** — Content should breathe, not feel trapped
2. **Frame without distracting** — The border serves content, not vice versa
3. **Invite without demanding** — Hover states suggest, not shout

### The Display Case Metaphor

Think of cards as museum display cases:

- **Glass edges** catch light (subtle border glow on hover)
- **Specimens** are the focus (content hierarchy is clear)
- **Labels** are secondary (metadata in monospace, smaller)
- **Cases don't compete** — The grid is harmonious

### Non-Negotiables

1. **Zero border-radius** — Sharp corners everywhere, no exceptions
2. **Dawn-08 borders at rest** — `rgba(236, 227, 214, 0.08)` or platform equivalent
3. **Dawn-30 borders on hover** — Subtle brightening, not dramatic
4. **No box-shadows** — Use borders and subtle glows instead
5. **16px internal padding** — Consistent breathing room
6. **4:5 or 3:4 aspect ratios** — For image cards

---

## Anatomy

### Standard Card Structure

```
┌─────────────────────────────────────┐
│ ┌─┐                             ┌─┐ │  ← Corner brackets (hover)
│                                     │
│           [ IMAGE ZONE ]            │  ← 4:5 or 3:4 aspect ratio
│              3:4 ratio              │
│                                     │
│ └─┘                             └─┘ │
├─────────────────────────────────────┤  ← Divider (dawn-08)
│                                     │
│  TITLE                              │  ← PT Mono, uppercase
│  Subtitle or epithet                │  ← IBM Plex Sans, italic
│                                     │
│  ▬▬▬▬ ▬▬ ▬  INDICATOR               │  ← Status/threat bar
│                                     │
│  ◆ 0.156  ○ 0.312  ◇ 0.089         │  ← Coordinates/metadata
│                                     │
└─────────────────────────────────────┘
```

### Zones

| Zone | Purpose | Treatment |
|------|---------|-----------|
| **Image Zone** | Primary visual | Full bleed, gradient overlay at bottom |
| **Corner Brackets** | Interactive affordance | Appear on hover, L-shaped, dawn-15 |
| **Content Zone** | Text and metadata | Padded, glass blur background |
| **Status Zone** | Indicators, bars | Small, monospace, colored by meaning |
| **Metadata Zone** | Coordinates, counts | Smallest text, diamond/circle markers |

---

## Platform Variations

### Atlas (Dark Mode)

**Metaphor:** Victorian specimen archive, display cases in a dark gallery

```css
/* Atlas Card */
.card {
  background: var(--surface-0);           /* #0A0908 */
  border: 1px solid var(--dawn-08);       /* rgba(236, 227, 214, 0.08) */
}

.card:hover {
  border-color: var(--dawn-30);
  transform: translateY(-2px);
}

/* Content zone with glass effect */
.card-content {
  background: rgba(10, 9, 8, 0.4);
  backdrop-filter: blur(16px);
  border-top: 1px solid rgba(236, 227, 214, 0.1);
}
```

**Special Features:**
- Corner brackets on hover (dawn-15)
- Scanline overlay on images
- Threat level indicator with glow
- Outer radial glow on hover
- Stacked card hints for multi-media

---

### Ledger Light Mode

**Metaphor:** Blueprint, technical schematic on paper

```css
/* Ledger Card */
.card {
  background: var(--paper);               /* #F0EFEC */
  border: 1px solid var(--ink-05);        /* rgba(58, 56, 53, 0.05) */
}

.card:hover {
  border-color: var(--ink-15);
}

/* No glass effects in light mode */
.card-content {
  background: transparent;
}
```

**Special Features:**
- Corner bracket wireframe markers
- Diamond bullet points (◇)
- Teal/Signal for positive/negative trends
- Gold for primary values
- No blur effects (crisp blueprint aesthetic)

---

### Ledger Dark Mode

**Metaphor:** Blade Runner terminal, data readout

```css
/* Ledger Dark Card */
.card {
  background: var(--void-surface-0);      /* #0A0908 */
  border: 1px solid var(--verde-15);      /* rgba(43, 78, 64, 0.15) */
}

.card:hover {
  border-color: var(--verde-30);
}
```

**Special Features:**
- Verde accent instead of gold
- Same glass blur as Atlas
- Status indicators in verde/signal

---

### Astrolabe

**Metaphor:** Brass instrument panel, navigation console

```css
/* Astrolabe Card */
.card {
  background: var(--surface-0);
  border: 1px solid var(--gold-15);       /* rgba(202, 165, 84, 0.15) */
}

.card:hover {
  border-color: var(--gold-30);
  box-shadow: 0 0 20px rgba(202, 165, 84, 0.1);
}
```

**Special Features:**
- Gold border accent
- Subtle gold glow on hover
- Instrument-style dividers
- Coordinate badges

---

## Sizing System

### Width Scale

| Size | Width | Image Height | Use Case |
|------|-------|--------------|----------|
| **xs** | 120px | 150px | Constellation compact cards |
| **sm** | 200px | 267px | Grid cards, stacked views |
| **md** | 280px | 350px | Standard card in grid |
| **lg** | 380px | 475px | Featured card |
| **xl** | 620px | 775px | Detail/preview card |

### Aspect Ratios

| Ratio | Use Case |
|-------|----------|
| **3:4** | Standard entity cards, portraits |
| **4:5** | Expanded cards with more metadata |
| **1:1** | Thumbnail grids, avatar cards |
| **16:9** | Video cards, landscape content |

---

## Interactive States

### Rest State

```css
.card {
  border: 1px solid var(--dawn-08);
  transform: translateY(0);
  transition: all 250ms cubic-bezier(0.19, 1, 0.22, 1);
}
```

### Hover State

```css
.card:hover {
  border-color: var(--dawn-30);
  transform: translateY(-2px);
}

/* Corner brackets appear */
.card:hover .corner-bracket {
  opacity: 1;
}

/* Outer glow appears */
.card:hover .outer-glow {
  opacity: 1;
}
```

### Selected State

```css
.card--selected {
  border-color: var(--dawn-50);
  box-shadow: 
    0 0 0 1px var(--dawn-15),
    0 0 30px rgba(236, 227, 214, 0.1);
}

.card--selected .corner-bracket {
  opacity: 1;
  border-color: var(--dawn-30);
}
```

### Focus State (Keyboard)

```css
.card:focus-visible {
  outline: none;
  border-color: var(--gold);
  box-shadow: 0 0 0 2px var(--gold-30);
}
```

### Disabled/Locked State

```css
.card--disabled {
  opacity: 0.5;
  pointer-events: none;
  filter: grayscale(30%);
}
```

---

## Corner Brackets

Corner brackets are a signature Thoughtform element — they appear on hover to suggest interactivity and frame the content.

### Implementation

```tsx
{/* Top-left corner bracket */}
<div
  className="
    absolute -top-px -left-px w-3 h-3
    border-t border-l border-[var(--dawn-15)]
    transition-opacity duration-300
    opacity-0 group-hover:opacity-100
  "
/>

{/* Bottom-right corner bracket */}
<div
  className="
    absolute -bottom-px -right-px w-3 h-3
    border-b border-r border-[var(--dawn-15)]
    transition-opacity duration-300
    opacity-0 group-hover:opacity-100
  "
/>
```

### Bracket Sizes

| Card Size | Bracket Size |
|-----------|--------------|
| xs | 8px (w-2 h-2) |
| sm | 10px |
| md | 12px (w-3 h-3) |
| lg | 16px (w-4 h-4) |
| xl | 20px (w-5 h-5) |

---

## Image Treatment

### Gradient Overlay

All card images get a gradient overlay for text legibility:

```css
.image-overlay {
  background: linear-gradient(
    to bottom,
    rgba(5, 4, 3, 0.1) 0%,
    transparent 30%,
    transparent 50%,
    rgba(5, 4, 3, 0.4) 80%,
    rgba(5, 4, 3, 0.85) 100%
  );
}
```

### Scanline Effect (Atlas)

```css
.scanlines {
  background: repeating-linear-gradient(
    0deg,
    transparent 0px,
    transparent 2px,
    rgba(0, 0, 0, 0.03) 2px,
    rgba(0, 0, 0, 0.03) 4px
  );
}
```

### Phase States (Atlas)

| Phase | Filter |
|-------|--------|
| Visible | none |
| Glimpsed | blur(2px) brightness(0.8) |
| Theoretical | blur(4px) brightness(0.6) |
| Unknown | blur(8px) brightness(0.3) |

---

## Typography Inside Cards

### Hierarchy

| Element | Font | Size | Style |
|---------|------|------|-------|
| **Title** | PT Mono | 14-18px | Uppercase, letter-spacing: 0.05em |
| **Subtitle** | IBM Plex Sans | 11-13px | Italic, dawn-50 |
| **Label** | PT Mono | 8-10px | Uppercase, letter-spacing: 0.1em, dawn-40 |
| **Value** | PT Mono | 10-12px | Normal, dawn-70 |
| **Meta** | PT Mono | 8-9px | Uppercase, letter-spacing: 0.08em, dawn-30 |

### Truncation

```css
/* Single line truncation */
.card-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Multi-line clamp */
.card-description {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

---

## Status Indicators

### Threat Bar (Atlas)

```tsx
const THREAT_COLORS = {
  Benign: '#5B8A7A',
  Cautious: '#7A7868',
  Volatile: '#C17F59',
  Existential: '#8B5A5A',
};

<div className="flex gap-1">
  {['Benign', 'Cautious', 'Volatile', 'Existential'].map((level, i) => (
    <div
      key={level}
      style={{
        width: 16,
        height: 4,
        background: i <= activeIndex 
          ? THREAT_COLORS[level]
          : 'var(--dawn-15)',
      }}
    />
  ))}
</div>
```

### Trend Indicator (Ledger)

```tsx
<div className="flex items-center gap-1.5">
  {trendUp ? (
    <TrendingUp style={{ color: 'var(--teal)' }} />
  ) : (
    <TrendingDown style={{ color: 'var(--signal)' }} />
  )}
  <span style={{ color: trendUp ? 'var(--teal)' : 'var(--signal)' }}>
    {trend}
  </span>
</div>
```

### Connection Dots

```tsx
{/* Show connection count as dots */}
<div className="flex gap-[3px]">
  {Array.from({ length: Math.min(connectionCount, 5) }).map((_, i) => (
    <div
      key={i}
      style={{
        width: 3,
        height: 3,
        background: 'var(--dawn-30)',
        borderRadius: '50%',
      }}
    />
  ))}
</div>
```

---

## Card Grids

### Standard Grid

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  padding: 24px;
}
```

### Masonry (Variable Heights)

```css
.card-masonry {
  columns: 3;
  column-gap: 24px;
}

.card-masonry .card {
  break-inside: avoid;
  margin-bottom: 24px;
}
```

### Responsive Breakpoints

| Breakpoint | Columns | Card Width |
|------------|---------|------------|
| < 640px | 1 | 100% |
| 640-1024px | 2 | ~280px |
| 1024-1440px | 3 | ~280px |
| > 1440px | 4+ | ~280px |

---

## Stacked Cards (Multi-Media)

When an entity has multiple media, show stacked card hints:

```tsx
{/* Stacked layers behind main card */}
{Array.from({ length: stackedLayers }).map((_, i) => {
  const offset = (i + 1) * 3; // 3px, 6px, 9px
  const rotation = (i % 2 === 0 ? 1 : -1) * 0.8; // ±0.8deg
  const opacity = 0.35 - (i * 0.08);
  
  return (
    <div
      key={i}
      style={{
        position: 'absolute',
        inset: 0,
        transform: `translate(${offset}px, ${offset}px) rotate(${rotation}deg)`,
        border: `1px solid rgba(236, 227, 214, ${0.15 - i * 0.03})`,
        background: 'var(--surface-0)',
        opacity,
        zIndex: -1 - i,
      }}
    />
  );
})}
```

---

## Special Variants

### Nomenclate Cards (Atlas)

Cards for entities with "Nomenclate" allegiance get special treatment:

```css
.card--nomenclate {
  border-color: rgba(139, 90, 90, 0.3);
}

.card--nomenclate:hover {
  border-color: rgba(139, 90, 90, 0.5);
}
```

### Compact Cards (Constellation View)

```tsx
<div style={{ width: 120 }}>
  <img style={{ height: 150 }} />
  <div className="p-2">
    <div style={{ fontSize: 9, letterSpacing: '0.08em' }}>
      {name}
    </div>
    {/* Mini threat bar */}
    <div className="flex gap-0.5 mt-1">
      {threatSegments.map(...)}
    </div>
  </div>
</div>
```

### Stat Cards (Ledger)

```tsx
<div style={{ padding: 20, background: 'var(--paper)' }}>
  <p style={{ fontSize: 10, letterSpacing: '0.12em' }}>{label}</p>
  <p style={{ fontSize: 24, color: 'var(--gold)' }}>{value}</p>
  {trend && <TrendIndicator {...} />}
</div>
```

---

## Accessibility

1. **Focus indicators** — Visible focus ring on keyboard navigation
2. **Color contrast** — All text meets WCAG AA (4.5:1 minimum)
3. **Interactive targets** — Minimum 44x44px touch targets
4. **Screen readers** — Use semantic HTML (`<article>`, `<h3>`, etc.)
5. **Motion** — Respect `prefers-reduced-motion` for animations

```css
@media (prefers-reduced-motion: reduce) {
  .card {
    transition: none;
  }
  .card:hover {
    transform: none;
  }
}
```

---

## Implementation Checklist

When implementing a new card:

- [ ] Zero border-radius
- [ ] Dawn-08 border at rest
- [ ] Dawn-30 border on hover
- [ ] 16px internal padding
- [ ] PT Mono for titles/labels
- [ ] IBM Plex Sans for descriptions
- [ ] Corner brackets on hover
- [ ] Lift animation (-2px translateY)
- [ ] Proper aspect ratio (3:4 or 4:5)
- [ ] Gradient overlay on images
- [ ] Status indicators use semantic colors
- [ ] Keyboard focus state
- [ ] Reduced motion support

---

*Last updated: December 2024*

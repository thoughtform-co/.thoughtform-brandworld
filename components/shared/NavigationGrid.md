# Navigation Grid - Design Primitive

## Overview

The Navigation Grid is a **fixed overlay frame system** that creates the "mission control" aesthetic across Thoughtform platforms. It consists of four corner brackets (L-shapes) and two vertical rails with tick marks, providing spatial awareness and navigation context.

**Core Principle**: The grid frame stays fixed while content scrolls beneath it, creating the "window into space" metaphor.

## Visual Structure

```
┌────────────────────────────────────────────────────────┐
│ [TL]                                           [TR]    │
│  │                                               │     │
│  │  tick                                         │     │
│  │  tick                                         │     │
│  │  tick                                         │     │
│  │  tick                                         │     │
│  │                                               │     │
│  │                                               │     │
│  │  tick                                         │     │
│  │                                               │     │
│ [BL]                                           [BR]    │
└────────────────────────────────────────────────────────┘
```

- **TL/TR/BL/BR**: Corner brackets (L-shapes)
- **Left/Right vertical lines**: Faded vertical rails
- **Horizontal ticks**: Small marks on the vertical lines

## Component Structure

### 1. Corner Brackets

Four L-shaped brackets positioned at each corner of the viewport.

**Positioning**:
- `position: fixed`
- Top corners: `top: var(--hud-padding)`
- Bottom corners: `bottom: var(--hud-padding)`
- Left corners: `left: var(--hud-padding)`
- Right corners: `right: var(--hud-padding)`

**Structure**:
```css
.corner {
  position: absolute;
  width: var(--corner-size);    /* Default: 40px */
  height: var(--corner-size);
}

/* L-shape created with ::before and ::after */
.corner::before {  /* horizontal line */
  width: var(--corner-size);
  height: 2px;
}

.corner::after {   /* vertical line */
  width: 2px;
  height: var(--corner-size);
}
```

### 2. Vertical Rails

Two vertical rails on left and right sides, containing tick marks.

**Positioning**:
- `position: fixed`
- Top: `calc(var(--hud-padding) + var(--corner-size) + 20px)`
- Bottom: `calc(var(--hud-padding) + var(--corner-size) + 20px)`
- Left rail: `left: var(--hud-padding)`
- Right rail: `right: var(--hud-padding)`
- Width: `var(--rail-width)` (Default: 60px)

**Vertical Line**:
- Created with `::before` pseudo-element
- `width: 1px`
- Positioned at `left: 0` (left rail) or `right: 0` (right rail)
- Faded gradient: transparent at top/bottom, solid in middle (10%-90%)

### 3. Tick Marks

Horizontal lines that mark scale intervals along the vertical rails.

**Distribution**:
- Use `justify-content: space-between` to evenly distribute
- Default: 20 ticks (0-20 range)
- Major ticks: Every 5th tick (0, 5, 10, 15, 20)
- Minor ticks: All other ticks

**Sizing**:
- Major tick: `width: 20px`
- Minor tick: `width: 10px`
- Height: `1px` for all ticks

**Positioning**:
- Left rail: `left: 0` (aligned with vertical line)
- Right rail: `right: 0` (aligned with vertical line)

## Design Tokens

### Spacing

```css
:root {
  /* Base padding from viewport edges */
  --hud-padding: clamp(32px, 4vw, 64px);
  
  /* Corner bracket size */
  --corner-size: 40px;           /* Desktop */
  --corner-size-tablet: 30px;    /* Tablet */
  --corner-size-mobile: 24px;    /* Mobile */
  
  /* Rail width */
  --rail-width: 60px;            /* Desktop */
  --rail-width-tablet: 0;        /* Tablet: hidden */
  --rail-width-mobile: 0;        /* Mobile: hidden */
  
  /* Gap between corner and rail */
  --corner-rail-gap: 20px;
}
```

### Aspect Ratio Responsiveness

The grid system uses **viewport-relative units** (`clamp()`, `vw`, `vh`) to scale appropriately:

- **Desktop (>1100px)**: Full grid visible, corners 40px, rails 60px
- **Tablet (600-1100px)**: Corners 30px, rails hidden
- **Mobile (<600px)**: Corners 24px, rails hidden

### Scaling Formula

```css
/* Corner size scales with viewport */
--corner-size: clamp(24px, 2.5vw, 40px);

/* Padding scales with viewport width */
--hud-padding: clamp(24px, 4vw, 64px);
```

## Color Customization

**Important**: Colors are the **only** platform-specific variable. Structure and positioning remain constant.

### Color Variables

```css
:root {
  /* Platform-specific accent color */
  --grid-color: var(--gold);           /* thoughtform.co */
  --grid-color-50: var(--gold-50);     /* 50% opacity */
  --grid-color-30: var(--gold-30);     /* 30% opacity */
}

/* Platform variations: */
/* Astrolabe: --grid-color: var(--gold) */
/* Atlas: --grid-color: var(--gold) */
/* Ledger Dark: --grid-color: var(--verde) */
/* Ledger Light: --grid-color: var(--teal) */
```

### Color Application

- **Corner brackets**: `background: var(--grid-color)`
- **Vertical rails**: `background: linear-gradient(..., var(--grid-color-50), ...)`
- **Major ticks**: `background: var(--grid-color)`
- **Minor ticks**: `background: var(--grid-color-50)`
- **Labels/text**: Use platform text color (usually `--dawn` or `--ink`)

## Implementation Guide

### Step 1: Base Container

```html
<div class="navigation-grid">
  <!-- Corners -->
  <div class="grid-corner grid-corner-tl"></div>
  <div class="grid-corner grid-corner-tr"></div>
  <div class="grid-corner grid-corner-bl"></div>
  <div class="grid-corner grid-corner-br"></div>
  
  <!-- Rails -->
  <aside class="grid-rail grid-rail-left">
    <div class="rail-scale">
      <div class="scale-ticks">
        <!-- Ticks generated dynamically -->
      </div>
    </div>
  </aside>
  
  <aside class="grid-rail grid-rail-right">
    <div class="rail-scale">
      <div class="scale-ticks">
        <!-- Ticks generated dynamically -->
      </div>
    </div>
  </aside>
</div>
```

### Step 2: Base Styles

```css
.navigation-grid {
  position: fixed;
  inset: 0;
  pointer-events: none;  /* Allow clicks through */
  z-index: 100;
}
```

### Step 3: Corner Brackets

```css
.grid-corner {
  position: absolute;
  width: var(--corner-size);
  height: var(--corner-size);
  pointer-events: none;
}

.grid-corner::before,
.grid-corner::after {
  content: '';
  position: absolute;
  background: var(--grid-color);
}

/* Top-left */
.grid-corner-tl {
  top: var(--hud-padding);
  left: var(--hud-padding);
}
.grid-corner-tl::before {
  top: 0;
  left: 0;
  width: var(--corner-size);
  height: 2px;
}
.grid-corner-tl::after {
  top: 0;
  left: 0;
  width: 2px;
  height: var(--corner-size);
}

/* Repeat for TR, BL, BR with appropriate positioning */
```

### Step 4: Vertical Rails

```css
.grid-rail {
  position: absolute;
  top: calc(var(--hud-padding) + var(--corner-size) + var(--corner-rail-gap));
  bottom: calc(var(--hud-padding) + var(--corner-size) + var(--corner-rail-gap));
  width: var(--rail-width);
  display: flex;
  flex-direction: column;
}

.grid-rail-left {
  left: var(--hud-padding);
}

.grid-rail-right {
  right: var(--hud-padding);
}

/* Faded vertical line */
.grid-rail-left::before,
.grid-rail-right::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    var(--grid-color-50) 10%,
    var(--grid-color-50) 90%,
    transparent 100%
  );
}

.grid-rail-left::before {
  left: 0;
}

.grid-rail-right::before {
  right: 0;
}
```

### Step 5: Tick Marks

```css
.rail-scale {
  flex: 1;
  position: relative;
  width: 100%;
}

.scale-ticks {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;  /* or right: 0 for right rail */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.tick {
  height: 1px;
  background: var(--grid-color-50);
}

.tick-major {
  width: 20px;
  background: var(--grid-color);
}

.tick-minor {
  width: 10px;
  background: var(--grid-color-50);
}
```

### Step 6: Dynamic Tick Generation

```typescript
// Generate 20 ticks (0-20)
const tickCount = 20;
const ticks = Array.from({ length: tickCount + 1 }, (_, i) => ({
  index: i,
  isMajor: i % 5 === 0,
  label: i % 5 === 0 ? String(i) : null,  // Optional labels
}));

// Render
{ticks.map((tick) => (
  <div
    key={tick.index}
    className={`tick ${tick.isMajor ? 'tick-major' : 'tick-minor'}`}
  />
))}
```

## Platform Variations

### thoughtform.co (Reference)
- **Color**: Gold (`#CAA554`)
- **Grid visible**: Full (all elements)
- **Use case**: Navigation cockpit with depth scales

### Astrolabe
- **Color**: Gold (`#CAA554`)
- **Grid visible**: Full
- **Use case**: Navigation instrument panel

### Atlas
- **Color**: Gold (`#CAA554`)
- **Grid visible**: Corners only (rails hidden)
- **Use case**: Specimen archive frame

### Ledger Dark
- **Color**: Verde (`#2B4E40`)
- **Grid visible**: Full
- **Use case**: Data terminal frame

### Ledger Light
- **Color**: Teal (`#3D8B7A`)
- **Grid visible**: Full
- **Use case**: Blueprint measurement frame

## Responsive Behavior

### Breakpoints

```css
/* Desktop: Full grid */
@media (min-width: 1100px) {
  :root {
    --corner-size: 40px;
    --rail-width: 60px;
  }
}

/* Tablet: Smaller corners, hide rails */
@media (max-width: 1100px) {
  :root {
    --corner-size: 30px;
    --rail-width: 0;
  }
  
  .grid-rail {
    display: none;
  }
}

/* Mobile: Minimal corners */
@media (max-width: 600px) {
  :root {
    --corner-size: 24px;
    --rail-width: 0;
    --hud-padding: clamp(16px, 4vw, 32px);
  }
  
  .grid-rail {
    display: none;
  }
}
```

## Additional Elements (Optional)

### Moving Indicator (Depth Gauge)

A diamond indicator that moves along the rail based on scroll position:

```css
.scale-indicator {
  position: absolute;
  left: 0;  /* or right: 0 for right rail */
  width: 100%;
  height: 2px;
  background: var(--grid-color);
  transition: top 0.3s ease-out;
}

.scale-indicator::before {
  content: '';
  position: absolute;
  left: -5px;
  top: -4px;
  width: 10px;
  height: 10px;
  background: var(--grid-color);
  transform: rotate(45deg);  /* Creates diamond shape */
}
```

### Readouts/Markers

Content can be placed at the bottom of rails:

```css
.rail-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
  padding-left: 28px;  /* Left rail */
  /* or padding-right: 28px; for right rail */
}
```

## Developer Checklist

When implementing the Navigation Grid:

- [ ] Set up CSS variables for colors (platform-specific)
- [ ] Implement corner brackets (4 L-shapes)
- [ ] Position rails relative to corners (20px gap)
- [ ] Create faded vertical lines (gradient, 1px width)
- [ ] Generate tick marks (20 ticks, space-between)
- [ ] Distinguish major/minor ticks (every 5th = major)
- [ ] Make grid responsive (clamp() for sizing)
- [ ] Hide rails on tablet/mobile if needed
- [ ] Set `pointer-events: none` on container
- [ ] Set `pointer-events: auto` on interactive elements
- [ ] Test across different aspect ratios
- [ ] Verify colors match platform theme

## Non-Negotiables

1. **Fixed positioning** — Grid must stay fixed while content scrolls
2. **Corner size scales** — Use `clamp()` or viewport units, never fixed px
3. **Rail positioning** — Always `corner-size + 20px` gap from corner
4. **Tick distribution** — Use `justify-content: space-between` (never absolute positioning)
5. **Faded rails** — Vertical lines must fade at top/bottom (10%-90%)
6. **Color variables** — Never hardcode colors, always use CSS variables
7. **Pointer events** — Container is `none`, interactive elements are `auto`

## File Locations

- **Reference implementation**: `components/hud/HUDFrame.tsx` (thoughtform.co)
- **Styles**: `app/globals.css` (`.hud-corner`, `.hud-rail` classes)
- **This specification**: `components/shared/NavigationGrid.md`

## Usage Example

```tsx
import { NavigationGrid } from '@/components/shared/NavigationGrid';

function MyPlatform() {
  return (
    <>
      <NavigationGrid 
        color="gold"  // or "verde", "teal", etc.
        showRails={true}
        tickCount={20}
      />
      {/* Your content */}
    </>
  );
}
```

---

**Last Updated**: Based on thoughtform.co implementation  
**Platform Status**: thoughtform.co ✅ | Astrolabe ⏳ | Atlas ⏳ | Ledger ⏳


---
name: thoughtform-design
description: Generate retrofuturistic UIs with sharp geometry, living particle systems, and purposeful glitch aesthetic for Thoughtform platforms.
triggers: [thoughtform, astrolabe, atlas, ledger, semantic UI, particle system, entity card, topology, retrofuturistic, glitch]
---

# Thoughtform Design

Build navigation instruments, not productivity software. CRT-inspired warmth meets technical precision.

## Core Identity

**Meaning is geometry.** Concepts exist as coordinates in high-dimensional space. Our interfaces make that navigation tangible — like brass sextants for the latent space.

## Non-Negotiables

- `border-radius: 0` — Sharp corners everywhere, no exceptions
- **PT Mono** for headings, labels, navigation; **IBM Plex** for body
- **GRID=3** pixel snapping for all particles
- No box-shadows — use borders and transparency for depth
- No system fonts — no Arial, Helvetica, Inter
- No purple gradients — stay within the Dawn/Gold/Verde/Teal palette

## Platform Palette

| Platform | Mode | Background | Accent | Character |
|----------|------|------------|--------|-----------|
| **Astrolabe** | Dark | Void | Gold | Brass sextant, star charts, knowledge navigation |
| **Atlas** | Dark | Void | Dawn/Gold | Victorian specimen archive, xenobiology lab |
| **Ledger Dark** | Dark | Void | Verde | Blade Runner terminal, data streams |
| **Ledger Light** | Light | Paper | Teal | NASA blueprint, financial schematic |

Reference `thoughtform://tokens/colors` for exact values.

---

## Glitch as Leitmotif

The glitch aesthetic is a **unifying thread** across all platforms. It represents the boundary where meaning dissolves into mathematical form.

### Glitch Levels

| Level | Effect | When to Use |
|-------|--------|-------------|
| **0** | Clean | Reading, primary content |
| **1** | Noise/grain | Ambient atmosphere, backgrounds |
| **2** | Scanlines | Loading, processing states |
| **3** | Displacement | Transitions, state changes |
| **4** | Chromatic aberration | Errors, warnings, dramatic moments |

### Application Rules

- **Loading states**: Apply level 2 scanlines over content
- **Processing indicators**: Use particle coalesce + level 2
- **Error states**: Apply level 4 aberration + threat/signal color
- **Page transitions**: Brief level 3 displacement during route changes
- **Hover on warnings**: Flicker between level 0 and 3

### CSS Implementation

```css
/* Scanlines (Level 2) */
.scanlines::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: repeating-linear-gradient(
    0deg,
    transparent 0px,
    transparent 2px,
    rgba(0, 0, 0, 0.03) 2px,
    rgba(0, 0, 0, 0.03) 3px
  );
}

/* Chromatic aberration text (Level 4) */
.glitch-text {
  position: relative;
}
.glitch-text::before,
.glitch-text::after {
  content: attr(data-text);
  position: absolute;
  inset: 0;
  opacity: 0.7;
}
.glitch-text::before {
  color: rgba(255, 50, 50, 0.7);
  transform: translateX(-2px);
  mix-blend-mode: screen;
}
.glitch-text::after {
  color: rgba(50, 50, 255, 0.7);
  transform: translateX(2px);
  mix-blend-mode: screen;
}
```

---

## Component Patterns

### Container Patterns

| Platform | Pattern | Implementation |
|----------|---------|----------------|
| **Atlas** | Display case | Glass-edge borders, specimen centered, dark void surround |
| **Ledger Light** | Wireframe box | Corner brackets, paper background, subtle ink border |
| **Astrolabe** | Instrument panel | Vertical dividers, tool sections, fixed position |

### Data Display Patterns

| Platform | Pattern | Implementation |
|----------|---------|----------------|
| **Atlas** | Metric visualization | Canvas-based, particle-rendered gauges and graphs |
| **Ledger Light** | Diamond-marked table | Rows with ◆ markers, teal hover states |
| **Astrolabe** | Coordinate readout | Monospace values with axis labels (X:, Y:) |

### Interactive Patterns

| State | Dark Mode | Light Mode |
|-------|-----------|------------|
| **Hover** | Dawn glow at 8% opacity | Teal border at 50% opacity |
| **Focus** | Gold 1px border | Teal 2px border |
| **Selected** | Gold background at 5%, Dawn border | Teal background at 8% |
| **Disabled** | 30% opacity, no interaction | 50% opacity, muted ink |

### Modal Patterns

| Platform | Style | Behavior |
|----------|-------|----------|
| **Atlas** | Examination chamber | Centered, dark backdrop with particle ambient |
| **Ledger Light** | Blueprint overlay | Slide from edge, paper surface, corner brackets |
| **Astrolabe** | Navigation sheet | Full-height panel, section dividers |

---

## Particle System

```javascript
const GRID = 3; // Non-negotiable

function drawPixel(ctx, x, y, color, alpha, size = GRID) {
  const px = Math.floor(x / GRID) * GRID;
  const py = Math.floor(y / GRID) * GRID;
  ctx.fillStyle = `rgba(${color}, ${alpha})`;
  ctx.fillRect(px, py, size - 1, size - 1);
}
```

### Platform Behaviors

| Platform | Behavior | Description |
|----------|----------|-------------|
| **Astrolabe** | `axis-flow` | Particles flow outward along Vector I axes |
| **Atlas** | `radial-organic` | Breathing, radial movement centered on subject |
| **Ledger Dark** | `horizontal-flow` | Scanline-like horizontal drift |
| **Ledger Light** | `clustered-topology` | Breathing clusters with connection lines |

Reference `thoughtform://particles` for full implementation.

---

## Visual Markers

- **Diamond markers** `◆` (filled) and `◇` (outline) — use instead of circles
- **ASCII prefixes**: `//` for section labels, `│` for dividers
- **Corner brackets** on wireframe boxes (Ledger Light)
- **Crosshairs** for targeting, focus indicators, coordinate centers
- **Threat dots** (5px circles) for Atlas entity status

---

## Typography Scale

Use PT Mono for UI elements, IBM Plex for content:

| Scale | Size | Use |
|-------|------|-----|
| `2xs` | 7px | Coordinate values, glyphs |
| `xs` | 9px | Labels, badges |
| `sm` | 11px | Secondary text, metadata |
| `base` | 13px | Body text |
| `lg` | 16px | Subheadings |
| `xl` | 20px | Section titles |
| `2xl` | 28px | Page titles |

All uppercase for labels: `letter-spacing: 0.1em`

---

## Component Translation Guide

When building new components, map the need to a brand metaphor:

| Need | Metaphor | Atlas | Ledger | Astrolabe |
|------|----------|-------|--------|-----------|
| Avatar | Identity marker | Specimen portrait with threat ring | Diamond with initials | Coordinate badge |
| Notification | Alert signal | Floating card from void | Banner with brackets | Panel alert strip |
| Dropdown | Selection instrument | Glass menu, specimen options | Blueprint list | Navigation selector |
| Progress | Measurement gauge | Particle fill | Flow line with nodes | Axis gauge |
| Empty state | Absence acknowledgment | "No specimens catalogued" | "Begin your epoch" | "Chart your first document" |

---

## Quality Checklist

Before shipping, verify:

- [ ] Zero border-radius anywhere
- [ ] Correct platform colors (reference tokens)
- [ ] PT Mono for all titles/labels
- [ ] Particles use GRID=3
- [ ] Glitch effects are purposeful (not decorative)
- [ ] Diamond markers instead of circles
- [ ] Would NOT be described as "generic AI output"
- [ ] Feels like an instrument, not an application

# Layer Architecture

Design elements exist in four layers. **This is the critical insight for implementation.**

---

## The Four Layers

| Layer | Domain | Source of Rules | Primary Concern |
|-------|--------|-----------------|-----------------|
| **VOID** | Negative space | Philosophy | Presence vs absence |
| **STRUCTURE** | Layout, spacing, typography | UX best practices | Optical correctness |
| **SIGNAL** | Generative/expressive elements | Expressive math | Aliveness, atmosphere |
| **FORM** | Components, UI elements | Composition of above | Usability, interaction |

---

## The Critical Distinction: Structure ≠ Signal

**STRUCTURE** and **SIGNAL** are *siblings*, not parent-child. They share DNA but have independent rules.

| Aspect | STRUCTURE | SIGNAL |
|--------|-----------|--------|
| **What it governs** | Layout, spacing, typography, grid | Particles, glitch, ambient motion |
| **Rules come from** | UX best practices, accessibility, optical correctness | Expressive math, philosophical meaning |
| **Base unit** | 4px | 3px (GRID constant) |
| **Why different** | Humans need predictable, readable spacing | Particles need visible quantization for aesthetic |
| **Flexibility** | Low — follow the spec | High — semantic logic guides |

---

## Why This Matters

**Don't derive button padding from particle math.**
**Don't constrain particle behavior to 4px grid.**

They're parallel systems that share:
- Color palette
- Geometric vocabulary (sharp corners, diamond markers)
- Typographic voice

But they have independent numeric systems because they serve different purposes.

---

## Shared DNA (The Design Genome)

What Structure and Signal both inherit:

### Colors
```
void:     #070604  (warm black, not pure)
dawn:     #ECE3D6  (semantic white)
gold:     #CAA554  (accent, the beacon)
verde:    #2B4E40  (Ledger dark)
teal:     #3D8B7A  (Ledger light)
```

### Geometric Vocabulary
- Sharp corners (`border-radius: 0` always)
- 1px hairlines
- Diagonal clip-paths
- Diamond markers
- Cross/plus motifs

### Typographic Voice
- PT Mono / PP Mondwest → System voice (navigation, labels, coordinates)
- IBM Plex / PP Neue Montreal → Content voice (body text, descriptions)
- Crimson Pro → Scholarly voice (Atlas only)

---

## Implementation Guide

### Structure System (4px base)

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-6: 24px;
--space-8: 32px;
```

Rule: If 12px *looks* better than 16px, use 12px. Structure serves human perception.

### Signal System (3px base)

```javascript
const GRID = 3; // Non-negotiable for particles

function drawPixel(ctx, x, y, color, alpha) {
  const px = Math.floor(x / GRID) * GRID;
  const py = Math.floor(y / GRID) * GRID;
  ctx.fillStyle = `rgba(${color}, ${alpha})`;
  ctx.fillRect(px, py, GRID - 1, GRID - 1);
}
```

Rule: Quantization is aesthetic. The 3px grid creates visible pixelation that evokes CRT phosphor dots.

---

## Layer Composition

Every component is a composition across layers:

```
VOID
└─► STRUCTURE (spacing, layout)
    └─► SIGNAL (ambient, generative)
        └─► FORM (interactive, solid)
```

The question isn't "does this feel right?" but:
1. **What layer does this element belong to?**
2. **What rules govern that layer?**
3. **How much signal should leak through?**

---

*Philosophy is the compass. Structure is the vessel. Signal is the wind. Form is the destination.*

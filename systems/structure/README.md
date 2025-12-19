# Structure System

Layout, spacing, typography, and grid primitives. Rules come from UX best practices and optical correctness.

---

## Base Unit: 4px

```css
--space-1: 4px;   /* Tight internal spacing */
--space-2: 8px;   /* Related elements */
--space-3: 12px;  /* Component padding */
--space-4: 16px;  /* Standard gap */
--space-6: 24px;  /* Section separation */
--space-8: 32px;  /* Major divisions */
```

**Rule:** Optical over mathematical. If 12px *looks* better than 16px, use 12px.

---

## Typography Scale

| Scale | Size | Use |
|-------|------|-----|
| `2xs` | 7px | Coordinate values, glyphs |
| `xs` | 9px | Labels, badges |
| `sm` | 11px | Secondary text, metadata |
| `base` | 13px | Body text |
| `lg` | 16px | Subheadings |
| `xl` | 20px | Section titles |
| `2xl` | 28px | Page titles |

---

## Line Height

| Context | Line Height |
|---------|-------------|
| UI labels | 1.2 |
| Body text | 1.5–1.6 |
| Long-form reading | 1.75–1.8 |

---

## Content Widths

| Context | Width |
|---------|-------|
| Reading | 48rem (768px) |
| Page | 56rem (896px) |
| Full layout | 72rem (1152px) |
| Dialogs | max 760px |

---

## Grid

Use standard responsive grid systems:
- 12-column for marketing
- Reading-width with sidebars for tools

Nothing exotic — distinctiveness comes from surface treatment, not grid novelty.

---

## Source Files

- `spacing.json` — Spacing scale values
- `grid.md` — Grid system documentation
- `layout-patterns.md` — Common layout patterns
- `../../tokens/spacing.json` — Canonical spacing tokens

---
name: Component Grammar System
overview: Define a front-end design grammar for Thoughtform.co—consistent card anatomy, spatial rhythm, and text placement rules—that elevates the marketing site while preserving the unique navigation aesthetic.
todos:
  - id: card-component
    content: Create CardFrame.tsx with three tiers (content, terminal, data) using existing token system
    status: pending
  - id: section-label-refactor
    content: Extend existing SectionHeader.tsx to support both // LABEL and 01 LABEL patterns
    status: pending
  - id: services-refactor
    content: Refactor ServicesSection.tsx to use CardFrame with unified spacing
    status: pending
  - id: shift-alignment
    content: Align ShiftSection.tsx cards with same CardFrame anatomy
    status: pending
  - id: globals-cleanup
    content: Add card tier CSS classes to globals.css for NavigationCockpitV2 usage
    status: pending
---

# Component Grammar System

## The Problem

Your foundation is solid—tokens, HUD frame, particle system, navigation grid. What's missing is a **unified card anatomy** that makes service cards, shift cards, and terminal frames feel like siblings rather than cousins.**Current state** (from codebase analysis):| Component | Accent | Padding | Internal Structure ||-----------|--------|---------|-------------------|| `ServicesSection` cards | Left bar (3px) | `p-6` | image → label → title → desc || `ShiftSection` cards | Top bar (3px) | `pt-10 px-8 pb-8` | label → title → desc || `service-card` (globals.css) | None | `var(--space-xl)` | id → title → desc || `terminal-frame` | Corner brackets | `var(--space-2xl)` | header → content → footer |The accent bar position, padding values, and internal structure vary. This is what feels "off."

## What to Build

### 1. CardFrame Component

A single reusable component with **three tiers**:**Tier 1: ContentCard** (services, features)

```javascript
┌─────────────────────────┐
│ ┃ LABEL                 │  ← Accent bar (left OR top)
│ ┃ Title                 │
│ ┃ Body text...          │
│ ┃                       │
│ ┃ meta           →      │  ← Optional action
└─────────────────────────┘
   Padding: 32px (--space-xl)
   Gap: 16px internal
```

**Tier 2: TerminalFrame** (manifesto, modals)

- Keep existing corner bracket system
- Standardize internal padding to `--space-2xl` (48px)
- Footer tags snap to bottom

**Tier 3: DataCard** (stats, metrics)

- Compact: `--space-lg` (24px) padding
- Label → Large value → Trend

### 2. Spacing Standardization

Your tokens already have the 8px grid in [tailwind.config.ts](../08_Artifacts/12_Thoughtform.co/tailwind.config.ts):

```typescript
spacing: {
  xs: "4px",   sm: "8px",   md: "16px",
  lg: "24px", xl: "32px", "2xl": "48px", ...
}
```

**Rules to enforce:**

- Card internal padding: Always `xl` (32px) for content cards
- Card gap (between cards): Always `lg` (24px)
- Section gap: Always `2xl` (48px) or `3xl` (64px)
- Label-to-title gap: Always `md` (16px)
- Title-to-body gap: Always `sm` (8px)

### 3. Visual Anchoring: Index Badge

**No accent bars.** Instead, use a simple gold index number as the visual anchor:

```javascript
┌─────────────────────────────┐
│ 01                          │  ← Gold number (9px, mono, tracking-wide)
│ Title Here                  │  ← Dawn, 15px, mono
│ Body text describing the    │  ← Dawn-50, 14px, body font
│ service or feature...       │
│                             │
│ meta · location        →    │  ← Dawn-30, 11px (optional)
└─────────────────────────────┘
   Border: 1px dawn-08
   Padding: 32px (--space-xl)
```

This approach:

- Feels like coordinates/waypoints (on-brand for navigation metaphor)
- Less visually aggressive than colored bars
- Already exists in your `service-card` CSS pattern
- Works across light/dark contexts

### 4. Text Hierarchy Lock

| Element | Font | Size | Color | Spacing Above ||---------|------|------|-------|---------------|| Card label | mono | 9px (2xs) | gold/type color | 0 || Card title | mono | 15px | dawn | 16px || Card body | body | 14px | dawn-50 | 8px || Card meta | mono | 11px | dawn-30 | auto (flex-end) |

## Files to Create/Modify

### In Thoughtform.co codebase:

1. **Create** `components/ui/CardFrame.tsx`

- Props: `tier`, `accent`, `accentColor`, `children`
- Three variants matching the tiers above

2. **Extend** `components/ui/SectionHeader.tsx`

- Add optional `number` prop for "01 SERVICES" pattern
- Keep existing "// LABEL" as default

3. **Refactor** `components/sections/ServicesSection.tsx`

- Replace inline card markup with `<CardFrame tier="content">`
- Standardize padding/gaps

4. **Refactor** `components/sections/ShiftSection.tsx`

- Same CardFrame usage for consistency

5. **Add to** `app/globals.css`

- `.card-content`, `.card-terminal`, `.card-data` classes
- For NavigationCockpitV2 which uses CSS classes

### In brandworld repo (documentation):

6. **Create** `tokens/component-grammar.json`

- Document the tier system
- Reference from marketing.json

## Visual Structure

```javascript
┌─────────────────────────────────────────────────────────────┐
│  RAIL                    CONTENT ZONE                  RAIL │
│  ┊                                                       ┊  │
│  ┊  // SERVICES ────────────────────────────────────────┊  │
│  ●                                                       ┊  │
│  ┊  ┌─ TOP ACCENT ─────┐  ┌─ TOP ACCENT ─────┐          ┊  │
│  ┊  │ LABEL            │  │ LABEL            │          ┊  │
│  ┊  │ Title            │  │ Title            │          ┊  │
│  ┊  │ Body text here   │  │ Body text here   │          ┊  │
│  ┊  │ with max-width   │  │ with max-width   │          ┊  │
│  ┊  │                  │  │                  │          ┊  │
│  ┊  │ meta        →    │  │ meta        →    │          ┊  │
│  ┊  └──────────────────┘  └──────────────────┘          ┊  │
│  ┊                                                       ┊  │
│  ┊                                         LANDMARK ●    ┊  │
└─────────────────────────────────────────────────────────────┘
```



## Priority Sequence

1. **CardFrame.tsx** — The reusable foundation
2. **ServicesSection refactor** — Most visible improvement
3. **ShiftSection alignment** — Consistency proof
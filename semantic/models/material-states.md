# Material States

Meaning moves through three states. Every design element exists somewhere on this continuum.

---

## The Continuum

```
VOID ────────────► SIGNAL ────────────► FORM
absence             emergence            crystallization
potential           threshold            meaning
```

---

## VOID

**Character:** Pure potential. Absence. The infinite before manifestation.

**Visual expression:**
- Warm black space (not pure #000 — use #070604)
- Negative space that feels inhabited rather than empty
- Depth without explicit representation

**When to use:**
- Backgrounds
- Creating contrast
- Establishing depth

**Key insight:** Void isn't nothing — it's pregnant nothing.

---

## SIGNAL

**Character:** Emergence. Pattern at the edge of recognition. The moment before meaning crystallizes.

**Visual expression:**
- Particles, glitch, dithering
- ASCII, scanlines
- Anything that shows *process* rather than *result*

**When to use:**
- Ambient elements
- Transitions
- Navigation indicators
- Anywhere you want to show information emerging rather than simply appearing

**Key insight:** Signal is the threshold material — the visual expression of meaning crossing from human to machine.

---

## FORM

**Character:** Crystallized meaning. Human-readable. Stable.

**Visual expression:**
- Solid typography
- Buttons, panels, cards
- The stuff users interact with directly

**When to use:**
- Interactive elements
- Primary content
- Anything that needs to be unambiguously readable

**Key insight:** Form is what remains after signal resolves.

---

## Composition Rule

Most components are **FORM with SIGNAL edges emerging from VOID**.

```
┌─────────────────────────────────────────────┐
│                                             │
│    [VOID: Black background]                 │
│                                             │
│         ·  ·    ·                           │
│       ·      ·     ·                        │
│         [SIGNAL: Particle accent]           │
│                                             │
│    ┌─────────────────────────┐              │
│    │                         │              │
│    │  [FORM: Solid panel]    │              │
│    │                         │              │
│    │  Title Text             │              │
│    │  Body content           │              │
│    │                         │              │
│    │  [ACTION BUTTON]        │              │
│    │                         │              │
│    └─────────────────────────┘              │
│                                             │
└─────────────────────────────────────────────┘
```

---

## Signal Quotient

Every component has a measurable signal quotient:

| Component | Signal Quotient | Expression |
|-----------|-----------------|------------|
| Button | 0-10% | Solid container, subtle hover glow |
| Card | 10-20% | 1px border, possible particle accent on important cards |
| Navigation Grid | 30-50% | Corner brackets, rail system, ambient presence |
| Hero Section | 60%+ | Particle system as primary visual |
| Data Visualization | Variable | Data determines density — particles represent data |

---

## Interactive States and Signal

| State | Signal Treatment |
|-------|------------------|
| Default | Minimal or none |
| Hover | Glow emerges, border brightens |
| Active | Gold accent, possible particle burst |
| Focus | Border solidifies |
| Disabled | Signal drains away, muted |

---

*Where does the threshold live in your component? That's where signal should concentrate.*

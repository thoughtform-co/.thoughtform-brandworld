---
name: semantic-design
description: |
  Foundational design system for Thoughtform platforms combining semantic brand architecture with interface patterns. Use when: (1) Building Thoughtform UI components, pages, or visualizations, (2) Interpreting visual references and mood boards, (3) Creating design elements, keynotes, or presentations, (4) Maintaining brand coherence across platforms (Astrolabe, Atlas, Ledger), (5) Working with the particle system or navigation grid, (6) Translating inspiration into Thoughtform dialect. Triggers on: semantic navigation, brand translation, design system, visual reference interpretation, UI components, particle visualization, navigation grid, keynote design, Thoughtform aesthetics.
---

# Semantic Design

Two-layer system for Thoughtform: semantic brand architecture (Layer 1) defines meaning, interface patterns (Layer 2) make that meaning navigable. Brand architecture is foundational—interface patterns derive from it.

## Core Principle

Traditional brand guidelines restrict: "use these colors, don't do X."
Semantic brand systems interpret: "understand these meanings, express them appropriately."

A green oscilloscope doesn't match Thoughtform's palette. But it's semantically aligned—instrument making invisible visible, living mathematical form. The translation: extract that essence, render in Thoughtform dialect.

---

## Layer 1: Semantic Brand Architecture

Encode vision as conceptual anchors, then interpret diverse inspirations through that lens.

### The Six Anchors

Meanings, not aesthetics. Regions of semantic space all Thoughtform expressions inhabit:

| Anchor | Meaning |
|--------|---------|
| **NAVIGATION** | Finding position in unmappable space. Human agency facing infinite possibility. |
| **THRESHOLD** | Boundary between comprehensible and alien. Liminal space, portals, edges. |
| **INSTRUMENT** | Tools extending perception. Making invisible visible. |
| **LIVING GEOMETRY** | Math that behaves organically. Computation with breath. |
| **GRADIENT** | Continuum over binary. Everything is "how much," not "whether." |
| **SIGNAL** | Information emerging from noise. Pattern at edge of perception. |

→ Full anchor definitions: [BRAND-ARCHITECTURE.md](references/BRAND-ARCHITECTURE.md)

### Translation Protocol

1. **Extract** semantic position from reference (what makes it resonate)
2. **Map** to anchors (which meanings does it activate)
3. **Measure** translation distance (how far from target dialect)
4. **Render** through platform tokens (colors, type, motion)

→ Protocol details and examples: [BRAND-ARCHITECTURE.md](references/BRAND-ARCHITECTURE.md)

### Complexity Gradient

Brand elements exist on a complexity spectrum:

```
TOKENS → GRIDS → COMPONENTS → PARTICLES
simple                            complex
```

| Level | Elements | Freedom |
|-------|----------|---------|
| **Tokens** | Colors, fonts, spacing | Low—use as specified |
| **Grids** | Navigation grid, layout, positioning | Medium—adapt to context |
| **Components** | Cards, dialogs, panels, templates | Medium—compose from primitives |
| **Particles** | Particle system, flow behavior | High—semantic logic guides |

→ Implementation details: [COMPLEXITY-GRADIENT.md](references/COMPLEXITY-GRADIENT.md)
→ Navigation grid CSS: [assets/navigation-grid.css](assets/navigation-grid.css)

---

## Layer 2: Interface Patterns

UX primitives for navigable meaning-space. These derive from brand architecture—the anchors determine what patterns express.

### Core Primitives

- **Position** — Everything embeddable has coordinates
- **Distance** — Nearness is meaningful
- **Interpolation** — Path between points contains information
- **Gradients** — Spectrums over binaries
- **Clustering** — Categories emerge from proximity

### Key Patterns

- **Semantic Zoom** — Continuous abstraction transformation
- **Fisheye** — Focus magnifies, context compresses
- **Passive Resonance** — Discovery without search
- **Translation** — Same DNA renders across types

→ Full pattern library: [INTERFACE-PATTERNS.md](references/INTERFACE-PATTERNS.md)

---

## Platform Dialects

Same anchors, different tokens:

| Platform | Character | Primary Anchors |
|----------|-----------|-----------------|
| **Astrolabe** | Brass warmth, night sky, celestial precision | Navigation, Instrument |
| **Atlas** | Victorian naturalist meets cosmic horror | Threshold, Living Geometry |
| **Ledger** | Green phosphor terminal, Blade Runner corporate | Instrument, Signal |
| **Marketing** | Portal invitation, threshold from outside | Threshold, Navigation |

Access tokens via `thoughtform-design:get_design_tokens` for platform-specific values.

---

## Working with References

When interpreting visual inspiration:

1. Extract why it resonates (function, relationship, tension)
2. Score against anchors (which activate, how strongly)
3. Identify what to preserve (meaning) vs transform (surface)
4. Render through target platform dialect

The mood board becomes infinite. The filter is semantic, not stylistic.

→ Practical guide with examples: [THOUGHTFORM-APPLICATION.md](references/THOUGHTFORM-APPLICATION.md)

---

## Evolving the System

New insights refine understanding without breaking coherence:

**Stable:** Anchors (rarely change), dialect relationships
**Evolving:** Anchor expressions, token refinements, new patterns
**Additive:** New references expand territory within anchor boundaries

→ Evolution protocol: [THOUGHTFORM-APPLICATION.md](references/THOUGHTFORM-APPLICATION.md)

---

## Quick Reference

**Building UI:** Read [COMPLEXITY-GRADIENT.md](references/COMPLEXITY-GRADIENT.md), get platform tokens, apply patterns

**Interpreting reference:** Read [BRAND-ARCHITECTURE.md](references/BRAND-ARCHITECTURE.md), extract → map → render

**Creating keynote/presentation:** Read [THOUGHTFORM-APPLICATION.md](references/THOUGHTFORM-APPLICATION.md) for templates and conventions

**Working with particles:** Read [COMPLEXITY-GRADIENT.md](references/COMPLEXITY-GRADIENT.md) particle section

---

*Where traditional guidelines say "match these colors," semantic design says "inhabit this meaning."*


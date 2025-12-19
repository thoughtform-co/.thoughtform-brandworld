# Systems Layer

Executable primitives that implement the semantic layer. Two parallel systems with shared DNA but independent rules.

---

## Contents

| Folder | Purpose | Base Unit |
|--------|---------|-----------|
| [`structure/`](structure/) | Layout, spacing, typography, grid | 4px |
| [`signal/`](signal/) | Particles, glitch, generative elements | 3px (GRID) |
| [`typography/`](typography/) | Font rules, fallback chains | — |

---

## The Critical Distinction

**Structure** and **Signal** are siblings, not parent-child.

| Aspect | Structure | Signal |
|--------|-----------|--------|
| Rules come from | UX best practices | Expressive math |
| Base unit | 4px | 3px |
| Flexibility | Low | High |
| Serves | Human perception | Aesthetic atmosphere |

Don't derive button padding from particle math.
Don't constrain particles to the 4px grid.

---

## Shared DNA

Both systems inherit from the semantic layer:
- Color palette (void, dawn, gold, verde, teal)
- Geometric vocabulary (sharp corners, diamonds, 1px lines)
- Typographic voice (mono for system, sans for content)

---

## Related Files

| Location | Description |
|----------|-------------|
| `../tokens/` | Token values (colors, spacing, motion) |
| `../particles/` | Particle system implementation |
| `../semantic/models/layer-architecture.md` | Theoretical foundation |

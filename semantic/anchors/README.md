# Semantic Anchors

Anchors are **meanings**, not aesthetics. They define regions of conceptual space Thoughtform inhabits.

---

## The Six Anchors

| Anchor | Meaning | Primary Tensions |
|--------|---------|------------------|
| **NAVIGATION** | Finding position in unmappable space. Wayfinding when maps don't exist. | Known ↔ unknown, precision ↔ uncertainty |
| **THRESHOLD** | Boundary between comprehensible and alien. Liminal space, portals. | Inside ↔ outside, safe ↔ dangerous |
| **INSTRUMENT** | Tools extending perception. Making invisible visible. | Human ↔ machine, intuition ↔ measurement |
| **LIVING_GEOMETRY** | Math that behaves organically. Computation with breath. | Order ↔ chaos, mechanical ↔ organic |
| **GRADIENT** | Continuum over binary. Everything is "how much," not "whether." | Discrete ↔ continuous, categories ↔ spectrums |
| **SIGNAL** | Information emerging from noise. Pattern at perception's edge. | Noise ↔ signal, hidden ↔ revealed |

---

## Anchor Definitions

Each anchor file contains:

```yaml
name: ANCHOR_NAME
meaning: |
  Philosophical core in 1-2 sentences
resonatesWith:
  - List of references that activate this anchor
expressions:
  - Visual/experiential manifestations
tensions:
  - Pole A ↔ Pole B
translations:
  - Physical patterns this anchor maps to (from translations/)
```

---

## Scoring References

When interpreting any reference, score each anchor 1-5:

```
NAVIGATION:      ●●●○○ (3) - moderate activation
THRESHOLD:       ●●●●● (5) - strong activation
INSTRUMENT:      ●○○○○ (1) - barely relevant
...
```

**Interpretation:**
- Total score < 10: Reference may not be in Thoughtform territory
- 2+ anchors score 4-5: Strong alignment, worth translating
- Only 1 anchor high: Partial alignment—extract that aspect only

---

## Source Files

- `definitions.json` — Machine-readable anchor data (canonical source)
- Individual `{ANCHOR}.md` files — Human-readable with examples

See also: `../translations/` for Anchor → Physical Pattern mappings

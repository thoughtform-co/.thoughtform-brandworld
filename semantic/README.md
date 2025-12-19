# Semantic Layer

The meaning layer of Thoughtform's design system. This is the stable, rarely-changing conceptual foundation from which all visual expression flows.

---

## Contents

| Folder | Purpose | Stability |
|--------|---------|-----------|
| [`anchors/`](anchors/) | The six semantic anchors (NAVIGATION, THRESHOLD, INSTRUMENT, LIVING_GEOMETRY, GRADIENT, SIGNAL) | Very stable |
| [`translations/`](translations/) | Anchor → Physical Pattern mappings (THE workflow) | Stable |
| [`dialects/`](dialects/) | Platform-specific anchor weightings + token mappings | Stable |
| [`models/`](models/) | Material states (VOID→SIGNAL→FORM), layer architecture | Very stable |
| [`antipatterns.md`](antipatterns.md) | Never/always rules | Stable |

---

## The Core Insight

Traditional brand guidelines **restrict**: "use these colors, don't do X."
Semantic brand systems **interpret**: "understand these meanings, express them appropriately."

A green oscilloscope doesn't match Thoughtform's palette. But it's semantically aligned—instrument making invisible visible, living mathematical form. The translation: extract that essence, render in the target dialect.

---

## The Workflow

```
Reference → Anchor Scoring → Translation Selection → Physical Pattern → Implementation
```

1. **Score the reference** against anchors (which meanings does it activate?)
2. **Select translations** from `translations/translation-table.json`
3. **Choose physical patterns** that implement those translations
4. **Implement** using the appropriate dialect's tokens

---

## Related Files

| Location | Description |
|----------|-------------|
| `skills/semantic-design/SKILL.md` | Claude/Cursor skill for semantic design |
| `skills/semantic-design/references/BRAND-ARCHITECTURE.md` | Full anchor definitions with examples |
| `tokens/anchors/definitions.json` | Machine-readable anchor data |

---

*Where traditional guidelines say "match these colors," semantic design says "inhabit this meaning."*

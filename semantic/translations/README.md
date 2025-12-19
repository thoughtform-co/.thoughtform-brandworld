# Translation Table

**This is THE workflow.** The Anchor → Translation → Physical Pattern cascade is how references become Thoughtform implementations.

---

## The Cascade

```
Anchor (meaning) → Translation (concept) → Physical Pattern (implementation)
```

**Example:**
```
THRESHOLD → Display Case → EntityCard with glass-edge borders, specimen centered
NAVIGATION → Rail System → NavigationGrid with vertical rails + corner brackets
INSTRUMENT → Readout → StatCard with mono value, label above
```

---

## Translation Table Structure

```json
{
  "NAVIGATION": {
    "translations": ["Rail System", "Coordinate Badge", "Axis Gauge", "Vector Field"],
    "physicalPatterns": {
      "Rail System": {
        "component": "NavigationGrid",
        "element": "vertical rails + corner brackets",
        "signalQuotient": [10, 30]
      }
    }
  }
}
```

---

## How to Use

1. **Score your reference** against anchors (see `../anchors/`)
2. **Find high-scoring anchors** (3+ activation)
3. **Look up translations** for those anchors in `translation-table.json`
4. **Select appropriate physical patterns** based on context
5. **Implement** using the pattern's component/element guidance

---

## Files

- `translation-table.json` — Machine-readable translation mappings
- See also: `../../tokens/translation/protocol.md` for the full translation protocol

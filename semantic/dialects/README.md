# Platform Dialects

Same anchors express differently across platforms. A dialect is an anchor system rendered through specific tokens.

---

## The Five Dialects

| Dialect | Character | Primary Anchors | Mode |
|---------|-----------|-----------------|------|
| **Astrolabe** | Brass sextant, night sky | NAVIGATION, INSTRUMENT | Dark |
| **Atlas** | Victorian naturalist meets cosmic horror | THRESHOLD, LIVING_GEOMETRY | Dark |
| **Ledger Dark** | Blade Runner corporate terminal | INSTRUMENT, SIGNAL | Dark |
| **Ledger Light** | NASA blueprint, morning shift | INSTRUMENT, SIGNAL | Light |
| **Marketing** | Invitation to the portal | THRESHOLD, NAVIGATION | Both |

---

## Dialect Structure

Each dialect file contains:

```json
{
  "name": "astrolabe",
  "character": "Brass sextant against night sky. Warm precision. Navigator's study at 3am.",
  "mode": "dark",
  "anchors": {
    "primary": ["NAVIGATION", "INSTRUMENT"],
    "secondary": ["LIVING_GEOMETRY", "GRADIENT"]
  },
  "tokens": {
    "background": "void",
    "text": "dawn",
    "accent": "gold"
  },
  "particleBehavior": "axis-flow",
  "motion": "instrument-easing"
}
```

---

## Dialect Coherence Test

Work from different dialects should feel like **siblings**—same family, different rooms.

- If they feel unrelated → anchors aren't consistent
- If they feel identical → dialects aren't differentiated enough

---

## Source Files

- `astrolabe.json`, `atlas.json`, `ledger-dark.json`, `ledger-light.json`, `marketing.json`
- See also: `../../tokens/platforms/` for token values

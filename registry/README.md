# Asset Registry

Machine-readable catalog of Thoughtform's design DNA. This is the source of truth from which skill files are generated.

---

## Contents

| File | Purpose |
|------|---------|
| `assets.schema.json` | JSON Schema for asset entries |
| `assets.json` | All registered assets (tokens, patterns, components, behaviors) |
| `validation.json` | Formalized tests and anti-pattern rules |

---

## What Gets Registered

Everything with semantic meaning:

| Type | Examples |
|------|----------|
| `token` | Colors, spacing values, motion curves |
| `primitive` | Spacing scale, type scale |
| `pattern` | Rail System, Display Case, Readout |
| `component` | EntityCard, StatCard, NavigationGrid |
| `system` | Particle system, Glitch system |
| `behavior` | axis-flow, radial-organic, horizontal-flow |

---

## Asset Schema Overview

Each asset has:

```json
{
  "id": "entity-card",
  "name": "Entity Card",
  "type": "component",
  "layer": "form",
  "signalQuotient": {
    "range": [20, 40],
    "expression": "Corner brackets on hover, threat indicator glow"
  },
  "anchors": {
    "primary": ["THRESHOLD"],
    "secondary": ["LIVING_GEOMETRY"],
    "weights": { "THRESHOLD": 0.9, "LIVING_GEOMETRY": 0.6 }
  },
  "translations": ["Display Case", "Specimen Frame"],
  "dialects": ["atlas"],
  "paths": {
    "docs": "components/atlas/EntityCard.md",
    "implementation": "components/atlas/EntityCard.tsx"
  },
  "validation": {
    "requiredTests": ["instrument-test"],
    "antipatterns": ["no-border-radius"]
  }
}
```

---

## Validation Rules

`validation.json` contains:

### Tests
Human-readable quality checks:
- Instrument Test ("Could this exist in brass and glass?")
- Ctrl Creep Test (mutual human-machine alienness)
- Material State Check (can you identify signal quotient?)

### Anti-patterns
Machine-checkable CSS rules:
- `no-border-radius` — regex: `border-radius:\s*[^0]`
- `no-pure-black` — regex: `#000000|#000\b`
- `no-inter-font` — regex: `font-family:.*Inter`

---

## Skill Generation

This registry is the source of truth. A build step generates Claude skill files:

```bash
npm run build:skills
```

Output goes to `../build/skills/`

---

## Related Files

| Location | Description |
|----------|-------------|
| `../semantic/` | Meaning layer (anchors, translations, dialects) |
| `../systems/` | Implementation primitives |
| `../components/` | Component implementations |
| `../build/skills/` | Generated skill files |

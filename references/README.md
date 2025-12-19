# Reference Library

Visual and conceptual references that inform Thoughtform's design, with semantic metadata for intelligent retrieval.

---

## Contents

| Folder/File | Purpose |
|-------------|---------|
| `entries/` | Markdown files with frontmatter for each reference |
| `assets/` | Small preview images (webp/png, <500KB each) |
| `index/` | Search index (V1: keywords, V2: vectors) |
| `reference.schema.json` | JSON Schema for reference entries |
| `local.config.example.json` | Template for local Dropbox paths |

---

## Adding a Reference

### 1. Create Entry File

```markdown
---
id: nasa-mission-control-1969
title: "NASA Mission Control, Apollo 11"
source: "https://example.com/image.jpg"
referenceMode: philosophical
anchorScores:
  NAVIGATION: 0.9
  INSTRUMENT: 0.9
  THRESHOLD: 0.5
suggestedTranslations:
  - Rail System
  - Instrument Panel
  - Coordinate Readout
dialectAffinity:
  astrolabe: 0.9
  ledger-dark: 0.6
translationDistance: medium
tags:
  - retrofuturism
  - control-room
  - collective-navigation
---

## Why This Resonates

Human-scale interface to vast systems. Collective navigation. Instrument readouts as shared truth. Warm electronics despite technical precision.

## Translation Notes

- CRT glow → gold/dawn temperature
- Instrument banks → panel-based layout
- Analog precision → deliberate motion timing
```

### 2. Add Preview Image

Save a small preview to `assets/{id}.webp` (max 500KB).

### 3. Update Index

Run the indexing script (or manually add to `index/keywords.json`).

---

## Reference Modes

| Mode | Meaning | Translation Approach |
|------|---------|---------------------|
| **direct** | Implement this pattern | Adapt to Thoughtform tokens |
| **philosophical** | Extract essence | Translate through anchors |
| **hybrid** | Partial implementation | Some direct, some philosophical |

---

## Anchor Scores

Score each anchor 0.0–1.0 based on how strongly the reference activates it:

- 0.0–0.3: Barely relevant
- 0.3–0.6: Moderate activation
- 0.6–0.9: Strong activation
- 0.9–1.0: Core expression

---

## Translation Distance

| Distance | Description | Approach |
|----------|-------------|----------|
| **close** | Similar visual language | Token substitution |
| **medium** | Shared meaning, different expression | Selective transformation |
| **far** | Strong anchor alignment, very different surface | Full re-expression |

---

## Dropbox Integration

Large original files stay in Dropbox. Configure paths in `local.config.json`:

```json
{
  "roots": {
    "generalReferences": "C:\\Users\\...\\07_Artifacts\\_01_GENERAL REFERENCES"
  }
}
```

Reference entries can link to Dropbox via:
```yaml
external:
  rootKey: generalReferences
  relativePath: "NASA/apollo-11-control.jpg"
```

---

## Search (V1)

V1 uses keyword + tag filtering:

```
GET /references?anchor=NAVIGATION&anchor=INSTRUMENT&mode=philosophical
```

Returns references sorted by combined anchor score.

---

## Future: V2 Embeddings

When library exceeds ~200 items:
- Add Voyage embeddings for automatic anchor scoring
- Natural language search queries
- Cross-modal search (find references similar to an image)

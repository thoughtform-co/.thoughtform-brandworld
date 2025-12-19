# Reference Workflow Guide

How to add references to the Thoughtform semantic design system.

---

## Quick Start

1. **Create entry file** in `references/entries/{id}.md`
2. **Score anchors** 0.0–1.0 for each of the six anchors
3. **Select reference mode** (direct, philosophical, hybrid)
4. **Suggest translations** from the translation table
5. **Update the keyword index** in `references/index/keywords.json`

---

## Step 1: Create Entry File

Create a markdown file with YAML frontmatter:

```markdown
---
id: my-reference-id
title: "Descriptive Title"
source: "https://example.com/image.jpg"
referenceMode: philosophical
anchorScores:
  NAVIGATION: 0.3
  THRESHOLD: 0.8
  INSTRUMENT: 0.5
  LIVING_GEOMETRY: 0.2
  GRADIENT: 0.1
  SIGNAL: 0.4
suggestedTranslations:
  - Display Case
  - Liminal Glow
dialectAffinity:
  astrolabe: 0.4
  atlas: 0.9
  ledger-dark: 0.3
  ledger-light: 0.2
  marketing: 0.5
translationDistance: medium
tags:
  - retrofuturism
  - specimen
createdAt: 2024-12-17T00:00:00Z
---

# Title

## Why This Resonates

[Explain what makes this reference align with Thoughtform]

## What to Extract

[Table of elements → meanings → translations]

## What to Transform

[Table of original → Thoughtform version]

## Translation Notes

[How to apply this reference]
```

---

## Step 2: Score Anchors

For each anchor, score 0.0–1.0:

| Score | Meaning |
|-------|---------|
| 0.0–0.3 | Barely relevant |
| 0.3–0.6 | Moderate activation |
| 0.6–0.9 | Strong activation |
| 0.9–1.0 | Core expression |

**Scoring questions:**

| Anchor | Ask Yourself |
|--------|--------------|
| **NAVIGATION** | Does it help find position in unmapped space? |
| **THRESHOLD** | Is it at a boundary between known/unknown? |
| **INSTRUMENT** | Does it extend perception, make invisible visible? |
| **LIVING_GEOMETRY** | Does math behave organically, data breathe? |
| **GRADIENT** | Does it show continuum over binary? |
| **SIGNAL** | Does pattern emerge from noise? |

---

## Step 3: Select Reference Mode

| Mode | When to Use | Translation Approach |
|------|-------------|---------------------|
| **direct** | Visual language already close to Thoughtform | Token substitution — adapt colors/fonts |
| **philosophical** | Strong meaning alignment, different surface | Extract essence, rebuild from scratch |
| **hybrid** | Some elements direct, some philosophical | Mix approaches per element |

**Examples:**

- Blade Runner terminals → **direct** (Ledger Dark IS this)
- NASA Mission Control → **philosophical** (meaning aligns, surface transforms)
- Oscilloscope display → **hybrid** (grid pattern direct, colors transform)

---

## Step 4: Suggest Translations

Look up translations in `semantic/translations/translation-table.json`:

1. Find your high-scoring anchors (0.6+)
2. Look up their translations
3. Select the most relevant physical patterns

**Example:** Reference scores high on THRESHOLD + LIVING_GEOMETRY:
- THRESHOLD translations: Display Case, Portal Frame, Gateway, Liminal Glow
- LIVING_GEOMETRY translations: Particle Cloud, Breathing Element, Organic Flow

Select the ones that match: "Display Case", "Organic Flow"

---

## Step 5: Update Keyword Index

Add your reference to `references/index/keywords.json`:

```json
{
  "entries": {
    "my-reference-id": {
      "title": "Descriptive Title",
      "referenceMode": "philosophical",
      "translationDistance": "medium",
      "anchors": {
        "highest": ["THRESHOLD", "INSTRUMENT"],
        "scores": {
          "THRESHOLD": 0.8,
          "INSTRUMENT": 0.5
        }
      },
      "dialects": {
        "highest": ["atlas"],
        "scores": { "atlas": 0.9 }
      },
      "translations": ["Display Case", "Liminal Glow"],
      "tags": ["retrofuturism", "specimen"]
    }
  }
}
```

Also update the index sections:
- `tagIndex` — add ID to each tag
- `anchorIndex` — add ID to high-scoring anchors
- `dialectIndex` — add ID to high-affinity dialects
- `translationIndex` — add ID to each translation

---

## Using the MCP Tools

Once added, you can search and use references via MCP:

```
// Search by anchor
search_references({ anchors: ["THRESHOLD", "INSTRUMENT"] })

// Search by dialect
search_references({ dialect: "atlas" })

// Get translation suggestions
suggest_translation({ referenceId: "my-reference-id" })

// Get full translation chain
get_translation_chain({ anchor: "THRESHOLD" })
```

---

## Example: Adding NASA Mission Control

### 1. Create `references/entries/nasa-mission-control-1969.md`

Score anchors:
- NAVIGATION: 0.9 (collective wayfinding)
- INSTRUMENT: 0.9 (readouts extending perception)
- SIGNAL: 0.6 (data streams)
- THRESHOLD: 0.5 (edge of the possible)

### 2. Select mode: `philosophical`

Why? The meaning (collective navigation, warm precision) aligns perfectly, but the visual language (1960s green CRTs) transforms to Thoughtform tokens.

### 3. Suggest translations:
- Rail System (from NAVIGATION)
- Panel (from INSTRUMENT)
- Readout (from INSTRUMENT)
- Coordinate Badge (from NAVIGATION)

### 4. Set dialect affinity:
- astrolabe: 0.9 (primary match)
- ledger-dark: 0.7 (terminal aesthetic)

### 5. Update index

Add to all relevant indices.

---

## Tips

- **Start with 2-3 references** to refine your scoring intuition
- **Be honest about scores** — not everything is a 0.9
- **Note what surprised you** — references that reveal new anchor expressions
- **Link to originals** in Dropbox via `external.rootKey` + `external.relativePath`

---

*The reference library grows. The semantic understanding deepens.*

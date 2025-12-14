# Interface Patterns

UX primitives for navigable meaning-space. These patterns derive from brand architecture—the anchors determine what patterns express.

---

## Foundation

AI encodes meaning as coordinates. Interfaces make that geometry tangible:

- **Position** = semantic identity
- **Distance** = relationship strength
- **Movement** = meaning transformation
- **Clustering** = emergent categories

---

## Core Primitives

### Position

Everything embeddable has coordinates. Show *where* concepts live.

**Pattern:** Enable "what's near this?" as primary interaction.
- Hover → show neighbors
- Click → center on position
- Documents positioned by content, not folder

### Distance

Nearness is meaningful. Farness is meaningful.

**Pattern:** Distance visible without interaction.
- Unexpected neighbors surface hidden connections
- Gaps between clusters show opportunity
- Drift over time shows evolution

### Interpolation

The path between two points contains information endpoints don't.

**Pattern:** Make interpolation interactive.
- State scrubbing: drag between historical states
- Concept blending: midpoint generates third idea
- Scenario morphing: "30% more toward target"

### Clustering

Categories emerge from proximity. Don't impose—discover.

**Pattern:** Name clusters AFTER discovery.
- Let data reveal its organization
- Spending clusters by latent theme, not accounting category
- Document groups by similarity, not explicit tags

---

## Scale Patterns

### Semantic Zoom

Continuous transformation between abstraction levels.

| Level | Shows |
|-------|-------|
| Narrative | Single-sentence summary |
| Cluster | Aggregate blocks |
| Item | Individual entries |
| Full | Maximum context |

**Critical:** Scroll continuously transforms abstraction. No mode switches.

### Fisheye

Magnify focus while compressing surroundings.

**Principle:** Never lose the ocean while studying a fish.
- Focus expands with maximum context
- Surroundings curve into peripheral compression
- Context never disappears—only compresses

---

## Discovery Patterns

### Passive Resonance

Surface related items without explicit search.

**Flow:**
1. User hovers/focuses on content
2. System finds semantically similar content elsewhere
3. Related items appear in side panel
4. User explores or ignores

**Critical:** Filter obvious matches. Surface cross-boundary connections only.

### Gap Visualization

Show what's missing.

**Applications:**
- Empty regions between clusters = opportunity
- Missing document types in collection
- Underrepresented perspectives

### Drift Monitoring

Compare intentions against revealed patterns.

**Question:** "Am I who I say I am?"

- Stated priorities vs. actual spending
- Declared focus vs. actual research
- Alert when delta exceeds norms

---

## Generation Patterns

### Multiple Drafts

Generate several variations. Let human taste select.

**Why:** Probability space contains a cloud of answers. Exposing the cloud enables judgment.

### Translation

Same semantic DNA renders across entity types.

**Flow:**
1. Entity exists as embedding (truth)
2. User requests translation to different type
3. System generates rendering
4. Translation cached with own embedding
5. Translations become searchable

### Gap Filling

Generate into empty space.

- "What entities would exist here?"
- "Generate document connecting these clusters"
- "Create transition between positions"

---

## Two-Layer Architecture

| Layer | Function | Speed |
|-------|----------|-------|
| Embeddings | Find what's near | Fast, cheap |
| LLM | Explain why | Slow, expensive |

**Rule:** Never make LLM guess what embeddings could look up. Never ask embeddings to explain.

---

## Platform Application

Same patterns, different tokens:

**Astrolabe:** Passive Resonance → Semantic Resonance panel. Semantic Zoom → Canon overview ↔ document detail.

**Atlas:** Position → Entity constellation. Gradients → Threat levels.

**Ledger:** Clustering → Spending topology. Drift → Era detection.

---

*Position is meaning. Navigation is thinking.*


# Thoughtform Application Guide

Practical guide for applying semantic design to Thoughtform work, including workflows for different tasks and how to evolve the system as vision crystallizes.

---

## When to Use What

| Task | Primary Reference | Tools |
|------|-------------------|-------|
| **Interpreting visual reference** | BRAND-ARCHITECTURE.md Part 1 | Anchor scoring |
| **Building UI component** | COMPLEXITY-GRADIENT.md | `thoughtform-design:get_design_tokens` |
| **Creating keynote/presentation** | This guide (Keynote workflow) | Navigation grid, marketing dialect |
| **Designing new platform** | BRAND-ARCHITECTURE.md Part 2 | Dialect definition |
| **Adding interface pattern** | INTERFACE-PATTERNS.md | Pattern library |
| **Evolving the system** | This guide (Evolution section) | Change log template |

---

## Workflow: Interpreting a Reference

When Vince shares an image, object, or concept for inspiration:

### Step 1: Extract Resonance (Not Surface)

**Ask:** Why does this feel right?

| Wrong | Right |
|-------|-------|
| "It's got grid lines and green color" | "Instrument making invisible signals perceptible" |
| "Dark with glowing elements" | "Threshold between known and alien, warmth in void" |
| "Minimalist, technical" | "Precision that breathes—mechanical with organic rhythm" |

**Questions to answer:**
- What is it *for*? (Function)
- What does it make visible? (Affordance)
- What tension does it hold? (Drama)
- What relationship does it create? (Connection)

### Step 2: Score Against Anchors

```
NAVIGATION:      ●○○○○ to ●●●●●
THRESHOLD:       ●○○○○ to ●●●●●
INSTRUMENT:      ●○○○○ to ●●●●●
LIVING GEOMETRY: ●○○○○ to ●●●●●
GRADIENT:        ●○○○○ to ●●●●●
SIGNAL:          ●○○○○ to ●●●●●
```

**Interpretation:**
- Total < 10: May not be Thoughtform territory
- 2+ anchors at 4-5: Strong alignment
- 1 anchor high: Partial alignment—extract that aspect

### Step 3: Determine Translation Distance

| Distance | Description | Approach |
|----------|-------------|----------|
| **Close** | Similar visual language | Token substitution |
| **Medium** | Shared meaning, different surface | Selective transformation |
| **Far** | Strong anchor alignment, very different aesthetic | Full re-expression |

### Step 4: Note Insights for Evolution

If reference reveals something new about an anchor:

```
INSIGHT: [What the reference taught us]
ANCHOR: [Which anchor it affects]
UPDATE: [How anchor understanding expands]
```

Example:
```
INSIGHT: Radar sweep motion suggests cyclical/rotational patterns
ANCHOR: LIVING GEOMETRY
UPDATE: Add rotational motion to expressions (not just flow)
```

---

## Workflow: Building UI Components

### Step 1: Identify Platform

| Platform | Background | Accent | Body Font |
|----------|------------|--------|-----------|
| Astrolabe | Void | Gold | IBM Plex Sans |
| Atlas | Void | Dawn | Crimson Pro |
| Ledger Dark | Void | Verde | IBM Plex Mono |
| Ledger Light | Paper | Teal | IBM Plex Mono |
| Marketing | Void/Paper | Gold | IBM Plex Sans |

### Step 2: Get Tokens

```
thoughtform-design:get_design_tokens(platform: "astrolabe")
thoughtform-design:get_color_css(platform: "astrolabe")
```

### Step 3: Determine Complexity Level

| Question | Answer → Level |
|----------|----------------|
| "What color?" | Token (use as specified) |
| "Where does it go?" | Grid (follow zones) |
| "How should it look?" | Component (compose) |
| "How should it feel?" | Particle (semantic guidance) |

### Step 4: Build and Check

**Quality checklist:**
- [ ] Zero border-radius everywhere
- [ ] Correct background for platform
- [ ] PT Mono for all labels/navigation
- [ ] Correct body font for platform
- [ ] Colors from tokens only
- [ ] Would NOT be described as "generic AI output"

---

## Workflow: Creating Keynotes/Presentations

### Setup

1. Use Navigation Grid frame
2. Apply Marketing dialect tokens
3. Dark background (Void) unless specifically light context

### Slide Structure

```
┌─                                                        ─┐
│  THOUGHTFORM / SECTION                    SLIDE 01/12   │
│                                                          │
│                                                          │
│                   [MAIN CONTENT]                         │
│                                                          │
│                                                          │
│                                                          │
│  ◇ STATUS                              semantic nav /   │
└─                                                        ─┘
```

### Content Patterns

**Title Slides:**
- Large PT Mono text
- Centered or left-aligned
- Particles: scattered → gathering

**Content Slides:**
- Left-heavy layout (content left, visual right)
- PT Mono for headers
- IBM Plex Sans for body
- Subtle grid visible

**Quote/Callout Slides:**
- Centered text
- Large pull quote
- Attribution in muted PT Mono

**Diagram Slides:**
- Use anchor colors for semantic meaning
- Gold = navigation/structure
- Dawn = content/human
- Grid lines visible

### Motion

- Scroll-triggered reveals (marketing dialect)
- Particle crystallization moments
- No bounce/spring easing (too playful)
- Instrument easing: snappy start, gentle settle

### Quality Check

- [ ] Would work projected in dark room
- [ ] Feels like navigation instrument, not slide deck
- [ ] Sharp corners everywhere
- [ ] PT Mono for all technical/label text
- [ ] Particles have semantic meaning (not decoration)

---

## Workflow: Defining New Platform Dialect

When extending Thoughtform to a new context:

### Step 1: Identify Primary Anchors

Which 2-3 anchors dominate this context?

```
New Platform: [Name]
Candidate Anchors: [List all 6]
Primary: [2-3 that dominate]
Secondary: [1-2 for accent]
```

### Step 2: Define Character

One evocative sentence:

```
Good: "Victorian naturalist meets cosmic horror"
Good: "Brass sextant against night sky"
Bad: "Professional and clean"
Bad: "Modern technology interface"
```

### Step 3: Choose Background Mode

- **Void (dark):** Night shift, CRT, immersive
- **Paper (light):** Blueprint, engineering, daytime precision

### Step 4: Select Tokens

| Element | Choice | Rationale |
|---------|--------|-----------|
| Accent | Gold / Dawn / Verde / Teal | [Why this color] |
| Body font | Plex Sans / Crimson Pro / Plex Mono | [Why this voice] |
| Particle behavior | [Description] | [What it represents] |

### Step 5: Document Dialect

Add to BRAND-ARCHITECTURE.md Part 2:

```markdown
#### [New Platform]

**Character:** [One sentence]

**Primary anchors:** [List]
**Secondary:** [List]

**Tokens:**
- Background: [value]
- Text: [value]
- Accent: [value]
- Body font: [value]
- Particles: [behavior]
- Motion: [character]
```

### Step 6: Sibling Test

Create one component. Place next to existing platform work.

- Does it feel like same family? ✓
- Does it feel differentiated? ✓
- Would someone recognize it as Thoughtform? ✓

---

## The Stability Spectrum

Not everything changes at the same rate:

```
STABLE ◄─────────────────────────────────────────► EVOLVING

Anchors        Dialect         Expressions        References
(meanings)     relationships   (how anchors       (new 
               (platform       manifest)          inspirations)
               families)
```

### Stable (Rarely Change)

- The six anchor meanings
- Core dialect relationships (Astrolabe=warm, Ledger=cool)
- Zero border-radius rule
- PT Mono for coordinates
- 4px base grid
- GRID=3 particle snapping

**Change requires:** Fundamental philosophy shift

### Evolving (Refine Over Time)

- How anchors express visually
- Component patterns
- Particle behaviors
- Specific token values (hex codes)
- Typography scale

**Change requires:** New insight or improved understanding

### Additive (Always Expanding)

- Reference library
- Translation examples
- New dialect definitions
- Pattern variations

**Change requires:** New work that fits within boundaries

---

## Evolution Protocol

When updating the system:

### Type 1: Anchor Clarification

New language for existing meaning.

**Example:** "Michael Levin's insight that intelligence is a gradient—that's exactly what GRADIENT captures."

**Action:** Add reference to anchor documentation. No structural change.

### Type 2: Expression Expansion

New way an anchor can manifest.

**Example:** "Lissajous curves show LIVING GEOMETRY can be mathematically pure, not just particle-based."

**Action:** Add to anchor's "Resonates with" and "Expressions" lists.

### Type 3: Dialect Refinement

Platform character becomes clearer.

**Example:** "Atlas isn't just 'dark and mysterious'—it's specifically 'Victorian naturalist meets cosmic horror.'"

**Action:** Update dialect description. May cascade to component guidance.

### Type 4: New Pattern Discovery

Recurring solution worth codifying.

**Example:** "We keep using corner brackets to frame content. That's the Navigation Grid pattern."

**Action:** Document in COMPLEXITY-GRADIENT.md or INTERFACE-PATTERNS.md.

### What Doesn't Change

If an update would require changing:
- Anchor meanings (not expressions)
- Core dialect relationships
- Fundamental geometry (sharp corners, 4px grid)

...it's probably misaligned with existing territory. Pause and reconsider.

---

## Evolution Log Template

Track changes to maintain system coherence:

```markdown
## [Date]

**Type:** [Clarification | Expansion | Refinement | Pattern]
**Trigger:** [What prompted this]
**Change:** [What was updated]
**Preserves:** [What stayed stable]
**Files updated:** [List]
```

Example:

```markdown
## 2024-12-15

**Type:** Expression Expansion
**Trigger:** Radar display reference showed rotational motion
**Change:** Added cyclical/rotational patterns to LIVING GEOMETRY expressions
**Preserves:** Anchor meaning unchanged ("math that breathes")
**Files updated:** BRAND-ARCHITECTURE.md
```

---

## Quality Checks

### Does It Feel Thoughtform?

- [ ] Activates at least 2 anchors at level 3+
- [ ] Uses platform dialect tokens correctly
- [ ] Sharp corners (no border-radius)
- [ ] PT Mono for technical/coordinate elements
- [ ] Could exist alongside sibling work
- [ ] NOT describable as "generic AI output"

### For Particle Systems

- [ ] Movement has semantic meaning
- [ ] Behavior matches platform dialect
- [ ] 3px grid quantization (GRID=3)
- [ ] Responds to user attention
- [ ] Breathes/pulses organically

### For Components

- [ ] Composed from token primitives
- [ ] Follows grid positioning
- [ ] Hierarchy clear without decoration
- [ ] Works on correct background
- [ ] Readable in intended context

### The Ctrl Creep Test

> "LLMs will never know light, fire, warmth, sprained wrist, the smell of bread; but neither do we feel wordslip, letter-sparkling, alliteration fugue, the numb wrongness of leaping to a distant conceptspace."

Does this work express that mutual alienness?

- If generic tech brand could claim it → not Thoughtform
- If incomprehensibly weird → lost the human side
- **Sweet spot:** "instrument for navigating alien intelligence"

---

*The system grows by accumulation within boundaries, not by boundary expansion.*

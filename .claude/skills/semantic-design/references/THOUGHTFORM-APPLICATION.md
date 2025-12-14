# Thoughtform Application Guide

Practical guide for applying semantic design to Thoughtform work, including how to evolve the system as vision crystallizes.

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

**Stable (rarely change):**
- The six anchors themselves
- Core dialect relationships (Astrolabe = warm, Ledger = cool)
- Zero border-radius rule
- PT Mono for coordinates

**Evolving (refine over time):**
- How anchors express visually
- Component patterns
- Particle behaviors
- Token values (specific hex codes)

**Additive (always expanding):**
- Reference library
- Translation examples
- New insight integrations

---

## Processing New References

When you share a reference image, object, or concept:

### Step 1: Extract Resonance

Ask: Why does this feel right?

**Not:** "It's got grid lines and green color"
**But:** "It's an instrument making invisible signals perceptible. Technical precision with organic waveform behavior."

**Questions to answer:**
- What is it *for*?
- What does it make visible?
- What tension does it hold?
- What relationship does it create?

### Step 2: Map to Anchors

Score each anchor 1-5:

```
Example: Vintage radar display

NAVIGATION:      ●●●●● (5) - literally for navigation
THRESHOLD:       ●●●○○ (3) - edge of perception
INSTRUMENT:      ●●●●● (5) - tool extending senses
LIVING GEOMETRY: ●●○○○ (2) - sweep motion is organic
GRADIENT:        ●●○○○ (2) - range rings suggest continuum
SIGNAL:          ●●●●○ (4) - signals emerging from noise
```

If total score < 10, reference may not be in Thoughtform territory.
If 2+ anchors score 4-5, strong alignment.

### Step 3: Determine What Transfers

**Meaning to preserve:**
- The function (navigation instrument)
- The relationship (operator ↔ system)
- The tension (precision ↔ uncertainty)

**Surface to transform:**
- Colors → platform palette
- Typography → platform fonts
- Specific forms → Thoughtform geometry

### Step 4: Note for Future

If reference reveals something new about an anchor, note it:

> "The radar's sweep motion suggests LIVING GEOMETRY can include rotational/cyclical patterns, not just flow. Consider for Astrolabe."

This expands anchor understanding without changing anchor definition.

---

## Integrating Vision Updates

When a new insight crystallizes understanding:

### Type 1: Anchor Clarification

New language for existing meaning.

**Example:** "Michael Levin's insight that intelligence is a gradient—that's exactly what the GRADIENT anchor captures."

**Action:** Add Levin reference to anchor documentation. No structural change.

### Type 2: Expression Expansion

New way an anchor can manifest.

**Example:** "The oscilloscope's Lissajous curves show LIVING GEOMETRY can be mathematically pure, not just particle-based."

**Action:** Add to anchor's "Resonates with" and "Expressions" lists.

### Type 3: Dialect Refinement

Platform character becomes clearer.

**Example:** "Atlas isn't just 'dark and mysterious'—it's specifically 'Victorian naturalist meets cosmic horror.'"

**Action:** Update dialect description. May cascade to component guidance.

### Type 4: New Pattern Discovery

Recurring solution worth codifying.

**Example:** "We keep using corner brackets to frame content as 'instrument reading.' That's a pattern."

**Action:** Document in COMPLEXITY-GRADIENT.md as Navigation Grid.

### What Doesn't Change

- Anchor meanings (refine language, not meaning)
- Core relationships (Astrolabe warm, Ledger cool)
- Fundamental geometry (sharp corners, 4px grid)

If an update would require changing these, it's probably misaligned with existing territory.

---

## Workflow: Creating New Work

### For UI Components

1. Identify which platform dialect
2. Read COMPLEXITY-GRADIENT.md for appropriate level
3. Get tokens via `thoughtform-design:get_design_tokens`
4. Compose from existing patterns where possible
5. Check: Does this feel like the same family?

### For Keynote/Presentation

1. Use Navigation Grid frame
2. Apply marketing dialect (threshold invitation)
3. Particles: scattered symbols → gathering meaning
4. Content panels: sharp corners, void background
5. Check: Would this work projected in a dark room?

### For New Platform/Feature

1. Identify primary anchors (which 2-3 dominate)
2. Choose dialect closest to intent, or define new one
3. Specify how particles should behave
4. Document dialect in BRAND-ARCHITECTURE.md
5. Check: Is this the same family, different room?

---

## Common Translation Examples

### Reference: Submarine Sonar Display

**Extract:** Sweeping signal detection. Range rings showing distance. Contacts emerging from noise. Operator vigilance.

**Map:** NAVIGATION ●●●●○, INSTRUMENT ●●●●●, SIGNAL ●●●●●, THRESHOLD ●●●○○

**Translate to Ledger:**
- Sweep motion → horizontal scan line
- Range rings → time-based gridlines
- Contacts → spending clusters appearing
- Operator → user monitoring financial patterns

### Reference: Antique Orrery

**Extract:** Mechanical model of celestial system. Brass precision. Making cosmic scale human-comprehensible. Beautiful instrument.

**Map:** NAVIGATION ●●●●●, INSTRUMENT ●●●●●, LIVING GEOMETRY ●●●○○

**Translate to Astrolabe:**
- Brass material → gold accents
- Orbital paths → document relationship lines
- Celestial bodies → knowledge nodes
- Mechanical precision → deliberate motion timing

### Reference: Medical MRI Imagery

**Extract:** Revealing hidden structure. Cross-sections through opacity. Technical visualization of organic. Diagnostic instrument.

**Map:** INSTRUMENT ●●●●●, THRESHOLD ●●●●○, SIGNAL ●●●○○

**Translate to Atlas:**
- Body cross-section → entity reveal layers
- Technical overlay → parameter annotations
- Diagnostic frame → classification structure
- Hidden revealed → entity phases (visible/glimpsed/theoretical)

---

## Quality Checks

### Does It Feel Thoughtform?

- [ ] Activates at least 2 anchors at level 3+
- [ ] Uses platform dialect tokens correctly
- [ ] Sharp corners (no border-radius)
- [ ] PT Mono for technical/coordinate elements
- [ ] Could exist alongside sibling work

### For Particle Systems

- [ ] Movement has semantic meaning
- [ ] Behavior matches platform dialect
- [ ] 3px grid quantization
- [ ] Responds to user attention
- [ ] Breathes/pulses organically

### For Components

- [ ] Composed from token primitives
- [ ] Follows grid positioning
- [ ] Hierarchy clear without decoration
- [ ] Works on void background
- [ ] Readable in low-light conditions

---

## The Ctrl Creep Test

From the Brand Story:

> "LLMs will never know light, fire, warmth, sprained wrist, the smell of bread; but neither do we feel wordslip, letter-sparkling, alliteration fugue, the numb wrongness of leaping to a distant conceptspace."

Does this work express that mutual alienness? Is it at the threshold between human and machine perception?

If it could be from any generic tech brand, it's not Thoughtform.
If it's incomprehensibly weird, it's lost the human side.
The sweet spot: "instrument for navigating alien intelligence."

---

## Evolution Log Template

When updating the system, log changes:

```
DATE: 
TYPE: [Clarification | Expansion | Refinement | Pattern]
INSIGHT: What triggered this
CHANGE: What was updated
PRESERVES: What stayed stable
```

This creates traceable evolution without drift.

---

*The system grows by accumulation within boundaries, not by boundary expansion.*


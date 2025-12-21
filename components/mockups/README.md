# Component Mockups

Live HTML mockups for testing and iterating on component designs before implementation.

---

## How to Use

1. Open any `.html` file directly in a browser
2. Iterate on styles in the `<style>` block
3. Once approved, translate to React component (`.tsx`)

---

## Available Mockups

| File | Description | Reference |
|------|-------------|-----------|
| `FeatureCard.html` | Basic feature card with corner brackets, list, CTA | Kriss.ai layout |
| `FeatureCardWithSigil.html` | Feature card with generative sigil in corner | Stripe Dev + Thoughtform sigils |
| `FeatureCard.tsx` | React component version | — |

---

## Design Tokens Applied

All mockups use canonical Thoughtform tokens:

```css
/* Backgrounds */
--void-base: #050403
--void-surface-1: #0F0E0C

/* Text */
--dawn-base: #ECE3D6
--dawn-70: rgba(236, 227, 214, 0.7)
--dawn-50: rgba(236, 227, 214, 0.5)

/* Accents */
--gold: #CAA554 (marketing, astrolabe)
--teal: #3D8B7A (ledger-light)
--verde: #5B8A7A (ledger-dark)
--dawn: #ECE3D6 (atlas)

/* Typography */
--font-system: 'PT Mono', monospace
--font-content: 'IBM Plex Sans', sans-serif
```

---

## Pattern: FeatureCard

Inspired by: Kriss.ai clean card layout
Reference mode: **Direct** (adapt pattern, translate tokens)

### Anatomy

```
┌─────────────────────────────────┐
│ ┌─┐                         ┌─┐ │  ← Corner brackets (hover)
│                                 │
│  01  TITLE                      │  ← Index + mono title
│                                 │
│  Description text here that     │  ← Sans body text
│  explains the feature.          │
│                                 │
│  ◇  Feature One                 │  ← Diamond markers
│  ◇  Feature Two                 │
│  ◇  Feature Three               │
│                                 │
│  EXPLORE →                      │  ← CTA link
│                                 │
│ └─┘                         └─┘ │
└─────────────────────────────────┘
```

### Variants

| Variant | Accent | Use Case |
|---------|--------|----------|
| Default | Gold | Marketing, Astrolabe |
| Teal | Teal | Ledger Light |
| Dawn | Dawn | Atlas |

### Signal Quotient

**15-25%** — Subtle bracket animation on hover, no particle effects

---

## Pattern: FeatureCardWithSigil

Extends FeatureCard with a **Generative Sigil** in the top-right corner.

Inspired by: Stripe Dev's generative line art, Detail's terminal decorations
Reference mode: **Hybrid** (pattern from Stripe, sigil system from Thoughtform)

### Sigil Patterns

| Pattern | Character | Use Case |
|---------|-----------|----------|
| `constellation` | Radiating star, bright core | Navigation, primary entities |
| `scatter` | Organic cloud, golden ratio | Ambient, archive elements |
| `grid` | Corrupted data, gaps | Technical, Ledger/data |
| `cross` | Gateway X-shape | Thresholds, transitions |
| `spiral` | Fibonacci arms | Evolution, growth |

### How Sigils Work

```javascript
// Same seed = same sigil (deterministic)
const seed = hashCode("navigation");
const particles = generateParticles("constellation", seed, 40);
```

- **Domain** → selects pattern type
- **Seed string** → creates unique variation
- **Glitch** → 1-3px displacements (Thoughtform signature)
- **Grid snap** → 3px grid maintains pixel aesthetic

### Signal Quotient

**25-35%** — Sigil + bracket animation, more visual presence

---

## Adding New Mockups

1. Create `.html` file for browser preview
2. Include all tokens in `<style>` block
3. Document reference source
4. Once stable, create `.tsx` component
5. Update this README

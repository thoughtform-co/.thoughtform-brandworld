---
id: blade-runner-terminal
title: "Blade Runner Esper Machine / Corporate Terminals"
source: "Blade Runner (1982) - Ridley Scott"
referenceMode: direct
anchorScores:
  NAVIGATION: 0.4
  THRESHOLD: 0.6
  INSTRUMENT: 0.8
  LIVING_GEOMETRY: 0.3
  GRADIENT: 0.2
  SIGNAL: 0.9
suggestedTranslations:
  - Terminal Aesthetic
  - Scanline Overlay
  - Data Stream
  - Glitch Effect
dialectAffinity:
  astrolabe: 0.3
  atlas: 0.4
  ledger-dark: 0.95
  ledger-light: 0.2
  marketing: 0.5
translationDistance: close
tags:
  - retrofuturism
  - terminal
  - CRT
  - noir
  - corporate
  - data-forensics
createdAt: 2024-12-17T00:00:00Z
---

# Blade Runner Terminal Aesthetic

## Why This Resonates

The Esper machine and Tyrell Corporation terminals define retrofuturism: high technology rendered through analog constraints. CRT phosphor glow, visible scanlines, compression artifacts as texture.

This is a **direct** reference — the Ledger Dark dialect explicitly inherits this aesthetic.

## What to Extract

| Element | Meaning | Translation |
|---------|---------|-------------|
| Green/amber phosphor | Terminal warmth | Verde (#2B4E40) accent |
| Visible scanlines | CRT texture | Scanline Overlay |
| Enhance/zoom interface | Data forensics | Reveal Animation |
| Corporate brutalism | Power through technology | Terminal Aesthetic |

## Direct Application

Since this is `referenceMode: direct`, we can copy patterns more literally:

```css
/* Scanline effect from Blade Runner */
.terminal::after {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent 0px,
    transparent 2px,
    rgba(0, 0, 0, 0.03) 2px,
    rgba(0, 0, 0, 0.03) 3px
  );
  pointer-events: none;
}

/* Phosphor glow */
.terminal-text {
  color: var(--verde);
  text-shadow: 0 0 10px rgba(43, 78, 64, 0.5);
}
```

## What to Transform

| Original | Thoughtform |
|----------|-------------|
| Green phosphor | Verde (#2B4E40) |
| CRT curvature | Flat with scanline texture |
| Analog controls | Digital with analog feel |

## Translation Notes

Ledger Dark IS this reference. Apply with minimal transformation.

The key insight: technology that acknowledges its own texture. Modern flat design pretends screens are windows. Blade Runner terminals know they're screens.

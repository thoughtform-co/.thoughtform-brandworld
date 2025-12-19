#!/usr/bin/env node
/**
 * Build Skills Script
 * 
 * Generates Claude/Cursor skill files from the registry source of truth.
 * 
 * Usage:
 *   node scripts/build-skills.js
 *   npm run build:skills
 * 
 * Output:
 *   build/skills/thoughtform-design.skill.md
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// Read JSON file
function readJson(relativePath) {
  const fullPath = path.join(ROOT_DIR, relativePath);
  return JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
}

// Read text file
function readText(relativePath) {
  const fullPath = path.join(ROOT_DIR, relativePath);
  return fs.readFileSync(fullPath, 'utf-8');
}

// Ensure directory exists
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Generate skill file
function generateSkill() {
  console.log('Building skill file from registry...');

  // Load sources
  const assets = readJson('registry/assets.json');
  const validation = readJson('registry/validation.json');
  const anchors = readJson('tokens/anchors/definitions.json');
  const translations = readJson('semantic/translations/translation-table.json');
  const colors = readJson('tokens/colors.json');

  // Build skill content
  const skill = `---
name: thoughtform-design
description: |
  Semantic design system for Thoughtform platforms. Meaning-based brand architecture
  with six anchors, translation tables, and platform dialects. Sharp geometry,
  living particles, purposeful glitch. Generated from registry source of truth.
triggers: [thoughtform, astrolabe, atlas, ledger, semantic design, particle system, retrofuturism, glitch, navigation grid]
---

# Thoughtform Design System

Generated: ${new Date().toISOString().split('T')[0]}
Source: registry/assets.json (${assets.assets.length} assets)

---

## Core Identity

**Meaning is geometry.** Concepts exist as coordinates in high-dimensional space. Our interfaces make that navigation tangible — like brass sextants for the latent space.

---

## The Six Anchors

${Object.entries(anchors.anchors).map(([name, anchor]) => `
### ${name}
${anchor.meaning}
- **Tensions:** ${anchor.tensions.poles.join(' ↔ ')}
- **Color affinity:** ${anchor.colorAffinity}
`).join('\n')}

---

## Non-Negotiables

${validation.antipatterns.filter(a => a.severity === 'error').map(a => `- **${a.name}:** ${a.rule}`).join('\n')}

---

## Platform Dialects

| Platform | Mode | Accent | Character |
|----------|------|--------|-----------|
| **Astrolabe** | Dark | Gold | Brass sextant, star charts |
| **Atlas** | Dark | Dawn/Gold | Victorian naturalist, specimen archive |
| **Ledger Dark** | Dark | Verde | Blade Runner terminal |
| **Ledger Light** | Light | Teal | NASA blueprint |
| **Marketing** | Dark | Gold | Portal invitation |

---

## Core Colors

**Dark mode:**
- Void: \`${colors.void.base}\`
- Dawn: \`${colors.dawn.base}\`
- Gold: \`${colors.gold.base}\`

**Light mode:**
- Paper: \`${colors.paper.base}\`
- Ink: \`${colors.ink.base}\`
- Teal: \`${colors.teal.base}\`

---

## Registered Assets (${assets.assets.length})

### Components
${assets.assets.filter(a => a.type === 'component').map(a => 
  `- **${a.name}** (${a.dialects.join(', ')}) — ${a.description || 'No description'}`
).join('\n')}

### Systems
${assets.assets.filter(a => a.type === 'system').map(a => 
  `- **${a.name}** — ${a.description || 'No description'}`
).join('\n')}

### Behaviors
${assets.assets.filter(a => a.type === 'behavior').map(a => 
  `- **${a.name}** (${a.dialects.join(', ')}) — Signal: ${a.signalQuotient?.range?.join('-')}%`
).join('\n')}

---

## Translation Table

The workflow: **Anchor → Translation → Physical Pattern**

${Object.entries(translations.anchors).map(([name, anchor]) => `
### ${name}
Translations: ${anchor.translations.join(', ')}
`).join('\n')}

---

## Quality Tests

${validation.tests.map(t => `- **${t.name}:** "${t.question}"`).join('\n')}

---

## Signal Quotient Guide

| Range | Example | Expression |
|-------|---------|------------|
| 0-10% | Button | Solid container, subtle hover |
| 10-30% | Card | 1px border, hover brackets |
| 30-60% | Navigation Grid | Rails, ambient presence |
| 60%+ | Hero Section | Particle system primary |

---

*Generated from registry. Do not edit directly.*
*Run \`npm run build:skills\` to regenerate.*
`;

  // Write output
  const outputDir = path.join(ROOT_DIR, 'build/skills');
  ensureDir(outputDir);
  
  const outputPath = path.join(outputDir, 'thoughtform-design.skill.md');
  fs.writeFileSync(outputPath, skill);
  
  console.log(`✓ Generated: ${outputPath}`);
  console.log(`  - ${assets.assets.length} assets`);
  console.log(`  - ${validation.tests.length} tests`);
  console.log(`  - ${validation.antipatterns.length} anti-patterns`);
}

// Run
generateSkill();

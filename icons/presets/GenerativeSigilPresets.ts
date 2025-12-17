/**
 * Generative Sigil Platform Presets
 * 
 * Pre-configured DNA mappings for each Thoughtform platform.
 * Import these to get platform-consistent sigil patterns.
 */

import { PatternDNA, PATTERN_PRESETS } from '../core/GenerativeSigil';

// ═══════════════════════════════════════════════════════════════════════════
// ATLAS PRESETS
// Entity domains with distinctive visual signatures
// ═══════════════════════════════════════════════════════════════════════════

export const ATLAS_DOMAIN_DNA: Record<string, PatternDNA> = {
  // Starhaven Reaches: Warm golden constellation, star-like with radiating arms
  'Starhaven Reaches': {
    pattern: 'constellation',
    baseParticles: 16,
    spread: 0.75,
    glitchChance: 0.05,
    rotation: -Math.PI / 6,
    hasCore: true,
    densityFalloff: 1.2,
    arms: 4,
  },
  // Gradient Throne: Ethereal scattered mist, less structured
  'Gradient Throne': {
    pattern: 'scatter',
    baseParticles: 14,
    spread: 0.8,
    glitchChance: 0.08,
    rotation: Math.PI / 8,
    hasCore: false,
    densityFalloff: 0.8,
    arms: 5,
  },
  // The Lattice: Grid-based with high glitch, data corruption aesthetic
  'The Lattice': {
    pattern: 'grid',
    baseParticles: 18,
    spread: 0.65,
    glitchChance: 0.25,
    rotation: 0,
    hasCore: true,
    densityFalloff: 0.6,
    arms: 4,
  },
  // The Threshold: Cross/gateway pattern, transitional
  'The Threshold': {
    pattern: 'cross',
    baseParticles: 12,
    spread: 0.7,
    glitchChance: 0.12,
    rotation: Math.PI / 4,
    hasCore: true,
    densityFalloff: 1.0,
    arms: 4,
  },
};

export const ATLAS_COLORS: Record<string, string> = {
  'Starhaven Reaches': '202, 165, 84',    // Gold
  'Gradient Throne': '180, 200, 200',     // Silver-white
  'The Lattice': '184, 196, 208',         // Blue-white
  'The Threshold': '139, 115, 85',        // Amber
  'default': '236, 227, 214',             // Dawn
};

// ═══════════════════════════════════════════════════════════════════════════
// ASTROLABE PRESETS
// Document and collection types
// ═══════════════════════════════════════════════════════════════════════════

export const ASTROLABE_COLLECTION_DNA: Record<string, PatternDNA> = {
  'research': {
    ...PATTERN_PRESETS['constellation'],
    arms: 6,
    glitchChance: 0.03,
  },
  'reference': {
    ...PATTERN_PRESETS['grid'],
    glitchChance: 0.08,
  },
  'archive': {
    ...PATTERN_PRESETS['scatter'],
    densityFalloff: 1.0,
  },
  'project': {
    ...PATTERN_PRESETS['cross'],
    arms: 4,
  },
};

export const ASTROLABE_COLORS: Record<string, string> = {
  'research': '202, 165, 84',     // Gold
  'reference': '180, 180, 175',   // Silver
  'archive': '160, 155, 145',     // Muted
  'project': '202, 165, 84',      // Gold
  'default': '202, 165, 84',      // Gold
};

// ═══════════════════════════════════════════════════════════════════════════
// LEDGER PRESETS
// Transaction and financial categories
// ═══════════════════════════════════════════════════════════════════════════

export const LEDGER_CATEGORY_DNA: Record<string, PatternDNA> = {
  'income': {
    ...PATTERN_PRESETS['constellation'],
    arms: 5,
    spread: 0.8,
  },
  'expense': {
    ...PATTERN_PRESETS['scatter'],
    densityFalloff: 0.9,
  },
  'transfer': {
    ...PATTERN_PRESETS['cross'],
    arms: 4,
  },
  'investment': {
    ...PATTERN_PRESETS['spiral'],
    arms: 3,
  },
};

export const LEDGER_DARK_COLORS: Record<string, string> = {
  'income': '91, 138, 122',       // Verde
  'expense': '139, 90, 90',       // Muted red
  'transfer': '122, 122, 104',    // Neutral
  'investment': '91, 138, 122',   // Verde
  'default': '91, 138, 122',      // Verde
};

export const LEDGER_LIGHT_COLORS: Record<string, string> = {
  'income': '61, 139, 122',       // Teal
  'expense': '139, 90, 90',       // Muted red
  'transfer': '90, 87, 82',       // Neutral
  'investment': '61, 139, 122',   // Teal
  'default': '61, 139, 122',      // Teal
};

// ═══════════════════════════════════════════════════════════════════════════
// THOUGHTFORM.CO PRESETS
// Service and section markers
// ═══════════════════════════════════════════════════════════════════════════

export const THOUGHTFORM_SERVICE_DNA: Record<string, PatternDNA> = {
  'training': {
    ...PATTERN_PRESETS['constellation'],
    arms: 4,
    glitchChance: 0.05,
  },
  'consulting': {
    ...PATTERN_PRESETS['cross'],
    spread: 0.75,
  },
  'integration': {
    ...PATTERN_PRESETS['grid'],
    glitchChance: 0.15,
  },
  'research': {
    ...PATTERN_PRESETS['spiral'],
    arms: 4,
  },
};

export const THOUGHTFORM_COLORS: Record<string, string> = {
  'training': '202, 165, 84',     // Gold
  'consulting': '202, 165, 84',   // Gold
  'integration': '184, 196, 208', // Blue-white
  'research': '202, 165, 84',     // Gold
  'default': '202, 165, 84',      // Gold
};

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get DNA for a category in a specific platform
 */
export function getPlatformDNA(
  platform: 'atlas' | 'astrolabe' | 'ledger' | 'thoughtform',
  category: string
): PatternDNA {
  switch (platform) {
    case 'atlas':
      return ATLAS_DOMAIN_DNA[category] || PATTERN_PRESETS['constellation'];
    case 'astrolabe':
      return ASTROLABE_COLLECTION_DNA[category] || PATTERN_PRESETS['constellation'];
    case 'ledger':
      return LEDGER_CATEGORY_DNA[category] || PATTERN_PRESETS['scatter'];
    case 'thoughtform':
      return THOUGHTFORM_SERVICE_DNA[category] || PATTERN_PRESETS['constellation'];
    default:
      return PATTERN_PRESETS['constellation'];
  }
}

/**
 * Get color for a category in a specific platform
 */
export function getPlatformColor(
  platform: 'atlas' | 'astrolabe' | 'ledger-dark' | 'ledger-light' | 'thoughtform',
  category: string
): string {
  switch (platform) {
    case 'atlas':
      return ATLAS_COLORS[category] || ATLAS_COLORS['default'];
    case 'astrolabe':
      return ASTROLABE_COLORS[category] || ASTROLABE_COLORS['default'];
    case 'ledger-dark':
      return LEDGER_DARK_COLORS[category] || LEDGER_DARK_COLORS['default'];
    case 'ledger-light':
      return LEDGER_LIGHT_COLORS[category] || LEDGER_LIGHT_COLORS['default'];
    case 'thoughtform':
      return THOUGHTFORM_COLORS[category] || THOUGHTFORM_COLORS['default'];
    default:
      return '236, 227, 214'; // Dawn
  }
}

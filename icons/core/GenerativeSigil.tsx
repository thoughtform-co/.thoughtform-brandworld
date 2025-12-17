'use client';

/**
 * GenerativeSigil - Algorithmic Particle Cluster Sigils
 * 
 * Inspired by Grafana's pillar configurations and Thoughtform's glitch aesthetic.
 * 
 * Philosophy:
 * - Domains have unique "genetic signatures" that produce consistent but organic patterns
 * - Entities inherit their domain's DNA with entity-specific mutations
 * - Subtle glitch offsets (1px shifts) echo Thoughtform brand language
 * - Mathematical algorithms (golden ratio, fibonacci) create natural-feeling arrangements
 * 
 * Grid System:
 * - All particles snap to GRID=3 for crisp pixel rendering
 * - Particles are 2x2 or 3x3 pixel blocks
 * - Glitch elements shift particles by 1-2px
 * 
 * Cross-Platform Usage:
 * - Atlas: Entity identification sigils
 * - Astrolabe: Document/collection markers
 * - Ledger: Category indicators
 * - thoughtform.co: Section/service markers
 */

import { useMemo } from 'react';

// Sacred constant: all sigils snap to 3px grid
const GRID = 3;

// Golden ratio for natural-feeling distributions
const PHI = 1.618033988749895;
const TAU = Math.PI * 2;

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface GenerativeSigilProps {
  /** Category/domain name - determines base pattern */
  category: string;
  /** Unique identifier - creates consistent variant (optional) */
  uniqueId?: string;
  /** Color as RGB triplet string (e.g., "202, 165, 84") */
  color?: string;
  /** Icon size in pixels */
  size?: number;
  /** Additional CSS class */
  className?: string;
  /** Overall opacity */
  opacity?: number;
  /** Animation pulse (0-1) for breathing effect */
  pulse?: number;
}

interface Particle {
  x: number;
  y: number;
  size: number; // 1 = small (2px), 2 = medium (3px), 3 = large (4px)
  alpha: number;
  glitchX?: number; // Glitch offset
  glitchY?: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT COLORS (platform-agnostic, override via props)
// ═══════════════════════════════════════════════════════════════════════════

const DEFAULT_COLORS: Record<string, string> = {
  'default': '236, 227, 214', // Dawn
  'gold': '202, 165, 84',
  'verde': '91, 138, 122',
  'teal': '61, 139, 122',
};

// ═══════════════════════════════════════════════════════════════════════════
// SEEDED RANDOM NUMBER GENERATOR
// Uses a simple hash function for consistent results
// ═══════════════════════════════════════════════════════════════════════════

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// PATTERN DNA SYSTEM
// Each pattern type produces unique algorithmic signatures
// ═══════════════════════════════════════════════════════════════════════════

export interface PatternDNA {
  // Core pattern type
  pattern: 'cross' | 'spiral' | 'scatter' | 'constellation' | 'grid';
  // Base particle count
  baseParticles: number;
  // How spread out particles are (0-1)
  spread: number;
  // Probability of glitch offsets (0-1)
  glitchChance: number;
  // Rotation offset in radians
  rotation: number;
  // Whether to add central core
  hasCore: boolean;
  // Density falloff from center (higher = more concentrated)
  densityFalloff: number;
  // Arm count for spiral/cross patterns
  arms: number;
}

// Pre-defined pattern presets (can be extended per platform)
export const PATTERN_PRESETS: Record<string, PatternDNA> = {
  // Constellation: Star-like with radiating arms
  'constellation': {
    pattern: 'constellation',
    baseParticles: 16,
    spread: 0.75,
    glitchChance: 0.05,
    rotation: -Math.PI / 6,
    hasCore: true,
    densityFalloff: 1.2,
    arms: 4,
  },
  // Scatter: Organic cloud with cluster points
  'scatter': {
    pattern: 'scatter',
    baseParticles: 14,
    spread: 0.8,
    glitchChance: 0.08,
    rotation: Math.PI / 8,
    hasCore: false,
    densityFalloff: 0.8,
    arms: 5,
  },
  // Grid: Data-like structure with corruption gaps
  'grid': {
    pattern: 'grid',
    baseParticles: 18,
    spread: 0.65,
    glitchChance: 0.25,
    rotation: 0,
    hasCore: true,
    densityFalloff: 0.6,
    arms: 4,
  },
  // Cross: X-shaped gateway pattern
  'cross': {
    pattern: 'cross',
    baseParticles: 12,
    spread: 0.7,
    glitchChance: 0.12,
    rotation: Math.PI / 4,
    hasCore: true,
    densityFalloff: 1.0,
    arms: 4,
  },
  // Spiral: Fibonacci spiral arms
  'spiral': {
    pattern: 'spiral',
    baseParticles: 14,
    spread: 0.7,
    glitchChance: 0.1,
    rotation: 0,
    hasCore: true,
    densityFalloff: 1.0,
    arms: 3,
  },
};

const DEFAULT_DNA: PatternDNA = PATTERN_PRESETS['constellation'];

// ═══════════════════════════════════════════════════════════════════════════
// PATTERN GENERATION ALGORITHMS
// ═══════════════════════════════════════════════════════════════════════════

function generateConstellationPattern(
  random: () => number,
  dna: PatternDNA,
  radius: number
): Particle[] {
  const particles: Particle[] = [];
  const { baseParticles, spread, glitchChance, rotation, hasCore, arms } = dna;
  
  if (hasCore) {
    particles.push({ x: 0, y: 0, size: 3, alpha: 1.0 });
    
    const innerCount = 4 + Math.floor(random() * 3);
    for (let i = 0; i < innerCount; i++) {
      const angle = (i / innerCount) * TAU + rotation + (random() - 0.5) * 0.3;
      const dist = radius * 0.2 + random() * radius * 0.15;
      particles.push({
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        size: 2,
        alpha: 0.85 + random() * 0.15,
        glitchX: random() < glitchChance ? (random() - 0.5) * 2 : 0,
        glitchY: random() < glitchChance ? (random() - 0.5) * 2 : 0,
      });
    }
  }
  
  for (let arm = 0; arm < arms; arm++) {
    const armAngle = (arm / arms) * TAU + rotation;
    const armParticles = Math.floor(baseParticles / arms);
    
    for (let i = 0; i < armParticles; i++) {
      const progress = (i + 1) / armParticles;
      const dist = radius * (0.3 + progress * spread * 0.7);
      const angleOffset = (random() - 0.5) * 0.4 * (1 - progress);
      
      particles.push({
        x: Math.cos(armAngle + angleOffset) * dist,
        y: Math.sin(armAngle + angleOffset) * dist,
        size: progress < 0.5 ? 2 : 1,
        alpha: 0.9 - progress * 0.4,
        glitchX: random() < glitchChance ? (random() - 0.5) * 3 : 0,
        glitchY: random() < glitchChance ? (random() - 0.5) * 3 : 0,
      });
    }
  }
  
  const satelliteCount = Math.floor(baseParticles * 0.3);
  for (let i = 0; i < satelliteCount; i++) {
    const angle = random() * TAU;
    const dist = radius * (0.6 + random() * spread * 0.4);
    
    particles.push({
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist,
      size: 1,
      alpha: 0.4 + random() * 0.3,
      glitchX: random() < glitchChance * 2 ? (random() - 0.5) * 4 : 0,
      glitchY: random() < glitchChance * 2 ? (random() - 0.5) * 4 : 0,
    });
  }
  
  return particles;
}

function generateCrossPattern(
  random: () => number,
  dna: PatternDNA,
  radius: number
): Particle[] {
  const particles: Particle[] = [];
  const { baseParticles, spread, glitchChance, rotation, hasCore, arms } = dna;
  
  if (hasCore) {
    particles.push({ x: 0, y: 0, size: 3, alpha: 1.0 });
  }
  
  const armLength = radius * spread;
  const particlesPerArm = Math.floor(baseParticles / arms);
  
  for (let arm = 0; arm < arms; arm++) {
    const angle = (arm / arms) * TAU + rotation;
    
    for (let i = 1; i <= particlesPerArm; i++) {
      const progress = i / particlesPerArm;
      const dist = armLength * progress;
      
      particles.push({
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        size: progress < 0.6 ? 2 : 1,
        alpha: 1.0 - progress * 0.5,
        glitchX: random() < glitchChance ? (random() - 0.5) * 2 : 0,
        glitchY: random() < glitchChance ? (random() - 0.5) * 2 : 0,
      });
      
      if (random() < 0.4 && progress < 0.7) {
        const perpAngle = angle + Math.PI / 2;
        const offset = (random() - 0.5) * 6;
        particles.push({
          x: Math.cos(angle) * dist + Math.cos(perpAngle) * offset,
          y: Math.sin(angle) * dist + Math.sin(perpAngle) * offset,
          size: 1,
          alpha: 0.6,
          glitchX: random() < glitchChance ? (random() - 0.5) * 3 : 0,
          glitchY: random() < glitchChance ? (random() - 0.5) * 3 : 0,
        });
      }
    }
  }
  
  return particles;
}

function generateScatterPattern(
  random: () => number,
  dna: PatternDNA,
  radius: number
): Particle[] {
  const particles: Particle[] = [];
  const { baseParticles, spread, glitchChance, densityFalloff } = dna;
  
  for (let i = 0; i < baseParticles; i++) {
    const goldenAngle = i * TAU / (PHI * PHI);
    const angle = goldenAngle + (random() - 0.5) * 0.8;
    const u = random();
    const dist = radius * spread * Math.pow(u, densityFalloff);
    
    particles.push({
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist,
      size: random() < 0.3 ? 2 : 1,
      alpha: 0.5 + random() * 0.5,
      glitchX: random() < glitchChance ? (random() - 0.5) * 4 : 0,
      glitchY: random() < glitchChance ? (random() - 0.5) * 4 : 0,
    });
  }
  
  const clusterCount = 2 + Math.floor(random() * 3);
  for (let c = 0; c < clusterCount; c++) {
    const clusterAngle = random() * TAU;
    const clusterDist = radius * 0.3 + random() * radius * 0.4;
    const cx = Math.cos(clusterAngle) * clusterDist;
    const cy = Math.sin(clusterAngle) * clusterDist;
    
    particles.push({ x: cx, y: cy, size: 2, alpha: 0.8 });
    
    const satCount = 2 + Math.floor(random() * 3);
    for (let s = 0; s < satCount; s++) {
      const satAngle = random() * TAU;
      const satDist = 4 + random() * 6;
      particles.push({
        x: cx + Math.cos(satAngle) * satDist,
        y: cy + Math.sin(satAngle) * satDist,
        size: 1,
        alpha: 0.5 + random() * 0.3,
        glitchX: random() < glitchChance ? (random() - 0.5) * 2 : 0,
        glitchY: random() < glitchChance ? (random() - 0.5) * 2 : 0,
      });
    }
  }
  
  return particles;
}

function generateGridPattern(
  random: () => number,
  dna: PatternDNA,
  radius: number
): Particle[] {
  const particles: Particle[] = [];
  const { glitchChance, hasCore } = dna;
  
  const gridSize = Math.floor(radius / 4);
  const gridSpan = 3;
  
  if (hasCore) {
    particles.push({ x: 0, y: 0, size: 3, alpha: 1.0 });
  }
  
  for (let gx = -gridSpan; gx <= gridSpan; gx++) {
    for (let gy = -gridSpan; gy <= gridSpan; gy++) {
      if (random() < 0.5) continue;
      if (gx === 0 && gy === 0 && hasCore) continue;
      
      const dist = Math.sqrt(gx * gx + gy * gy);
      if (dist > gridSpan * 0.9) {
        if (random() < 0.7) continue;
      }
      
      const x = gx * gridSize;
      const y = gy * gridSize;
      
      const glitchX = random() < glitchChance ? (random() - 0.5) * gridSize * 0.5 : 0;
      const glitchY = random() < glitchChance ? (random() - 0.5) * gridSize * 0.5 : 0;
      
      particles.push({
        x,
        y,
        size: dist < 2 ? 2 : 1,
        alpha: 1.0 - (dist / gridSpan) * 0.5,
        glitchX,
        glitchY,
      });
    }
  }
  
  if (random() < glitchChance * 3) {
    const lineY = (random() - 0.5) * radius;
    for (let i = 0; i < 3; i++) {
      particles.push({
        x: (random() - 0.5) * radius * 1.5,
        y: lineY,
        size: 1,
        alpha: 0.3 + random() * 0.2,
      });
    }
  }
  
  return particles;
}

function generateSpiralPattern(
  random: () => number,
  dna: PatternDNA,
  radius: number
): Particle[] {
  const particles: Particle[] = [];
  const { baseParticles, spread, glitchChance, rotation, hasCore, arms } = dna;
  
  if (hasCore) {
    particles.push({ x: 0, y: 0, size: 3, alpha: 1.0 });
  }
  
  for (let arm = 0; arm < arms; arm++) {
    const armOffset = (arm / arms) * TAU + rotation;
    const particlesPerArm = Math.floor(baseParticles / arms);
    
    for (let i = 0; i < particlesPerArm; i++) {
      const t = (i + 1) / particlesPerArm;
      const angle = armOffset + t * Math.PI * 1.5;
      const dist = radius * spread * Math.pow(t, 1 / PHI);
      
      particles.push({
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        size: t < 0.5 ? 2 : 1,
        alpha: 0.9 - t * 0.4,
        glitchX: random() < glitchChance ? (random() - 0.5) * 3 : 0,
        glitchY: random() < glitchChance ? (random() - 0.5) * 3 : 0,
      });
    }
  }
  
  return particles;
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN GENERATION FUNCTION
// ═══════════════════════════════════════════════════════════════════════════

function generateParticles(
  category: string,
  uniqueId: string | undefined,
  radius: number,
  customDNA?: Partial<PatternDNA>
): Particle[] {
  const seedString = uniqueId ? `${category}:${uniqueId}` : category;
  const seed = hashCode(seedString);
  const random = seededRandom(seed);
  
  // Get pattern from presets or use category hash to select one
  const presetNames = Object.keys(PATTERN_PRESETS);
  const patternIndex = hashCode(category) % presetNames.length;
  const baseDNA = PATTERN_PRESETS[presetNames[patternIndex]] || DEFAULT_DNA;
  
  // Apply custom DNA overrides
  const dna: PatternDNA = { ...baseDNA, ...customDNA };
  
  // Entity variation: slightly modify DNA based on unique seed
  const entityDNA: PatternDNA = uniqueId
    ? {
        ...dna,
        rotation: dna.rotation + (random() - 0.5) * 0.5,
        spread: dna.spread + (random() - 0.5) * 0.15,
        glitchChance: dna.glitchChance + (random() - 0.5) * 0.05,
      }
    : dna;
  
  let particles: Particle[];
  switch (entityDNA.pattern) {
    case 'constellation':
      particles = generateConstellationPattern(random, entityDNA, radius);
      break;
    case 'cross':
      particles = generateCrossPattern(random, entityDNA, radius);
      break;
    case 'scatter':
      particles = generateScatterPattern(random, entityDNA, radius);
      break;
    case 'grid':
      particles = generateGridPattern(random, entityDNA, radius);
      break;
    case 'spiral':
      particles = generateSpiralPattern(random, entityDNA, radius);
      break;
    default:
      particles = generateConstellationPattern(random, entityDNA, radius);
  }
  
  return particles;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export function GenerativeSigil({
  category,
  uniqueId,
  color,
  size = 48,
  className = '',
  opacity = 1,
  pulse = 0,
}: GenerativeSigilProps) {
  const fillColor = color || DEFAULT_COLORS[category] || DEFAULT_COLORS['default'];
  
  const particles = useMemo(() => {
    const radius = size / 2 - 4;
    return generateParticles(category, uniqueId, radius);
  }, [category, uniqueId, size]);
  
  const center = size / 2;
  
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      style={{
        imageRendering: 'pixelated',
        display: 'inline-block',
        verticalAlign: 'middle',
      }}
      aria-hidden="true"
    >
      {particles.map((particle, i) => {
        const x = particle.x + (particle.glitchX || 0);
        const y = particle.y + (particle.glitchY || 0);
        
        const gx = Math.floor((x + center) / GRID) * GRID;
        const gy = Math.floor((y + center) / GRID) * GRID;
        
        const pixelSize = particle.size === 3 ? 4 : particle.size === 2 ? GRID : 2;
        
        const pulseAlpha = 1 + pulse * 0.2 * Math.sin(i * 0.5);
        const alpha = Math.min(1, particle.alpha * opacity * pulseAlpha);
        
        return (
          <rect
            key={`${gx}-${gy}-${i}`}
            x={gx}
            y={gy}
            width={pixelSize}
            height={pixelSize}
            fill={`rgba(${fillColor}, ${alpha})`}
          />
        );
      })}
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export { PATTERN_PRESETS, DEFAULT_COLORS };
export type { PatternDNA, Particle };

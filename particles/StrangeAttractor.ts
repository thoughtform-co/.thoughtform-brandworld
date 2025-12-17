/**
 * Strange Attractor Generator
 * 
 * Mathematical chaos systems for particle nebulae.
 * Produces infinitely complex, never-repeating patterns.
 * 
 * Cross-Platform Usage:
 * - Atlas: Domain nebulae
 * - Astrolabe: Navigation backgrounds
 * - Ledger: Category visualizations
 * - thoughtform.co: Gateway effects
 */

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type AttractorType = 
  | 'galaxy' 
  | 'lorenz' 
  | 'halvorsen' 
  | 'aizawa' 
  | 'thomas' 
  | 'sprott' 
  | 'rossler' 
  | 'dadras';

export interface AttractorPoint {
  x: number;
  y: number;
  z: number;
}

export interface AttractorParticle {
  x: number;
  y: number;
  z: number;
  isCore: boolean;
  alpha: number;
  phase: number;
  size: number;
}

export interface AttractorConfig {
  type: AttractorType;
  pointCount: number;     // Points to generate (1000-5000)
  radius: number;         // Target radius after normalization
  scale: number;          // Scale multiplier (0.5-1.5)
  warmupIterations: number; // Iterations before recording (500)
  dt: number;             // Time step for integration (0.005)
}

export const DEFAULT_ATTRACTOR_CONFIG: AttractorConfig = {
  type: 'lorenz',
  pointCount: 2000,
  radius: 180,
  scale: 1.0,
  warmupIterations: 500,
  dt: 0.005,
};

// ═══════════════════════════════════════════════════════════════════════════
// ATTRACTOR EQUATIONS
// Each attractor is a system of differential equations
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Lorenz Attractor — Classic butterfly shape
 * Parameters: σ=10, ρ=28, β=8/3 (standard values)
 */
function lorenzStep(x: number, y: number, z: number, dt: number): AttractorPoint {
  const sigma = 10, rho = 28, beta = 8/3;
  const dx = sigma * (y - x);
  const dy = x * (rho - z) - y;
  const dz = x * y - beta * z;
  return { x: x + dx * dt, y: y + dy * dt, z: z + dz * dt };
}

/**
 * Thomas Attractor — Smooth, symmetric
 * Parameter: b=0.208186
 */
function thomasStep(x: number, y: number, z: number, dt: number): AttractorPoint {
  const b = 0.208186;
  const dx = Math.sin(y) - b * x;
  const dy = Math.sin(z) - b * y;
  const dz = Math.sin(x) - b * z;
  return { x: x + dx * dt, y: y + dy * dt, z: z + dz * dt };
}

/**
 * Halvorsen Attractor — Twisted triangular loops
 * Parameter: a=1.89
 */
function halvorsenStep(x: number, y: number, z: number, dt: number): AttractorPoint {
  const a = 1.89;
  const dx = -a * x - 4 * y - 4 * z - y * y;
  const dy = -a * y - 4 * z - 4 * x - z * z;
  const dz = -a * z - 4 * x - 4 * y - x * x;
  return { x: x + dx * dt, y: y + dy * dt, z: z + dz * dt };
}

/**
 * Aizawa Attractor — Disc with axis
 */
function aizawaStep(x: number, y: number, z: number, dt: number): AttractorPoint {
  const a = 0.95, b = 0.7, c = 0.6, d = 3.5, e = 0.25, f = 0.1;
  const dx = (z - b) * x - d * y;
  const dy = d * x + (z - b) * y;
  const dz = c + a * z - (z * z * z) / 3 - (x * x + y * y) * (1 + e * z) + f * z * x * x * x;
  return { x: x + dx * dt, y: y + dy * dt, z: z + dz * dt };
}

/**
 * Sprott Attractor — Elegant spiral
 */
function sprottStep(x: number, y: number, z: number, dt: number): AttractorPoint {
  const a = 0.4, b = 1.2;
  const dx = a * y * z;
  const dy = x - y;
  const dz = b - x * y;
  return { x: x + dx * dt, y: y + dy * dt, z: z + dz * dt };
}

/**
 * Rössler Attractor — Spiral with fold
 */
function rosslerStep(x: number, y: number, z: number, dt: number): AttractorPoint {
  const a = 0.2, b = 0.2, c = 5.7;
  const dx = -(y + z);
  const dy = x + a * y;
  const dz = b + z * (x - c);
  return { x: x + dx * dt, y: y + dy * dt, z: z + dz * dt };
}

/**
 * Dadras Attractor — Complex flow
 */
function dadrasStep(x: number, y: number, z: number, dt: number): AttractorPoint {
  const p = 3, q = 2.7, r = 1.7, s = 2, e = 9;
  const dx = y - p * x + q * y * z;
  const dy = r * y - x * z + z;
  const dz = s * x * y - e * z;
  return { x: x + dx * dt, y: y + dy * dt, z: z + dz * dt };
}

/**
 * Galaxy Spiral — Parametric (not differential)
 */
function galaxyPoint(i: number, armCount: number = 2): AttractorPoint {
  const t = i * 0.01;
  const arm = i % armCount;
  const armAngle = arm * Math.PI * 2 / armCount;
  const r = Math.pow(t % 10, 0.5) * 2;
  const spiral = t * 0.3 + armAngle;
  
  return {
    x: r * Math.cos(spiral) + (Math.random() - 0.5) * 0.5,
    y: (Math.random() - 0.5) * 0.3 * Math.exp(-r * 0.1),
    z: r * Math.sin(spiral) + (Math.random() - 0.5) * 0.5,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// GENERATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Generate points along a strange attractor
 */
export function generateAttractorPoints(
  config: Partial<AttractorConfig> = {}
): AttractorPoint[] {
  const cfg = { ...DEFAULT_ATTRACTOR_CONFIG, ...config };
  const points: AttractorPoint[] = [];
  
  // Initial conditions (small random offset for variety)
  let x = 0.1 + Math.random() * 0.1;
  let y = 0.1 + Math.random() * 0.1;
  let z = 0.1 + Math.random() * 0.1;
  
  const totalIterations = cfg.pointCount + cfg.warmupIterations;
  
  for (let i = 0; i < totalIterations; i++) {
    let next: AttractorPoint;
    
    switch (cfg.type) {
      case 'lorenz':
        next = lorenzStep(x, y, z, cfg.dt);
        break;
      case 'thomas':
        next = thomasStep(x, y, z, cfg.dt);
        break;
      case 'halvorsen':
        next = halvorsenStep(x, y, z, cfg.dt);
        break;
      case 'aizawa':
        next = aizawaStep(x, y, z, cfg.dt);
        break;
      case 'sprott':
        next = sprottStep(x, y, z, cfg.dt);
        break;
      case 'rossler':
        next = rosslerStep(x, y, z, cfg.dt);
        break;
      case 'dadras':
        next = dadrasStep(x, y, z, cfg.dt);
        break;
      case 'galaxy':
      default:
        // Galaxy is parametric, not differential
        if (i >= cfg.warmupIterations) {
          points.push(galaxyPoint(i - cfg.warmupIterations));
        }
        continue;
    }
    
    x = next.x;
    y = next.y;
    z = next.z;
    
    // Only record after warmup
    if (i >= cfg.warmupIterations) {
      points.push({ x, y, z });
    }
  }
  
  return points;
}

/**
 * Normalize attractor points to fit within a target radius
 */
export function normalizeAttractorPoints(
  points: AttractorPoint[],
  radius: number,
  scale: number = 1.0
): AttractorPoint[] {
  if (points.length === 0) return points;
  
  // Find bounding box
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;
  let minZ = Infinity, maxZ = -Infinity;
  
  for (const p of points) {
    minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x);
    minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y);
    minZ = Math.min(minZ, p.z); maxZ = Math.max(maxZ, p.z);
  }
  
  // Center and scale
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  const centerZ = (minZ + maxZ) / 2;
  const rangeMax = Math.max(maxX - minX, maxY - minY, maxZ - minZ) || 1;
  const scaleFactor = (radius * 2 * scale) / rangeMax;
  
  return points.map(p => ({
    x: (p.x - centerX) * scaleFactor,
    y: (p.y - centerY) * scaleFactor,
    z: (p.z - centerZ) * scaleFactor,
  }));
}

// ═══════════════════════════════════════════════════════════════════════════
// PARTICLE CREATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Create a particle sampled from attractor points
 */
export function createAttractorParticle(
  attractorPoints: AttractorPoint[],
  isCore: boolean
): AttractorParticle {
  // Random point from attractor
  const idx = Math.floor(Math.random() * attractorPoints.length);
  const basePoint = attractorPoints[idx] || { x: 0, y: 0, z: 0 };
  
  // Jitter: core particles cluster tighter
  const jitter = isCore ? 3 : 8;
  
  return {
    x: basePoint.x + (Math.random() - 0.5) * jitter,
    y: basePoint.y + (Math.random() - 0.5) * jitter,
    z: basePoint.z + (Math.random() - 0.5) * jitter,
    isCore,
    alpha: isCore ? 0.6 + Math.random() * 0.3 : 0.15 + Math.random() * 0.25,
    phase: Math.random() * Math.PI * 2,
    size: isCore ? 3 : 2,
  };
}

/**
 * Create a full particle system from an attractor
 */
export function createAttractorParticleSystem(
  type: AttractorType,
  particleCount: number,
  coreRatio: number = 0.2,
  radius: number = 180,
  scale: number = 1.0
): AttractorParticle[] {
  // Generate and normalize attractor points
  const rawPoints = generateAttractorPoints({
    type,
    pointCount: Math.max(2000, particleCount * 2),
  });
  
  const normalizedPoints = normalizeAttractorPoints(rawPoints, radius, scale);
  
  // Create particles
  const particles: AttractorParticle[] = [];
  const coreCount = Math.floor(particleCount * coreRatio);
  
  // Core particles (bright, tight clustering)
  for (let i = 0; i < coreCount; i++) {
    particles.push(createAttractorParticle(normalizedPoints, true));
  }
  
  // Nebula particles (dim, wider spread)
  for (let i = 0; i < particleCount - coreCount; i++) {
    particles.push(createAttractorParticle(normalizedPoints, false));
  }
  
  return particles;
}

// ═══════════════════════════════════════════════════════════════════════════
// RENDERING HELPERS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Rotate point around Y-axis
 */
export function rotateY(point: AttractorPoint, angle: number): AttractorPoint {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: point.x * cos - point.z * sin,
    y: point.y,
    z: point.x * sin + point.z * cos,
  };
}

/**
 * Project 3D point to 2D with perspective
 */
export function projectToScreen(
  point: AttractorPoint,
  centerX: number,
  centerY: number,
  focalLength: number = 400
): { x: number; y: number; scale: number } {
  const scale = focalLength / (focalLength + point.z);
  return {
    x: centerX + point.x * scale,
    y: centerY + point.y * scale,
    scale,
  };
}

/**
 * Calculate breathing/pulsing alpha
 */
export function getBreathingAlpha(
  baseAlpha: number,
  phase: number,
  time: number,
  intensity: number = 0.2
): number {
  const breathe = Math.sin(time * 0.002 + phase) * intensity + 1;
  return baseAlpha * breathe;
}

/**
 * Calculate depth-based alpha fade
 */
export function getDepthAlpha(
  baseAlpha: number,
  z: number,
  maxDepth: number,
  depthEffect: number = 0.5
): number {
  const depthRatio = (z + maxDepth) / (maxDepth * 2); // 0 (near) to 1 (far)
  const depthFade = 1 - depthRatio * depthEffect;
  return baseAlpha * Math.max(0.1, depthFade);
}

// ═══════════════════════════════════════════════════════════════════════════
// CACHING
// ═══════════════════════════════════════════════════════════════════════════

const attractorCache = new Map<string, AttractorPoint[]>();

/**
 * Get attractor points with caching
 */
export function getCachedAttractorPoints(
  type: AttractorType,
  pointCount: number = 2000,
  radius: number = 180,
  scale: number = 1.0
): AttractorPoint[] {
  const key = `${type}|${pointCount}|${radius}|${scale}`;
  
  if (!attractorCache.has(key)) {
    const rawPoints = generateAttractorPoints({ type, pointCount });
    const normalizedPoints = normalizeAttractorPoints(rawPoints, radius, scale);
    attractorCache.set(key, normalizedPoints);
  }
  
  return attractorCache.get(key)!;
}

/**
 * Clear attractor cache
 */
export function clearAttractorCache(): void {
  attractorCache.clear();
}

// ═══════════════════════════════════════════════════════════════════════════
// ATTRACTOR METADATA
// ═══════════════════════════════════════════════════════════════════════════

export const ATTRACTOR_INFO: Record<AttractorType, {
  name: string;
  character: string;
  recommendedDensity: [number, number];
  useCase: string;
}> = {
  lorenz: {
    name: 'Lorenz (Butterfly)',
    character: 'Classic butterfly, two-lobed',
    recommendedDensity: [800, 1200],
    useCase: 'Primary domains, navigation',
  },
  thomas: {
    name: 'Thomas',
    character: 'Smooth, symmetric, elegant',
    recommendedDensity: [600, 900],
    useCase: 'Ethereal, calm categories',
  },
  halvorsen: {
    name: 'Halvorsen',
    character: 'Twisted triangular loops',
    recommendedDensity: [800, 1000],
    useCase: 'Dynamic, active categories',
  },
  aizawa: {
    name: 'Aizawa',
    character: 'Disc with central axis',
    recommendedDensity: [700, 1000],
    useCase: 'Structured, technical categories',
  },
  sprott: {
    name: 'Sprott',
    character: 'Elegant spiral shell',
    recommendedDensity: [500, 800],
    useCase: 'Minimalist, refined',
  },
  rossler: {
    name: 'Rössler',
    character: 'Spiral with fold',
    recommendedDensity: [700, 1000],
    useCase: 'Transitions, thresholds',
  },
  dadras: {
    name: 'Dadras',
    character: 'Complex intertwined loops',
    recommendedDensity: [800, 1200],
    useCase: 'Complex, data-heavy',
  },
  galaxy: {
    name: 'Galaxy Spiral',
    character: 'Classic two-arm galaxy',
    recommendedDensity: [600, 1000],
    useCase: 'Familiar, accessible fallback',
  },
};

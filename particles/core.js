/**
 * Thoughtform Particle System Core
 * Shared renderer for all Thoughtform platforms
 * 
 * GRID = 3 is non-negotiable. All positions snap to this grid.
 */

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

export const GRID = 3; // DO NOT CHANGE

// Color constants as RGB triplets for rgba()
export const COLORS = {
  // Universal
  DAWN: '236, 227, 214',
  VOID: '5, 4, 3',
  
  // Dark mode accents
  GOLD: '202, 165, 84',
  GOLD_BRIGHT: '224, 188, 106',
  VERDE: '43, 78, 64',
  VERDE_GLOW: '91, 168, 130',
  
  // Light mode
  PAPER: '240, 239, 236',
  INK: '58, 56, 53',
  TEAL: '61, 139, 122',
  SIGNAL: '184, 92, 74',
  GOLD_LIGHT: '166, 144, 85',
  MUTED: '122, 120, 104',
};

// Timing constants (from motion.json)
export const TIMING = {
  QUICK: 150,
  STANDARD: 250,
  DELIBERATE: 400,
  DRAMATIC: 600,
};

// Easing functions
export const EASING = {
  instrument: 'cubic-bezier(0.19, 1, 0.22, 1)',
  smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
  glitch: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
};

// ═══════════════════════════════════════════════════════════════════════════
// CANVAS SETUP
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Setup canvas with proper DPR scaling
 * @param {HTMLCanvasElement} canvas
 * @returns {{ ctx: CanvasRenderingContext2D, width: number, height: number }}
 */
export function setupCanvas(canvas) {
  const rect = canvas.parentElement.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  canvas.style.width = rect.width + 'px';
  canvas.style.height = rect.height + 'px';
  
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  
  return { ctx, width: rect.width, height: rect.height };
}

// ═══════════════════════════════════════════════════════════════════════════
// CORE DRAWING FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Draw a grid-snapped pixel
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x - Position (will be snapped to GRID)
 * @param {number} y - Position (will be snapped to GRID)
 * @param {string} color - RGB triplet, e.g., '202, 165, 84'
 * @param {number} alpha - Opacity 0-1
 * @param {number} size - Pixel size (default GRID)
 */
export function drawPixel(ctx, x, y, color, alpha, size = GRID) {
  const px = Math.floor(x / GRID) * GRID;
  const py = Math.floor(y / GRID) * GRID;
  ctx.fillStyle = `rgba(${color}, ${alpha})`;
  ctx.fillRect(px, py, size - 1, size - 1);
}

/**
 * Clear with trail effect (creates motion blur)
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} width
 * @param {number} height
 * @param {string} bgColor - Background RGB triplet
 * @param {number} trailAlpha - Lower = longer trails (0.05-0.15)
 */
export function clearWithTrail(ctx, width, height, bgColor, trailAlpha = 0.1) {
  ctx.fillStyle = `rgba(${bgColor}, ${trailAlpha})`;
  ctx.fillRect(0, 0, width, height);
}

/**
 * Draw a particle line as discrete points
 */
export function drawParticleLine(ctx, x1, y1, x2, y2, color, alpha, density = 0.3) {
  const dist = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  const steps = Math.floor(dist * density);
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    drawPixel(ctx, x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, color, alpha);
  }
}

/**
 * Draw a particle circle
 */
export function drawParticleCircle(ctx, cx, cy, r, color, alpha, density = 0.15) {
  const circumference = 2 * Math.PI * r;
  const steps = Math.floor(circumference * density);
  for (let i = 0; i < steps; i++) {
    const angle = (i / steps) * Math.PI * 2;
    drawPixel(ctx, cx + Math.cos(angle) * r, cy + Math.sin(angle) * r, color, alpha);
  }
}

/**
 * Draw crosshairs at a point
 */
export function drawCrosshairs(ctx, cx, cy, size, color, alpha) {
  for (let x = cx - size; x <= cx + size; x += GRID) {
    if (Math.abs(x - cx) > 4) drawPixel(ctx, x, cy, color, alpha);
  }
  for (let y = cy - size; y <= cy + size; y += GRID) {
    if (Math.abs(y - cy) > 4) drawPixel(ctx, cx, y, color, alpha);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// GLITCH EFFECTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Draw scanline overlay
 * Use for loading/processing states (glitch level 2)
 * 
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {string} color - RGB triplet for scanline color
 * @param {number} opacity - Line opacity (0.02-0.06 typical)
 * @param {number} gap - Pixels between lines (default 2, respects GRID)
 */
export function drawScanlines(ctx, width, height, color = '0, 0, 0', opacity = 0.03, gap = 2) {
  const actualGap = Math.max(gap, GRID);
  for (let y = 0; y < height; y += actualGap) {
    ctx.fillStyle = `rgba(${color}, ${opacity})`;
    ctx.fillRect(0, y, width, 1);
  }
}

/**
 * Draw with chromatic aberration (RGB split)
 * Use for errors, warnings, dramatic moments (glitch level 4)
 * 
 * @param {CanvasRenderingContext2D} ctx
 * @param {Function} drawFn - Function that draws content: (ctx, offsetX, offsetY, channel) => void
 * @param {number} offset - Pixel offset for RGB split (1-3 typical)
 */
export function drawWithAberration(ctx, drawFn, offset = 2) {
  // Save current composite operation
  const prevComposite = ctx.globalCompositeOperation;
  
  // Draw red channel (offset left)
  ctx.globalCompositeOperation = 'lighter';
  ctx.save();
  ctx.translate(-offset, 0);
  drawFn(ctx, -offset, 0, 'red');
  ctx.restore();
  
  // Draw green channel (center)
  drawFn(ctx, 0, 0, 'green');
  
  // Draw blue channel (offset right)
  ctx.save();
  ctx.translate(offset, 0);
  drawFn(ctx, offset, 0, 'blue');
  ctx.restore();
  
  ctx.globalCompositeOperation = prevComposite;
}

/**
 * Apply glitch displacement to a set of particles
 * Use for transitions, state changes (glitch level 3)
 * 
 * @param {Array} particles - Array of particle objects with x, y properties
 * @param {number} intensity - Displacement amount in pixels (3-9 typical)
 * @param {number} probability - Chance each particle is displaced (0-1)
 * @returns {Array} - New array with displaced positions (original unchanged)
 */
export function glitchDisplace(particles, intensity = GRID, probability = 0.3) {
  return particles.map(p => {
    if (Math.random() > probability) return { ...p };
    
    // Snap displacement to GRID
    const dx = Math.floor((Math.random() - 0.5) * intensity * 2 / GRID) * GRID;
    const dy = Math.floor((Math.random() - 0.5) * intensity / GRID) * GRID; // More horizontal than vertical
    
    return {
      ...p,
      x: p.x + dx,
      y: p.y + dy,
      glitched: true,
    };
  });
}

/**
 * Create a glitch flicker effect (for loading states)
 * Returns opacity multiplier based on time
 * 
 * @param {number} time - Animation time
 * @param {number} frequency - Flicker speed (higher = faster)
 * @param {number} minOpacity - Minimum opacity during flicker
 * @returns {number} - Opacity multiplier 0-1
 */
export function glitchFlicker(time, frequency = 0.1, minOpacity = 0.7) {
  // Combine multiple sine waves for organic flicker
  const flicker = Math.sin(time * frequency * 50) * 0.5 + 
                  Math.sin(time * frequency * 73) * 0.3 +
                  Math.sin(time * frequency * 97) * 0.2;
  
  // Occasional sharp drops
  const spike = Math.random() > 0.98 ? 0.5 : 1;
  
  return Math.max(minOpacity, (flicker * 0.5 + 0.5) * spike);
}

/**
 * Draw noise/grain texture
 * Use for ambient atmosphere (glitch level 1)
 * 
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} width
 * @param {number} height
 * @param {string} color - RGB triplet
 * @param {number} density - Noise density (0.01-0.05 typical)
 * @param {number} alpha - Max noise alpha
 */
export function drawNoise(ctx, width, height, color = COLORS.DAWN, density = 0.02, alpha = 0.1) {
  const count = Math.floor(width * height * density / (GRID * GRID));
  for (let i = 0; i < count; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const a = Math.random() * alpha;
    drawPixel(ctx, x, y, color, a);
  }
}

/**
 * Apply glitch effect based on intensity level (0-4)
 * Convenience function that applies appropriate effects for each level
 * 
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} width
 * @param {number} height
 * @param {number} level - Glitch intensity 0-4
 * @param {string} color - RGB triplet for effects
 * @param {number} time - Animation time (for animated effects)
 */
export function applyGlitchLevel(ctx, width, height, level, color = COLORS.DAWN, time = 0) {
  if (level <= 0) return;
  
  // Level 1+: Noise
  if (level >= 1) {
    drawNoise(ctx, width, height, color, 0.02, 0.08);
  }
  
  // Level 2+: Scanlines
  if (level >= 2) {
    drawScanlines(ctx, width, height, '0, 0, 0', 0.03 + (level - 2) * 0.01);
  }
  
  // Level 3+: Occasional displacement (handled at particle level)
  // Level 4: Aberration (handled at draw level)
}

// ═══════════════════════════════════════════════════════════════════════════
// PARTICLE PRESETS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Create ambient drift particles
 */
export function createDriftParticles(count, width, height) {
  const particles = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: 0.1 + Math.random() * 0.15,
    });
  }
  return particles;
}

/**
 * Update and draw drift particles
 */
export function drawDriftParticles(ctx, particles, width, height, color) {
  particles.forEach(p => {
    drawPixel(ctx, p.x, p.y, color, p.alpha);
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0) p.x = width;
    if (p.x > width) p.x = 0;
    if (p.y < 0) p.y = height;
    if (p.y > height) p.y = 0;
  });
}

/**
 * Gaussian random for natural clustering
 */
export function gaussianRandom() {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

/**
 * Create clustered particles (for Ledger topology)
 */
export function createClusteredParticles(clusters, width, height) {
  const particles = [];
  clusters.forEach(cluster => {
    const count = Math.floor(cluster.amount / 100);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.abs(gaussianRandom() * cluster.spread);
      particles.push({
        x: cluster.cx + Math.cos(angle) * dist,
        y: cluster.cy + Math.sin(angle) * dist,
        baseX: cluster.cx + Math.cos(angle) * dist,
        baseY: cluster.cy + Math.sin(angle) * dist,
        cluster: cluster.name,
        color: cluster.color,
        phase: Math.random() * Math.PI * 2,
      });
    }
  });
  return particles;
}

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATION HELPERS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Standard animation loop pattern
 * @param {Function} drawFn - Function called each frame with (time) parameter
 * @returns {Function} - Cancel function
 */
export function createAnimationLoop(drawFn) {
  let animationId = null;
  let time = 0;
  
  function animate() {
    drawFn(time);
    time += 0.01;
    animationId = requestAnimationFrame(animate);
  }
  
  animate();
  
  return () => {
    if (animationId) cancelAnimationFrame(animationId);
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS FOR PLATFORMS
// ═══════════════════════════════════════════════════════════════════════════

export default {
  // Constants
  GRID,
  COLORS,
  TIMING,
  EASING,
  
  // Canvas setup
  setupCanvas,
  
  // Core drawing
  drawPixel,
  clearWithTrail,
  drawParticleLine,
  drawParticleCircle,
  drawCrosshairs,
  
  // Glitch effects
  drawScanlines,
  drawWithAberration,
  glitchDisplace,
  glitchFlicker,
  drawNoise,
  applyGlitchLevel,
  
  // Particle presets
  createDriftParticles,
  drawDriftParticles,
  gaussianRandom,
  createClusteredParticles,
  
  // Animation
  createAnimationLoop,
};

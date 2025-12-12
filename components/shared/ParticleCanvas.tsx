/**
 * Shared ParticleCanvas - Reference Implementation
 * 
 * A React component for the Thoughtform particle system.
 * Provides the core GRID=3 pixel-snapping animation foundation
 * that all platforms use with their specific configurations.
 * 
 * NON-NEGOTIABLE RULES:
 * - GRID = 3 (always snap to 3px grid)
 * - Use RGB triplets for colors, not hex in canvas operations
 * - clearWithTrail for motion blur (don't fully clear each frame)
 * - DPR-aware canvas setup
 * 
 * PLATFORM BEHAVIORS:
 * - Astrolabe: axis-flow (particles follow Vector I axes outward)
 * - Atlas: radial-organic (breathing, radial movement from center)
 * - Ledger Dark: horizontal-flow (scanline-like horizontal motion)
 * - Ledger Light: clustered-topology (breathing clusters with connections)
 */

'use client';

import { useRef, useEffect, useCallback } from 'react';

// ═══════════════════════════════════════════════════════════════════
// CONSTANTS (NON-NEGOTIABLE)
// ═══════════════════════════════════════════════════════════════════

export const GRID = 3; // SACRED: Never change this

// Color constants as RGB triplets for canvas operations
export const COLORS = {
  // Dark mode
  void: '5, 4, 3',
  dawn: '236, 227, 214',
  gold: '202, 165, 84',
  verde: '43, 78, 64',
  
  // Light mode  
  paper: '240, 239, 236',
  ink: '58, 56, 53',
  teal: '61, 139, 122',
  
  // Shared
  signal: '184, 92, 74',
};

// ═══════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════

export type ParticleBehavior = 
  | 'axis-flow'        // Astrolabe: Flow along Vector I axes
  | 'radial-organic'   // Atlas: Breathing radial movement
  | 'horizontal-flow'  // Ledger Dark: Scanline-like
  | 'clustered-topology'; // Ledger Light: Breathing clusters

export type ColorMode = 'dark' | 'light';

export interface ParticleCanvasProps {
  /** Particle behavior pattern */
  behavior?: ParticleBehavior;
  /** Color mode */
  mode?: ColorMode;
  /** Primary particle color (RGB triplet) */
  particleColor?: string;
  /** Background color (RGB triplet) */
  backgroundColor?: string;
  /** Number of particles */
  particleCount?: number;
  /** Trail opacity (0 = no trail, 1 = no fade) */
  trailOpacity?: number;
  /** Additional class names */
  className?: string;
  /** Pause animation */
  paused?: boolean;
}

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  alpha: number;
  phase: number;
  speed: number;
  size: number;
}

// ═══════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

/**
 * Setup canvas with DPR scaling
 */
function setupCanvas(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
): { width: number; height: number; dpr: number } {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);
  
  return { width: rect.width, height: rect.height, dpr };
}

/**
 * Draw a pixel-snapped square (core rendering primitive)
 */
function drawPixel(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string,
  alpha: number,
  size: number = GRID
): void {
  const px = Math.floor(x / GRID) * GRID;
  const py = Math.floor(y / GRID) * GRID;
  ctx.fillStyle = `rgba(${color}, ${alpha})`;
  ctx.fillRect(px, py, size - 1, size - 1);
}

/**
 * Clear with trail effect (creates motion blur)
 */
function clearWithTrail(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  bgColor: string,
  trailOpacity: number
): void {
  ctx.fillStyle = `rgba(${bgColor}, ${trailOpacity})`;
  ctx.fillRect(0, 0, width, height);
}

// ═══════════════════════════════════════════════════════════════════
// PARTICLE GENERATORS
// ═══════════════════════════════════════════════════════════════════

function generateParticles(
  count: number,
  width: number,
  height: number,
  behavior: ParticleBehavior
): Particle[] {
  const particles: Particle[] = [];
  
  for (let i = 0; i < count; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    
    particles.push({
      x,
      y,
      baseX: x,
      baseY: y,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      alpha: 0.3 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 1.5,
      size: GRID,
    });
  }
  
  return particles;
}

// ═══════════════════════════════════════════════════════════════════
// BEHAVIOR UPDATE FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

function updateAxisFlow(
  particle: Particle,
  time: number,
  centerX: number,
  centerY: number
): void {
  // Flow outward along axes from center
  const dx = particle.baseX - centerX;
  const dy = particle.baseY - centerY;
  const angle = Math.atan2(dy, dx);
  
  const flowOffset = (time * 0.02 * particle.speed) % 200;
  const distance = Math.hypot(dx, dy);
  
  particle.x = centerX + Math.cos(angle) * (distance + flowOffset);
  particle.y = centerY + Math.sin(angle) * (distance + flowOffset);
  
  // Reset when too far
  if (particle.x < 0 || particle.x > centerX * 2 || 
      particle.y < 0 || particle.y > centerY * 2) {
    particle.x = centerX + Math.cos(angle) * 10;
    particle.y = centerY + Math.sin(angle) * 10;
  }
}

function updateRadialOrganic(
  particle: Particle,
  time: number,
  centerX: number,
  centerY: number
): void {
  // Breathing radial movement
  const breathe = Math.sin(time * 0.002 + particle.phase) * 20;
  const drift = Math.cos(time * 0.001 + particle.phase * 1.5) * 10;
  
  particle.x = particle.baseX + breathe;
  particle.y = particle.baseY + drift;
  
  // Subtle alpha pulsing
  particle.alpha = 0.3 + Math.sin(time * 0.003 + particle.phase) * 0.2;
}

function updateHorizontalFlow(
  particle: Particle,
  time: number,
  width: number
): void {
  // Scanline-like horizontal movement
  particle.x += particle.speed * 0.5;
  
  // Subtle vertical drift
  particle.y += Math.sin(time * 0.002 + particle.phase) * 0.3;
  
  // Wrap around
  if (particle.x > width) {
    particle.x = 0;
    particle.y = particle.baseY;
  }
}

function updateClusteredTopology(
  particle: Particle,
  time: number
): void {
  // Gentle orbital breathing around base position
  const orbitRadius = 8 + Math.sin(particle.phase) * 4;
  const orbitAngle = time * 0.001 * particle.speed + particle.phase;
  
  particle.x = particle.baseX + Math.cos(orbitAngle) * orbitRadius;
  particle.y = particle.baseY + Math.sin(orbitAngle) * orbitRadius;
  
  // Breathing alpha
  particle.alpha = 0.35 + Math.sin(time * 0.002 + particle.phase) * 0.15;
}

// ═══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════

export function ParticleCanvas({
  behavior = 'radial-organic',
  mode = 'dark',
  particleColor,
  backgroundColor,
  particleCount = 100,
  trailOpacity = 0.08,
  className = '',
  paused = false,
}: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | null>(null);
  const timeRef = useRef(0);

  // Determine colors based on mode
  const bgColor = backgroundColor || (mode === 'dark' ? COLORS.void : COLORS.paper);
  const pColor = particleColor || (mode === 'dark' ? COLORS.gold : COLORS.teal);

  const animate = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    if (paused) return;
    
    const time = timeRef.current;
    const centerX = width / 2;
    const centerY = height / 2;

    // Clear with trail
    clearWithTrail(ctx, width, height, bgColor, trailOpacity);

    // Update and draw particles
    particlesRef.current.forEach((particle) => {
      // Update based on behavior
      switch (behavior) {
        case 'axis-flow':
          updateAxisFlow(particle, time, centerX, centerY);
          break;
        case 'radial-organic':
          updateRadialOrganic(particle, time, centerX, centerY);
          break;
        case 'horizontal-flow':
          updateHorizontalFlow(particle, time, width);
          break;
        case 'clustered-topology':
          updateClusteredTopology(particle, time);
          break;
      }

      // Draw particle (pixel-snapped)
      drawPixel(ctx, particle.x, particle.y, pColor, particle.alpha, particle.size);
    });

    timeRef.current++;
    animationRef.current = requestAnimationFrame(() => animate(ctx, width, height));
  }, [behavior, bgColor, pColor, trailOpacity, paused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = setupCanvas(canvas, ctx);
    
    // Generate particles
    particlesRef.current = generateParticles(particleCount, width, height, behavior);

    // Initial fill
    ctx.fillStyle = `rgb(${bgColor})`;
    ctx.fillRect(0, 0, width, height);

    // Start animation
    animate(ctx, width, height);

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particleCount, behavior, animate, bgColor]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const { width, height } = setupCanvas(canvas, ctx);
      particlesRef.current = generateParticles(particleCount, width, height, behavior);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [particleCount, behavior]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
      style={{
        background: `rgb(${bgColor})`,
      }}
    />
  );
}

// ═══════════════════════════════════════════════════════════════════
// USAGE EXAMPLES
// ═══════════════════════════════════════════════════════════════════
/*
import { ParticleCanvas, COLORS } from '@/components/shared/ParticleCanvas';

// Astrolabe style (gold axis flow on void)
<ParticleCanvas
  behavior="axis-flow"
  mode="dark"
  particleColor={COLORS.gold}
  particleCount={150}
/>

// Atlas style (dawn organic on void)
<ParticleCanvas
  behavior="radial-organic"
  mode="dark"
  particleColor={COLORS.dawn}
  particleCount={80}
/>

// Ledger Dark style (verde horizontal on void)
<ParticleCanvas
  behavior="horizontal-flow"
  mode="dark"
  particleColor={COLORS.verde}
  particleCount={120}
/>

// Ledger Light style (teal clusters on paper)
<ParticleCanvas
  behavior="clustered-topology"
  mode="light"
  particleColor={COLORS.teal}
  particleCount={100}
/>
*/

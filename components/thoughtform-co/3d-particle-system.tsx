/**
 * 3D Scroll-Driven Particle System V2 - Thoughtform.co Implementation
 * 
 * Reference implementation showing the pattern for:
 * - Config-driven particle rendering
 * - Extended topology terrain (Manifold) with wave topology
 * - Multiple landmark shapes (Gateway, Tower, Helix, Sphere, Ring)
 * - Proximity brightness boost for nearby particles
 * - Admin-controllable via ParticleConfigContext
 * 
 * See: particles/thoughtform-co-3d.md for full documentation
 */

'use client';

import { useEffect, useRef, useCallback } from 'react';

// ═══════════════════════════════════════════════════════════════
// CONFIGURATION TYPES
// ═══════════════════════════════════════════════════════════════

interface ManifoldConfig {
  color: string;
  rows: number;
  columns: number;
  waveAmplitude: number;
  waveFrequency: number;
  spreadX: number;
  spreadZ: number;
  opacity: number;
}

interface LandmarkConfig {
  id: string;
  sectionId: string;
  name: string;
  shape: 'gateway' | 'tower' | 'helix' | 'sphere' | 'ring';
  color: string;
  density: number;
  scale: number;
  position: { x: number; y: number; z: number };
  enabled: boolean;
}

interface ParticleSystemConfig {
  manifold: ManifoldConfig;
  landmarks: LandmarkConfig[];
  version: number;
}

// ═══════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════

const GRID = 3; // Non-negotiable: all positions snap to 3px grid
const FOCAL = 400;
const MAX_DEPTH = 7000;

// Default configuration
const DEFAULT_CONFIG: ParticleSystemConfig = {
  manifold: {
    color: "#ebe3d6",  // Semantic Dawn
    rows: 140,
    columns: 60,
    waveAmplitude: 180,
    waveFrequency: 0.2,
    spreadX: 1.0,
    spreadZ: 1.0,
    opacity: 0.45,
  },
  landmarks: [
    {
      id: "gateway",
      sectionId: "hero",
      name: "Gateway Portal",
      shape: "gateway",
      color: "#caa554",
      density: 1.0,
      scale: 1.0,
      position: { x: 150, y: 180, z: 800 },
      enabled: true,
    },
    {
      id: "tower",
      sectionId: "manifesto",
      name: "Crystalline Tower",
      shape: "tower",
      color: "#caa554",
      density: 1.0,
      scale: 1.0,
      position: { x: 0, y: 0, z: 3200 },
      enabled: true,
    },
  ],
  version: 1,
};

// ═══════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════

function snap(value: number): number {
  return Math.floor(value / GRID) * GRID;
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "236, 227, 214";
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
}

function drawPixel(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string,
  alpha: number,
  size: number = GRID
) {
  const px = snap(x);
  const py = snap(y);
  ctx.fillStyle = `rgba(${color}, ${alpha})`;
  ctx.fillRect(px, py, size - 1, size - 1);
}

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

interface Particle {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  type: "terrain" | "gateway" | "geo";
  color: string;
  size: number;
  phase: number;
  landmark?: number;
  landmarkId?: string;
}

// ═══════════════════════════════════════════════════════════════
// PARTICLE CREATION
// ═══════════════════════════════════════════════════════════════

function createPoint(
  x: number,
  y: number,
  z: number,
  type: "terrain" | "gateway" | "geo",
  color: string,
  landmark?: number,
  landmarkId?: string
): Particle {
  return {
    x,
    y,
    z,
    baseX: x,
    baseY: y,
    type,
    color,
    size: 1 + Math.random() * 0.5,
    phase: Math.random() * Math.PI * 2,
    landmark,
    landmarkId,
  };
}

function getTerrainY(x: number, z: number, config: ManifoldConfig): number {
  const clampedZ = Math.max(800, Math.min(8800, z));
  const r = (clampedZ - 800) / 50;
  const c = x / 65 + 35;

  const wavePhase = r * 0.02;
  return (
    400 +
    Math.sin(c * config.waveFrequency + wavePhase) * config.waveAmplitude +
    Math.cos(r * 0.12) * 150 +
    Math.sin(c * 0.35 + r * 0.15) * 70 +
    Math.sin(r * 0.08) * 100
  );
}

// ═══════════════════════════════════════════════════════════════
// SHAPE GENERATORS
// ═══════════════════════════════════════════════════════════════

function generateGateway(
  particles: Particle[],
  landmark: LandmarkConfig,
  index: number
): void {
  const colorRgb = hexToRgb(landmark.color);
  const scale = landmark.scale;
  const density = landmark.density;
  const baseX = landmark.position.x;
  const baseZ = landmark.position.z;
  const radius = 400 * scale;

  // Concentric rings
  const ringCount = Math.floor(8 * density);
  for (let ring = 0; ring < ringCount; ring++) {
    const ringRadius = radius - ring * (20 * scale);
    const points = Math.max(20, Math.floor((80 - ring * 5) * density));
    const z = baseZ + ring * 15;

    for (let i = 0; i < points; i++) {
      const angle = (i / points) * Math.PI * 2;
      const x = baseX + Math.cos(angle) * ringRadius;
      const y = landmark.position.y + Math.sin(angle) * ringRadius;
      particles.push(createPoint(x, y, z, "gateway", colorRgb, index, landmark.id));
    }
  }

  // Inner spiral
  const spiralPoints = Math.floor(150 * density);
  for (let i = 0; i < spiralPoints; i++) {
    const t = i / spiralPoints;
    const angle = t * Math.PI * 2 * 5;
    const spiralRadius = (1 - t) * radius * 0.9;
    const z = baseZ + 100 + t * 600;
    const x = baseX + Math.cos(angle) * spiralRadius;
    const y = landmark.position.y + Math.sin(angle) * spiralRadius * 0.8;
    particles.push(createPoint(x, y, z, "gateway", colorRgb, index, landmark.id));
  }
}

function generateTower(
  particles: Particle[],
  landmark: LandmarkConfig,
  index: number,
  manifold: ManifoldConfig
): void {
  const colorRgb = hexToRgb(landmark.color);
  const scale = landmark.scale;
  const density = landmark.density;
  const centerX = landmark.position.x;
  const centerZ = landmark.position.z;
  const terrainY = getTerrainY(centerX, centerZ, manifold);

  const levels = Math.floor(12 * density);
  for (let level = 0; level < levels; level++) {
    const height = level * 40 * scale;
    const baseY = terrainY - height;
    const levelSize = (220 - level * 15) * scale;
    const pointsPerSide = Math.max(3, 10 - Math.floor(level / 3));

    // Square layers
    for (let side = 0; side < 4; side++) {
      for (let i = 0; i < pointsPerSide; i++) {
        const t = i / pointsPerSide;
        let x: number, z: number;

        if (side === 0) {
          x = centerX + (t - 0.5) * levelSize;
          z = centerZ - levelSize * 0.3;
        } else if (side === 1) {
          x = centerX + (t - 0.5) * levelSize;
          z = centerZ + levelSize * 0.3;
        } else if (side === 2) {
          z = centerZ + (t - 0.5) * levelSize * 0.6;
          x = centerX - levelSize * 0.5;
        } else {
          z = centerZ + (t - 0.5) * levelSize * 0.6;
          x = centerX + levelSize * 0.5;
        }

        particles.push(createPoint(x, baseY, z, "geo", colorRgb, index, landmark.id));
      }
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// PARTICLE INITIALIZATION
// ═══════════════════════════════════════════════════════════════

function initParticles(config: ParticleSystemConfig): Particle[] {
  const particles: Particle[] = [];
  const { manifold, landmarks } = config;
  const manifoldColorRgb = hexToRgb(manifold.color);

  // ─── TERRAIN (Manifold) ───
  for (let r = 0; r < manifold.rows; r++) {
    for (let c = 0; c < manifold.columns; c++) {
      const x = (c - manifold.columns / 2) * (70 * manifold.spreadX);
      const z = 1200 + r * (55 * manifold.spreadZ);

      const wavePhase = r * 0.02;
      const y =
        400 +
        Math.sin(c * manifold.waveFrequency + wavePhase) * manifold.waveAmplitude +
        Math.cos(r * 0.12) * 150 +
        Math.sin(c * 0.35 + r * 0.15) * 70 +
        Math.sin(r * 0.08) * 100;

      particles.push(createPoint(x, y, z, "terrain", manifoldColorRgb, 0));
    }
  }

  // ─── LANDMARKS ───
  landmarks.forEach((landmark, index) => {
    if (!landmark.enabled) return;

    const landmarkIndex = index + 1;

    switch (landmark.shape) {
      case "gateway":
        generateGateway(particles, landmark, landmarkIndex);
        break;
      case "tower":
        generateTower(particles, landmark, landmarkIndex, manifold);
        break;
      // Add more shapes as needed...
    }
  });

  return particles;
}

// ═══════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════

interface ParticleSystem3DProps {
  scrollProgress: number;
  config?: ParticleSystemConfig;
}

export function ParticleSystem3D({
  scrollProgress,
  config = DEFAULT_CONFIG,
}: ParticleSystem3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);
  const dimensionsRef = useRef({ width: 0, height: 0 });
  const scrollProgressRef = useRef(0);
  const timeRef = useRef(0);
  const configRef = useRef(config);

  useEffect(() => {
    configRef.current = config;
    particlesRef.current = initParticles(config);
  }, [config]);

  useEffect(() => {
    scrollProgressRef.current = scrollProgress;
  }, [scrollProgress]);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;

    dimensionsRef.current = { width, height };
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(dpr, dpr);
  }, []);

  useEffect(() => {
    particlesRef.current = initParticles(config);
    resize();

    const render = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) {
        animationRef.current = requestAnimationFrame(render);
        return;
      }

      const { width, height } = dimensionsRef.current;
      if (width === 0 || height === 0) {
        animationRef.current = requestAnimationFrame(render);
        return;
      }

      const currentConfig = configRef.current;
      const time = timeRef.current;
      const scrollP = scrollProgressRef.current;
      const scrollZ = scrollP * 9000;

      const currentSection = Math.floor(scrollP * 4) + 1;
      const sectionProgress = (scrollP * 4) % 1;

      // Full clear - no trails
      ctx.fillStyle = "#050504";
      ctx.fillRect(0, 0, width, height);

      const cx_geo = width * 0.7;
      const cy = height * 0.5;

      // Sort by depth
      const sorted = [...particlesRef.current].sort(
        (a, b) => b.z - scrollZ - (a.z - scrollZ)
      );

      sorted.forEach((p) => {
        let relZ: number;
        let particleAlpha = 1;
        let terrainAlphaMultiplier = 1;

        if (p.type === "terrain") {
          relZ = p.z - scrollZ;
          terrainAlphaMultiplier = currentConfig.manifold.opacity;
        } else if (p.type === "gateway") {
          relZ = p.z - scrollZ;
          if (scrollP > 0.15) {
            particleAlpha = Math.max(0, 1 - (scrollP - 0.15) * 4);
          }
        } else {
          relZ = p.z - scrollZ;

          if (p.landmark) {
            const sectionDist = Math.abs(currentSection - p.landmark);
            if (sectionDist === 0) {
              particleAlpha = Math.min(1, sectionProgress * 1.8);
            } else if (sectionDist === 1) {
              particleAlpha = 0.3;
            } else {
              return;
            }
          }
        }

        // Culling
        if (p.type === "terrain") {
          if (relZ <= 30 || relZ > MAX_DEPTH) return;
        } else {
          if (relZ <= 5 || relZ > MAX_DEPTH) return;
        }

        const scale = FOCAL / relZ;

        // Breathing animation
        const breatheX = Math.sin(time * 0.015 + p.phase) * 5;
        const breatheY = Math.cos(time * 0.012 + p.phase * 1.3) * 4;

        const x = cx_geo + (p.x + breatheX) * scale;
        const y = cy + (p.y + breatheY) * scale;

        // Bounds check
        if (x < -150 || x > width + 150 || y < -150 || y > height + 150) return;

        // Y-culling for terrain
        if (p.type === "terrain" && y < height * 0.35) return;

        // Alpha calculation with proximity boost
        const normalizedDepth = relZ / MAX_DEPTH;
        const depthAlpha = Math.min(1, (1 - normalizedDepth) * 1.5 + 0.3);
        const proximityBoost = relZ < 1500 ? 1 + (1 - relZ / 1500) * 0.8 : 1;
        const breatheAlpha = 0.85 + Math.sin(time * 0.02 + p.phase) * 0.15;

        const finalAlpha = Math.min(
          1,
          depthAlpha * particleAlpha * terrainAlphaMultiplier * breatheAlpha * proximityBoost
        );

        // Render
        if (p.type === "terrain") {
          const sizeMultiplier = Math.min(2.5, 0.6 + scale * 1.2);
          drawPixel(ctx, x, y, p.color, finalAlpha, Math.max(GRID, GRID * sizeMultiplier));
        } else {
          const baseSize = p.type === "gateway" ? GRID * 2 : GRID * 1.6;
          drawPixel(ctx, x, y, p.color, finalAlpha, Math.max(GRID, baseSize * Math.min(3, scale * 2)));
        }
      });

      timeRef.current++;
      animationRef.current = requestAnimationFrame(render);
    };

    window.addEventListener("resize", resize);
    animationRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [resize, config]);

  return (
    <div className="space-background">
      <canvas ref={canvasRef} className="space-canvas" />
    </div>
  );
}

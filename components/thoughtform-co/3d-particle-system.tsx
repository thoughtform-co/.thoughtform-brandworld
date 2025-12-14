/**
 * 3D Scroll-Driven Particle System - Thoughtform.co Implementation
 * 
 * Reference implementation showing the pattern for:
 * - Extended topology terrain (scrolls with content)
 * - Section-based landmarks that emerge from terrain
 * - Split vanishing points (stars center, geo right)
 * - Scroll-driven depth and section detection
 * 
 * See: particles/thoughtform-co-3d.md for full documentation
 */

'use client';

import { useEffect, useRef, useCallback } from 'react';

// ═══════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════

const GRID = 3; // Non-negotiable
const DAWN = "#ebe3d6";
const GOLD = "#caa554";
const ALERT = "#ff6b35";
const CHARS = ["λ", "δ", "θ", "φ", "ψ", "Σ", "π", "∇", "∞", "∂", "⟨", "⟩"];

function snap(value: number): number {
  return Math.floor(value / GRID) * GRID;
}

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

interface Particle {
  x: number;
  y: number;
  z: number;
  baseY: number;
  type: "star" | "geo" | "terrain";
  color: string;
  char: string;
  size: number;
  landmark?: number; // 0=terrain, 1-4=sections
}

// ═══════════════════════════════════════════════════════════════
// PARTICLE INITIALIZATION
// ═══════════════════════════════════════════════════════════════

function createPoint(
  x: number,
  y: number,
  z: number,
  type: "star" | "geo" | "terrain",
  color: string,
  landmark?: number
): Particle {
  return {
    x, y, z,
    baseY: y,
    type,
    color,
    char: CHARS[Math.floor(Math.random() * CHARS.length)],
    size: 1 + Math.random(),
    landmark,
  };
}

function initParticles(): Particle[] {
  const particles: Particle[] = [];

  // ─── A. STARFIELD ───
  for (let i = 0; i < 500; i++) {
    particles.push(createPoint(
      (Math.random() - 0.5) * 6000,
      (Math.random() - 0.5) * 6000,
      Math.random() * 8000,
      "star", DAWN
    ));
  }

  // ─── B. EXTENDED TOPOLOGY TERRAIN ───
  // 160 rows × 70 columns, spans Z: 800 to 8800
  for (let r = 0; r < 160; r++) {
    for (let c = 0; c < 70; c++) {
      const x = (c - 35) * 65;
      const z = 800 + (r * 50);
      
      const wavePhase = r * 0.02; // Evolution as you travel
      const y = 400 
        + Math.sin(c * 0.2 + wavePhase) * 180
        + Math.cos(r * 0.12) * 150
        + Math.sin(c * 0.35 + r * 0.15) * 70
        + Math.sin(r * 0.08) * 100;
      
      particles.push(createPoint(x, y, z, "terrain", GOLD, 0));
    }
  }

  // ─── C. LANDMARKS (examples) ───
  // Gateway Portal (Section 1)
  const portalOffsetX = 200;
  for (let layer = 0; layer < 12; layer++) {
    const z = 1500 + layer * 40;
    const radius = 300 - layer * 18;
    const points = Math.max(20, 40 - layer * 2);
    for (let i = 0; i < points; i++) {
      const angle = (i / points) * Math.PI * 2;
      particles.push(createPoint(
        portalOffsetX + Math.cos(angle) * radius,
        200 + Math.sin(angle) * radius,
        z,
        "geo", GOLD, 1
      ));
    }
  }

  // Event Horizon (Section 4)
  for (let i = 0; i < 700; i++) {
    const r = 450;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    particles.push(createPoint(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta),
      8500 + r * Math.cos(phi) * 0.5,
      "geo", ALERT, 4
    ));
  }

  return particles;
}

// ═══════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════

interface ParticleSystem3DProps {
  /** Scroll progress (0-1) */
  scrollProgress: number;
}

export function ParticleSystem3D({ scrollProgress }: ParticleSystem3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);
  const dimensionsRef = useRef({ width: 0, height: 0 });
  const scrollProgressRef = useRef(0);

  const FOCAL = 400;
  const MAX_DEPTH = 6500;
  const SCROLL_RANGE = 8500;

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
    particlesRef.current = initParticles();
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

      const scrollP = scrollProgressRef.current;
      const scrollZ = scrollP * SCROLL_RANGE;
      
      // Section detection
      const currentSection = Math.floor(scrollP * 4) + 1;
      const sectionProgress = (scrollP * 4) % 1;

      // Trail effect
      ctx.fillStyle = "rgba(5, 5, 4, 0.88)";
      ctx.fillRect(0, 0, width, height);

      // Split vanishing points
      const cx_stars = width * 0.5;
      const cx_geo = width * 0.72;  // Fixed right position
      const cy = height * 0.52;

      // Sort by depth
      const sorted = [...particlesRef.current].sort((a, b) => {
        return (b.z - scrollZ) - (a.z - scrollZ);
      });

      sorted.forEach((p) => {
        let relZ: number;
        let particleAlpha = 1;
        let yOffset = 0;
        let terrainAlphaMultiplier = 1;

        if (p.type === "terrain") {
          relZ = p.z - scrollZ;
          terrainAlphaMultiplier = 0.7;
        } else if (p.type === "star") {
          relZ = p.z - scrollZ;
          while (relZ < 0) relZ += 8000;
          while (relZ > 8000) relZ -= 8000;
        } else {
          relZ = p.z - scrollZ;
          
          if (p.landmark) {
            const landmarkSection = p.landmark;
            const sectionDist = Math.abs(currentSection - landmarkSection);
            
            if (sectionDist === 0) {
              particleAlpha = 1;
              const emergence = Math.min(1, sectionProgress * 2);
              yOffset = (1 - emergence) * 150;
            } else if (sectionDist === 1) {
              particleAlpha = 0.4;
            } else {
              particleAlpha = 0;
              return;
            }
          }
        }

        // Culling
        if (p.type === "terrain") {
          if (relZ <= 50 || relZ > MAX_DEPTH) return;
        } else {
          if (relZ <= 10 || relZ > MAX_DEPTH) return;
        }

        const scale = FOCAL / relZ;
        const center = p.type === "star" ? cx_stars : cx_geo;
        const x = center + p.x * scale;
        const y = cy + (p.y + yOffset) * scale;

        // Bounds check
        if (p.type === "terrain") {
          if (x < -200 || x > width + 200 || y < -200 || y > height + 200) return;
        } else {
          if (x < -50 || x > width + 50 || y < -50 || y > height + 50) return;
        }

        // Render
        const depthAlpha = Math.min(1, (1 - relZ / MAX_DEPTH) * 1.8);
        ctx.globalAlpha = depthAlpha * particleAlpha * terrainAlphaMultiplier;
        ctx.fillStyle = p.color;

        if ((p.type === "geo" || p.type === "terrain") && scale > 0.35) {
          const fontSize = Math.max(8, Math.min(18, 12 * scale));
          ctx.font = `${fontSize}px "IBM Plex Sans", sans-serif`;
          ctx.fillText(p.char, snap(x), snap(y));
        } else if (p.type === "geo" || p.type === "terrain") {
          const size = Math.max(GRID, GRID * scale);
          ctx.fillRect(snap(x), snap(y), size - 1, size - 1);
        } else {
          const size = Math.max(GRID, p.size * scale * GRID);
          ctx.globalAlpha = depthAlpha * 0.4;
          ctx.fillRect(snap(x), snap(y), size - 1, size - 1);
        }
      });

      ctx.globalAlpha = 1;
      animationRef.current = requestAnimationFrame(render);
    };

    window.addEventListener("resize", resize);
    animationRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [resize]);

  return (
    <div className="space-background">
      <canvas ref={canvasRef} className="space-canvas" />
    </div>
  );
}


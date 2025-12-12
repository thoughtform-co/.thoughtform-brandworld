/**
 * Glitch Effects - Reference Implementations
 * 
 * CSS and React implementations of the Thoughtform glitch aesthetic.
 * These are the building blocks for glitch level 1-4 effects.
 * 
 * GLITCH LEVELS:
 * 0 - None: Clean render
 * 1 - Texture: Background noise, subtle grain
 * 2 - Scanlines: Horizontal line overlay (loading/processing)
 * 3 - Displacement: Pixel offset, brief stutter (transitions)
 * 4 - Aberration: RGB split, chromatic shift (errors/drama)
 * 
 * PRINCIPLES:
 * - Purposeful, not decorative — signals liminal states
 * - Subtle by default — reserve high intensity for significant moments
 * - Pixelated, not smooth — respect GRID=3 snapping conceptually
 * - Warm, not cold — use Dawn/Gold tints
 */

'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// SCANLINE OVERLAY (Glitch Level 2)
// ═══════════════════════════════════════════════════════════════════════════

export interface ScanlineOverlayProps {
  /** Opacity of scanlines (0.02-0.06 typical) */
  opacity?: number;
  /** Gap between lines in pixels */
  gap?: number;
  /** Animate scanlines moving */
  animated?: boolean;
  /** Additional class names */
  className?: string;
}

/**
 * CSS-only scanline overlay for loading/processing states.
 * Apply as a sibling or child that overlays content.
 * 
 * Usage:
 * <div className="relative">
 *   <Content />
 *   {isLoading && <ScanlineOverlay />}
 * </div>
 */
export function ScanlineOverlay({
  opacity = 0.03,
  gap = 2,
  animated = false,
  className = '',
}: ScanlineOverlayProps) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        background: `repeating-linear-gradient(
          0deg,
          transparent 0px,
          transparent ${gap}px,
          rgba(0, 0, 0, ${opacity}) ${gap}px,
          rgba(0, 0, 0, ${opacity}) ${gap + 1}px
        )`,
        animation: animated ? 'scanline-scroll 0.5s linear infinite' : 'none',
      }}
    >
      <style jsx>{`
        @keyframes scanline-scroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(${gap + 1}px); }
        }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// GLITCH TEXT (Glitch Level 3-4)
// ═══════════════════════════════════════════════════════════════════════════

export interface GlitchTextProps {
  /** Text content */
  children: ReactNode;
  /** Enable chromatic aberration on hover */
  aberrationOnHover?: boolean;
  /** Aberration offset in pixels */
  aberrationOffset?: number;
  /** Enable random glitch flicker */
  flicker?: boolean;
  /** Additional class names */
  className?: string;
  /** HTML tag to render */
  as?: 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'p';
}

/**
 * Text with chromatic aberration effect.
 * Applies RGB split on hover or continuously.
 * 
 * Usage:
 * <GlitchText aberrationOnHover>ERROR: Connection Lost</GlitchText>
 */
export function GlitchText({
  children,
  aberrationOnHover = true,
  aberrationOffset = 2,
  flicker = false,
  className = '',
  as: Component = 'span',
}: GlitchTextProps) {
  const [isGlitching, setIsGlitching] = useState(false);

  // Random flicker effect
  useEffect(() => {
    if (!flicker) return;
    
    const interval = setInterval(() => {
      if (Math.random() > 0.95) {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 50 + Math.random() * 100);
      }
    }, 100);
    
    return () => clearInterval(interval);
  }, [flicker]);

  const showAberration = isGlitching || (aberrationOnHover ? undefined : false);

  return (
    <Component
      className={`
        relative inline-block
        ${aberrationOnHover ? 'group' : ''}
        ${className}
      `}
      style={{
        // Base text
      }}
    >
      {/* Main text */}
      <span className="relative z-10">{children}</span>
      
      {/* Red channel (offset left) */}
      <span
        className={`
          absolute inset-0 z-0
          ${aberrationOnHover ? 'opacity-0 group-hover:opacity-100' : ''}
          transition-opacity duration-75
        `}
        style={{
          color: 'rgba(255, 50, 50, 0.7)',
          transform: `translateX(-${aberrationOffset}px)`,
          opacity: showAberration === false ? 0 : undefined,
          mixBlendMode: 'screen',
        }}
        aria-hidden
      >
        {children}
      </span>
      
      {/* Blue channel (offset right) */}
      <span
        className={`
          absolute inset-0 z-0
          ${aberrationOnHover ? 'opacity-0 group-hover:opacity-100' : ''}
          transition-opacity duration-75
        `}
        style={{
          color: 'rgba(50, 50, 255, 0.7)',
          transform: `translateX(${aberrationOffset}px)`,
          opacity: showAberration === false ? 0 : undefined,
          mixBlendMode: 'screen',
        }}
        aria-hidden
      >
        {children}
      </span>
    </Component>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// LOADING GLITCH (Glitch Level 2-3)
// ═══════════════════════════════════════════════════════════════════════════

export interface LoadingGlitchProps {
  /** Size of the loading indicator */
  size?: 'sm' | 'md' | 'lg';
  /** Primary color (RGB triplet or CSS color) */
  color?: string;
  /** Show scanlines */
  scanlines?: boolean;
  /** Additional class names */
  className?: string;
}

const SIZE_MAP = {
  sm: { width: 24, height: 24, particles: 8 },
  md: { width: 48, height: 48, particles: 16 },
  lg: { width: 80, height: 80, particles: 24 },
};

/**
 * Particle-based loading indicator with glitch aesthetic.
 * Particles coalesce and flicker during loading.
 * 
 * Usage:
 * {isLoading && <LoadingGlitch size="md" />}
 */
export function LoadingGlitch({
  size = 'md',
  color = 'var(--gold, #CAA554)',
  scanlines = true,
  className = '',
}: LoadingGlitchProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { width, height, particles: particleCount } = SIZE_MAP[size];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const GRID = 3;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Create particles
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      targetX: width / 2,
      targetY: height / 2,
      phase: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 0.5,
    }));

    let time = 0;
    let animationId: number;

    function draw() {
      // Clear with trail
      ctx.fillStyle = 'rgba(5, 4, 3, 0.15)';
      ctx.fillRect(0, 0, width, height);

      // Update center target with breathing
      const breathe = Math.sin(time * 0.03) * 8;
      const cx = width / 2;
      const cy = height / 2;

      particles.forEach((p, i) => {
        // Orbital motion around center
        const angle = time * 0.02 * p.speed + p.phase;
        const radius = 8 + Math.sin(time * 0.01 + p.phase) * 4 + breathe * 0.3;
        
        p.x += (cx + Math.cos(angle) * radius - p.x) * 0.1;
        p.y += (cy + Math.sin(angle) * radius - p.y) * 0.1;

        // Occasional glitch displacement
        const glitched = Math.random() > 0.98;
        const gx = glitched ? (Math.random() - 0.5) * GRID * 2 : 0;
        const gy = glitched ? (Math.random() - 0.5) * GRID : 0;

        // Flicker alpha
        const flicker = Math.sin(time * 0.1 + i) * 0.3 + 0.7;
        const alpha = 0.4 + flicker * 0.4;

        // Draw pixel-snapped
        const px = Math.floor((p.x + gx) / GRID) * GRID;
        const py = Math.floor((p.y + gy) / GRID) * GRID;
        
        ctx.fillStyle = color.startsWith('var') 
          ? `rgba(202, 165, 84, ${alpha})`  // Fallback for CSS vars
          : color.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
        ctx.fillRect(px, py, GRID - 1, GRID - 1);
      });

      // Draw scanlines
      if (scanlines) {
        for (let y = 0; y < height; y += 2) {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
          ctx.fillRect(0, y, width, 1);
        }
      }

      time++;
      animationId = requestAnimationFrame(draw);
    }

    draw();

    return () => cancelAnimationFrame(animationId);
  }, [width, height, particleCount, color, scanlines]);

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <canvas
        ref={canvasRef}
        style={{ width, height }}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// NOISE TEXTURE (Glitch Level 1)
// ═══════════════════════════════════════════════════════════════════════════

export interface NoiseTextureProps {
  /** Noise opacity (0.02-0.08 typical) */
  opacity?: number;
  /** Animate noise */
  animated?: boolean;
  /** Animation speed (frames between updates) */
  frameSkip?: number;
  /** Additional class names */
  className?: string;
}

/**
 * Animated noise/grain texture overlay.
 * Creates subtle film grain effect for atmosphere.
 * 
 * Usage:
 * <div className="relative">
 *   <Content />
 *   <NoiseTexture opacity={0.04} />
 * </div>
 */
export function NoiseTexture({
  opacity = 0.04,
  animated = true,
  frameSkip = 3,
  className = '',
}: NoiseTextureProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      const rect = parent.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.scale(dpr, dpr);
    };
    resize();

    let frameCount = 0;
    let animationId: number;

    function draw() {
      if (!animated || frameCount % frameSkip === 0) {
        const { width, height } = canvas;
        const imageData = ctx.createImageData(width, height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
          const noise = Math.random() * 255;
          data[i] = noise;     // R
          data[i + 1] = noise; // G
          data[i + 2] = noise; // B
          data[i + 3] = Math.random() * opacity * 255; // A
        }

        ctx.putImageData(imageData, 0, 0);
      }
      
      frameCount++;
      if (animated) {
        animationId = requestAnimationFrame(draw);
      }
    }

    draw();
    
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [animated, opacity, frameSkip]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ mixBlendMode: 'overlay' }}
    />
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// GLITCH CONTAINER (Composite)
// ═══════════════════════════════════════════════════════════════════════════

export interface GlitchContainerProps {
  children: ReactNode;
  /** Glitch intensity level 0-4 */
  level?: 0 | 1 | 2 | 3 | 4;
  /** Additional class names */
  className?: string;
}

/**
 * Container that applies appropriate glitch effects based on level.
 * Convenience wrapper for combining multiple effects.
 * 
 * Usage:
 * <GlitchContainer level={isLoading ? 2 : isError ? 4 : 0}>
 *   <Content />
 * </GlitchContainer>
 */
export function GlitchContainer({
  children,
  level = 0,
  className = '',
}: GlitchContainerProps) {
  return (
    <div className={`relative ${className}`}>
      {children}
      
      {/* Level 1+: Noise texture */}
      {level >= 1 && (
        <NoiseTexture 
          opacity={0.02 + (level - 1) * 0.01} 
          animated={level >= 2}
        />
      )}
      
      {/* Level 2+: Scanlines */}
      {level >= 2 && (
        <ScanlineOverlay 
          opacity={0.03 + (level - 2) * 0.01}
          animated={level >= 3}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// USAGE EXAMPLES
// ═══════════════════════════════════════════════════════════════════════════
/*
import { 
  ScanlineOverlay, 
  GlitchText, 
  LoadingGlitch, 
  NoiseTexture,
  GlitchContainer 
} from '@/components/shared/GlitchEffects';

// Scanlines during loading
<div className="relative">
  <DataTable data={data} />
  {isLoading && <ScanlineOverlay animated />}
</div>

// Error text with aberration
<GlitchText aberrationOnHover flicker>
  CONNECTION LOST
</GlitchText>

// Loading indicator
{isProcessing && <LoadingGlitch size="md" />}

// Atmospheric background
<div className="relative min-h-screen">
  <NoiseTexture opacity={0.03} />
  <PageContent />
</div>

// Composite glitch based on state
<GlitchContainer level={isError ? 4 : isLoading ? 2 : 0}>
  <Card />
</GlitchContainer>
*/

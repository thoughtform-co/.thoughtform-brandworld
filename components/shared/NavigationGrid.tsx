/**
 * NavigationGrid - Reference Implementation
 * 
 * The signature Thoughtform frame that transforms content into instrument readings.
 * Creates corner brackets, vertical rails with scale ticks, and status zones.
 * 
 * SEMANTIC ANCHOR: INSTRUMENT
 * The grid transforms any content into a "reading" on an instrument.
 * User becomes operator, not just viewer.
 * 
 * USAGE:
 * - Full-page views in Astrolabe, Atlas, Marketing
 * - Keynote slides
 * - Any immersive interface
 * 
 * WHEN TO SKIP:
 * - Embedded components, dialogs
 * - Dense data views where frame competes with content
 * - Light mode Ledger (can feel heavy)
 */

'use client';

import { ReactNode } from 'react';

// ═══════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════

export interface NavigationGridProps {
  /** Content to display within the grid */
  children: ReactNode;
  /** Accent color - defaults to gold */
  accentColor?: 'gold' | 'verde' | 'teal' | 'dawn';
  /** Show vertical rails with scale */
  showRails?: boolean;
  /** Corner bracket size in pixels */
  cornerSize?: number;
  /** Padding from viewport edges */
  padding?: number;
  /** Left rail content */
  leftRailContent?: ReactNode;
  /** Right rail content */
  rightRailContent?: ReactNode;
  /** Additional class names */
  className?: string;
}

export interface CornerBracketProps {
  position: 'tl' | 'tr' | 'bl' | 'br';
  size: number;
  color: string;
  padding: number;
}

export interface RailProps {
  side: 'left' | 'right';
  color: string;
  padding: number;
  cornerSize: number;
  children?: ReactNode;
}

// ═══════════════════════════════════════════════════════════════════
// COLOR MAP
// ═══════════════════════════════════════════════════════════════════

const ACCENT_COLORS = {
  gold: {
    solid: 'var(--gold, #CAA554)',
    half: 'rgba(202, 165, 84, 0.5)',
    dim: 'rgba(202, 165, 84, 0.3)',
  },
  verde: {
    solid: 'var(--verde-bright, #3D7A5E)',
    half: 'rgba(61, 122, 94, 0.5)',
    dim: 'rgba(61, 122, 94, 0.3)',
  },
  teal: {
    solid: 'var(--teal, #3D8B7A)',
    half: 'rgba(61, 139, 122, 0.5)',
    dim: 'rgba(61, 139, 122, 0.3)',
  },
  dawn: {
    solid: 'var(--dawn, #ECE3D6)',
    half: 'rgba(236, 227, 214, 0.5)',
    dim: 'rgba(236, 227, 214, 0.3)',
  },
};

// ═══════════════════════════════════════════════════════════════════
// CORNER BRACKET
// ═══════════════════════════════════════════════════════════════════

function CornerBracket({ position, size, color, padding }: CornerBracketProps) {
  const positionStyles: Record<string, React.CSSProperties> = {
    tl: { top: padding, left: padding },
    tr: { top: padding, right: padding },
    bl: { bottom: padding, left: padding },
    br: { bottom: padding, right: padding },
  };

  const lineStyles: Record<string, { horizontal: React.CSSProperties; vertical: React.CSSProperties }> = {
    tl: {
      horizontal: { top: 0, left: 0, width: size, height: 2 },
      vertical: { top: 0, left: 0, width: 2, height: size },
    },
    tr: {
      horizontal: { top: 0, right: 0, width: size, height: 2 },
      vertical: { top: 0, right: 0, width: 2, height: size },
    },
    bl: {
      horizontal: { bottom: 0, left: 0, width: size, height: 2 },
      vertical: { bottom: 0, left: 0, width: 2, height: size },
    },
    br: {
      horizontal: { bottom: 0, right: 0, width: size, height: 2 },
      vertical: { bottom: 0, right: 0, width: 2, height: size },
    },
  };

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        ...positionStyles[position],
        width: size,
        height: size,
      }}
    >
      <div
        className="absolute"
        style={{
          ...lineStyles[position].horizontal,
          background: color,
        }}
      />
      <div
        className="absolute"
        style={{
          ...lineStyles[position].vertical,
          background: color,
        }}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// VERTICAL RAIL
// ═══════════════════════════════════════════════════════════════════

function Rail({ side, color, padding, cornerSize, children }: RailProps) {
  const sideStyles: React.CSSProperties = side === 'left' 
    ? { left: padding }
    : { right: padding };

  // Generate tick marks
  const ticks = [0, 2, 5, 7, 10];

  return (
    <div
      className="absolute flex flex-col"
      style={{
        ...sideStyles,
        top: padding + cornerSize + 20,
        bottom: padding + cornerSize + 20,
        width: 60,
      }}
    >
      {/* Vertical line */}
      <div
        className="absolute"
        style={{
          [side]: 0,
          top: 0,
          bottom: 0,
          width: 1,
          background: `linear-gradient(
            to bottom,
            transparent 0%,
            ${color} 10%,
            ${color} 90%,
            transparent 100%
          )`,
        }}
      />

      {/* Scale ticks */}
      <div className="flex-1 relative">
        {ticks.map((tick, i) => (
          <div
            key={tick}
            className="absolute flex items-center"
            style={{
              top: `${(i / (ticks.length - 1)) * 100}%`,
              [side]: 0,
              transform: 'translateY(-50%)',
            }}
          >
            {/* Tick mark */}
            <div
              style={{
                width: i === 0 || i === ticks.length - 1 ? 20 : 10,
                height: 1,
                background: i === 0 || i === ticks.length - 1 ? color : ACCENT_COLORS.dawn.dim,
                [side === 'left' ? 'marginRight' : 'marginLeft']: 4,
              }}
            />
            {/* Label */}
            <span
              style={{
                fontFamily: 'var(--font-mono, "PT Mono", monospace)',
                fontSize: 9,
                color: ACCENT_COLORS.dawn.dim,
                [side === 'left' ? 'marginLeft' : 'marginRight']: 4,
              }}
            >
              {tick}
            </span>
          </div>
        ))}
      </div>

      {/* Custom content */}
      {children && (
        <div
          className="mt-4"
          style={{
            [side === 'left' ? 'paddingLeft' : 'paddingRight']: 28,
            textAlign: side === 'left' ? 'left' : 'right',
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════

export function NavigationGrid({
  children,
  accentColor = 'gold',
  showRails = true,
  cornerSize = 40,
  padding = 32,
  leftRailContent,
  rightRailContent,
  className = '',
}: NavigationGridProps) {
  const colors = ACCENT_COLORS[accentColor];

  return (
    <div className={`fixed inset-0 pointer-events-none z-50 ${className}`}>
      {/* Corner brackets */}
      <CornerBracket position="tl" size={cornerSize} color={colors.solid} padding={padding} />
      <CornerBracket position="tr" size={cornerSize} color={colors.solid} padding={padding} />
      <CornerBracket position="bl" size={cornerSize} color={colors.solid} padding={padding} />
      <CornerBracket position="br" size={cornerSize} color={colors.solid} padding={padding} />

      {/* Vertical rails */}
      {showRails && (
        <>
          <Rail 
            side="left" 
            color={colors.half} 
            padding={padding} 
            cornerSize={cornerSize}
          >
            {leftRailContent}
          </Rail>
          <Rail 
            side="right" 
            color={colors.half} 
            padding={padding} 
            cornerSize={cornerSize}
          >
            {rightRailContent}
          </Rail>
        </>
      )}

      {/* Content passthrough */}
      <div className="pointer-events-auto">
        {children}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// RAIL CONTENT HELPERS
// ═══════════════════════════════════════════════════════════════════

export interface RailLabelProps {
  label: string;
  value?: string;
  accent?: boolean;
}

export function RailLabel({ label, value, accent = false }: RailLabelProps) {
  return (
    <div className="mb-2">
      <div
        style={{
          fontFamily: 'var(--font-mono, "PT Mono", monospace)',
          fontSize: 9,
          letterSpacing: '0.1em',
          color: 'var(--dawn-30, rgba(236, 227, 214, 0.3))',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </div>
      {value && (
        <div
          style={{
            fontFamily: 'var(--font-mono, "PT Mono", monospace)',
            fontSize: 11,
            color: accent 
              ? 'var(--gold, #CAA554)' 
              : 'var(--dawn-70, rgba(236, 227, 214, 0.7))',
            textTransform: 'uppercase',
          }}
        >
          {value}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// USAGE EXAMPLE
// ═══════════════════════════════════════════════════════════════════
/*
import { NavigationGrid, RailLabel } from '@/components/shared/NavigationGrid';

<NavigationGrid
  accentColor="gold"
  leftRailContent={
    <>
      <RailLabel label="Mode" value="ARCHITECT" accent />
      <RailLabel label="Vector" value="WANDERER" />
    </>
  }
  rightRailContent={
    <>
      <RailLabel label="Signal" value="74%" accent />
    </>
  }
>
  <main className="min-h-screen">
    <YourContent />
  </main>
</NavigationGrid>
*/

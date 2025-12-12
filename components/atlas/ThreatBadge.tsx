/**
 * Atlas ThreatBadge - Reference Implementation
 * 
 * A minimal badge component for displaying threat levels.
 * Used throughout Atlas to indicate entity danger classification.
 * 
 * KEY DESIGN RULES:
 * - Zero border-radius
 * - PT Mono font at tiny sizes (7-8px)
 * - Color-coded by threat level
 * - Optional pulse animation for Existential threats
 */

'use client';

// ═══════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════

export type ThreatLevel = 'Benign' | 'Cautious' | 'Volatile' | 'Existential';

export interface ThreatBadgeProps {
  level: ThreatLevel;
  /** Show the text label alongside the dot */
  showLabel?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional class names */
  className?: string;
}

// ═══════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════

const THREAT_COLORS: Record<ThreatLevel, string> = {
  Benign: 'var(--threat-benign)',
  Cautious: 'var(--threat-cautious)',
  Volatile: 'var(--threat-volatile)',
  Existential: 'var(--threat-existential)',
};

const SIZE_CONFIG = {
  sm: { dot: 4, font: 6, gap: 3 },
  md: { dot: 5, font: 7, gap: 5 },
  lg: { dot: 6, font: 8, gap: 6 },
};

// ═══════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════

export function ThreatBadge({
  level,
  showLabel = false,
  size = 'md',
  className = '',
}: ThreatBadgeProps) {
  const config = SIZE_CONFIG[size];
  const isExistential = level === 'Existential';
  const isVolatile = level === 'Volatile';

  return (
    <div
      className={`inline-flex items-center ${className}`}
      style={{ gap: `${config.gap}px` }}
    >
      {/* Threat Dot */}
      <div
        className={isExistential ? 'animate-pulse' : ''}
        style={{
          width: `${config.dot}px`,
          height: `${config.dot}px`,
          borderRadius: '50%',
          background: THREAT_COLORS[level],
          boxShadow: isVolatile ? '0 0 8px var(--gold-dim)' : 'none',
          opacity: 0.9,
        }}
        title={level}
      />

      {/* Label */}
      {showLabel && (
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: `${config.font}px`,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--dawn-30)',
          }}
        >
          {level}
        </span>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// USAGE EXAMPLE
// ═══════════════════════════════════════════════════════════════════
/*
import { ThreatBadge } from '@/components/atlas/ThreatBadge';

// Basic usage
<ThreatBadge level="Benign" />
<ThreatBadge level="Cautious" showLabel />
<ThreatBadge level="Volatile" size="lg" showLabel />
<ThreatBadge level="Existential" size="sm" />
*/

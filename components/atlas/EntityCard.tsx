/**
 * Atlas EntityCard - Reference Implementation
 * 
 * The primary card component for displaying entities in the Atlas constellation.
 * Follows the Atlas dark mode design language with Void backgrounds and Dawn text.
 * 
 * KEY DESIGN RULES:
 * - 3:4 aspect ratio (width: 200px)
 * - Zero border-radius (NO rounded corners)
 * - Corner bracket accents on hover
 * - Threat level indicator with color-coded dot
 * - Glassmorphic info overlay at bottom
 * - GRID=3 pixel snapping for any particle effects
 * 
 * COLORS:
 * - Background: var(--surface-0) from Void palette
 * - Text: var(--dawn) for primary, var(--dawn-50) for secondary
 * - Accent: var(--gold) for highlights
 * - Borders: var(--dawn-08) default, var(--dawn-30) on hover
 */

'use client';

import Image from 'next/image';

// ═══════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════

export type ThreatLevel = 'Benign' | 'Cautious' | 'Volatile' | 'Existential';

export interface EntityCardProps {
  /** Entity display name */
  name: string;
  /** Optional subtitle */
  subtitle?: string;
  /** Entity classification type */
  type: string;
  /** Threat level determines indicator color */
  threatLevel: ThreatLevel;
  /** Image URL for the entity */
  imageUrl?: string;
  /** Optional glyph text (displayed vertically) */
  glyphs?: string;
  /** Coordinates in the three cardinal fields */
  coordinates?: {
    geometry: number;
    alterity: number;
    dynamics: number;
  };
  /** Connection count for dot indicators */
  connectionCount?: number;
  /** Selection state */
  isSelected?: boolean;
  /** Callbacks */
  onHover?: (isHovered: boolean) => void;
  onClick?: () => void;
}

// ═══════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════

const THREAT_COLORS: Record<ThreatLevel, string> = {
  Benign: 'var(--threat-benign)',      // Green-ish
  Cautious: 'var(--threat-cautious)',  // Amber
  Volatile: 'var(--threat-volatile)',  // Orange
  Existential: 'var(--threat-existential)', // Red
};

// ═══════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════

export function EntityCard({
  name,
  subtitle,
  type,
  threatLevel,
  imageUrl,
  glyphs,
  coordinates,
  connectionCount = 0,
  isSelected = false,
  onHover,
  onClick,
}: EntityCardProps) {
  // Format coordinate for display (removes leading zero)
  const formatCoord = (n: number): string => {
    const sign = n < 0 ? '-' : '';
    return sign + Math.abs(n).toFixed(3).slice(1);
  };

  const isExistential = threatLevel === 'Existential';

  return (
    <article
      className={`
        entity-card group cursor-pointer relative
        ${isSelected ? 'entity-card--selected' : ''}
      `}
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => onHover?.(false)}
      onClick={onClick}
    >
      {/* ─── Outer Glow (Hover) ─────────────────────────────────────── */}
      <div
        className="absolute -inset-[30px] opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 70% at 50% 45%, rgba(236, 227, 214, 0.08) 0%, rgba(236, 227, 214, 0.03) 40%, transparent 70%)',
        }}
      />

      {/* ─── Main Frame ─────────────────────────────────────────────── */}
      <div
        className={`
          relative w-[200px] overflow-hidden
          border transition-all duration-250
          group-hover:translate-y-[-2px]
          ${isSelected
            ? 'border-[var(--dawn-50)] shadow-[0_0_0_1px_var(--dawn-15),0_0_30px_rgba(236,227,214,0.1)]'
            : 'border-[var(--dawn-08)] group-hover:border-[var(--dawn-30)]'
          }
          group-hover:shadow-[0_0_0_1px_rgba(236,227,214,0.03),0_20px_50px_-15px_rgba(0,0,0,0.5)]
        `}
        style={{
          background: 'var(--surface-0)',
          transitionTimingFunction: 'cubic-bezier(0.19, 1, 0.22, 1)',
        }}
      >
        {/* ─── Corner Accents ─────────────────────────────────────────── */}
        <div
          className={`
            absolute -top-px -left-px w-3 h-3
            border-t border-l border-[var(--dawn-15)]
            transition-opacity duration-300
            ${isSelected ? 'opacity-100 border-[var(--dawn-30)]' : 'opacity-0 group-hover:opacity-100'}
          `}
        />
        <div
          className={`
            absolute -bottom-px -right-px w-3 h-3
            border-b border-r border-[var(--dawn-15)]
            transition-opacity duration-300
            ${isSelected ? 'opacity-100 border-[var(--dawn-30)]' : 'opacity-0 group-hover:opacity-100'}
          `}
        />

        {/* ─── Image Container ────────────────────────────────────────── */}
        <div
          className="relative overflow-hidden"
          style={{
            aspectRatio: '3/4',
            background: 'linear-gradient(180deg, var(--surface-1) 0%, var(--surface-0) 100%)',
          }}
        >
          {imageUrl ? (
            <div className="absolute inset-0">
              <Image
                src={imageUrl}
                alt={name}
                fill
                className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                style={{ transitionTimingFunction: 'cubic-bezier(0.19, 1, 0.22, 1)' }}
              />
              {/* Gradient overlay for readability */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(to bottom, rgba(5, 4, 3, 0.1) 0%, transparent 30%, transparent 50%, rgba(5, 4, 3, 0.4) 80%, rgba(5, 4, 3, 0.85) 100%)',
                }}
              />
            </div>
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center select-none"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '4rem',
                color: 'var(--dawn-08)',
              }}
            >
              {type[0]}
            </div>
          )}

          {/* ─── Scanlines (Hover) ──────────────────────────────────────── */}
          <div
            className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: 'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0, 0, 0, 0.03) 2px, rgba(0, 0, 0, 0.03) 4px)',
            }}
          />

          {/* ─── Vertical Glyphs ────────────────────────────────────────── */}
          {glyphs && (
            <div
              className="absolute top-4 right-4 opacity-40 group-hover:opacity-75 transition-opacity duration-300"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '7px',
                lineHeight: 1.6,
                color: 'var(--dawn-30)',
                letterSpacing: '0.1em',
                writingMode: 'vertical-rl',
              }}
            >
              {glyphs}
            </div>
          )}

          {/* ─── Threat Indicator ───────────────────────────────────────── */}
          <div className="absolute top-4 left-4 flex items-center gap-[5px]">
            <div
              className={`
                w-[5px] h-[5px] rounded-full opacity-80
                group-hover:scale-[1.2] transition-transform duration-300
                ${isExistential ? 'animate-pulse' : ''}
              `}
              style={{
                background: THREAT_COLORS[threatLevel],
                boxShadow: threatLevel === 'Volatile' ? '0 0 8px var(--gold-dim)' : 'none',
              }}
              title={threatLevel}
            />
            <span
              className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-250"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '6px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--dawn-30)',
              }}
            >
              {threatLevel}
            </span>
          </div>

          {/* ─── Info Overlay ───────────────────────────────────────────── */}
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              padding: '10px 14px 14px',
              background: 'rgba(10, 9, 8, 0.4)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderTop: '1px solid rgba(236, 227, 214, 0.1)',
            }}
          >
            {/* Name */}
            <h3
              className="leading-[1.35] group-hover:text-white transition-colors duration-200"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                fontWeight: 400,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: 'var(--dawn)',
              }}
            >
              {name}
            </h3>

            {/* Subtitle */}
            {subtitle && (
              <p
                className="mt-0.5 opacity-80"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '8px',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--dawn-50)',
                }}
              >
                {subtitle}
              </p>
            )}

            {/* Meta Row */}
            {coordinates && (
              <div
                className="flex items-center overflow-hidden"
                style={{
                  marginTop: '8px',
                  paddingTop: '8px',
                  borderTop: '1px solid var(--dawn-08)',
                  columnGap: '16px',
                }}
              >
                <span
                  className="shrink-0"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '7px',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--dawn-30)',
                  }}
                >
                  {type}
                </span>

                <div
                  className="flex shrink-0"
                  style={{
                    columnGap: '4px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '7px',
                    letterSpacing: '0.03em',
                    color: 'var(--dawn-30)',
                  }}
                >
                  {/* Geometry - Gold Diamond */}
                  <span className="flex items-center gap-px">
                    <span className="text-[8px] text-[var(--gold)]">◆</span>
                    <span>{formatCoord(coordinates.geometry)}</span>
                  </span>
                  {/* Alterity - Dawn Circle */}
                  <span className="flex items-center gap-px">
                    <span className="text-[8px] text-[var(--dawn-50)]">○</span>
                    <span>{formatCoord(coordinates.alterity)}</span>
                  </span>
                  {/* Dynamics - Teal Diamond Outline */}
                  <span className="flex items-center gap-px">
                    <span className="text-[8px] text-[var(--cardinal-dynamics)]">◇</span>
                    <span>{formatCoord(coordinates.dynamics)}</span>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* ─── Connection Dots ─────────────────────────────────────────── */}
          {connectionCount > 0 && (
            <div
              className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              {Array.from({ length: Math.min(connectionCount, 5) }).map((_, i) => (
                <div
                  key={i}
                  className="w-[3px] h-[3px]"
                  style={{ background: 'var(--dawn-30)', borderRadius: '50%' }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

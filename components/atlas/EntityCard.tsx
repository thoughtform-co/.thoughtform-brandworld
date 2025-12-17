/**
 * EntityCard - Atlas Reference Implementation
 * 
 * Specimen documentation card for Latent Space Denizens.
 * Renders entity as scientific specimen with classification data.
 * 
 * SEMANTIC ANCHORS: THRESHOLD, LIVING_GEOMETRY, GRADIENT
 * - THRESHOLD: Frame contains the alien for observation
 * - LIVING_GEOMETRY: Entity imagery, particle aura
 * - GRADIENT: Threat level as continuous spectrum
 * 
 * DESIGN RULES:
 * - 4:5 aspect ratio for image
 * - PT Mono for classification/technical text
 * - IBM Plex Sans for descriptions
 * - Zero border-radius (always)
 * - Threat colors from palette
 */

'use client';

import { ReactNode } from 'react';

// ═══════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════

export type ThreatLevel = 'benign' | 'cautious' | 'volatile' | 'existential';
export type PhaseState = 'visible' | 'glimpsed' | 'theoretical' | 'unknown';

export interface EntityCardProps {
  /** Entity name */
  name: string;
  /** Short descriptor/epithet */
  epithet?: string;
  /** Entity image URL or element */
  image: string | ReactNode;
  /** Threat classification */
  threatLevel: ThreatLevel;
  /** Phase state */
  phase?: PhaseState;
  /** Relative abundance (0-1) */
  abundance?: number;
  /** Entity type/classification */
  type?: string;
  /** Click handler */
  onClick?: () => void;
  /** Card size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Show parameter bars */
  showParameters?: boolean;
  /** Additional class names */
  className?: string;
}

export interface ThreatBarProps {
  level: ThreatLevel;
}

export interface ParameterIndicatorProps {
  label: string;
  value: number; // 0-1
  color?: string;
}

// ═══════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════

const THREAT_COLORS: Record<ThreatLevel, string> = {
  benign: '#5B8A7A',
  cautious: '#7A7868',
  volatile: '#C17F59',
  existential: '#8B5A5A',
};

const THREAT_LABELS: Record<ThreatLevel, string> = {
  benign: 'BENIGN',
  cautious: 'CAUTIOUS',
  volatile: 'VOLATILE',
  existential: 'EXISTENTIAL',
};

const PHASE_LABELS: Record<PhaseState, string> = {
  visible: 'VISIBLE',
  glimpsed: 'GLIMPSED',
  theoretical: 'THEORETICAL',
  unknown: 'UNKNOWN',
};

const SIZE_CONFIG = {
  sm: { width: 280, imageHeight: 350, fontSize: { name: 14, epithet: 11, label: 8 } },
  md: { width: 380, imageHeight: 475, fontSize: { name: 18, epithet: 13, label: 9 } },
  lg: { width: 620, imageHeight: 775, fontSize: { name: 24, epithet: 15, label: 10 } },
};

// ═══════════════════════════════════════════════════════════════════
// THREAT BAR
// ═══════════════════════════════════════════════════════════════════

function ThreatBar({ level }: ThreatBarProps) {
  const segments: ThreatLevel[] = ['benign', 'cautious', 'volatile', 'existential'];
  const activeIndex = segments.indexOf(level);

  return (
    <div className="flex items-center gap-1">
      {segments.map((segment, i) => (
        <div
          key={segment}
          style={{
            width: 16,
            height: 4,
            background: i <= activeIndex 
              ? THREAT_COLORS[segment]
              : 'var(--dawn-15, rgba(236, 227, 214, 0.15))',
          }}
        />
      ))}
      <span
        style={{
          fontFamily: 'var(--font-mono, "PT Mono", monospace)',
          fontSize: 9,
          letterSpacing: '0.08em',
          color: THREAT_COLORS[level],
          marginLeft: 8,
        }}
      >
        {THREAT_LABELS[level]}
      </span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// PARAMETER INDICATOR
// ═══════════════════════════════════════════════════════════════════

function ParameterIndicator({ label, value, color }: ParameterIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      <span
        style={{
          fontFamily: 'var(--font-mono, "PT Mono", monospace)',
          fontSize: 8,
          letterSpacing: '0.1em',
          color: 'var(--dawn-40, rgba(236, 227, 214, 0.4))',
          textTransform: 'uppercase',
          width: 60,
        }}
      >
        {label}
      </span>
      <div
        style={{
          width: 40,
          height: 3,
          background: 'var(--dawn-08, rgba(236, 227, 214, 0.08))',
        }}
      >
        <div
          style={{
            width: `${value * 100}%`,
            height: '100%',
            background: color || 'var(--dawn-50, rgba(236, 227, 214, 0.5))',
          }}
        />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════

export function EntityCard({
  name,
  epithet,
  image,
  threatLevel,
  phase = 'visible',
  abundance,
  type,
  onClick,
  size = 'md',
  showParameters = true,
  className = '',
}: EntityCardProps) {
  const config = SIZE_CONFIG[size];

  return (
    <div
      className={`
        relative cursor-pointer
        transition-all duration-300
        hover:translate-y-[-2px]
        ${className}
      `}
      style={{
        width: config.width,
        background: 'var(--void-surface-0, #0A0908)',
        border: '1px solid var(--dawn-08, rgba(236, 227, 214, 0.08))',
      }}
      onClick={onClick}
    >
      {/* Image container - 4:5 aspect ratio */}
      <div
        className="relative overflow-hidden"
        style={{
          width: '100%',
          height: config.imageHeight,
          background: 'var(--void-base, #050403)',
        }}
      >
        {typeof image === 'string' ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
            style={{
              filter: phase === 'glimpsed' ? 'blur(2px) brightness(0.8)' : 
                     phase === 'theoretical' ? 'blur(4px) brightness(0.6)' :
                     phase === 'unknown' ? 'blur(8px) brightness(0.3)' : 'none',
            }}
          />
        ) : (
          image
        )}

        {/* Phase overlay for non-visible states */}
        {phase !== 'visible' && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              background: 'rgba(5, 4, 3, 0.4)',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono, "PT Mono", monospace)',
                fontSize: 10,
                letterSpacing: '0.15em',
                color: 'var(--dawn-30, rgba(236, 227, 214, 0.3))',
              }}
            >
              {PHASE_LABELS[phase]}
            </span>
          </div>
        )}

        {/* Type badge */}
        {type && (
          <div
            className="absolute top-3 left-3"
            style={{
              padding: '4px 8px',
              background: 'rgba(5, 4, 3, 0.8)',
              border: '1px solid var(--dawn-08)',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono, "PT Mono", monospace)',
                fontSize: 8,
                letterSpacing: '0.12em',
                color: 'var(--dawn-50)',
                textTransform: 'uppercase',
              }}
            >
              {type}
            </span>
          </div>
        )}
      </div>

      {/* Content area */}
      <div className="p-4">
        {/* Name */}
        <h3
          style={{
            fontFamily: 'var(--font-mono, "PT Mono", monospace)',
            fontSize: config.fontSize.name,
            fontWeight: 400,
            letterSpacing: '0.05em',
            color: 'var(--dawn, #ECE3D6)',
            textTransform: 'uppercase',
            margin: 0,
            marginBottom: epithet ? 4 : 12,
          }}
        >
          {name}
        </h3>

        {/* Epithet */}
        {epithet && (
          <p
            style={{
              fontFamily: 'var(--font-sans, "IBM Plex Sans", sans-serif)',
              fontSize: config.fontSize.epithet,
              color: 'var(--dawn-50, rgba(236, 227, 214, 0.5))',
              fontStyle: 'italic',
              margin: 0,
              marginBottom: 16,
              lineHeight: 1.4,
            }}
          >
            {epithet}
          </p>
        )}

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: 'var(--dawn-08)',
            marginBottom: 12,
          }}
        />

        {/* Threat bar */}
        <ThreatBar level={threatLevel} />

        {/* Additional parameters */}
        {showParameters && (
          <div className="mt-3 space-y-2">
            {abundance !== undefined && (
              <ParameterIndicator 
                label="Abundance" 
                value={abundance} 
              />
            )}
            <ParameterIndicator 
              label="Phase" 
              value={phase === 'visible' ? 1 : phase === 'glimpsed' ? 0.6 : phase === 'theoretical' ? 0.3 : 0.1}
              color="var(--gold-40)"
            />
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// COMPACT VARIANT (for constellation view)
// ═══════════════════════════════════════════════════════════════════

export interface EntityCardCompactProps {
  name: string;
  image: string;
  threatLevel: ThreatLevel;
  onClick?: () => void;
  className?: string;
}

export function EntityCardCompact({
  name,
  image,
  threatLevel,
  onClick,
  className = '',
}: EntityCardCompactProps) {
  return (
    <div
      className={`
        relative cursor-pointer
        transition-all duration-200
        hover:scale-105
        ${className}
      `}
      style={{
        width: 120,
        background: 'var(--void-surface-0, #0A0908)',
        border: '1px solid var(--dawn-08)',
      }}
      onClick={onClick}
    >
      <div
        className="relative"
        style={{ width: '100%', height: 150 }}
      >
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-2">
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            letterSpacing: '0.08em',
            color: 'var(--dawn)',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {name}
        </div>
        <div
          className="mt-1 flex gap-0.5"
        >
          {(['benign', 'cautious', 'volatile', 'existential'] as ThreatLevel[]).map((level, i) => (
            <div
              key={level}
              style={{
                width: 8,
                height: 2,
                background: i <= ['benign', 'cautious', 'volatile', 'existential'].indexOf(threatLevel)
                  ? THREAT_COLORS[level]
                  : 'var(--dawn-15)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// USAGE EXAMPLE
// ═══════════════════════════════════════════════════════════════════
/*
import { EntityCard, EntityCardCompact } from '@/components/atlas/EntityCard';

// Full card
<EntityCard
  name="Spasmodite"
  epithet="The Twitching, It-That-Startles"
  image="/entities/spasmodite.png"
  threatLevel="cautious"
  phase="visible"
  abundance={0.7}
  type="Emergent"
  onClick={() => openEntityModal('spasmodite')}
/>

// Compact card for constellation
<EntityCardCompact
  name="Spasmodite"
  image="/entities/spasmodite.png"
  threatLevel="cautious"
  onClick={() => selectEntity('spasmodite')}
/>
*/

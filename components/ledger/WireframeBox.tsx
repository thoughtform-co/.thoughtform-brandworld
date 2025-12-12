/**
 * Ledger WireframeBox - Reference Implementation
 * 
 * The primary container component for Ledger Light's "financial blueprint" aesthetic.
 * Creates the distinctive architectural wireframe look with corner brackets.
 * 
 * KEY DESIGN RULES:
 * - Zero border-radius (NO rounded corners)
 * - Paper background (#F0EFEC)
 * - Ink text (#3A3835)
 * - Teal accents (#3D8B7A)
 * - Diamond markers (◆) for emphasis
 * - Corner bracket decorations
 * - PT Mono / PP Neue Bit typography
 * 
 * VARIANTS:
 * - default: Standard wireframe with subtle border
 * - elevated: Adds shadow for layered appearance
 * - interactive: Hover states with teal highlight
 */

'use client';

import { ReactNode } from 'react';

// ═══════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════

export interface WireframeBoxProps {
  children: ReactNode;
  /** Visual variant */
  variant?: 'default' | 'elevated' | 'interactive';
  /** Show corner bracket decorations */
  showBrackets?: boolean;
  /** Optional header label with diamond marker */
  label?: string;
  /** Additional class names */
  className?: string;
  /** Click handler (only for interactive variant) */
  onClick?: () => void;
}

// ═══════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════

export function WireframeBox({
  children,
  variant = 'default',
  showBrackets = true,
  label,
  className = '',
  onClick,
}: WireframeBoxProps) {
  const isInteractive = variant === 'interactive';

  return (
    <div
      className={`
        relative
        ${isInteractive ? 'cursor-pointer group' : ''}
        ${className}
      `}
      onClick={isInteractive ? onClick : undefined}
      style={{
        background: 'var(--paper, #F0EFEC)',
        border: '1px solid var(--ink-05, rgba(58, 56, 53, 0.05))',
        boxShadow: variant === 'elevated' 
          ? '0 1px 3px rgba(58, 56, 53, 0.08)' 
          : 'none',
      }}
    >
      {/* ─── Corner Brackets ────────────────────────────────────────── */}
      {showBrackets && (
        <>
          {/* Top Left */}
          <div
            className={`
              absolute -top-px -left-px w-2 h-2
              border-t border-l
              ${isInteractive 
                ? 'border-[var(--ink-10)] group-hover:border-[var(--teal)]' 
                : 'border-[var(--ink-10)]'
              }
              transition-colors duration-200
            `}
          />
          {/* Top Right */}
          <div
            className={`
              absolute -top-px -right-px w-2 h-2
              border-t border-r
              ${isInteractive 
                ? 'border-[var(--ink-10)] group-hover:border-[var(--teal)]' 
                : 'border-[var(--ink-10)]'
              }
              transition-colors duration-200
            `}
          />
          {/* Bottom Left */}
          <div
            className={`
              absolute -bottom-px -left-px w-2 h-2
              border-b border-l
              ${isInteractive 
                ? 'border-[var(--ink-10)] group-hover:border-[var(--teal)]' 
                : 'border-[var(--ink-10)]'
              }
              transition-colors duration-200
            `}
          />
          {/* Bottom Right */}
          <div
            className={`
              absolute -bottom-px -right-px w-2 h-2
              border-b border-r
              ${isInteractive 
                ? 'border-[var(--ink-10)] group-hover:border-[var(--teal)]' 
                : 'border-[var(--ink-10)]'
              }
              transition-colors duration-200
            `}
          />
        </>
      )}

      {/* ─── Label Header ───────────────────────────────────────────── */}
      {label && (
        <div
          className={`
            px-4 py-2 border-b
            ${isInteractive 
              ? 'border-[var(--ink-05)] group-hover:border-[var(--teal-08)]' 
              : 'border-[var(--ink-05)]'
            }
            transition-colors duration-200
          `}
        >
          <span
            className={`
              inline-flex items-center gap-1.5
              ${isInteractive ? 'group-hover:text-[var(--teal)]' : ''}
              transition-colors duration-200
            `}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '9px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--ink-70, rgba(58, 56, 53, 0.70))',
            }}
          >
            {/* Diamond Marker */}
            <span 
              className={isInteractive ? 'text-[var(--teal)]' : 'text-[var(--ink-30)]'}
              style={{ fontSize: '6px' }}
            >
              ◆
            </span>
            {label}
          </span>
        </div>
      )}

      {/* ─── Content ────────────────────────────────────────────────── */}
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// USAGE EXAMPLE
// ═══════════════════════════════════════════════════════════════════
/*
import { WireframeBox } from '@/components/ledger/WireframeBox';

// Basic usage
<WireframeBox>
  <p>Content here</p>
</WireframeBox>

// With label
<WireframeBox label="Revenue Summary">
  <StatCard label="Total" value="€12,450" />
</WireframeBox>

// Interactive card
<WireframeBox 
  variant="interactive" 
  label="Q4 Report"
  onClick={() => openReport()}
>
  <p>Click to view details</p>
</WireframeBox>

// Elevated for layering
<WireframeBox variant="elevated" showBrackets={false}>
  <DataTable data={invoices} />
</WireframeBox>
*/

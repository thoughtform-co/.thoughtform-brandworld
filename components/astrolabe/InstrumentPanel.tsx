/**
 * Astrolabe InstrumentPanel - Reference Implementation
 * 
 * A navigation instrument panel component inspired by 1970s aerospace interfaces.
 * Used for tool controls, status displays, and contextual actions.
 * 
 * KEY DESIGN RULES:
 * - Zero border-radius
 * - Void background with Dawn text
 * - Gold accent for active states and indicators
 * - PT Mono typography at small sizes
 * - Subtle divider lines between sections
 * - Fixed position at bottom of screen (typically 64px height)
 * 
 * VISUAL ELEMENTS:
 * - Vertical dividers between tool groups
 * - Status indicator dots
 * - Coordinate/value displays in monospace
 * - ASCII-style markers
 */

'use client';

import { ReactNode } from 'react';

// ═══════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════

export interface InstrumentPanelProps {
  /** Panel sections to render */
  children: ReactNode;
  /** Position variant */
  position?: 'bottom' | 'top' | 'inline';
  /** Additional class names */
  className?: string;
}

export interface PanelSectionProps {
  /** Section content */
  children: ReactNode;
  /** Show divider on right side */
  divider?: boolean;
  /** Section label */
  label?: string;
}

export interface StatusIndicatorProps {
  /** Indicator label */
  label: string;
  /** Current value or status text */
  value: string;
  /** Status color: active (gold), nominal (green), warning (amber) */
  status?: 'active' | 'nominal' | 'warning' | 'inactive';
}

export interface CoordinateDisplayProps {
  /** Label for the coordinate group */
  label?: string;
  /** X/horizontal value */
  x: number;
  /** Y/vertical value */
  y: number;
  /** Number of decimal places */
  precision?: number;
}

// ═══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════

export function InstrumentPanel({
  children,
  position = 'bottom',
  className = '',
}: InstrumentPanelProps) {
  const positionClasses = {
    bottom: 'fixed bottom-0 left-0 right-0',
    top: 'fixed top-0 left-0 right-0',
    inline: 'relative',
  };

  return (
    <div
      className={`
        ${positionClasses[position]}
        flex items-center
        ${className}
      `}
      style={{
        height: '64px',
        background: 'var(--surface-0, #0A0908)',
        borderTop: position === 'bottom' ? '1px solid var(--dawn-08, rgba(236, 227, 214, 0.08))' : 'none',
        borderBottom: position === 'top' ? '1px solid var(--dawn-08, rgba(236, 227, 214, 0.08))' : 'none',
        zIndex: 50,
      }}
    >
      <div className="flex items-center h-full px-6 gap-0 w-full">
        {children}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// PANEL SECTION
// ═══════════════════════════════════════════════════════════════════

export function PanelSection({
  children,
  divider = true,
  label,
}: PanelSectionProps) {
  return (
    <div
      className="flex items-center h-full px-4"
      style={{
        borderRight: divider ? '1px solid var(--dawn-08, rgba(236, 227, 214, 0.08))' : 'none',
      }}
    >
      <div className="flex flex-col justify-center">
        {label && (
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '7px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--dawn-30, rgba(236, 227, 214, 0.30))',
              marginBottom: '4px',
            }}
          >
            {label}
          </span>
        )}
        <div className="flex items-center gap-3">
          {children}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// STATUS INDICATOR
// ═══════════════════════════════════════════════════════════════════

export function StatusIndicator({
  label,
  value,
  status = 'nominal',
}: StatusIndicatorProps) {
  const statusColors = {
    active: 'var(--gold, #CAA554)',
    nominal: 'var(--verde-bright, #3D7A5E)',
    warning: 'var(--gold, #CAA554)',
    inactive: 'var(--dawn-20, rgba(236, 227, 214, 0.20))',
  };

  return (
    <div className="flex items-center gap-2">
      {/* Status Dot */}
      <div
        className={status === 'active' ? 'animate-pulse' : ''}
        style={{
          width: '4px',
          height: '4px',
          borderRadius: '50%',
          background: statusColors[status],
        }}
      />
      
      <div className="flex flex-col">
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '7px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--dawn-40, rgba(236, 227, 214, 0.40))',
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: status === 'active' 
              ? 'var(--gold, #CAA554)' 
              : 'var(--dawn, #ECE3D6)',
          }}
        >
          {value}
        </span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// COORDINATE DISPLAY
// ═══════════════════════════════════════════════════════════════════

export function CoordinateDisplay({
  label,
  x,
  y,
  precision = 1,
}: CoordinateDisplayProps) {
  const formatValue = (n: number) => n.toFixed(precision);

  return (
    <div className="flex items-center gap-3">
      {label && (
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '8px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--dawn-30, rgba(236, 227, 214, 0.30))',
          }}
        >
          {label}
        </span>
      )}
      
      <div className="flex items-center gap-2">
        {/* X Coordinate */}
        <span
          className="flex items-center gap-1"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: 'var(--dawn-50, rgba(236, 227, 214, 0.50))',
          }}
        >
          <span style={{ color: 'var(--gold, #CAA554)', fontSize: '6px' }}>◆</span>
          X:{formatValue(x)}
        </span>
        
        {/* Y Coordinate */}
        <span
          className="flex items-center gap-1"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: 'var(--dawn-50, rgba(236, 227, 214, 0.50))',
          }}
        >
          <span style={{ color: 'var(--dawn-30)', fontSize: '6px' }}>○</span>
          Y:{formatValue(y)}
        </span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// TOOL BUTTON (for instrument panel actions)
// ═══════════════════════════════════════════════════════════════════

export interface ToolButtonProps {
  /** Button icon (usually from lucide-react) */
  icon: ReactNode;
  /** Tooltip/label */
  label: string;
  /** Active state */
  isActive?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Click handler */
  onClick?: () => void;
}

export function ToolButton({
  icon,
  label,
  isActive = false,
  disabled = false,
  onClick,
}: ToolButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative p-2 transition-all duration-150
        ${disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
        ${isActive ? '' : 'hover:bg-[var(--dawn-04)]'}
      `}
      style={{
        background: isActive ? 'var(--gold-05, rgba(202, 165, 84, 0.05))' : 'transparent',
        border: 'none',
        color: isActive 
          ? 'var(--gold, #CAA554)' 
          : 'var(--dawn-50, rgba(236, 227, 214, 0.50))',
      }}
      title={label}
    >
      {icon}
      
      {/* Active indicator dot */}
      {isActive && (
        <div
          className="absolute bottom-0.5 left-1/2 -translate-x-1/2"
          style={{
            width: '3px',
            height: '3px',
            borderRadius: '50%',
            background: 'var(--gold, #CAA554)',
          }}
        />
      )}
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════════
// USAGE EXAMPLE
// ═══════════════════════════════════════════════════════════════════
/*
import { 
  InstrumentPanel, 
  PanelSection, 
  StatusIndicator, 
  CoordinateDisplay,
  ToolButton 
} from '@/components/astrolabe/InstrumentPanel';
import { Pencil, Move, ZoomIn } from 'lucide-react';

<InstrumentPanel position="bottom">
  <PanelSection label="Tools">
    <ToolButton icon={<Pencil size={16} />} label="Edit" isActive />
    <ToolButton icon={<Move size={16} />} label="Pan" />
    <ToolButton icon={<ZoomIn size={16} />} label="Zoom" />
  </PanelSection>
  
  <PanelSection label="Status">
    <StatusIndicator label="Mode" value="Navigate" status="active" />
    <StatusIndicator label="Sync" value="Connected" status="nominal" />
  </PanelSection>
  
  <PanelSection label="Position" divider={false}>
    <CoordinateDisplay x={1024.5} y={768.0} />
  </PanelSection>
</InstrumentPanel>
*/

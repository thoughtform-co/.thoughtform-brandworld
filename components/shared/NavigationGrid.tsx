/**
 * Navigation Grid - Design Primitive Component
 * 
 * Reusable fixed overlay frame system for Thoughtform platforms.
 * Creates the "mission control" aesthetic with:
 * - Four corner brackets (L-shapes)
 * - Two vertical rails with faded lines
 * - Horizontal tick marks on rails
 * 
 * REQUIREMENTS:
 * - Import the CSS file: `import './navigation-grid.css'` or add to your global styles
 * - Set CSS variables on the component or in your root CSS
 * 
 * USAGE:
 * ```tsx
 * import { NavigationGrid } from '@/components/shared/NavigationGrid';
 * import './navigation-grid.css';  // or add to globals.css
 * 
 * <NavigationGrid
 *   color="gold"           // "gold" | "verde" | "teal"
 *   showRails={true}       // Show/hide vertical rails
 *   tickCount={20}         // Number of tick marks
 *   cornerSize={40}        // Corner bracket size (px)
 *   railWidth={60}         // Rail width (px)
 *   padding={32}           // Padding from edges (px)
 *   opacity={1}            // Overall opacity
 * />
 * ```
 * 
 * See: components/shared/NavigationGrid.md for full specification
 */

'use client';

import { useMemo } from 'react';
// NOTE: Import navigation-grid.css in your app (globals.css or framework-specific way)

export type GridColor = 'gold' | 'verde' | 'teal';
export type GridSize = 'desktop' | 'tablet' | 'mobile';

export interface NavigationGridProps {
  /** Accent color for grid elements */
  color?: GridColor;
  /** Show vertical rails (hidden on tablet/mobile by default) */
  showRails?: boolean;
  /** Number of tick marks on each rail (default: 20) */
  tickCount?: number;
  /** Corner bracket size in pixels (default: 40) */
  cornerSize?: number;
  /** Rail width in pixels (default: 60) */
  railWidth?: number;
  /** Padding from viewport edges in pixels (default: 32) */
  padding?: number;
  /** Overall opacity (0-1, default: 1) */
  opacity?: number;
  /** Responsive size preset (overrides manual sizing) */
  size?: GridSize;
  /** Custom CSS class name */
  className?: string;
  /** Show labels on major ticks (every 5th tick) */
  showLabels?: boolean;
  /** Additional content in left rail (e.g., readouts) */
  leftRailContent?: React.ReactNode;
  /** Additional content in right rail (e.g., markers) */
  rightRailContent?: React.ReactNode;
}

export function NavigationGrid({
  color = 'gold',
  showRails = true,
  tickCount = 20,
  cornerSize,
  railWidth,
  padding,
  opacity = 1,
  size,
  className = '',
  showLabels = false,
  leftRailContent,
  rightRailContent,
}: NavigationGridProps) {
  // Size presets (override manual sizing if provided)
  const dimensions = useMemo(() => {
    if (size === 'mobile') {
      return {
        cornerSize: cornerSize ?? 24,
        railWidth: 0,
        padding: padding ?? 16,
        showRails: false,
      };
    }
    if (size === 'tablet') {
      return {
        cornerSize: cornerSize ?? 30,
        railWidth: 0,
        padding: padding ?? 24,
        showRails: false,
      };
    }
    // Desktop
    return {
      cornerSize: cornerSize ?? 40,
      railWidth: railWidth ?? 60,
      padding: padding ?? 32,
      showRails: showRails ?? true,
    };
  }, [size, cornerSize, railWidth, padding, showRails]);

  // Color CSS variable mapping
  const colorVar = useMemo(() => {
    switch (color) {
      case 'verde':
        return 'var(--verde)';
      case 'teal':
        return 'var(--teal)';
      case 'gold':
      default:
        return 'var(--gold)';
    }
  }, [color]);

  // Generate tick marks
  const ticks = useMemo(() => {
    return Array.from({ length: tickCount + 1 }, (_, i) => ({
      index: i,
      isMajor: i % 5 === 0,
      label: showLabels && i % 5 === 0 ? String(i) : null,
    }));
  }, [tickCount, showLabels]);

  // Corner rail gap
  const cornerRailGap = 20;

  return (
    <div
      className={`navigation-grid ${className}`}
      style={{
        '--grid-color': colorVar,
        '--grid-color-50': `${colorVar}80`, // 50% opacity
        '--corner-size': `${dimensions.cornerSize}px`,
        '--rail-width': `${dimensions.railWidth}px`,
        '--hud-padding': `${dimensions.padding}px`,
        '--grid-opacity': opacity,
      } as React.CSSProperties}
    >
      {/* Corner Brackets */}
      <div
        className="grid-corner grid-corner-tl"
        style={{ opacity }}
      />
      <div
        className="grid-corner grid-corner-tr"
        style={{ opacity }}
      />
      <div
        className="grid-corner grid-corner-bl"
        style={{ opacity }}
      />
      <div
        className="grid-corner grid-corner-br"
        style={{ opacity }}
      />

      {/* Left Rail */}
      {dimensions.showRails && dimensions.railWidth > 0 && (
        <aside
          className="grid-rail grid-rail-left"
          style={{ opacity }}
        >
          <div className="rail-scale">
            <div className="scale-ticks">
              {ticks.map((tick) => (
                <div key={tick.index} style={{ position: 'relative' }}>
                  <div
                    className={`tick ${tick.isMajor ? 'tick-major' : 'tick-minor'}`}
                  />
                  {tick.label && (
                    <span
                      className="tick-label"
                      style={{
                        position: 'absolute',
                        top: '-4px',
                        left: '28px',
                      }}
                    >
                      {tick.label}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
          {leftRailContent && (
            <div className="rail-content">
              {leftRailContent}
            </div>
          )}
        </aside>
      )}

      {/* Right Rail */}
      {dimensions.showRails && dimensions.railWidth > 0 && (
        <aside
          className="grid-rail grid-rail-right"
          style={{ opacity }}
        >
          <div className="rail-scale">
            <div className="scale-ticks">
              {ticks.map((tick) => (
                <div
                  key={tick.index}
                  className={`tick ${tick.isMajor ? 'tick-major' : 'tick-minor'}`}
                />
              ))}
            </div>
          </div>
          {rightRailContent && (
            <div className="rail-content">
              {rightRailContent}
            </div>
          )}
        </aside>
      )}

      {/* CSS is provided via navigation-grid.css - ensure it's imported */}
    </div>
  );
}


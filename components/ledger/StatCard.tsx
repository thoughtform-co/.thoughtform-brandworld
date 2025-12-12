/**
 * Ledger StatCard - Reference Implementation
 * 
 * A compact card for displaying key financial metrics.
 * Follows Ledger Light's blueprint aesthetic with trend indicators.
 * 
 * KEY DESIGN RULES:
 * - Zero border-radius
 * - Paper background with subtle Ink border
 * - Teal for positive trends, Signal for negative
 * - PT Mono for values, uppercase labels
 * - Gold accent for primary values
 */

'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════

export interface StatCardProps {
  /** Metric label (displayed uppercase) */
  label: string;
  /** Primary value (formatted string) */
  value: string;
  /** Trend text (e.g., "+12.5% vs last month") */
  trend?: string;
  /** Trend direction - determines color and icon */
  trendUp?: boolean;
  /** Additional class names */
  className?: string;
}

// ═══════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════

export function StatCard({ 
  label, 
  value, 
  trend, 
  trendUp, 
  className = '' 
}: StatCardProps) {
  return (
    <div 
      className={`p-5 ${className}`}
      style={{
        background: 'var(--paper, #F0EFEC)',
        border: '1px solid var(--ink-05, rgba(58, 56, 53, 0.05))',
      }}
    >
      {/* Label */}
      <p
        className="mb-2"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--ink-50, rgba(58, 56, 53, 0.50))',
        }}
      >
        {label}
      </p>

      {/* Value */}
      <p
        className="mb-1"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '24px',
          fontWeight: 400,
          color: 'var(--gold, #CAA554)',
          letterSpacing: '-0.01em',
        }}
      >
        {value}
      </p>

      {/* Trend */}
      {trend && (
        <div className="flex items-center gap-1.5">
          {trendUp !== undefined && (
            trendUp ? (
              <TrendingUp 
                className="h-3 w-3" 
                style={{ color: 'var(--teal, #3D8B7A)' }} 
              />
            ) : (
              <TrendingDown 
                className="h-3 w-3" 
                style={{ color: 'var(--signal, #B85C4A)' }} 
              />
            )
          )}
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: trendUp === true 
                ? 'var(--teal, #3D8B7A)'
                : trendUp === false 
                  ? 'var(--signal, #B85C4A)'
                  : 'var(--ink-50, rgba(58, 56, 53, 0.50))',
            }}
          >
            {trend}
          </span>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// USAGE EXAMPLE
// ═══════════════════════════════════════════════════════════════════
/*
import { StatCard } from '@/components/ledger/StatCard';

// Basic usage
<StatCard 
  label="Total Revenue" 
  value="€24,580" 
/>

// With positive trend
<StatCard 
  label="Monthly Growth" 
  value="€3,240"
  trend="+12.5% vs last month"
  trendUp={true}
/>

// With negative trend
<StatCard 
  label="Expenses" 
  value="€8,120"
  trend="-5.2% vs last month"
  trendUp={false}
/>

// Neutral (no direction)
<StatCard 
  label="Outstanding" 
  value="€1,850"
  trend="3 invoices pending"
/>
*/

/**
 * Ledger DataTable - Reference Implementation
 * 
 * A minimal table component for displaying financial data.
 * Follows Ledger Light's blueprint aesthetic with architectural lines.
 * 
 * KEY DESIGN RULES:
 * - Zero border-radius
 * - Paper background
 * - Ink text with subtle row separators
 * - Diamond markers (◆) for row indicators
 * - PT Mono typography throughout
 * - Teal for interactive/linked elements
 * - Right-align numeric columns
 */

'use client';

import { ReactNode } from 'react';

// ═══════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════

export interface Column<T> {
  /** Column header label */
  header: string;
  /** Key to access data, or render function */
  accessor: keyof T | ((row: T) => ReactNode);
  /** Alignment - numeric columns should be right-aligned */
  align?: 'left' | 'center' | 'right';
  /** Column width */
  width?: string;
}

export interface DataTableProps<T> {
  /** Array of data rows */
  data: T[];
  /** Column definitions */
  columns: Column<T>[];
  /** Show diamond markers on each row */
  showMarkers?: boolean;
  /** Row click handler */
  onRowClick?: (row: T) => void;
  /** Additional class names */
  className?: string;
}

// ═══════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════

export function DataTable<T extends { id?: string | number }>({
  data,
  columns,
  showMarkers = true,
  onRowClick,
  className = '',
}: DataTableProps<T>) {
  const isInteractive = !!onRowClick;

  const getCellValue = (row: T, accessor: Column<T>['accessor']): ReactNode => {
    if (typeof accessor === 'function') {
      return accessor(row);
    }
    return row[accessor] as ReactNode;
  };

  return (
    <div 
      className={`overflow-x-auto ${className}`}
      style={{
        background: 'var(--paper, #F0EFEC)',
      }}
    >
      <table className="w-full" style={{ borderCollapse: 'collapse' }}>
        {/* ─── Header ───────────────────────────────────────────────── */}
        <thead>
          <tr
            style={{
              borderBottom: '1px solid var(--ink-10, rgba(58, 56, 53, 0.10))',
            }}
          >
            {showMarkers && <th style={{ width: '20px' }} />}
            {columns.map((col, i) => (
              <th
                key={i}
                className="py-3 px-4"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  fontWeight: 400,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  textAlign: col.align || 'left',
                  color: 'var(--ink-50, rgba(58, 56, 53, 0.50))',
                  width: col.width,
                }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        {/* ─── Body ─────────────────────────────────────────────────── */}
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={row.id ?? rowIndex}
              className={isInteractive ? 'group cursor-pointer' : ''}
              onClick={() => onRowClick?.(row)}
              style={{
                borderBottom: '1px solid var(--ink-05, rgba(58, 56, 53, 0.05))',
                transition: 'background-color 150ms',
              }}
              onMouseEnter={(e) => {
                if (isInteractive) {
                  e.currentTarget.style.backgroundColor = 'var(--teal-08, rgba(61, 139, 122, 0.08))';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {/* Diamond Marker */}
              {showMarkers && (
                <td className="py-3 pl-4 pr-0">
                  <span
                    className={isInteractive ? 'group-hover:text-[var(--teal)]' : ''}
                    style={{
                      fontSize: '6px',
                      color: 'var(--ink-20, rgba(58, 56, 53, 0.20))',
                      transition: 'color 150ms',
                    }}
                  >
                    ◆
                  </span>
                </td>
              )}

              {/* Data Cells */}
              {columns.map((col, colIndex) => (
                <td
                  key={colIndex}
                  className="py-3 px-4"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    textAlign: col.align || 'left',
                    color: 'var(--ink, #3A3835)',
                  }}
                >
                  {getCellValue(row, col.accessor)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Empty State */}
      {data.length === 0 && (
        <div
          className="py-12 text-center"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--ink-30, rgba(58, 56, 53, 0.30))',
          }}
        >
          No data available
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// USAGE EXAMPLE
// ═══════════════════════════════════════════════════════════════════
/*
import { DataTable } from '@/components/ledger/DataTable';

interface Invoice {
  id: string;
  client: string;
  amount: number;
  status: string;
  date: string;
}

const invoices: Invoice[] = [
  { id: '1', client: 'Acme Corp', amount: 2500, status: 'Paid', date: '2024-01-15' },
  { id: '2', client: 'Globex', amount: 1800, status: 'Pending', date: '2024-01-18' },
];

<DataTable
  data={invoices}
  columns={[
    { header: 'Client', accessor: 'client' },
    { header: 'Amount', accessor: (row) => `€${row.amount.toLocaleString()}`, align: 'right' },
    { header: 'Status', accessor: 'status' },
    { header: 'Date', accessor: 'date', align: 'right' },
  ]}
  onRowClick={(row) => openInvoice(row.id)}
/>
*/

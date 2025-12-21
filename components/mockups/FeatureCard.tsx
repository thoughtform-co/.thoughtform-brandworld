/**
 * FeatureCard
 * 
 * Clean feature card with corner brackets, inspired by Kriss.ai layout
 * but translated into Thoughtform's retrofuturistic visual language.
 * 
 * Reference: Direct pattern adaptation
 * Anchor: THRESHOLD (display case framing)
 * Signal Quotient: 15-25% (subtle bracket hover animation)
 */

import React from 'react';

interface Feature {
  label: string;
  icon?: string; // Optional custom icon, defaults to diamond
}

interface FeatureCardProps {
  /** Card title - displayed in mono uppercase */
  title: string;
  /** Description paragraph */
  description: string;
  /** List of features */
  features: Feature[];
  /** CTA text */
  ctaLabel?: string;
  /** CTA click handler */
  onCtaClick?: () => void;
  /** Optional section index (01, 02, etc.) */
  index?: number;
  /** Accent color variant */
  accent?: 'gold' | 'dawn' | 'teal' | 'verde';
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  features,
  ctaLabel = 'Explore',
  onCtaClick,
  index,
  accent = 'gold',
}) => {
  const accentColors = {
    gold: 'rgba(202, 165, 84, 1)',
    dawn: 'rgba(236, 227, 214, 1)',
    teal: 'rgba(61, 139, 122, 1)',
    verde: 'rgba(91, 138, 122, 1)',
  };

  const accentColor = accentColors[accent];

  return (
    <div className="feature-card">
      {/* Corner brackets */}
      <div className="corner corner-tl" />
      <div className="corner corner-tr" />
      <div className="corner corner-bl" />
      <div className="corner corner-br" />

      {/* Content */}
      <div className="card-content">
        {/* Header with optional index */}
        <div className="card-header">
          {index !== undefined && (
            <span className="card-index">
              {String(index).padStart(2, '0')}
            </span>
          )}
          <h3 className="card-title">{title}</h3>
        </div>

        {/* Description */}
        <p className="card-description">{description}</p>

        {/* Feature list */}
        <ul className="feature-list">
          {features.map((feature, i) => (
            <li key={i} className="feature-item">
              <span className="feature-marker">{feature.icon || '◇'}</span>
              <span className="feature-label">{feature.label}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        {onCtaClick && (
          <button className="card-cta" onClick={onCtaClick}>
            <span>{ctaLabel}</span>
            <span className="cta-arrow">→</span>
          </button>
        )}
      </div>

      <style jsx>{`
        .feature-card {
          position: relative;
          width: 100%;
          max-width: 320px;
          background: rgba(5, 4, 3, 0.85);
          border: 1px solid rgba(236, 227, 214, 0.08);
          padding: 32px;
          transition: border-color 300ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .feature-card:hover {
          border-color: rgba(236, 227, 214, 0.2);
        }

        /* Corner brackets */
        .corner {
          position: absolute;
          width: 16px;
          height: 16px;
          opacity: 0;
          transition: opacity 300ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .feature-card:hover .corner {
          opacity: 1;
        }

        .corner-tl {
          top: -1px;
          left: -1px;
          border-top: 1px solid ${accentColor};
          border-left: 1px solid ${accentColor};
        }

        .corner-tr {
          top: -1px;
          right: -1px;
          border-top: 1px solid ${accentColor};
          border-right: 1px solid ${accentColor};
        }

        .corner-bl {
          bottom: -1px;
          left: -1px;
          border-bottom: 1px solid ${accentColor};
          border-left: 1px solid ${accentColor};
        }

        .corner-br {
          bottom: -1px;
          right: -1px;
          border-bottom: 1px solid ${accentColor};
          border-right: 1px solid ${accentColor};
        }

        /* Content */
        .card-content {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .card-header {
          display: flex;
          align-items: baseline;
          gap: 12px;
        }

        .card-index {
          font-family: 'PP Mondwest', 'PT Mono', monospace;
          font-size: 11px;
          color: ${accentColor};
          letter-spacing: 0.05em;
        }

        .card-title {
          font-family: 'PP Mondwest', 'PT Mono', monospace;
          font-size: 14px;
          font-weight: 400;
          color: rgba(236, 227, 214, 0.9);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin: 0;
        }

        .card-description {
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 13px;
          line-height: 1.6;
          color: rgba(236, 227, 214, 0.6);
          margin: 0;
        }

        /* Feature list */
        .feature-list {
          list-style: none;
          padding: 0;
          margin: 8px 0 0 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .feature-marker {
          font-size: 10px;
          color: ${accentColor};
          opacity: 0.7;
        }

        .feature-label {
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 12px;
          color: rgba(236, 227, 214, 0.8);
        }

        /* CTA */
        .card-cta {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          padding: 8px 0;
          margin-top: 8px;
          cursor: pointer;
          font-family: 'PP Mondwest', 'PT Mono', monospace;
          font-size: 11px;
          color: ${accentColor};
          letter-spacing: 0.05em;
          text-transform: uppercase;
          transition: opacity 150ms;
        }

        .card-cta:hover {
          opacity: 0.8;
        }

        .cta-arrow {
          transition: transform 150ms;
        }

        .card-cta:hover .cta-arrow {
          transform: translateX(4px);
        }
      `}</style>
    </div>
  );
};

export default FeatureCard;

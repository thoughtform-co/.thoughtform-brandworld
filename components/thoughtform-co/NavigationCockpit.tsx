/**
 * Navigation Cockpit - Thoughtform.co Pattern
 * 
 * Fixed HUD overlay with spatial navigation interface.
 * Provides the "mission control" aesthetic with:
 * - Corner brackets (gold L-shapes)
 * - Top bar (brand, navigation, signal)
 * - Left rail (depth scale, vector readouts)
 * - Right rail (section markers)
 * - Bottom bar (coordinates, instructions)
 * 
 * PATTERN: Fixed window, scrolling world
 * - HUD stays fixed while content/particles scroll beneath
 * - HUD hidden in hero section, fades in on scroll
 * - Section-based state updates via IntersectionObserver
 * 
 * USAGE:
 * ```tsx
 * <NavigationCockpit>
 *   <ParticleCanvas scrollProgress={scrollProgress} />
 *   <HUDFrame 
 *     activeSection={activeSection}
 *     scrollProgress={scrollProgress}
 *     onNavigate={handleNavigate}
 *   />
 *   <main className="scroll-container">
 *     {/* Sections */}
 *   </main>
 * </NavigationCockpit>
 * ```
 * 
 * See: components/thoughtform-co/NAVIGATION_HUD.md for full documentation
 */

'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';

export interface SectionData {
  sector: string;
  depth: number;
  vector: string;
  signal: number;
  landmark: number;
}

export interface NavigationCockpitProps {
  /** Section data mapping */
  sectionData: Record<string, SectionData>;
  /** Navigation links configuration */
  navLinks: Array<{ href: string; label: string; section: string }>;
  /** Section markers configuration */
  sectionMarkers: Array<{ section: string; label: string }>;
  /** Scroll progress (0-1) from smooth scroll library */
  scrollProgress: number;
  /** Smooth scroll function */
  scrollTo: (element: HTMLElement) => void;
  /** HUD visibility threshold (default: 0.02) */
  visibilityThreshold?: number;
  /** Children to render */
  children: React.ReactNode;
}

export function NavigationCockpit({
  sectionData,
  navLinks,
  sectionMarkers,
  scrollProgress,
  scrollTo,
  visibilityThreshold = 0.02,
  children,
}: NavigationCockpitProps) {
  const [activeSection, setActiveSection] = useState(
    Object.keys(sectionData)[0] || 'hero'
  );

  // Handle navigation
  const handleNavigate = useCallback(
    (sectionId: string) => {
      const element = document.getElementById(sectionId);
      if (element) {
        scrollTo(element);
      }
    },
    [scrollTo]
  );

  // Set up section detection with IntersectionObserver
  useEffect(() => {
    const sections = document.querySelectorAll(".section[data-section]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            const sectionId = entry.target.getAttribute("data-section");
            if (sectionId) {
              setActiveSection(sectionId);
            }
          }
        });
      },
      { threshold: [0.3, 0.5] }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  // HUD visibility based on scroll
  const showHUD = scrollProgress > visibilityThreshold;
  const hudOpacity = Math.min(
    1,
    Math.max(0, (scrollProgress - visibilityThreshold * 2.5) / (visibilityThreshold * 5))
  );

  // Compute HUD state from scroll progress and active section
  const hudState = useMemo(() => {
    const p = scrollProgress;
    const section = sectionData[activeSection] || Object.values(sectionData)[0];

    let instruction = "Scroll to descend. The window stays. The world changes.";
    if (p < 0.1) {
      instruction = "Scroll to descend. The window stays. The world changes.";
    } else if (p < 0.3) {
      instruction = "Entering content. Recalibrating perspective.";
    } else if (p < 0.6) {
      instruction = "Navigation services detected. Plotting course.";
    } else if (p < 0.9) {
      instruction = "Approaching destination. Signal strengthening.";
    } else {
      instruction = "Arrival imminent. Initiating contact protocols.";
    }

    return {
      sector: section.sector,
      depth: (p * 7.5).toFixed(1),
      vector: section.vector,
      signal: `${section.signal}%`,
      delta: (0.27 + p * 0.5).toFixed(2),
      theta: (58.1 + p * 30).toFixed(1) + "°",
      rho: (0.63 + p * 0.3).toFixed(2),
      zeta: (2.4 + p * 7).toFixed(1),
      instruction,
      showHUD,
      hudOpacity,
    };
  }, [scrollProgress, activeSection, sectionData, showHUD, hudOpacity]);

  return (
    <>
      {/* Render children (ParticleCanvas, HUDFrame, content) */}
      {typeof children === 'function' 
        ? children({ 
            activeSection, 
            hudState, 
            handleNavigate,
            navLinks,
            sectionMarkers,
          })
        : children
      }
    </>
  );
}


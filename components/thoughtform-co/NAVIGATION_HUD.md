# Thoughtform.co Navigation HUD System

## Overview

The Navigation Cockpit is a fixed overlay HUD that provides spatial awareness and navigation controls as users scroll through the website. It creates a "mission control" aesthetic with retro interface elements, radar-style indicators, and dynamic readouts that respond to scroll position.

## Core Concept

**The HUD as a fixed window** — The interface stays fixed while the world (particle terrain) scrolls beneath it. This creates the sensation of navigating through space while maintaining constant situational awareness.

## Architecture

### Component Structure

```
NavigationCockpit (main orchestrator)
├── ParticleCanvas (background 3D engine)
├── HUDFrame (fixed overlay interface)
│   ├── Corner Brackets (gold L-shapes)
│   ├── Top Bar (brand, navigation, signal)
│   ├── Left Rail (depth scale, vector readouts)
│   ├── Right Rail (section markers)
│   └── Bottom Bar (coordinates, instructions)
└── Scroll Container (content sections)
```

### HUD Visibility Logic

The HUD is **hidden in the hero section** and fades in as you scroll:

```typescript
// HUD appears after 2% scroll, fully visible at 15%
const showHUD = scrollProgress > 0.02;
const hudOpacity = Math.min(1, Math.max(0, (scrollProgress - 0.05) / 0.1));
```

**Rationale**: The hero section features the Thoughtform logo and tagline prominently. The HUD would compete with this. Once you scroll past, the HUD becomes the primary navigation interface.

## HUD Elements

### 1. Corner Brackets

Gold L-shaped brackets at all four corners:

```css
.hud-corner {
  position: absolute;
  width: 40px;
  height: 40px;
}

.hud-corner::before { /* horizontal line */ }
.hud-corner::after  { /* vertical line */ }
```

- **Purpose**: Frame the interface, create "instrument panel" aesthetic
- **Visibility**: Same as HUD (hidden in hero, fade in after)
- **Color**: Gold (`#caa554`)

### 2. Top Bar

Contains three sections:

**Left: Brand Display**
```typescript
<brand-label>Thoughtform</brand-label>
<span>/</span>
<brand-sector>{currentSection}</brand-sector>
```

**Center: Navigation Links**
- Manifesto, Services, About, Contact
- Active link highlighted with gold underline
- Monospace font (IBM Plex Sans)

**Right: Signal Strength**
```typescript
<signal-label>Signal</signal-label>
<signal-value>{percentage}%</signal-value>
```
- Dynamic percentage based on section
- Increases as you go deeper (61% → 95%)

### 3. Left Rail: Depth Scale

**Vertical radar-style scale** with tick marks:

```typescript
const tickCount = 20;
const tickLabels = {
  0: "0",
  5: "2",    // Major ticks every 5
  10: "5",
  15: "7",
  20: "10"
};
```

**Moving Indicator**:
- Diamond-shaped indicator slides down scale
- Position: `top: ${scrollProgress * 100}%`
- Represents current depth in the journey

**Readouts** (bottom of rail):
- **Depth**: Current Z position in "km" (e.g., "2.6km")
- **Vector**: Current navigation mode (Entry, Creative, Strategic, Destination)

### 4. Right Rail: Section Markers

Vertical list of section indicators:

```typescript
const sectionMarkers = [
  { section: "hero", label: "01" },
  { section: "manifesto", label: "02" },
  { section: "services", label: "03" },
  { section: "contact", label: "04" }
];
```

**State Logic**:
- **Active**: Current section (gold dot, gold label)
- **Past**: Sections already visited (gold dot, dim label)
- **Future**: Upcoming sections (outline dot, dim label)

**Interaction**: Clicking a marker navigates to that section.

### 5. Bottom Bar

**Left: Coordinates**
```typescript
<span>δ: <value></span>  // Delta
<span>θ: <value>°</span> // Theta (angle)
<span>ρ: <value></span>  // Rho
<span>ζ: <value></span>  // Zeta
```

Coordinates update based on scroll progress:
- Simulated navigation data
- Creates sense of traversing space

**Right: Instructions**
Dynamic text that changes based on scroll position:

```typescript
if (scrollProgress < 0.1) {
  instruction = "Scroll to descend. The window stays. The world changes.";
} else if (scrollProgress < 0.3) {
  instruction = "Entering the manifesto. Recalibrating perspective.";
} else if (scrollProgress < 0.6) {
  instruction = "Navigation services detected. Plotting course.";
} else if (scrollProgress < 0.9) {
  instruction = "Approaching destination. Signal strengthening.";
} else {
  instruction = "Arrival imminent. Initiating contact protocols.";
}
```

## Section Detection

### IntersectionObserver Setup

Sections are detected via `IntersectionObserver`:

```typescript
const sections = document.querySelectorAll(".section[data-section]");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
        const sectionId = entry.target.getAttribute("data-section");
        setActiveSection(sectionId);
      }
    });
  },
  { threshold: [0.3, 0.5] }
);
```

**Threshold**: Section must be 30-50% visible to be considered "active"

### Section Data Structure

Each section has associated metadata:

```typescript
const sectionData = {
  hero: {
    sector: "Origin",
    depth: 0.0,
    vector: "Entry",
    signal: 61,
    landmark: 1,
  },
  manifesto: {
    sector: "Manifesto",
    depth: 2.4,
    vector: "Creative",
    signal: 74,
    landmark: 2,
  },
  // ...
};
```

## Navigation Logic

### Smooth Scrolling Integration

Uses Lenis for smooth scrolling:

```typescript
const { scrollProgress, scrollTo } = useLenis();

const handleNavigate = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    scrollTo(element);  // Lenis smooth scroll
  }
};
```

### HUD State Computation

HUD state is computed from scroll progress and active section:

```typescript
const hudState = useMemo(() => {
  const p = scrollProgress;
  const section = sectionData[activeSection] || sectionData.hero;

  return {
    sector: section.sector,
    depth: (p * 7.5).toFixed(1),        // Linear depth progression
    vector: section.vector,
    signal: `${section.signal}%`,
    delta: (0.27 + p * 0.5).toFixed(2),  // Simulated coordinates
    theta: (58.1 + p * 30).toFixed(1) + "°",
    rho: (0.63 + p * 0.3).toFixed(2),
    zeta: (2.4 + p * 7).toFixed(1),
    instruction: getInstruction(p),
  };
}, [scrollProgress, activeSection]);
```

**Note**: Uses `useMemo` to avoid unnecessary recalculations. No `useState` to prevent render loops.

## Styling System

### Design Tokens

```css
:root {
  --hud-padding: clamp(32px, 4vw, 64px);  /* Responsive padding */
  --rail-width: 60px;                      /* Side rail width */
  --corner-size: 40px;                     /* Corner bracket size */
  --gold: #caa554;                         /* HUD accent color */
  --dawn: #ebe3d6;                         /* Text color */
  --dawn-30: rgba(235, 227, 214, 0.3);    /* Dim text */
}
```

### Typography

- **Font**: IBM Plex Sans (monospace feel)
- **Sizes**: 9-14px for HUD elements
- **Tracking**: 0.06-0.12em for uppercase labels
- **Style**: Uppercase for navigation and labels

### Layout

- **Fixed positioning**: `position: fixed; inset: 0;`
- **Z-index**: 100 (above content, below modals)
- **Pointer events**: `pointer-events: none` on container, `pointer-events: auto` on interactive elements

## Responsive Behavior

### Breakpoints

**Desktop (> 1100px)**:
- Full HUD visible
- Rails on both sides
- All readouts visible

**Tablet (600-1100px)**:
- Rails hidden (`--rail-width: 0`)
- Corner size reduced to 30px
- Signal indicator hidden
- Navigation links remain

**Mobile (< 600px)**:
- Brand label hidden
- Coordinates hidden
- Navigation links compressed
- Corner size: 24px

## Animation & Transitions

### Fade-In Animation

HUD elements fade in as scroll progresses:

```typescript
const hudOpacity = Math.min(1, Math.max(0, (scrollProgress - 0.05) / 0.1));
```

Applied via inline styles:
```tsx
<div style={{ opacity: hudOpacity }}>
```

### Navigation Transitions

- **Active link**: Gold underline via `::after` pseudo-element
- **Section markers**: Opacity transition (0.4 → 1.0)
- **Depth indicator**: Smooth `top` transition based on scroll

### Instruction Text

Text updates smoothly based on scroll thresholds:
- Uses simple conditional logic
- No fade transitions (instant swap for clarity)

## Integration Pattern

### Component Hierarchy

```tsx
function NavigationCockpit() {
  // State management
  const [activeSection, setActiveSection] = useState("hero");
  const { scrollProgress, scrollTo } = useLenis();
  
  // Section detection
  useEffect(() => {
    // IntersectionObserver setup
  }, []);
  
  // Render
  return (
    <>
      <ParticleCanvas scrollProgress={scrollProgress} />
      <HUDFrame 
        activeSection={activeSection}
        scrollProgress={scrollProgress}
        onNavigate={handleNavigate}
      />
      <main className="scroll-container">
        {/* Sections */}
      </main>
    </>
  );
}
```

### Scroll Progress Flow

```
Lenis Scroll → scrollProgress (0-1)
    ↓
ParticleCanvas (3D depth calculation)
    ↓
HUDFrame (HUD state updates)
    ↓
Content Sections (IntersectionObserver)
    ↓
activeSection update
```

## Key Design Principles

1. **Fixed Window Metaphor**: HUD stays, world moves
2. **Progressive Disclosure**: HUD appears after hero
3. **Spatial Awareness**: Depth scales, coordinates, section markers
4. **Retro Aesthetic**: Radar ticks, monospace fonts, corner brackets
5. **Non-Intrusive**: Fades in gradually, doesn't compete with content

## File Locations

- **Main Component**: `components/hud/NavigationCockpit.tsx`
- **HUD Frame**: `components/hud/HUDFrame.tsx`
- **Styles**: `app/globals.css` (`.hud-*` classes)
- **Lenis Hook**: `lib/hooks/useLenis.ts`

## Usage Example

```tsx
import { NavigationCockpit } from "@/components/hud";

export default function HomePage() {
  return <NavigationCockpit />;
}
```

## Future Enhancements

- Keyboard navigation (arrow keys, number keys for sections)
- HUD customization/preferences
- Additional coordinate systems
- Sound effects for navigation events
- Gesture controls for mobile


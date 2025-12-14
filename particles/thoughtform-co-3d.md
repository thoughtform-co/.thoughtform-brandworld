# Thoughtform.co 3D Scroll-Driven Particle System

## Overview

The thoughtform.co website uses a 3D particle system that creates a "navigation through latent space" experience. The system features an extended topology terrain that fills the background throughout the scroll journey, with section-specific landmarks that emerge from it.

## Core Concept

**The terrain is the journey** — rather than a backdrop, the gold topology grid extends through the entire scroll experience (Z: 800 to 8800), creating a continuous landscape you travel across. Section-specific landmarks emerge from this terrain as you progress.

## Architecture

### Particle Types

1. **Stars** (`type: "star"`)
   - Ambient background particles
   - Loop infinitely in Z-space
   - Center vanishing point (fly straight)

2. **Terrain** (`type: "terrain"`)
   - The main topology grid (160 rows × 70 columns)
   - Extends Z: 800 to 8800
   - Scrolls with content (not fixed)
   - Right-side vanishing point (looking out window)

3. **Landmarks** (`type: "geo"`)
   - Section-specific structures
   - Emerge from terrain as sections come into view
   - Fade based on section proximity

### Key Constants

```typescript
const GRID = 3;                    // Pixel snapping (non-negotiable)
const FOCAL = 400;                 // Perspective focal length
const MAX_DEPTH = 6500;            // Maximum visible depth
const TERRAIN_SPAN = 8000;         // Z: 800 to 8800
const SCROLL_RANGE = 8500;         // Total scroll depth
```

## Terrain Implementation

### Extended Topology Grid

The terrain is a continuous mesh that spans the entire journey:

```typescript
// 160 rows × 70 columns
for (let r = 0; r < 160; r++) {
  for (let c = 0; c < 70; c++) {
    const x = (c - 35) * 65;        // Wide spread (-2275 to +2275)
    const z = 800 + (r * 50);       // Z: 800 to 8800
    const wavePhase = r * 0.02;     // Evolution as you travel
    
    const y = 400 
      + Math.sin(c * 0.2 + wavePhase) * 180   // Primary wave (phase-shifted)
      + Math.cos(r * 0.12) * 150              // Secondary wave
      + Math.sin(c * 0.35 + r * 0.15) * 70    // Detail wave
      + Math.sin(r * 0.08) * 100;             // Long-wave undulation
  }
}
```

### Key Features

- **Evolving terrain**: `wavePhase = r * 0.02` causes the terrain to morph as you travel
- **Multi-wave composition**: Four sine/cosine waves create organic topology
- **Long-wave undulation**: `Math.sin(r * 0.08) * 100` creates gentle rises/falls over distance
- **Scroll-driven**: Terrain scrolls with content (uses `p.z - scrollZ`), not fixed position

## Landmarks

### Section Mapping

Each section has a unique landmark structure:

| Section | Landmark ID | Z Range | Concept |
|---------|-------------|---------|---------|
| Hero | 1 | 1500-1900 | Gateway Portal (concentric rings + spiral) |
| Manifesto | 2 | 2800-3000 | Data Overlay (vertical streams + scan lines) |
| Services | 3 | 5500-8200 | Trajectory Tunnel (helix) |
| Contact | 4 | 8500+ | Event Horizon (sphere/singularity) |

### Visibility Logic

Landmarks use section-based visibility:

```typescript
const currentSection = Math.floor(scrollProgress * 4) + 1;
const sectionDist = Math.abs(currentSection - landmarkSection);

if (sectionDist === 0) {
  // Current section: fully visible, with emergence animation
  particleAlpha = 1;
  const emergence = Math.min(1, sectionProgress * 2);
  yOffset = (1 - emergence) * 150; // Rise from terrain
} else if (sectionDist === 1) {
  // Adjacent section: partially visible
  particleAlpha = 0.4;
} else {
  // Far sections: hidden
  particleAlpha = 0;
}
```

### Emergence Animation

Landmarks "rise up" from the terrain as their section comes into view:

- Initial state: 150px below final position
- Animates over first 50% of section scroll
- Creates sense of discovery/emergence

## Rendering System

### Split Vanishing Points

The system uses two vanishing points for different particle types:

```typescript
const cx_stars = width * 0.5;    // Stars: Center (fly straight forward)
const cx_geo = width * 0.72;     // Geo/Terrain: Right (look out window)
```

This creates the effect of:
- Stars: Flying straight ahead (centered perspective)
- Terrain/Landmarks: Visible through a side window (right-side perspective)

### Projection

Simple perspective projection:

```typescript
const scale = FOCAL / relZ;
const x = center + particle.x * scale;
const y = cy + particle.y * scale;
```

### Rendering Modes

1. **Close particles** (scale > 0.35): Render as ASCII characters
   - Uses semantic chars: `λ, δ, θ, φ, ψ, Σ, π, ∇, ∞, ∂, ⟨, ⟩`
   - Font size scales with distance

2. **Distant particles** (scale <= 0.35): Render as grid-snapped squares
   - Size: `Math.max(GRID, GRID * scale)`
   - Always snaps to 3px grid

3. **Stars**: Always squares, 40% opacity multiplier

### Trail Effect

Partial clearing creates motion blur:

```typescript
ctx.fillStyle = "rgba(5, 5, 4, 0.88)";  // 88% opacity = 12% fade per frame
ctx.fillRect(0, 0, width, height);
```

Lower alpha = longer trails = more motion blur.

## Scroll Integration

The particle system depth is driven by scroll progress:

```typescript
const scrollProgress = 0 to 1;  // From Lenis smooth scroll
const scrollZ = scrollProgress * 8500;

// Each particle's relative Z
let relZ = particle.z - scrollZ;
```

### Section Detection

Sections are detected via `IntersectionObserver`:

```typescript
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
      setActiveSection(entry.target.getAttribute("data-section"));
    }
  });
}, { threshold: [0.3, 0.5] });
```

## Color Palette

```typescript
const DAWN = "#ebe3d6";   // Ambient stars, close particles
const GOLD = "#caa554";   // Terrain, primary landmarks
const ALERT = "#ff6b35";  // Event Horizon (final landmark)
```

## Performance

- **Total particles**: ~11,200
  - Stars: 500
  - Terrain: 11,200 (160 × 70)
  - Landmarks: ~3,500
- **Render loop**: Single `requestAnimationFrame` loop
- **Depth sorting**: Sorts all particles each frame (back-to-front)
- **Culling**: Particles outside view frustum are skipped early

## Implementation Notes

### React Integration

- Uses `useRef` for scroll progress to avoid re-renders
- Canvas dimensions stored in ref for stable render loop
- `requestAnimationFrame` loop runs independently of React render cycle

### Smooth Scrolling

Integrated with Lenis smooth scroll:

```typescript
const { scrollProgress } = useLenis();
// scrollProgress is 0-1 value from Lenis
```

### Responsive Behavior

- Canvas resizes with viewport
- DPR-aware scaling for retina displays
- Vanishing points adjust to screen width

## Brand Alignment

This implementation adheres to Thoughtform brand guidelines:

✅ **Sharp geometry only** — All particles are squares (`fillRect`)  
✅ **Grid snapping** — All positions snap to 3px grid  
✅ **No glow effects** — No `shadowBlur` or bloom  
✅ **Scroll-driven motion** — No continuous rotation, all movement tied to scroll  
✅ **ASCII semantics** — Close particles use mathematical/logical symbols  

## File Location

Main implementation:
- `components/hud/ParticleCanvas.tsx`

Documentation:
- `design/PARTICLE_SYSTEM.md` (detailed technical docs)

## Usage Example

```tsx
import { ParticleCanvas } from "@/components/hud/ParticleCanvas";
import { useLenis } from "@/lib/hooks/useLenis";

function NavigationCockpit() {
  const { scrollProgress } = useLenis();
  
  return (
    <>
      <ParticleCanvas scrollProgress={scrollProgress} />
      {/* Content sections... */}
    </>
  );
}
```

## Future Enhancements

Potential additions while maintaining brand guidelines:
- Interactive landmark highlighting on hover
- Particle density variation based on viewport size
- Additional landmark types for new sections
- Subtle parallax between terrain layers


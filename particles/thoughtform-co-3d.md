# Thoughtform.co 3D Scroll-Driven Particle System V2

## Overview

The thoughtform.co website uses a **config-driven 3D particle system** that creates a "navigation through latent space" experience. The system features an extended topology terrain (the "Manifold") that fills the background throughout the scroll journey, with section-specific landmarks that emerge from it.

**Key Feature**: The particle system is **admin-controllable** — logged-in admins can adjust colors, density, topology, and landmark shapes in real-time via a floating panel, with settings persisted to Vercel KV (Upstash Redis).

## Core Concept

**The terrain is the journey** — rather than a backdrop, the off-white topology grid extends through the entire scroll experience (Z: 1200 to ~9000), creating a continuous landscape you travel across. Section-specific landmarks in Tensor Gold emerge from this terrain as you progress.

## Architecture

### Particle Types

1. **Terrain** (`type: "terrain"`)
   - The main topology grid (configurable rows × columns, default 140×60)
   - Extends through entire scroll journey
   - Uses Semantic Dawn color (`#ebe3d6`) at configurable opacity
   - Right-side vanishing point

2. **Gateway** (`type: "gateway"`)
   - Hero section portal structure
   - Concentric rings with inner spiral
   - Pulsing halo effect
   - Fades as you scroll past

3. **Landmarks** (`type: "geo"`)
   - Section-specific structures (Tower, Helix, Sphere, Ring)
   - Emerge from terrain as sections come into view
   - Use Tensor Gold color (`#caa554`)
   - Fade based on section proximity

### Configuration Schema

```typescript
interface ParticleSystemConfig {
  manifold: {
    color: string;        // Hex color for terrain
    rows: number;         // Grid rows (40-200)
    columns: number;      // Grid columns (30-100)
    waveAmplitude: number;// Wave height (50-400)
    waveFrequency: number;// Wave tightness (0.05-0.5)
    spreadX: number;      // Horizontal spread (0.5-2.0)
    spreadZ: number;      // Depth spread (0.5-2.0)
    opacity: number;      // Base opacity (0.1-1.0)
  };
  landmarks: LandmarkConfig[];
  version: number;
}

interface LandmarkConfig {
  id: string;
  sectionId: string;      // Matches data-section attribute
  name: string;
  shape: 'gateway' | 'tower' | 'helix' | 'sphere' | 'ring';
  color: string;          // Hex color
  density: number;        // Particle count multiplier
  scale: number;          // Size multiplier
  position: { x, y, z };  // Base position
  enabled: boolean;
}
```

### Key Constants

```typescript
const GRID = 3;          // Pixel snapping (non-negotiable)
const FOCAL = 400;       // Perspective focal length
const MAX_DEPTH = 7000;  // Maximum visible depth
```

## Manifold (Terrain) Implementation

### Topology Grid

The terrain is a continuous mesh with multi-wave topology:

```typescript
for (let r = 0; r < config.rows; r++) {
  for (let c = 0; c < config.columns; c++) {
    const x = (c - columns / 2) * (70 * spreadX);
    const z = 1200 + r * (55 * spreadZ);

    const wavePhase = r * 0.02;  // Evolution as you travel
    const y = 400 
      + Math.sin(c * waveFrequency + wavePhase) * waveAmplitude
      + Math.cos(r * 0.12) * 150         // Secondary wave
      + Math.sin(c * 0.35 + r * 0.15) * 70   // Detail wave
      + Math.sin(r * 0.08) * 100;        // Long-wave undulation
  }
}
```

### Key Features

- **Evolving terrain**: `wavePhase = r * 0.02` causes the terrain to morph as you travel
- **Multi-wave composition**: Four sine/cosine waves create organic topology
- **Y-culling**: Terrain only renders in lower 65% of screen to avoid visual noise above
- **Proximity boost**: Nearby particles get up to 80% brightness increase

## Landmark Shapes

### 1. Gateway Portal
- **Sections**: Hero
- **Structure**: 8 concentric rings with diminishing radii, plus inner spiral and core glow
- **Special effect**: Pulsing halo visible in hero section

### 2. Crystalline Tower
- **Sections**: Manifesto
- **Structure**: 12 square layers that taper upward, with vertical connectors and apex
- **Emergence**: Rises from terrain Y position

### 3. Trajectory Helix
- **Sections**: Services
- **Structure**: Double-strand DNA-like spiral extending along Z-axis
- **Pattern**: Uses terrain Y as baseline with orbital motion

### 4. Event Horizon (Sphere)
- **Sections**: Contact
- **Structure**: Spherical surface with concentric core rings
- **Color**: Uses Alert orange (`#ff6b35`) for emphasis

### 5. Orbital Ring
- **Additional shape**: 10 concentric tilted rings at varying angles

## Rendering System

### Visibility Logic

```typescript
const currentSection = Math.floor(scrollProgress * 4) + 1;
const sectionDist = Math.abs(currentSection - landmarkSection);

if (sectionDist === 0) {
  // Current section: fully visible with emergence animation
  particleAlpha = 1;
  const emergence = Math.min(1, sectionProgress * 1.8);
  particleAlpha *= emergence;
} else if (sectionDist === 1) {
  // Adjacent section: partially visible
  particleAlpha = 0.3;
} else {
  // Far sections: hidden
  return;
}
```

### Alpha Calculation

```typescript
// Depth-based alpha with minimum floor
const normalizedDepth = relZ / MAX_DEPTH;
const depthAlpha = Math.min(1, (1 - normalizedDepth) * 1.5 + 0.3);

// Proximity boost for nearby particles
const proximityBoost = relZ < 1500 ? 1 + (1 - relZ / 1500) * 0.8 : 1;

// Breathing animation
const breatheAlpha = 0.85 + Math.sin(time * 0.02 + phase) * 0.15;

// Final alpha
const finalAlpha = depthAlpha * particleAlpha * opacity * breatheAlpha * proximityBoost;
```

### Size Calculation

```typescript
// Terrain: scale based on depth
const sizeMultiplier = Math.min(2.5, 0.6 + scale * 1.2);
const terrainSize = Math.max(GRID, GRID * sizeMultiplier);

// Landmarks: larger, more prominent
const baseSize = type === "gateway" ? GRID * 2 : GRID * 1.6;
const landmarkSize = Math.max(GRID, baseSize * Math.min(3, scale * 2));
```

### Projection

```typescript
const scale = FOCAL / relZ;
const cx_geo = width * 0.7;  // Right-side vanishing point
const x = cx_geo + particle.x * scale;
const y = cy + particle.y * scale;
```

## Color Palette

```typescript
const DAWN = "#ebe3d6";   // Manifold terrain (Semantic Dawn)
const GOLD = "#caa554";   // Landmarks (Tensor Gold)
const ALERT = "#ff6b35";  // Event Horizon (Alert Orange)
const TEAL = "#5b8a7a";   // Available preset
const VOID = "#050504";   // Background
```

## Admin Panel

### Features
- **Manifold controls**: Color, rows, columns, wave amplitude/frequency, spread, opacity
- **Landmark controls**: Shape, color, density, scale, position, enabled toggle
- **Persistence**: Settings saved to Vercel KV (Upstash Redis)
- **Live preview**: Changes reflect immediately in particle canvas

### Access
- Toggle button: Square icon in top-right corner
- Draggable panel: Can be positioned anywhere on screen
- Storage indicator: Shows "☁ KV" (server) or "💾 Local" (localStorage fallback)

## Performance

- **Particle count**: ~8,400+ (terrain) + ~3,500 (landmarks)
- **Render loop**: Single `requestAnimationFrame`, full clear each frame
- **Depth sorting**: Back-to-front each frame
- **Culling**: Y-culling for terrain, bounds checking for all

## Brand Alignment

✅ **Sharp geometry only** — All particles are squares (`fillRect`)  
✅ **Grid snapping** — All positions snap to 3px grid  
✅ **No glow effects** — Clean, crisp rendering  
✅ **Scroll-driven motion** — No continuous rotation  
✅ **Pure pixels** — No ASCII characters (removed in V2)  
✅ **Configurable** — Admin can adjust without code changes

## File Locations

**Implementation:**
- `components/hud/ParticleCanvasV2.tsx` — Main particle renderer
- `lib/particle-config.ts` — Configuration schema and defaults
- `lib/contexts/ParticleConfigContext.tsx` — React context for config state
- `components/admin/ParticleAdminPanel.tsx` — Admin controls UI

**API:**
- `app/api/particles/config/route.ts` — KV storage endpoints

**Documentation:**
- `design/PARTICLE_SYSTEM.md` — Detailed technical docs

## Usage Example

```tsx
import { ParticleCanvasV2 } from "@/components/hud/ParticleCanvasV2";
import { ParticleConfigProvider, useParticleConfig } from "@/lib/contexts/ParticleConfigContext";

function NavigationCockpit() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const { config } = useParticleConfig();
  
  return (
    <ParticleConfigProvider>
      <ParticleCanvasV2 
        scrollProgress={scrollProgress} 
        config={config}
      />
      {/* Content sections... */}
    </ParticleConfigProvider>
  );
}
```

## Migration from V1

V2 removes several V1 features:
- ❌ ASCII character rendering (now pure pixels)
- ❌ Star particles (removed for cleaner visuals)
- ❌ Motion blur trails (full clear each frame)
- ❌ Hardcoded configuration (now admin-controllable)

V2 adds:
- ✅ Admin panel with live controls
- ✅ Vercel KV persistence
- ✅ Multiple landmark shapes
- ✅ Proximity brightness boost
- ✅ Breathing animations
- ✅ Gateway halo effect

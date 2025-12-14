# Thoughtform.co Implementation Guide

## Overview

This guide explains how the 3D particle system and Navigation HUD work together to create the "navigation through latent space" experience on thoughtform.co.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    NavigationCockpit                         │
│  (Orchestrates all systems, manages scroll/state)           │
└─────────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
┌─────────────────┐  ┌──────────────┐  ┌──────────────────┐
│ ParticleCanvas  │  │  HUDFrame    │  │ Scroll Container │
│                 │  │              │  │                  │
│ - 3D terrain    │  │ - Top bar    │  │ - Hero section   │
│ - Landmarks     │  │ - Rails      │  │ - Manifesto      │
│ - Scroll depth  │  │ - Corners    │  │ - Services       │
│ - Split v-point │  │ - Readouts   │  │ - Contact        │
└─────────────────┘  └──────────────┘  └──────────────────┘
```

## Data Flow

### 1. Scroll Detection

```
User Scrolls
    ↓
Lenis Smooth Scroll (useLenis hook)
    ↓
scrollProgress (0-1)
    ↓
┌─────────────────┬──────────────────┐
│                 │                  │
ParticleCanvas    HUDFrame          NavigationCockpit
(depth calc)      (state update)     (section detection)
```

### 2. Section Detection

```
IntersectionObserver
    ↓
Active Section ID (hero/manifesto/services/contact)
    ↓
┌─────────────────┬──────────────────┐
│                 │                  │
HUDFrame          ParticleCanvas
(updates display) (shows/hides landmarks)
```

## Key Integrations

### Particle System ↔ HUD Communication

**Shared State**:
- `scrollProgress` (0-1) — drives both systems
- `activeSection` — determines landmark visibility

**Particle System Uses**:
- `scrollProgress` → calculate `scrollZ` (depth position)
- `activeSection` → determine which landmarks to show

**HUD Uses**:
- `scrollProgress` → update depth readouts, coordinates
- `activeSection` → update sector label, signal strength

### Scroll-Driven Depth Calculation

```typescript
// In ParticleCanvas
const scrollZ = scrollProgress * 8500;  // Total journey depth
const relZ = particle.z - scrollZ;      // Relative depth

// In HUDFrame
const depth = (scrollProgress * 7.5).toFixed(1);  // Displayed depth
```

**Synchronization**: Both use the same `scrollProgress` value, so depth indicators match particle positions.

## Component Responsibilities

### NavigationCockpit
- Manages overall state
- Sets up IntersectionObserver for section detection
- Provides navigation handlers
- Passes props to child components

### ParticleCanvas
- Initializes particle array (stars, terrain, landmarks)
- Runs render loop (`requestAnimationFrame`)
- Calculates 3D projection and depth
- Manages landmark visibility based on section
- Handles resize events

### HUDFrame
- Computes HUD state from scroll/section
- Manages HUD visibility (hidden in hero)
- Renders all HUD elements
- Updates readouts based on state

## State Management Pattern

### No Shared State Store

The system uses **prop drilling** rather than a context/store:

```
NavigationCockpit
  ├── scrollProgress (from useLenis)
  ├── activeSection (from IntersectionObserver)
  ├── handleNavigate (callback)
  │
  ├──→ ParticleCanvas (scrollProgress)
  ├──→ HUDFrame (scrollProgress, activeSection, onNavigate)
  └──→ Content Sections (data-section attributes)
```

**Why?** Simpler, no unnecessary re-renders, React handles updates efficiently.

### State Updates

1. **Scroll Progress**: Updates on every scroll tick
   - `scrollProgressRef.current = scrollProgress` (in ParticleCanvas)
   - Direct prop pass (in HUDFrame)

2. **Active Section**: Updates on intersection
   - `setActiveSection(sectionId)` triggers re-render
   - Both ParticleCanvas and HUDFrame react via props

## Rendering Performance

### Particle Canvas Optimization

- **Single render loop**: One `requestAnimationFrame` handles everything
- **Depth sorting**: Only happens once per frame
- **Early culling**: Particles outside frustum skipped
- **Refs for stability**: `particlesRef`, `dimensionsRef` avoid re-renders

### HUD Optimization

- **useMemo for state**: HUD state computed once per scroll/section change
- **Conditional rendering**: HUD elements only rendered when `showHUD === true`
- **Inline styles**: Opacity transitions via inline styles (no CSS animations)

## Integration Checklist

When implementing this pattern:

- [ ] Set up Lenis smooth scroll
- [ ] Create `useLenis` hook returning `scrollProgress` and `scrollTo`
- [ ] Implement `NavigationCockpit` with IntersectionObserver
- [ ] Create `ParticleCanvas` with particle initialization
- [ ] Create `HUDFrame` with all UI elements
- [ ] Add `data-section` attributes to content sections
- [ ] Wire up navigation handlers
- [ ] Test HUD visibility transitions
- [ ] Test landmark emergence animations
- [ ] Verify scroll depth synchronization

## File Structure

```
components/hud/
├── ParticleCanvas.tsx        # 3D particle system
├── HUDFrame.tsx              # Navigation HUD overlay
├── NavigationCockpit.tsx     # Main orchestrator
└── Wordmark.tsx              # Logo component

lib/hooks/
└── useLenis.ts               # Smooth scroll integration

app/
├── globals.css               # HUD styles (.hud-*)
└── page.tsx                  # Renders NavigationCockpit
```

## Common Patterns

### Adding a New Section

1. Add section data:
```typescript
const sectionData = {
  // ...existing
  newSection: {
    sector: "New Sector",
    depth: 12.0,
    vector: "Direction",
    signal: 98,
    landmark: 5,
  }
};
```

2. Create landmark particles:
```typescript
// In initParticles()
// ─── LANDMARK 5: NEW LANDMARK ───
for (let i = 0; i < 500; i++) {
  const z = 9000 + /* ... */;
  particles.push(createPoint(x, y, z, "geo", GOLD, 5));
}
```

3. Add section marker:
```typescript
const sectionMarkers = [
  // ...existing
  { section: "newSection", label: "05" }
];
```

### Adjusting Terrain Evolution

Modify the wave phase calculation:
```typescript
const wavePhase = r * 0.02;  // Lower = slower evolution
```

Or add more wave components:
```typescript
const y = 400 
  + Math.sin(c * 0.2 + wavePhase) * 180
  + Math.cos(r * 0.12) * 150
  + Math.sin(c * 0.35 + r * 0.15) * 70
  + Math.sin(r * 0.08) * 100
  + Math.sin(c * 0.5 + r * 0.3) * 50;  // New wave
```

## Troubleshooting

### HUD Not Appearing
- Check `scrollProgress > 0.02`
- Verify `showHUD` logic in NavigationCockpit
- Check opacity calculation

### Particles Not Visible
- Verify canvas is rendering (check browser console)
- Check particle culling bounds
- Verify scrollZ calculation matches particle Z positions

### Landmarks Not Emerging
- Check landmark IDs match section mapping
- Verify `currentSection` calculation
- Check emergence animation `yOffset` logic

### Performance Issues
- Reduce particle count (especially terrain)
- Increase culling bounds
- Reduce MAX_DEPTH to render fewer particles
- Check for memory leaks in render loop

## References

- **Particle System**: `particles/thoughtform-co-3d.md`
- **HUD System**: `components/thoughtform-co/NAVIGATION_HUD.md`
- **Reference Code**: `components/thoughtform-co/3d-particle-system.tsx`
- **HUD Pattern**: `components/thoughtform-co/NavigationCockpit.tsx`


# Atlas Domain Nebulae System

> **Each domain is a gravitational well** — entities orbit around strange attractor particle systems that give each domain a distinctive visual signature.

---

## Overview

The Atlas Celestial Constellation View uses **strange attractors** to create domain-specific particle nebulae. Each domain has:

1. **Unique attractor type** — Different mathematical equation
2. **Color palette** — Domain-specific RGB values
3. **Particle configuration** — Density, core ratio, scale
4. **Entity cards** — Orbit within the attractor field

---

## Domain Configuration

### Current Mappings

| Domain | Attractor | Color | Character |
|--------|-----------|-------|-----------|
| **Starhaven Reaches** | Lorenz (Butterfly) | Gold `202, 165, 84` | Navigational, purposeful |
| **The Gradient Throne** | Thomas | Silver `180, 200, 200` | Ethereal, smooth |
| **The Lattice** | Halvorsen | Blue-white `184, 196, 208` | Dynamic, data-like |
| **The Threshold** | Rössler | Amber `139, 115, 85` | Transitional, folding |

### Configuration Interface

```typescript
export type AttractorType = 
  | 'galaxy' 
  | 'lorenz' 
  | 'halvorsen' 
  | 'aizawa' 
  | 'thomas' 
  | 'sprott' 
  | 'rossler' 
  | 'dadras';

export interface DomainConfig {
  attractorType: AttractorType;    // Mathematical equation
  particleDensity: number;         // Particle count (500-1500)
  coreIntensity: number;           // Core brightness (0-1)
  coreParticleRatio: number;       // Core vs nebula ratio (0.1-0.3)
  nebulaScale: number;             // Size multiplier
  sphereRadius: number;            // Base radius in pixels
  cardGlow: number;                // Entity card glow intensity
}

export const DEFAULT_DOMAIN_CONFIG: DomainConfig = {
  attractorType: 'lorenz',
  particleDensity: 800,
  coreIntensity: 0.6,
  coreParticleRatio: 0.2,
  nebulaScale: 1.0,
  sphereRadius: 180,
  cardGlow: 0.6,
};
```

---

## How It Works

### 1. Attractor Point Generation

When a domain cluster is created, we generate points along the attractor:

```typescript
// Generate 2000+ points along the Lorenz attractor
const attractorPoints = generateAttractorPoints('lorenz', 2000);

// Normalize to fit within sphereRadius
const normalizedPoints = normalizeAttractorPoints(
  attractorPoints,
  config.sphereRadius,
  config.nebulaScale
);
```

### 2. Particle Sampling

Particles are sampled from the attractor points with jitter:

```typescript
// Core particles (bright, tight clustering)
for (let i = 0; i < particleCount * coreParticleRatio; i++) {
  particles.push(createAttractorParticle(normalizedPoints, true));
}

// Nebula particles (dim, wider spread)
for (let i = 0; i < particleCount * (1 - coreParticleRatio); i++) {
  particles.push(createAttractorParticle(normalizedPoints, false));
}
```

### 3. Entity Card Placement

Entity cards are positioned within the attractor field:

```typescript
// Sample a point from the attractor for card position
const attractorPoint = normalizedPoints[
  Math.floor(Math.random() * normalizedPoints.length)
];

// Offset from attractor point
const cardPosition = {
  x: attractorPoint.x + offsetX,
  y: attractorPoint.y + offsetY,
  z: attractorPoint.z + offsetZ,
};
```

### 4. 3D Rotation

The entire domain (particles + cards) rotates around Y-axis:

```typescript
const rotationSpeed = 0.0003; // Radians per frame
let rotation = 0;

function animate() {
  rotation += rotationSpeed;
  
  // Rotate each particle
  particles.forEach(p => {
    const cos = Math.cos(rotation);
    const sin = Math.sin(rotation);
    const rotatedX = p.x * cos - p.z * sin;
    const rotatedZ = p.x * sin + p.z * cos;
    
    // Project to 2D
    const scale = focalLength / (focalLength + rotatedZ);
    const screenX = centerX + rotatedX * scale;
    const screenY = centerY + p.y * scale;
    
    // Draw with depth-based alpha
    drawParticle(screenX, screenY, p, scale);
  });
}
```

---

## Visual Effects

### Breathing Animation

Particles pulse gently:

```typescript
const breathe = Math.sin(time * 0.002 + particle.phase) * 0.2 + 1;
const alpha = particle.alpha * breathe;
```

### Depth Fog

Distant particles fade:

```typescript
const depthFade = 1 - (z / maxDepth) * depthEffect;
const finalAlpha = alpha * depthFade;
```

### Core Glow

Core particles get extra intensity:

```typescript
if (particle.isCore) {
  // Draw glow halo
  ctx.fillStyle = `rgba(${color}, ${alpha * 0.3})`;
  ctx.fillRect(px - 1, py - 1, GRID + 2, GRID + 2);
}
// Draw particle
ctx.fillStyle = `rgba(${color}, ${alpha})`;
ctx.fillRect(px, py, GRID - 1, GRID - 1);
```

---

## Admin Controls

The NavigationHUD provides per-domain controls:

### Attractor Type Selector
```tsx
<select
  value={domainConfig.attractorType}
  onChange={(e) => onDomainConfigChange(domain, 'attractorType', e.target.value)}
>
  <option value="lorenz">Lorenz (Butterfly)</option>
  <option value="halvorsen">Halvorsen (Twisted)</option>
  <option value="thomas">Thomas (Smooth)</option>
  <option value="aizawa">Aizawa (Disc)</option>
  <option value="rossler">Rössler (Spiral)</option>
  <option value="sprott">Sprott (Elegant)</option>
  <option value="dadras">Dadras (Complex)</option>
  <option value="galaxy">Galaxy (Classic)</option>
</select>
```

### Particle Density Slider
```tsx
<input
  type="range"
  min={200}
  max={1500}
  value={domainConfig.particleDensity}
  onChange={(e) => onDomainConfigChange(domain, 'particleDensity', parseInt(e.target.value))}
/>
```

### Nebula Scale Slider
```tsx
<input
  type="range"
  min={0.5}
  max={2.0}
  step={0.1}
  value={domainConfig.nebulaScale}
  onChange={(e) => onDomainConfigChange(domain, 'nebulaScale', parseFloat(e.target.value))}
/>
```

---

## Integration with Entity Cards

### Card Glow

Entity cards inherit domain color for glow:

```css
.entity-card {
  box-shadow: 
    0 0 20px rgba(var(--domain-color), var(--card-glow)),
    0 0 40px rgba(var(--domain-color), calc(var(--card-glow) * 0.5));
}
```

### Tidal Locking

Cards face the camera during rotation:

```typescript
// Counter-rotate card to maintain facing
const cardRotation = -rotation; // Opposite of domain rotation
card.style.transform = `rotateY(${cardRotation}rad)`;
```

---

## Performance

### Caching

Attractor points are cached by signature:

```typescript
const cacheKey = `${domain}|${config.attractorType}|${config.particleDensity}|${config.nebulaScale}`;
if (!particleCache.has(cacheKey)) {
  particleCache.set(cacheKey, generateParticles(config));
}
```

### Particle Cap

Maximum particles per domain:

```typescript
const MAX_PARTICLES = 1500;
const actualCount = Math.min(config.particleDensity, MAX_PARTICLES);
```

### Off-screen Culling

Skip particles behind camera:

```typescript
if (rotatedZ > focalLength * 2) continue; // Behind camera
if (screenX < -margin || screenX > width + margin) continue;
if (screenY < -margin || screenY > height + margin) continue;
```

---

## Files

| File | Purpose |
|------|---------|
| `CelestialConstellationView.tsx` | Main component with attractor logic |
| `NavigationHUD.tsx` | Admin controls for domain configuration |
| `CelestialConstellationView.module.css` | Styles for constellation view |

---

*Last updated: December 2024*

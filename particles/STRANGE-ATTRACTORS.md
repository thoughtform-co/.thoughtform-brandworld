# Strange Attractor Particle Systems

> **Core insight: Chaos is beautiful.** Mathematical chaos systems produce infinitely complex, never-repeating patterns that feel organic and alive. Each domain/category can have its own attractor "personality."

---

## What Are Strange Attractors?

Strange attractors are mathematical systems that exhibit **deterministic chaos** — they follow precise equations but produce unpredictable, non-repeating patterns. They're perfect for:

1. **Domain differentiation** — Each domain gets a visually distinct "nebula"
2. **Organic motion** — Patterns feel alive without being random
3. **Infinite variation** — Never repeats, always fresh
4. **Mathematical authenticity** — Real physics, real beauty

---

## Available Attractor Types

### Lorenz Attractor (Butterfly)
**Character**: Classic butterfly shape, two wings, chaotic orbits

```javascript
// Parameters
const sigma = 10, rho = 28, beta = 8/3;

// Differential equations
dx = sigma * (y - x);
dy = x * (rho - z) - y;
dz = x * y - beta * z;
```

**Visual**: Double-lobed, figure-8 trajectories
**Use for**: Primary domains, navigation, focal points
**Recommended density**: 800-1200 particles

---

### Thomas Attractor
**Character**: Smooth, symmetric, elegant spirals

```javascript
// Parameters
const b = 0.208186;

// Differential equations
dx = Math.sin(y) - b * x;
dy = Math.sin(z) - b * y;
dz = Math.sin(x) - b * z;
```

**Visual**: Three-fold symmetry, gentle curves
**Use for**: Ethereal domains, calm categories
**Recommended density**: 600-900 particles

---

### Halvorsen Attractor
**Character**: Twisted loops, dynamic flow

```javascript
// Parameters
const a = 1.89;

// Differential equations
dx = -a * x - 4 * y - 4 * z - y * y;
dy = -a * y - 4 * z - 4 * x - z * z;
dz = -a * z - 4 * x - 4 * y - x * x;
```

**Visual**: Twisted triangular loops
**Use for**: Dynamic domains, active categories
**Recommended density**: 800-1000 particles

---

### Aizawa Attractor
**Character**: Disc with central axis, UFO-like

```javascript
// Parameters
const a = 0.95, b = 0.7, c = 0.6, d = 3.5, e = 0.25, f = 0.1;

// Differential equations
dx = (z - b) * x - d * y;
dy = d * x + (z - b) * y;
dz = c + a * z - (z * z * z) / 3 - (x * x + y * y) * (1 + e * z) + f * z * x * x * x;
```

**Visual**: Disc with protruding axis
**Use for**: Structured domains, technical categories
**Recommended density**: 700-1000 particles

---

### Sprott Attractor
**Character**: Elegant spiral, minimal parameters

```javascript
// Parameters
const a = 0.4, b = 1.2;

// Differential equations
dx = a * y * z;
dy = x - y;
dz = b - x * y;
```

**Visual**: Graceful spiral shell
**Use for**: Minimalist domains, refined categories
**Recommended density**: 500-800 particles

---

### Rössler Attractor
**Character**: Spiral with fold, iconic shape

```javascript
// Parameters
const a = 0.2, b = 0.2, c = 5.7;

// Differential equations
dx = -(y + z);
dy = x + a * y;
dz = b + z * (x - c);
```

**Visual**: Spiral that folds back on itself
**Use for**: Transitional domains, threshold categories
**Recommended density**: 700-1000 particles

---

### Dadras Attractor
**Character**: Complex flow, intricate patterns

```javascript
// Parameters
const p = 3, q = 2.7, r = 1.7, s = 2, e = 9;

// Differential equations
dx = y - p * x + q * y * z;
dy = r * y - x * z + z;
dz = s * x * y - e * z;
```

**Visual**: Complex, intertwined loops
**Use for**: Complex domains, data-heavy categories
**Recommended density**: 800-1200 particles

---

### Galaxy Spiral (Parametric)
**Character**: Classic spiral galaxy, familiar shape

```javascript
// Parametric equations (not differential)
const armCount = 2;
const arm = i % armCount;
const armAngle = arm * Math.PI * 2 / armCount;
const r = Math.pow(t % 10, 0.5) * 2;
const spiral = t * 0.3 + armAngle;

x = r * Math.cos(spiral) + noise;
z = r * Math.sin(spiral) + noise;
y = (Math.random() - 0.5) * 0.3 * Math.exp(-r * 0.1);
```

**Visual**: Two-arm spiral galaxy
**Use for**: Default fallback, familiar aesthetic
**Recommended density**: 600-1000 particles

---

## Implementation

### Point Generation

```typescript
function generateAttractorPoints(
  type: AttractorType, 
  count: number
): Array<{x: number, y: number, z: number}> {
  const points: Array<{x: number, y: number, z: number}> = [];
  
  // Initial conditions (small random offset for variety)
  let x = 0.1 + Math.random() * 0.1;
  let y = 0.1 + Math.random() * 0.1;
  let z = 0.1 + Math.random() * 0.1;
  
  const dt = 0.005;      // Time step (smaller = smoother)
  const warmup = 500;    // Iterations before recording (let attractor stabilize)
  
  for (let i = 0; i < count + warmup; i++) {
    let dx = 0, dy = 0, dz = 0;
    
    switch (type) {
      case 'lorenz':
        const sigma = 10, rho = 28, beta = 8/3;
        dx = sigma * (y - x);
        dy = x * (rho - z) - y;
        dz = x * y - beta * z;
        break;
      // ... other cases
    }
    
    // Euler integration
    x += dx * dt;
    y += dy * dt;
    z += dz * dt;
    
    // Only record after warmup
    if (i >= warmup) {
      points.push({ x, y, z });
    }
  }
  
  return points;
}
```

### Normalization

Attractors have different scales. Normalize to fit your viewport:

```typescript
function normalizeAttractorPoints(
  points: Array<{x: number, y: number, z: number}>,
  radius: number,   // Target radius
  scale: number     // Scale factor (1.0 = fill radius)
): Array<{x: number, y: number, z: number}> {
  // Find bounding box
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;
  let minZ = Infinity, maxZ = -Infinity;
  
  for (const p of points) {
    minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x);
    minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y);
    minZ = Math.min(minZ, p.z); maxZ = Math.max(maxZ, p.z);
  }
  
  // Center and scale
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  const centerZ = (minZ + maxZ) / 2;
  const rangeMax = Math.max(maxX - minX, maxY - minY, maxZ - minZ) || 1;
  const scaleFactor = (radius * 2 * scale) / rangeMax;
  
  return points.map(p => ({
    x: (p.x - centerX) * scaleFactor,
    y: (p.y - centerY) * scaleFactor,
    z: (p.z - centerZ) * scaleFactor,
  }));
}
```

### Particle Creation

Create particles sampled from attractor points:

```typescript
interface AttractorParticle {
  x: number;
  y: number;
  z: number;
  isCore: boolean;    // Core particles are brighter
  alpha: number;      // Base opacity
  phase: number;      // For breathing animation
  size: number;       // Particle size (respects GRID)
}

function createAttractorParticle(
  attractorPoints: Array<{x: number, y: number, z: number}>,
  isCore: boolean
): AttractorParticle {
  // Random point from attractor
  const idx = Math.floor(Math.random() * attractorPoints.length);
  const basePoint = attractorPoints[idx] || { x: 0, y: 0, z: 0 };
  
  // Small random offset for natural clustering
  const jitter = isCore ? 3 : 8;
  
  return {
    x: basePoint.x + (Math.random() - 0.5) * jitter,
    y: basePoint.y + (Math.random() - 0.5) * jitter,
    z: basePoint.z + (Math.random() - 0.5) * jitter,
    isCore,
    alpha: isCore ? 0.6 + Math.random() * 0.3 : 0.15 + Math.random() * 0.25,
    phase: Math.random() * Math.PI * 2,
    size: isCore ? 3 : 2,
  };
}
```

---

## Rendering

### 3D Projection

Project 3D attractor points to 2D canvas:

```typescript
function project3D(
  x: number, y: number, z: number,
  centerX: number, centerY: number,
  focalLength: number = 400
): { x: number, y: number, scale: number } {
  // Simple perspective projection
  const scale = focalLength / (focalLength + z);
  return {
    x: centerX + x * scale,
    y: centerY + y * scale,
    scale,  // Use for size/alpha depth effects
  };
}
```

### Rotation

Rotate attractor around Y-axis for animation:

```typescript
function rotateY(
  x: number, z: number, 
  angle: number
): { x: number, z: number } {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: x * cos - z * sin,
    z: x * sin + z * cos,
  };
}

// In animation loop:
const rotationSpeed = 0.0003;
let rotation = 0;

function animate() {
  rotation += rotationSpeed;
  
  particles.forEach(p => {
    const rotated = rotateY(p.x, p.z, rotation);
    const projected = project3D(rotated.x, p.y, rotated.z, centerX, centerY);
    // Draw at projected.x, projected.y
  });
}
```

### Breathing Animation

Add subtle pulsing to particles:

```typescript
function getBreathingAlpha(
  baseAlpha: number,
  phase: number,
  time: number,
  intensity: number = 0.2
): number {
  const breathe = Math.sin(time * 0.002 + phase) * intensity + 1;
  return baseAlpha * breathe;
}
```

---

## Domain/Category Mapping

### Atlas Example

```typescript
const ATLAS_ATTRACTOR_MAP: Record<string, AttractorType> = {
  'Starhaven Reaches': 'lorenz',      // Butterfly for navigation
  'The Gradient Throne': 'thomas',    // Smooth for ethereal
  'The Lattice': 'halvorsen',         // Dynamic for data
  'The Threshold': 'rossler',         // Fold for transitions
  'default': 'galaxy',                // Familiar fallback
};
```

### Platform Recommendations

| Platform | Recommended | Rationale |
|----------|-------------|-----------|
| **Atlas** | Lorenz, Thomas, Halvorsen | Distinct domain personalities |
| **Astrolabe** | Galaxy, Sprott | Navigation, elegant spirals |
| **Ledger** | Aizawa, Dadras | Structured, data-oriented |
| **thoughtform.co** | Lorenz (gateway section) | Iconic, recognizable |

---

## Configuration Parameters

### Per-Domain Config

```typescript
interface DomainConfig {
  attractorType: AttractorType;  // Which attractor to use
  particleDensity: number;       // Total particle count (500-1500)
  coreIntensity: number;         // Core brightness (0-1)
  coreParticleRatio: number;     // Fraction that are core (0.1-0.3)
  nebulaScale: number;           // Size multiplier (0.5-1.5)
  sphereRadius: number;          // Base radius in pixels
  cardGlow: number;              // Entity card glow intensity
}

const DEFAULT_DOMAIN_CONFIG: DomainConfig = {
  attractorType: 'lorenz',
  particleDensity: 800,
  coreIntensity: 0.6,
  coreParticleRatio: 0.2,
  nebulaScale: 1.0,
  sphereRadius: 180,
  cardGlow: 0.6,
};
```

### Global Config

```typescript
interface GlobalConfig {
  GRID: number;              // Pixel snap grid (2-3)
  rotationSpeed: number;     // Radians per frame (0.0001-0.001)
  depthEffect: number;       // Z-depth opacity falloff (0-1)
  showBackgroundStars: boolean;
  showNebulae: boolean;
  showScanLines: boolean;
}
```

---

## Performance Considerations

1. **Pre-compute attractor points** — Generate once, sample many times
2. **Cap particle count** — 800-1200 per domain is sufficient
3. **Use requestAnimationFrame** — Not setInterval
4. **Skip off-screen particles** — Don't render what's not visible
5. **Depth sorting** — Only if particles overlap significantly

```typescript
// Cache attractor points by signature
const attractorCache = new Map<string, Array<{x: number, y: number, z: number}>>();

function getAttractorPoints(type: AttractorType, count: number) {
  const key = `${type}|${count}`;
  if (!attractorCache.has(key)) {
    attractorCache.set(key, normalizeAttractorPoints(
      generateAttractorPoints(type, count),
      180,  // radius
      1.0   // scale
    ));
  }
  return attractorCache.get(key)!;
}
```

---

## The Thoughtform Touch

### Grid Snapping

Even chaotic attractors respect GRID=3:

```typescript
const px = Math.floor(projected.x / GRID) * GRID;
const py = Math.floor(projected.y / GRID) * GRID;
ctx.fillRect(px, py, GRID - 1, GRID - 1);
```

### Glitch Integration

Add occasional glitch to attractor particles:

```typescript
function applyAttractorGlitch(
  particles: AttractorParticle[],
  glitchChance: number = 0.02
): void {
  particles.forEach(p => {
    if (Math.random() < glitchChance) {
      p.x += (Math.random() - 0.5) * 10;
      p.y += (Math.random() - 0.5) * 3;  // More horizontal than vertical
    }
  });
}
```

### Color Gradients

Depth-based coloring within domain palette:

```typescript
function getParticleColor(
  baseColor: { r: number, g: number, b: number },
  depth: number,  // 0 (near) to 1 (far)
  isCore: boolean
): string {
  const intensity = isCore ? 1.0 : 0.7;
  const depthFade = 1 - depth * 0.4;
  const r = Math.floor(baseColor.r * intensity * depthFade);
  const g = Math.floor(baseColor.g * intensity * depthFade);
  const b = Math.floor(baseColor.b * intensity * depthFade);
  return `rgb(${r}, ${g}, ${b})`;
}
```

---

*Last updated: December 2024*

# Domain Nebulae (Strange Attractors)

Mathematical chaos systems that create infinitely complex, never-repeating particle patterns for domain/category visualization.

---

## Philosophy

> **Chaos is beautiful.** Strange attractors are deterministic systems that appear random. They produce organic, living patterns from pure mathematics.

Domain nebulae serve the **LIVING_GEOMETRY** anchor — computation with breath. They also activate **NAVIGATION** — each domain becomes a gravitational well that entities orbit.

---

## What Are Strange Attractors?

Strange attractors are solutions to systems of differential equations that exhibit **deterministic chaos**:

- **Deterministic:** Same initial conditions produce same trajectory
- **Chaotic:** Tiny differences in input create wildly different outputs
- **Bounded:** Trajectories stay within a finite region (the "attractor")
- **Never repeating:** Infinite complexity, never exactly cycles

This makes them perfect for domain visualization:
- Each domain gets a distinct visual personality
- Patterns feel alive and organic
- Mathematically authentic
- Never boring (infinite variation)

---

## Available Attractor Types

### Lorenz (Butterfly)

```javascript
const sigma = 10, rho = 28, beta = 8/3;
dx = sigma * (y - x);
dy = x * (rho - z) - y;
dz = x * y - beta * z;
```

**Visual:** Classic butterfly shape, two lobes, chaotic orbits between them

**Character:** Iconic, recognizable, dynamic switching

**Use for:** Primary domains, navigation centers, hero sections

**Recommended particles:** 800-1200

---

### Thomas

```javascript
const b = 0.208186;
dx = Math.sin(y) - b * x;
dy = Math.sin(z) - b * y;
dz = Math.sin(x) - b * z;
```

**Visual:** Smooth, symmetric, three-fold rotational symmetry

**Character:** Gentle, ethereal, flowing

**Use for:** Calm categories, ethereal domains, meditation/reflection

**Recommended particles:** 600-900

---

### Halvorsen

```javascript
const a = 1.89;
dx = -a * x - 4 * y - 4 * z - y * y;
dy = -a * y - 4 * z - 4 * x - z * z;
dz = -a * z - 4 * x - 4 * y - x * x;
```

**Visual:** Twisted triangular loops, dynamic flow

**Character:** Energetic, complex, technical

**Use for:** Active categories, dynamic domains, data-heavy sections

**Recommended particles:** 800-1000

---

### Aizawa

```javascript
const a = 0.95, b = 0.7, c = 0.6, d = 3.5, e = 0.25, f = 0.1;
dx = (z - b) * x - d * y;
dy = d * x + (z - b) * y;
dz = c + a * z - (z³) / 3 - (x² + y²) * (1 + e * z) + f * z * x³;
```

**Visual:** Disc with protruding central axis

**Character:** Structured, technical, UFO-like

**Use for:** Technical categories, structured domains

**Recommended particles:** 700-1000

---

### Sprott

```javascript
const a = 0.4, b = 1.2;
dx = a * y * z;
dy = x - y;
dz = b - x * y;
```

**Visual:** Elegant spiral shell, minimal form

**Character:** Refined, minimalist, graceful

**Use for:** Curated categories, refined domains

**Recommended particles:** 500-800

---

### Rössler

```javascript
const a = 0.2, b = 0.2, c = 5.7;
dx = -(y + z);
dy = x + a * y;
dz = b + z * (x - c);
```

**Visual:** Spiral that folds back on itself

**Character:** Transitional, threshold-crossing

**Use for:** Transition states, threshold domains

**Recommended particles:** 700-1000

---

### Dadras

```javascript
const p = 3, q = 2.7, r = 1.7, s = 2, e = 9;
dx = y - p * x + q * y * z;
dy = r * y - x * z + z;
dz = s * x * y - e * z;
```

**Visual:** Complex intertwined loops

**Character:** Dense, intricate, data-rich

**Use for:** Complex categories, data-heavy domains

**Recommended particles:** 800-1200

---

### Galaxy (Parametric)

```javascript
const armCount = 2;
const arm = i % armCount;
const armAngle = arm * Math.PI * 2 / armCount;
const r = Math.pow(t % 10, 0.5) * 2;
const spiral = t * 0.3 + armAngle;

x = r * Math.cos(spiral) + noise;
z = r * Math.sin(spiral) + noise;
y = (Math.random() - 0.5) * 0.3 * Math.exp(-r * 0.1);
```

**Visual:** Classic two-arm spiral galaxy

**Character:** Familiar, accessible, cosmic

**Use for:** Default fallback, general navigation, familiar contexts

**Recommended particles:** 600-1000

---

## Implementation

### Point Generation

```typescript
function generateAttractorPoints(
  type: AttractorType, 
  count: number
): Array<{x: number, y: number, z: number}> {
  const points = [];
  
  // Initial conditions (small random for variety)
  let x = 0.1 + Math.random() * 0.1;
  let y = 0.1 + Math.random() * 0.1;
  let z = 0.1 + Math.random() * 0.1;
  
  const dt = 0.005;      // Time step
  const warmup = 500;    // Let attractor stabilize
  
  for (let i = 0; i < count + warmup; i++) {
    // Apply differential equations
    const { dx, dy, dz } = attractorEquation(type, x, y, z);
    
    x += dx * dt;
    y += dy * dt;
    z += dz * dt;
    
    if (i >= warmup) {
      points.push({ x, y, z });
    }
  }
  
  return points;
}
```

### Normalization

Attractors have different natural scales. Normalize to fit viewport:

```typescript
function normalizePoints(points, radius, scale = 1.0) {
  // Find bounding box
  const bounds = getBoundingBox(points);
  
  // Center and scale to fit radius
  const scaleFactor = (radius * 2 * scale) / bounds.maxRange;
  
  return points.map(p => ({
    x: (p.x - bounds.centerX) * scaleFactor,
    y: (p.y - bounds.centerY) * scaleFactor,
    z: (p.z - bounds.centerZ) * scaleFactor,
  }));
}
```

### Particle Creation

Sample particles from attractor points with jitter:

```typescript
function createParticle(attractorPoints, isCore) {
  const idx = Math.floor(Math.random() * attractorPoints.length);
  const base = attractorPoints[idx];
  
  const jitter = isCore ? 3 : 8;  // Core particles cluster tighter
  
  return {
    x: base.x + (Math.random() - 0.5) * jitter,
    y: base.y + (Math.random() - 0.5) * jitter,
    z: base.z + (Math.random() - 0.5) * jitter,
    isCore,
    alpha: isCore ? 0.6 + Math.random() * 0.3 : 0.15 + Math.random() * 0.25,
    phase: Math.random() * Math.PI * 2,
    size: isCore ? 3 : 2,
  };
}
```

---

## 3D Rendering

### Rotation

```typescript
function rotateY(x, z, angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: x * cos - z * sin,
    z: x * sin + z * cos,
  };
}

// Animation loop
rotation += 0.0003; // Radians per frame
```

### Perspective Projection

```typescript
function project(x, y, z, centerX, centerY, focalLength = 400) {
  const scale = focalLength / (focalLength + z);
  return {
    screenX: centerX + x * scale,
    screenY: centerY + y * scale,
    scale, // Use for size/alpha depth effects
  };
}
```

### Depth Effects

```typescript
// Distant particles fade
const depthAlpha = 1 - (z / maxDepth) * depthEffect;

// Breathing animation
const breathe = Math.sin(time * 0.002 + particle.phase) * 0.2 + 1;

// Final alpha
const alpha = particle.alpha * depthAlpha * breathe;
```

---

## Domain Configuration

```typescript
interface DomainConfig {
  attractorType: AttractorType;
  particleDensity: number;    // 500-1500
  coreIntensity: number;      // 0-1
  coreParticleRatio: number;  // 0.1-0.3
  nebulaScale: number;        // 0.5-1.5
  sphereRadius: number;       // Base radius in pixels
  cardGlow: number;           // Entity card glow intensity
}

const DEFAULT_CONFIG: DomainConfig = {
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

## Domain → Attractor Mapping

| Domain | Attractor | Color | Character |
|--------|-----------|-------|-----------|
| **Starhaven Reaches** | Lorenz | Gold | Navigational, purposeful |
| **The Gradient Throne** | Thomas | Silver | Ethereal, smooth |
| **The Lattice** | Halvorsen | Blue-white | Dynamic, data-like |
| **The Threshold** | Rössler | Amber | Transitional, folding |

---

## Performance

### Caching

```typescript
const cache = new Map<string, AttractorPoint[]>();

function getCachedPoints(type, count, radius, scale) {
  const key = `${type}|${count}|${radius}|${scale}`;
  
  if (!cache.has(key)) {
    cache.set(key, normalizePoints(
      generateAttractorPoints(type, count),
      radius,
      scale
    ));
  }
  
  return cache.get(key);
}
```

### Particle Caps

- **Max per domain:** 1500
- **Recommended:** 800-1000
- **Minimum for visibility:** 400

### Off-Screen Culling

```typescript
if (rotatedZ > focalLength * 2) continue; // Behind camera
if (screenX < -margin || screenX > width + margin) continue;
if (screenY < -margin || screenY > height + margin) continue;
```

---

## Grid Snapping

Even chaos respects GRID=3:

```typescript
const px = Math.floor(screenX / GRID) * GRID;
const py = Math.floor(screenY / GRID) * GRID;
ctx.fillRect(px, py, GRID - 1, GRID - 1);
```

---

## Platform Usage

| Platform | Recommended Attractors | Application |
|----------|----------------------|-------------|
| **Atlas** | Lorenz, Thomas, Halvorsen | Domain nebulae in constellation |
| **Astrolabe** | Galaxy, Sprott | Navigation backgrounds |
| **Ledger** | Aizawa, Dadras | Category visualizations |
| **thoughtform.co** | Lorenz | Gateway section effect |

---

## Files

| File | Purpose |
|------|---------|
| `particles/StrangeAttractor.ts` | Core attractor module |
| `particles/STRANGE-ATTRACTORS.md` | Full mathematical documentation |
| `components/atlas/DomainNebulae.md` | Atlas implementation guide |

---

*Deterministic chaos: infinite complexity from simple equations.*

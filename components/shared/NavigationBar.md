# Navigation Bar - Design Specification

## Overview

The Navigation Bar is a **fixed horizontal navigation component** positioned at the top of the viewport. It uses a **two-zone architecture**: a centered navigation bar for platform links, and a separate user menu positioned in the top-right corner. The design emphasizes minimalism, sharp geometry, and particle-based canvas icons.

**Core Principle**: The navbar stays fixed at the top while content scrolls beneath it, providing persistent access to navigation and user controls.

## Visual Structure

```
┌─────────────────────────────────────────────────────────────┐
│                                         [Username ACTIVE ▼] │  ← Zone 2: User Menu (top-right)
│                                                             │
│        [+ Add]  [◇ Atlas] [⊞ Lore] [🔥 Forge]              │  ← Zone 1: Centered Nav Bar
│         (opt)                                               │
└─────────────────────────────────────────────────────────────┘
```

## Two-Zone Architecture

The navigation system separates concerns into two distinct zones:

### Zone 1: Centered Navigation Bar
- **Position**: Fixed at `top: 20px`, centered horizontally
- **Height**: 44px
- **Background**: `var(--surface-0, #0A0908)`
- **Border**: `1px solid rgba(236, 227, 214, 0.1)`
- **Contents**: Platform-specific navigation links (Atlas, Lore, Forge, etc.)
- **Optional**: Add button for admin users (left of nav bar)

### Zone 2: User Menu (Top-Right Corner) — UNIVERSAL STANDARD
- **Position**: Fixed at `top: 20px`, `right: clamp(48px, 8vw, 120px)`
- **Purpose**: Authentication state and user actions
- **Format**: `[USERNAME]: ACTIVE ▼` when logged in, `Sign In` when logged out
- **zIndex**: 1000 (same level as nav bar)

> ⚠️ **UNIVERSAL STANDARD**: The user menu position (top-right corner) is consistent across ALL Thoughtform platforms. This replaces any "Signal" or status indicators that may have been in this position previously. The top-right corner is reserved exclusively for user identity and authentication controls.

**Note**: The `[+ Add]` button is optional and only appears for admin users. For non-admin users or platforms without entity creation, the navbar starts with the navigation links.

## Component Structure

### 1. Container

```tsx
<div
  style={{
    position: 'fixed',
    top: '20px',
    left: 0,
    right: 0,
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'center',
    pointerEvents: 'none',
  }}
>
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', pointerEvents: 'auto' }}>
    {/* Navigation content */}
  </div>
</div>
```

**Key Properties**:
- `position: fixed` - Stays at top during scroll
- `top: 20px` - Offset from viewport top
- `pointerEvents: 'none'` on container, `'auto'` on inner content
- `zIndex: 1000` - Above content, below modals

### 2. Add Button (Optional - Admin Only)

A square button with a "+" icon rendered via canvas. **This is an optional element** that only appears for admin users.

**Visibility**: Only shown when `isAdmin === true` and auth state is resolved (`mounted && !loading && !roleLoading`)

**Note**: This button is platform-specific and may not be needed in all implementations. For platforms without admin entity creation, this button can be omitted entirely.

**Structure**:
```tsx
<Link
  href="/admin/new-entity"
  style={{
    width: '44px',
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'transparent',
    border: '1px solid rgba(236, 227, 214, 0.15)',
    cursor: 'pointer',
    transition: 'all 150ms ease',
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.borderColor = 'rgba(202, 165, 84, 0.5)';
    e.currentTarget.style.background = 'rgba(202, 165, 84, 0.15)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.borderColor = 'rgba(236, 227, 214, 0.15)';
    e.currentTarget.style.background = 'transparent';
  }}
>
  <canvas ref={addIconRef} width={22} height={22} />
</Link>
```

**Icon Rendering** (Canvas):
- Grid: `GRID = 2`
- Plus sign: Horizontal and vertical lines with center dot
- Colors: Dawn (`rgba(236, 227, 214)`) for lines, Gold (`rgba(202, 165, 84)`) for center
- Alpha: Fades from center (0.7) to edges (0.4)

### 3. Main Navigation Links

Horizontal list of navigation items, each with an icon and label.

**Container**:
```tsx
<nav
  style={{
    display: 'flex',
    alignItems: 'center',
    background: 'var(--surface-0, #0A0908)',
    border: '1px solid rgba(236, 227, 214, 0.1)',
    height: '44px',
  }}
>
  {/* Links */}
</nav>
```

**Link Structure**:
```tsx
<Link
  href="/"
  style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    padding: '0 18px',
    height: '100%',
    fontSize: '12px',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: isActive ? 'var(--dawn, #ECE3D6)' : 'rgba(202, 165, 84, 0.5)',
    textDecoration: 'none',
    background: isActive ? 'rgba(236, 227, 214, 0.1)' : 'transparent',
    borderRight: '1px solid rgba(236, 227, 214, 0.08)',
    transition: 'all 150ms ease',
  }}
>
  <canvas ref={iconRef} width={17} height={17} />
  <span>Label</span>
</Link>
```

**Active State**:
- Text color: `var(--dawn)` (full opacity)
- Background: `rgba(236, 227, 214, 0.1)`
- Inactive: Gold at 50% opacity, transparent background

**Navigation Items**:

1. **Atlas** (`/`)
   - Icon: Diamond shape (◇) in gold
   - Active when `pathname === '/'`

2. **Lore** (`/lore`)
   - Icon: 3x3 grid pattern in dawn
   - Active when `pathname === '/lore'`

### 4. User Menu (Zone 2 - Top Right)

The user menu is **positioned separately** from the main nav bar, in the top-right corner. This is a universal standard across all Thoughtform platforms.

**Container** (Zone 2):
```tsx
<div
  style={{
    position: 'fixed',
    top: '20px',
    right: 'clamp(48px, 8vw, 120px)',
    zIndex: 1000,
    pointerEvents: 'auto',
  }}
>
  {/* User menu content */}
</div>
```

**User Button** (Authenticated):
```tsx
<div
  style={{
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    padding: '8px 0',
  }}
>
  <span
    style={{
      fontFamily: 'var(--font-mono)',
      fontSize: '10px',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: showDropdown ? 'var(--gold, #CAA554)' : 'var(--dawn, #ECE3D6)',
    }}
  >
    {user?.email?.split('@')[0] || 'Navigator'}
  </span>
  <span
    style={{
      fontFamily: 'var(--font-mono)',
      fontSize: '8px',
      color: 'rgba(91, 138, 122, 0.8)',  // Verde tint for "active" status
      letterSpacing: '0.1em',
    }}
  >
    ACTIVE
  </span>
  <span
    style={{
      fontSize: '8px',
      color: 'rgba(236, 227, 214, 0.3)',
      transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
    }}
  >
    ▼
  </span>
</div>
```

**Format**: `[USERNAME]: ACTIVE ▼`
- Username extracted from email (before @)
- "ACTIVE" shown in verde tint to indicate connected status
- Chevron (▼) rotates on hover/open

**Dropdown Menu**:
```tsx
<div
  style={{
    position: 'absolute',
    top: '100%',
    right: 0,
    paddingTop: '4px',
    zIndex: 1001,
  }}
>
  <div
    style={{
      background: 'var(--surface-0, #0A0908)',
      border: '1px solid rgba(236, 227, 214, 0.1)',
      minWidth: '120px',
    }}
  >
    {/* Menu items */}
  </div>
</div>
```

**Menu Items**:

1. **Admin** (if `isAdmin === true`)
   - Icon: Gear pattern (14x14 canvas)
   - Route: `/admin/prompts`
   - Separator line below

2. **Log out**
   - Icon: Arrow out pattern (14x14 canvas)
   - Action: Calls `signOut()` function

**Hover Behavior**:
- 150ms delay before closing (prevents flicker)
- Menu items highlight on hover: `rgba(236, 227, 214, 0.08)` background

### 5. Sign In Button

Shown when user is not authenticated. Positioned in Zone 2 (top-right corner).

```tsx
<button
  onClick={() => setShowLoginModal(true)}
  style={{
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'rgba(236, 227, 214, 0.5)',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '8px 0',
    transition: 'color 150ms ease',
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.color = 'var(--dawn, #ECE3D6)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.color = 'rgba(236, 227, 214, 0.5)';
  }}
>
  Sign In
</button>
```

## Icon System

All icons are rendered using HTML5 Canvas with a particle-based approach.

### Canvas Setup

```typescript
const GRID = 2; // Pixel grid size
const GOLD = '202, 165, 84';
const DAWN = '236, 227, 214';

function drawPixel(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, alpha: number, size: number = GRID) {
  const px = Math.floor(x / GRID) * GRID;
  const py = Math.floor(y / GRID) * GRID;
  ctx.fillStyle = `rgba(${color}, ${alpha})`;
  ctx.fillRect(px, py, size - 1, size - 1);
}

function setupIcon(canvasRef: React.RefObject<HTMLCanvasElement | null>, size: number) {
  if (!canvasRef.current) return null;
  const canvas = canvasRef.current;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  ctx.scale(dpr, dpr);
  return { ctx, size };
}
```

### Icon Specifications

#### Add Icon (22x22)
- **Pattern**: Plus sign
- **Lines**: Horizontal and vertical, fading from center
- **Center**: Gold dot at center
- **Alpha**: 0.7 at center, fades to 0.4 at edges

#### Atlas Icon (17x17)
- **Pattern**: Diamond (◇)
- **Shape**: 4-point diamond with center dot
- **Color**: Gold
- **Alpha**: 0.5-0.7 gradient along edges, 0.8 at center

#### Archive/Lore Icon (17x17)
- **Pattern**: 3x3 grid
- **Layout**: 9 dots in grid formation
- **Color**: Dawn
- **Alpha**: Increases from top-left (0.3) to bottom-right (0.75)

#### User Icon (17x17)
- **Pattern**: Simplified person silhouette
- **Head**: Single pixel at top
- **Body**: Vertical line (3 pixels)
- **Arms**: Horizontal pixels on sides
- **Color**: Dawn
- **Alpha**: 0.35-0.7

#### Admin Icon (14x14)
- **Pattern**: Gear/cog
- **Shape**: Cross with diagonal corners
- **Color**: Dawn
- **Alpha**: 0.35-0.7

#### Logout Icon (14x14)
- **Pattern**: Arrow pointing right
- **Shape**: Vertical line with arrow head
- **Color**: Dawn
- **Alpha**: 0.3-0.5

## Design Tokens

### Colors

```css
:root {
  /* Background */
  --surface-0: #0A0908;
  
  /* Text */
  --dawn: #ECE3D6;
  --dawn-50: rgba(236, 227, 214, 0.5);
  --dawn-30: rgba(236, 227, 214, 0.3);
  
  /* Accent */
  --gold: #CAA554;
  --gold-50: rgba(202, 165, 84, 0.5);
  --gold-15: rgba(202, 165, 84, 0.15);
  
  /* Borders */
  --border-color: rgba(236, 227, 214, 0.1);
  --border-color-light: rgba(236, 227, 214, 0.08);
  --border-color-hover: rgba(202, 165, 84, 0.5);
}
```

### Typography

```css
:root {
  --font-mono: 'PT Mono', monospace;
  
  /* Navbar text */
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
```

### Spacing

```css
:root {
  /* Container */
  --navbar-top-offset: 20px;
  --navbar-height: 44px;
  --navbar-gap: 12px;
  
  /* Links */
  --link-padding-x: 18px;
  --link-gap: 10px;
  
  /* Icons */
  --icon-size-small: 14px;
  --icon-size-medium: 17px;
  --icon-size-large: 22px;
}
```

## States & Interactions

### Active State
- Applied to current route's link
- Text: Full dawn color
- Background: `rgba(236, 227, 214, 0.1)`

### Hover State
- **Links**: Color brightens slightly
- **Add Button**: Border changes to gold, background appears
- **Dropdown**: Menu appears with 150ms delay on leave

### Loading State
- Icons only render after `mounted && !loading && !roleLoading`
- Prevents flicker during auth resolution

## Responsive Behavior

The navbar is designed to be responsive but maintains its structure:

- **Desktop**: Full navbar with all elements
- **Tablet/Mobile**: Same structure, may need to adjust spacing if content overflows
- **Icons**: Always visible, maintain size across breakpoints

## Implementation Checklist

When implementing the Navigation Bar:

**Zone 1: Centered Nav Bar**
- [ ] Set up fixed positioning at top (20px offset), centered
- [ ] Implement canvas icon rendering system
- [ ] Create navigation links with active state detection
- [ ] (Optional) Implement admin-only "Add" button if platform requires entity creation
- [ ] Handle auth state loading (prevent icon flicker)

**Zone 2: User Menu (Top-Right)**
- [ ] Position user menu at `top: 20px`, `right: clamp(48px, 8vw, 120px)`
- [ ] Display format: `[USERNAME]: ACTIVE ▼`
- [ ] Add user dropdown with hover delay (150ms)
- [ ] Add sign in button for unauthenticated users
- [ ] Include Admin option in dropdown (if `isAdmin`)
- [ ] Include Log out option in dropdown

**General**
- [ ] Set proper z-index layering (1000 for both zones, 1001 for dropdown)
- [ ] Use CSS variables for all colors
- [ ] Apply transitions (150ms ease)
- [ ] Verify pointer events (none on container, auto on content)

## Platform Variations

### Atlas (Current Implementation)
- **Background**: `var(--surface-0)`
- **Accent**: Gold for active/inactive states
- **Icons**: Canvas-based particle rendering
- **Routes**: `/` (Atlas), `/lore` (Lore)
- **Add Button**: Present (admin-only, for entity creation)

### Other Platforms
- Can reuse structure with platform-specific colors
- Icons can be adapted or replaced
- Routes will vary by platform
- **Add Button**: Optional - only include if platform requires admin entity creation functionality

## File Locations

- **Implementation**: `src/components/ui/Navigation.tsx` (Atlas)
- **Styles**: Inline styles (component-based)
- **This specification**: `components/shared/NavigationBar.md`

## Usage Example

```tsx
import { Navigation } from '@/components/ui/Navigation';

function Layout({ children }) {
  return (
    <>
      <Navigation />
      {children}
    </>
  );
}
```

## Key Principles

1. **Two-Zone Architecture** - Nav bar centered, user menu top-right (separate)
2. **Fixed Positioning** - Both zones stay at top during scroll
3. **Universal User Menu Position** - Top-right corner is ALWAYS for user identity (across all platforms)
4. **Canvas Icons** - All icons use particle-based canvas rendering
5. **Sharp Geometry** - No rounded corners, clean lines
6. **State-Driven** - Active states, auth states, loading states
7. **Minimal Transitions** - 150ms ease for all interactions
8. **Pointer Events** - Container is `none`, content is `auto`
9. **Z-Index Management** - Both zones at 1000, dropdown at 1001

## Non-Negotiables

1. **User menu in top-right corner** — This position is reserved for user identity across ALL Thoughtform platforms
2. **Format: `[USERNAME]: ACTIVE ▼`** — Consistent display format when authenticated
3. **No user menu in the nav bar** — User controls are always separate from navigation links

---

**Last Updated**: December 2024 (Atlas implementation with two-zone architecture)  
**Platform Status**: Atlas ✅ | Other platforms should adopt this specification

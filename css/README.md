# Modular CSS Structure

This directory contains the modular CSS architecture for iamlrk.github.io and its subdomains.

## Directory Structure

```
css/
├── base/                   # Core foundation
│   ├── variables.css      # CSS custom properties, theme colors
│   ├── reset.css          # Base styles, container, footer
│   └── typography.css     # Font system, text utilities
│
├── components/            # Reusable UI components
│   ├── navigation.css     # Nav, hamburger, mobile menu
│   ├── buttons.css        # Theme toggle, carousel, timeline buttons
│   ├── cards.css          # Project, skill, link, stat cards
│   ├── carousel.css       # Skills carousel
│   └── timeline.css       # Timeline sidebar & content
│
├── layouts/               # Page layout structures
│   ├── hero.css           # Hero section
│   ├── sections.css       # Skills, projects, quick-links sections
│   └── responsive.css     # All media queries (mobile-first)
│
├── pages/                 # Page-specific styles
│   ├── home.css           # Home page (typewriter animation)
│   └── about.css          # About page
│
├── utilities/             # Helpers and animations
│   └── animations.css     # Keyframe animations
│
├── base.css              # 🔵 SHARED BASE (for subdomains)
└── main.css              # 🔵 FULL SITE (main site only)
```

## Usage

### Main Site (iamlrk.github.io)

Import the full site styles:

```html
<link rel="stylesheet" href="/css/main.css">
```

### Subdomains (projects.iamlrk.com, etc.)

Import only the shared base, then add custom styles:

```html
<!-- Shared base from main site (cached by Cloudflare) -->
<link rel="stylesheet" href="https://iamlrk.github.io/css/base.css">

<!-- Subdomain-specific styles -->
<link rel="stylesheet" href="/css/custom.css">
```

## What's Included in base.css

The shared `base.css` includes:

- ✅ CSS Variables & Theme System (light/dark modes)
- ✅ Typography System (fonts, text utilities)
- ✅ Base Reset (body, container, footer)
- ✅ Navigation Components (desktop nav, mobile menu)
- ✅ Button Components (theme toggle, general buttons)
- ✅ Card Components (project cards, skill cards, etc.)

**Total size:** ~400 lines (vs 1892 in original monolithic file)

## Benefits

### 🚀 Performance

- Smaller file sizes
- Better caching (shared `base.css` cached once)
- Cloudflare edge optimization

### 🧹 Maintainability

- Each module is 50-200 lines
- Easy to find and edit specific components
- Clear separation of concerns

### 🎨 Consistency

- All sites share the same design foundation
- Update once, apply everywhere
- Centralized theme system

### 🔧 Flexibility

- Subdomains can override specific styles
- Add custom components without touching base
- Progressive enhancement

## File Size Comparison

| File | Lines | Purpose |
|------|-------|---------|
| **OLD** main.css | 1892 | Everything in one file |
| **NEW** base.css | ~400 | Shared foundation |
| **NEW** main.css | 30 | Import orchestration |
| All modules | ~1900 | Split into logical files |

## Editing Guidelines

### Adding New Styles

1. **Shared styles** (used by multiple sites): Add to appropriate module in `base/` or `components/`
2. **Main site only**: Add to `layouts/`, `pages/`, or create new module
3. **Page-specific**: Add to existing or create new file in `pages/`
4. **Animations**: Add to `utilities/animations.css`

### Mobile Styles

All responsive styles are in `layouts/responsive.css`. Uses mobile-first approach:

- Base styles work on mobile
- Progressive enhancement for larger screens
- Media queries organized by breakpoint

### Updating Shared Base

When editing files imported by `base.css`, changes automatically apply to:

- Main site (iamlrk.github.io)
- All subdomains using the shared base
- Cached copies update on next deployment

## Cloudflare Pages Integration

### Caching Strategy

```
base.css → Cloudflare Edge → 
  ├─ iamlrk.github.io (imports locally)
  └─ projects.iamlrk.com (imports via HTTPS)
```

**Benefits:**

- Fast loading (edge cache)
- Single source of truth
- No duplicate code
- Free bandwidth (same network)

### Deployment

1. Push changes to GitHub
2. Cloudflare Pages auto-deploys
3. Cache invalidation automatic
4. All sites use latest styles

## Troubleshooting

### Styles not updating?

1. **Hard refresh**: Ctrl+Shift+R (or Cmd+Shift+R)
2. **Check imports**: Verify file paths in `@import` statements
3. **Cloudflare cache**: Wait 1-2 minutes for edge propagation

### Import errors?

- All `@import` paths are relative to `css/` directory
- Ensure file exists at correct path
- Check for typos in filenames

### Subdomain styles broken?

- Verify `base.css` URL points to `https://iamlrk.github.io/css/base.css`
- Check CORS (should work, same Cloudflare network)
- Ensure subdomain CSS doesn't override critical base styles

## Best Practices

### DO ✅

- Keep modules focused and single-purpose
- Use CSS variables for colors and sizes
- Add comments explaining complex styles
- Test on mobile and desktop
- Update this README when adding new files

### DON'T ❌

- Don't put everything in one file
- Don't duplicate styles across modules
- Don't use absolute positioning without good reason
- Don't forget mobile-first responsive design
- Don't commit without testing

## Migration Notes

This structure was created from the original 1892-line `main.css` on November 2, 2025. All functionality preserved, now organized into logical modules.

Original file backed up as: (create backup if needed)

---

**Questions?** Contact: <lepakshiramkiran@duck.com>

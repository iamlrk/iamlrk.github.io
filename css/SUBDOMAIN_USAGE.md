# Using Shared CSS in Subdomains

This guide shows how to use the shared `base.css` in your subdomain projects (like `projects-directory`).

## Quick Start

### For projects-directory Subdomain

In your HTML `<head>`:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Projects - Lepakshi Ram Kiran</title>
    
    <!-- 🔵 Shared base styles from main site (cached by Cloudflare) -->
    <link rel="stylesheet" href="https://iamlrk.github.io/css/base.css">
    
    <!-- 🎨 Your custom styles (optional) -->
    <link rel="stylesheet" href="/css/projects.css">
</head>
<body data-theme="light">
    <!-- Your content -->
</body>
</html>
```

## What You Get from base.css

### ✅ Included

- **Theme System**: Light/dark mode with CSS variables
- **Typography**: Complete font system and text utilities
- **Navigation**: Desktop nav + mobile hamburger menu
- **Buttons**: Theme toggle, carousel buttons, etc.
- **Cards**: Project cards, skill cards, link cards
- **Base Layout**: Container, footer, basic resets

### ❌ NOT Included (Main site only)

- Timeline component
- Skills carousel
- Hero section layout
- About page styles
- Page-specific animations

## Custom Styling

Create a `projects.css` (or any name) in your subdomain to add custom styles:

```css
/* projects.css - Custom styles for projects-directory */

/* Override or extend base styles */
.project-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 30px;
    padding: 40px 0;
}

/* Add new components */
.filter-bar {
    background: var(--nav-bg-color);
    border: var(--border-width) solid var(--border-color);
    padding: 20px;
    margin-bottom: 30px;
}

/* Use CSS variables from base.css */
.custom-button {
    background: var(--text-accent);
    color: var(--bg-color);
    border: 3px solid var(--border-color);
    box-shadow: var(--shadow-brutal);
    padding: 8px 16px;
    font-family: 'Courier New', 'JetBrains Mono', monospace;
    font-weight: 900;
    text-transform: uppercase;
}
```

## Available CSS Variables

From `base.css`, you can use these CSS variables:

### Colors (Light Theme)
```css
var(--bg-color)           /* #ffffff */
var(--nav-bg-color)       /* #f8f8f8 */
var(--border-color)       /* #1a1a1a */
var(--text-heading)       /* #1a1a1a */
var(--text-subheading)    /* #2d2d2d */
var(--text-body)          /* #333333 */
var(--text-muted)         /* #666666 */
var(--text-accent)        /* #0066cc (blue) */
var(--text-tag)           /* #4a4a4a */
```

### Colors (Dark Theme)
Automatically applied when `data-theme="dark"` is set on `<body>`:
```css
var(--bg-color)           /* #0d1117 */
var(--text-accent)        /* #58a6ff */
/* ... etc */
```

### Typography
```css
var(--font-heading)       /* 3.2em */
var(--font-subheading)    /* 2em */
var(--font-subtitle)      /* 1.4em */
var(--font-body)          /* 1em */
var(--font-small)         /* 0.875em */
var(--font-tiny)          /* 0.75em */
```

### Brutalist Style
```css
var(--shadow-brutal)       /* 6px 6px 0px #1a1a1a */
var(--shadow-brutal-hover) /* 8px 8px 0px #1a1a1a */
var(--border-width)        /* 4px */
```

## Theme Toggle Script

Add this JavaScript to enable theme switching:

```html
<script>
// Theme toggle functionality
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Check for saved theme or default to light
const currentTheme = localStorage.getItem('theme') || 'light';
body.setAttribute('data-theme', currentTheme);
updateToggleButton(currentTheme);

themeToggle?.addEventListener('click', () => {
    const current = body.getAttribute('data-theme');
    const newTheme = current === 'light' ? 'dark' : 'light';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateToggleButton(newTheme);
});

function updateToggleButton(theme) {
    if (themeToggle) {
        themeToggle.textContent = theme === 'light' ? 'Dark' : 'Light';
    }
}
</script>
```

## Complete Example

Here's a complete example HTML file for a subdomain:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Projects - Lepakshi Ram Kiran</title>
    
    <!-- Shared base from main site -->
    <link rel="stylesheet" href="https://iamlrk.github.io/css/base.css">
    
    <!-- Custom styles -->
    <style>
        .project-showcase {
            margin-top: 80px;
        }
        
        .projects-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
            padding: 40px 0;
        }
    </style>
</head>
<body data-theme="light">
    <!-- Navigation (styled by base.css) -->
    <nav>
        <ul>
            <li><a href="https://iamlrk.github.io">Home</a></li>
            <li><a href="https://iamlrk.github.io/about">About</a></li>
            <li><a href="/">Projects</a></li>
        </ul>
    </nav>
    
    <!-- Theme toggle button (styled by base.css) -->
    <button id="theme-toggle">Dark</button>
    
    <!-- Content -->
    <div class="container project-showcase">
        <h1>My Projects</h1>
        
        <div class="projects-grid">
            <!-- Project cards (styled by base.css) -->
            <div class="project-card">
                <div class="project-header">
                    <h3>Project Name</h3>
                    <div class="project-links">
                        <a href="#" class="project-link">GitHub</a>
                        <a href="#" class="project-link">Demo</a>
                    </div>
                </div>
                <p class="project-description">
                    Your project description here...
                </p>
                <div class="project-tech">
                    <span class="tech-tag">Python</span>
                    <span class="tech-tag">FastAPI</span>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Footer (styled by base.css) -->
    <footer>
        <ul>
            <li><a href="mailto:lepakshiramkiran@duck.com">Email</a></li>
            <li><a href="https://github.com/iamlrk">GitHub</a></li>
        </ul>
    </footer>
    
    <!-- Theme toggle script -->
    <script>
        const themeToggle = document.getElementById('theme-toggle');
        const body = document.body;
        
        const currentTheme = localStorage.getItem('theme') || 'light';
        body.setAttribute('data-theme', currentTheme);
        themeToggle.textContent = currentTheme === 'light' ? 'Dark' : 'Light';
        
        themeToggle.addEventListener('click', () => {
            const current = body.getAttribute('data-theme');
            const newTheme = current === 'light' ? 'dark' : 'light';
            body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            themeToggle.textContent = newTheme === 'light' ? 'Dark' : 'Light';
        });
    </script>
</body>
</html>
```

## Benefits

### 🚀 Performance
- **Fast Loading**: Cached at Cloudflare edge
- **Shared Cache**: One `base.css` file cached for all your sites
- **Small Size**: Only ~400 lines vs 1892 in monolithic file

### 🎨 Consistency
- **Same Look**: Automatic design consistency
- **Theme Sync**: Light/dark mode works the same way
- **Easy Updates**: Update once, applies everywhere

### 🔧 Flexibility
- **Override Anything**: Your custom CSS takes precedence
- **Extend Components**: Build on top of base styles
- **Add New Styles**: No conflicts with base

## Troubleshooting

### Styles Not Loading?

**Check the URL:**
```html
<!-- ✅ Correct -->
<link rel="stylesheet" href="https://iamlrk.github.io/css/base.css">

<!-- ❌ Wrong -->
<link rel="stylesheet" href="http://iamlrk.github.io/css/base.css">  <!-- Missing 's' -->
<link rel="stylesheet" href="/css/base.css">  <!-- Wrong path -->
```

**Clear Cache:**
- Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
- Wait 1-2 minutes for Cloudflare edge cache to update

### Theme Not Working?

Make sure you have:
1. `data-theme="light"` attribute on `<body>`
2. Theme toggle script included
3. Button with `id="theme-toggle"`

### Cards Look Different?

The base styles include card components, but you may need to match the HTML structure:

```html
<!-- Project card structure from base.css -->
<div class="project-card">
    <div class="project-header">
        <h3>Title</h3>
        <div class="project-links">
            <a href="#" class="project-link">Link</a>
        </div>
    </div>
    <p class="project-description">Description</p>
    <div class="project-tech">
        <span class="tech-tag">Tag</span>
    </div>
</div>
```

## Questions?

Contact: lepakshiramkiran@duck.com
Main Site: https://iamlrk.github.io


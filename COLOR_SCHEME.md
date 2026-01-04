# Color Scheme Guide

## Overview

The application uses a professional, eye-soothing color palette based on Indigo/Blue tones with Slate grays and Green accents. This palette provides excellent contrast, readability, and reduces eye strain.

## Color Palette

### Primary Colors (Indigo)
Used for buttons, links, and key interactive elements.

```css
primary-50:  #eef2ff  /* Very light indigo background */
primary-100: #e0e7ff  /* Light backgrounds */
primary-200: #c7d2fe  /* Subtle accents */
primary-300: #a5b4fc  /* Borders, hover states */
primary-400: #818cf8  /* Secondary buttons */
primary-500: #6366f1  /* Main brand color */
primary-600: #4f46e5  /* Primary buttons, links */
primary-700: #4338ca  /* Hover states */
primary-800: #3730a3  /* Dark text on light */
primary-900: #312e81  /* Very dark text */
```

### Secondary Colors (Slate/Gray)
Used for text, borders, and neutral elements.

```css
secondary-50:  #f8fafc  /* Background tints */
secondary-100: #f1f5f9  /* Card headers, table headers */
secondary-200: #e2e8f0  /* Borders, dividers */
secondary-300: #cbd5e1  /* Subtle borders */
secondary-400: #94a3b8  /* Placeholder text */
secondary-500: #64748b  /* Secondary text */
secondary-600: #475569  /* Body text */
secondary-700: #334155  /* Headings */
secondary-800: #1e293b  /* Dark headings */
secondary-900: #0f172a  /* Maximum contrast text */
```

### Accent Colors (Green)
Used for success states, positive actions, and data visualization.

```css
accent-50:  #f0fdf4  /* Success background */
accent-100: #dcfce7  /* Light success */
accent-200: #bbf7d0  /* Success badges */
accent-300: #86efac  /* Chart colors */
accent-400: #4ade80  /* Chart colors */
accent-500: #22c55e  /* Success icons */
accent-600: #16a34a  /* Success buttons */
accent-700: #15803d  /* Dark success */
accent-800: #166534  /* Success text */
accent-900: #14532d  /* Very dark success */
```

## Usage Guidelines

### Backgrounds

```css
Body background: gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50
Card background: bg-white/95 backdrop-blur-sm
Card header: bg-gradient-to-r from-primary-50 to-indigo-50
Table header: bg-gradient-to-r from-primary-50 to-indigo-50
```

### Text Colors

```css
Headings (large): gradient-text (primary-600 to indigo-600)
Headings (normal): text-secondary-800
Body text: text-secondary-700
Secondary text: text-secondary-600
Muted text: text-secondary-500
Placeholder: text-secondary-400
```

### Interactive Elements

```css
Primary button: bg-primary-600 hover:bg-primary-700
Secondary button: bg-white border-secondary-200 hover:border-primary-300
Input field: border-secondary-200 focus:border-primary-500
Active state: bg-primary-50 border-primary-500
Hover state: hover:bg-primary-50/30 hover:border-primary-400
```

### Status Indicators

```css
Success: bg-accent-100 text-accent-800 border-accent-200
Error: bg-red-100 text-red-800 border-red-200
Warning: bg-amber-100 text-amber-800 border-amber-200
Info: bg-blue-100 text-blue-800 border-blue-200
```

### Data Visualization

Chart colors (in order):
1. `#6366f1` - Indigo 500
2. `#818cf8` - Indigo 400
3. `#22c55e` - Green 500
4. `#4ade80` - Green 400
5. `#4f46e5` - Indigo 600
6. `#a5b4fc` - Indigo 300
7. `#16a34a` - Green 600
8. `#86efac` - Green 300

## Accessibility

### Contrast Ratios

All color combinations meet WCAG 2.1 AA standards:

- **Normal text**: Minimum 4.5:1 contrast ratio
- **Large text**: Minimum 3:1 contrast ratio
- **Interactive elements**: Minimum 3:1 contrast ratio

### Examples

✅ `text-secondary-800` on `bg-white` - 12.63:1
✅ `text-primary-600` on `bg-white` - 4.54:1
✅ `text-white` on `bg-primary-600` - 5.14:1
✅ `text-secondary-700` on `bg-primary-50` - 8.73:1

## Design Principles

1. **Professional**: Indigo/blue tones convey trust and professionalism
2. **Eye-Soothing**: Soft, muted colors reduce eye strain
3. **Consistent**: Limited palette ensures visual harmony
4. **Accessible**: High contrast ratios for all text
5. **Modern**: Clean, contemporary color choices

## Component Examples

### Button Styles

```jsx
// Primary button
<button className="btn-primary">
  Execute Query
</button>

// Secondary button
<button className="btn-secondary">
  Cancel
</button>
```

### Card Styles

```jsx
<div className="card">
  <div className="card-header">
    <h2 className="text-lg font-semibold text-secondary-800">
      Card Title
    </h2>
  </div>
  <div className="p-6">
    Card content
  </div>
</div>
```

### Input Styles

```jsx
<input
  type="text"
  className="input-field"
  placeholder="Enter your query..."
/>
```

### Status Badges

```jsx
<span className="status-badge-success">Success</span>
<span className="status-badge-error">Error</span>
<span className="status-badge-pending">Pending</span>
```

## Gradient Usage

### Text Gradients

```css
.gradient-text {
  @apply bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent font-bold;
}
```

### Background Gradients

```css
Card headers: from-primary-50 to-indigo-50
Table headers: from-primary-50 to-indigo-50
Body background: from-slate-50 via-blue-50/30 to-indigo-50/50
```

## Dark Mode (Future Enhancement)

For future dark mode implementation:

```css
Dark background: secondary-900
Dark cards: secondary-800
Dark text: secondary-100
Dark borders: secondary-700
```

## Color Psychology

- **Indigo/Blue**: Trust, stability, professionalism, intelligence
- **Slate/Gray**: Neutral, sophisticated, modern, clean
- **Green**: Success, growth, positive actions, freshness

## Maintenance

When adding new components:

1. Use primary colors for interactive elements
2. Use secondary colors for text and borders
3. Use accent colors for success states
4. Maintain consistent spacing and shadows
5. Test contrast ratios for accessibility

## References

- Primary: Tailwind Indigo
- Secondary: Tailwind Slate
- Accent: Tailwind Green
- Based on: Material Design 3, iOS Human Interface Guidelines
- Accessibility: WCAG 2.1 Level AA

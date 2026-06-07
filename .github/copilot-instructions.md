# Bucks2Bar — Project Guidelines

## Project Overview
**Bucks2Bar** is a client-side monthly income & expense tracker that visualises data as a bar chart.
- Stack: Vanilla HTML5 + CSS3 + JavaScript (ES6+)
- UI library: Bootstrap 5.3.3 (via jsDelivr CDN)
- Chart library: Chart.js 4.4.4 (via jsDelivr CDN)
- Currency: INR (Indian Rupee ₹)
- No build tools, no npm, no bundler — everything runs directly in the browser.

## File Structure
```
index.html   — All markup + inline <style> block
script.js    — All application logic
```
Do **not** introduce a separate `.css` file or any additional `.js` files unless explicitly asked.
All styles live in the `<style>` block inside `index.html`.

## Dependencies
Always load dependencies from jsDelivr CDN. Do not add npm packages or local copies.
```html
<!-- Bootstrap 5 CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" />

<!-- Bootstrap 5 JS bundle -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

<!-- Chart.js 4 -->
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.4/dist/chart.umd.min.js"></script>
```

## JavaScript Conventions

### Section Comments
Use the `── Description ──` style separator comments to mark logical sections:
```js
// ── Section name ─────────────────────────────
```

### INR Formatting
Always use the shared `inrFmt` formatter — never hardcode ₹ symbols in JS:
```js
const inrFmt = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0
});
```

### DOM Initialisation
All DOM wiring goes inside a single `DOMContentLoaded` listener at the bottom of `script.js`.

### Chart.js Pattern
Maintain a single chart instance (`let budgetChart = null`). On subsequent renders, update the existing instance in-place (`budgetChart.update()`) rather than destroying and recreating it.

### Bootstrap Color Tokens in Chart.js
Match Bootstrap semantic colors exactly when using Chart.js dataset colors:
- Success / income green: `rgba(25, 135, 84, 0.75)` / `rgba(25, 135, 84, 1)`
- Danger / expense red:   `rgba(220, 53, 69, 0.75)`  / `rgba(220, 53, 69, 1)`

## HTML / CSS Conventions

### UI Elements
All buttons must be pink in color. 

### Numeric Inputs
All `<input type="number">` elements must:
1. Be right-aligned (`text-align: right`)
2. Have spinner arrows hidden (both `-webkit` and `-moz` variants)
3. Be wrapped in a Bootstrap `input-group` with a `₹` prefix span

### Net Value Colour Classes
Use these CSS utility classes for dynamic colouring — never inline styles:
```css
.net-positive { color: #198754; font-weight: 600; }  /* income > expense */
.net-negative { color: #dc3545; font-weight: 600; }  /* income < expense */
.net-zero     { color: #6c757d; font-weight: 600; }  /* income = expense */
```

### Accessibility
- Every `<input>` must have an `aria-label` describing its purpose (e.g., `"Jan income"`).
- Tab UI must include `role`, `aria-controls`, and `aria-selected` attributes on tab buttons.

### App Header
The gradient header uses these exact brand colours — keep them consistent:
```css
background: linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%);
```

## Currency & Locale
- Currency: INR only. Do not add multi-currency support unless asked.
- Locale: `en-IN` for number formatting.
- Fiscal year label: "FY 2026" (update year only when explicitly asked).

## What to Avoid
- Do not add a backend, server, or API calls.
- Do not add `localStorage` or any persistence layer unless asked.
- Do not introduce TypeScript, React, Vue, or any JS framework.
- Do not add a build step (Webpack, Vite, Parcel, etc.).
- Do not duplicate Bootstrap utility classes with custom CSS when a Bootstrap class already exists.

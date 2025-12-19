# Accessibility Features

## Overview
Fritz's Forge implements WCAG 2.1 Level AA accessibility standards to ensure the site is usable by everyone.

## Implemented Features

### Keyboard Navigation
- **Tab Navigation**: All interactive elements accessible via Tab key
- **Search Shortcut**: `Cmd/Ctrl + K` to focus search bar
- **Escape Key**: Close modals and clear search with Escape

### ARIA Labels
- **Cart Button**: Announces cart item count to screen readers
- **Quantity Controls**: Labeled increase/decrease buttons
- **Images**: Alt text for all product images
- **Video Content**: Marked as `aria-hidden` for decorative videos

### Focus Management
- **Visible Focus States**: High-contrast focus rings on all interactive elements
- **Logical Focus Order**: Follows natural reading flow
- **Focus Trapping**: Modal dialogs trap focus within

### Color Contrast
- **Text Contrast**: All text meets WCAG AA standards (4.5:1 minimum)
- **Interactive Elements**: Buttons and links have sufficient contrast
- **Error States**: Color-blind friendly error indicators

### Semantic HTML
- **Proper Heading Hierarchy**: H1 → H2 → H3 in correct order
- **Landmark Regions**: `<main>`, `<nav>`, `<aside>` used appropriately
- **Button vs Link**: Proper distinction between actions and navigation

## Testing

### Keyboard-Only Test
```bash
# Test with keyboard only (no mouse)
# 1. Tab through all interactive elements
# 2. Activate buttons with Enter/Space
# 3. Navigate forms with Tab/Shift+Tab
# 4. Close modals with Escape
```

### Screen Reader Test
```bash
# macOS VoiceOver
Cmd + F5  # Toggle VoiceOver
VO + A    # Start reading

# Windows NVDA (download from nvaccess.org)
Ctrl + Alt + N  # Start NVDA
```

### Automated Testing
```bash
# Install axe DevTools Chrome extension
# Or use Lighthouse accessibility audit
npm run build
npm start
# Open Chrome DevTools → Lighthouse → Run audit
```

## Future Enhancements

### Planned Improvements
- [ ] Skip to main content link
- [ ] Live region announcements for cart updates
- [ ] High contrast theme toggle
- [ ] Text size adjustment controls
- [ ] Reduced motion preferences respect

### ARIA Live Regions
```tsx
// Example: Cart update announcement
<div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
  {cartItemCount} items in cart
</div>
```

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [React Accessibility](https://react.dev/learn/accessibility)

## Keyboard Shortcuts

| Shortcut      | Action                       |
| ------------- | ---------------------------- |
| `⌘/Ctrl + K`  | Focus search bar             |
| `Esc`         | Clear search / Close modal   |
| `Tab`         | Next interactive element     |
| `Shift + Tab` | Previous interactive element |
| `Enter`       | Activate button/link         |
| `Space`       | Activate button              |

## Color Palette Accessibility

All color combinations in the design system meet WCAG AA standards:

| Foreground        | Background           | Contrast Ratio | Pass  |
| ----------------- | -------------------- | -------------- | ----- |
| Text (#FFFFFF)    | Background (#0F0F10) | 19.4:1         | ✅ AAA |
| Muted (#A1A1AA)   | Background (#0F0F10) | 7.8:1          | ✅ AA  |
| Primary (#E8E5DB) | Background (#0F0F10) | 13.1:1         | ✅ AAA |

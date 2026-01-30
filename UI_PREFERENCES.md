# UI Design Preferences

## 🎨 Color Scheme

### Primary Colors
- **Primary**: `#11998e` (teal)
- **Secondary**: `#38ef7d` (bright green)
- **Primary Gradient**: `linear-gradient(135deg, #11998e 0%, #38ef7d 100%)`
- **Background**: `#000000` (complete black)

### Status Colors
- **Success/Income**: `#38ef7d` (bright green)
- **Error/Expense**: `#ef4444` (red)
- **Warning**: `#fbbf24` (yellow)
- **Info**: `#11998e` (teal)

### Neutrals
- **White**: `#ffffff`
- **Gray**: `#9b9b9b`
- **Light**: `rgba(255, 255, 255, 0.87)`
- **Medium**: `rgba(255, 255, 255, 0.5)`
- **Dark**: `#000000`

### Backgrounds
- **Main Background**: `#000000` (complete black)
- **Card Background**: `linear-gradient(135deg, rgba(17, 153, 142, 0.1), rgba(56, 239, 125, 0.05))`
- **Overlay**: `rgba(17, 153, 142, 0.1)` with `backdrop-filter: blur(10px)`
- **Border**: `rgba(17, 153, 142, 0.2)`

## 📝 Typography

### Font Family
- **Primary**: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif`
- **Monospace**: For code or numbers if needed

### Font Sizes
- **Headings**:
  - H1: `2.5rem` (40px)
  - H2: `1.5rem` (24px)
  - H3: `1.1rem` (18px)
- **Body**: `1rem` (16px)
- **Small**: `0.9rem` (14px)
- **Tiny**: `0.85rem` (13px)

### Font Weights
- **Regular**: `400`
- **Medium**: `500`
- **Semibold**: `600`
- **Bold**: `700`

## 📏 Spacing

### Base Unit
- **Base**: `1rem` (16px)
- **Use 8px increments**: 0.5rem, 1rem, 1.5rem, 2rem, 3rem

### Common Spacings
- **Extra Small**: `0.25rem` (4px)
- **Small**: `0.5rem` (8px)
- **Medium**: `1rem` (16px)
- **Large**: `1.5rem` (24px)
- **Extra Large**: `2rem` (32px)
- **Huge**: `3rem` (48px)

### Component Padding
- **Cards**: `1.5rem - 2rem`
- **Buttons**: `0.65rem 1.5rem`
- **Input Fields**: `0.75rem`
- **Containers**: `2rem` (1rem on mobile)

### Gaps
- **Form Fields**: `1.25rem`
- **List Items**: `1rem`
- **Grid**: `1.5rem`
- **Flex**: `1rem`

## 🎭 Component Styling

### Buttons
- **Style**: Rounded with gradient or solid
- **Border Radius**: `8px`
- **Padding**: `0.65rem 1.5rem` (medium), `1rem 2rem` (large)
- **Font Weight**: `600` (semibold)
- **Transition**: `all 0.3s ease`
- **Hover Effect**: `translateY(-2px)` with shadow

### Cards
- **Border Radius**: `12px - 16px`
- **Background**: Glass morphism effect
- **Border**: `1px solid rgba(255, 255, 255, 0.1)`
- **Padding**: `1.5rem - 2rem`
- **Shadow**: `0 8px 24px rgba(0, 0, 0, 0.15)` on hover
- **Hover Transform**: `translateY(-4px)`

### Forms
- **Input Border Radius**: `8px`
- **Input Border**: `2px solid rgba(255, 255, 255, 0.2)`
- **Focus Border**: `#667eea`
- **Input Padding**: `0.75rem`
- **Background**: `rgba(255, 255, 255, 0.05)`
- **Label Font Size**: `0.9rem`
- **Label Font Weight**: `600`

### Icons
- **Size**: `2rem - 2.5rem` for feature icons
- **Background**: `rgba(255, 255, 255, 0.1)` rounded container
- **Container Size**: `50px - 60px`
- **Border Radius**: `10px - 12px`

## 🎬 Animations & Transitions

### Timing
- **Fast**: `0.2s`
- **Medium**: `0.3s` (default)
- **Slow**: `0.5s`

### Easing
- **Default**: `ease`
- **Smooth**: `ease-in-out`
- **Bounce**: `cubic-bezier(0.68, -0.55, 0.265, 1.55)`

### Common Transitions
- **Hover**: `all 0.3s ease`
- **Transform**: `transform 0.3s ease`
- **Color**: `color 0.3s ease`
- **Border**: `border-color 0.3s ease`

### Effects
- **Hover Lift**: `transform: translateY(-2px) or translateY(-4px)`
- **Hover Shadow**: `box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15)`
- **Loading Spinner**: `animation: spin 1s linear infinite`

## 📱 Responsive Design

### Breakpoints
- **Mobile**: `< 768px`
- **Tablet**: `768px - 1024px`
- **Desktop**: `> 1024px`

### Mobile Adjustments
- Reduce padding by 25-50%
- Stack grid layouts (grid-template-columns: 1fr)
- Hide non-essential text
- Larger touch targets (min 44px)
- Reduce font sizes slightly
- Full-width buttons

### Max Widths
- **Container**: `1200px`
- **Form**: `600px`
- **Input**: `400px`

## 🖼️ Layout Patterns

### Container
- **Max Width**: `1200px`
- **Margin**: `0 auto`
- **Padding**: `2rem` (1rem on mobile)

### Grid
- **Columns**: `repeat(auto-fit, minmax(250px, 1fr))`
- **Gap**: `1.5rem`

### Flexbox
- **Common**: `display: flex; align-items: center; gap: 1rem`
- **Column**: `flex-direction: column`
- **Center**: `justify-content: center; align-items: center`

### Cards List
- **Display**: `flex-direction: column`
- **Gap**: `1rem`

## 🎨 Visual Effects

### Glass Morphism
```css
background: linear-gradient(135deg, rgba(17, 153, 142, 0.1), rgba(56, 239, 125, 0.05));
backdrop-filter: blur(10px);
border: 1px solid rgba(17, 153, 142, 0.2);
```

### Gradient Text
```css
background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;
```

### Shadow Hierarchy
- **Subtle**: `0 2px 8px rgba(0, 0, 0, 0.1)`
- **Medium**: `0 4px 12px rgba(0, 0, 0, 0.15)`
- **Strong**: `0 8px 24px rgba(0, 0, 0, 0.2)`

## 🎯 Accessibility

### Contrast
- Text on dark background: Use white/light colors
- Minimum contrast ratio: 4.5:1 for normal text
- Focus indicators: Always visible

### Interactive Elements
- **Minimum Size**: `44px x 44px` (touch targets)
- **Focus Outline**: Use browser default or custom ring
- **Hover States**: Always provide visual feedback

### Loading States
- Always show loading spinners
- Disable buttons during loading
- Show skeleton screens for lists

### Error States
- Red color: `#ef4444`
- Clear error messages
- Show inline with form fields

## 🎪 Component-Specific Styles

### Header
- **Height**: Auto
- **Position**: `sticky` at top
- **Z-Index**: `100`
- **Background**: Primary gradient (#11998e to #38ef7d)
- **Shadow**: `0 4px 6px rgba(0, 0, 0, 0.3)`

### Stats Cards
- **Grid**: 3 columns (auto-fit)
- **Min Width**: `250px`
- **Icon Size**: `2.5rem`
- **Value Size**: `1.8rem`

### Transaction Items
- **Layout**: Flex row (column on mobile)
- **Icon Size**: `2rem` in `50px` container
- **Hover**: Slight translate right `translateX(4px)`
- **Background**: `rgba(255, 255, 255, 0.05)`

### Forms
- **Layout**: Vertical with groups
- **Field Groups**: 2 columns (1 on mobile)
- **Submit Button**: Full width on mobile
- **Error Messages**: Red background with light text

## 🌟 Special Notes

### Dark Mode
- App uses complete black (#000000) background
- Use white/light text on black backgrounds
- Primary color: #11998e (teal)
- Secondary color: #38ef7d (bright green)
- Use gradient (teal to green) for accents and highlights

### Consistency
- Use the same border radius throughout (8px, 12px, 16px, 24px)
- Use the same transition timing (0.3s ease)
- Use the same gradient directions (135deg)
- Use the same gap spacing (1rem, 1.5rem)
- Use teal (#11998e) to green (#38ef7d) gradient for primary elements

### Performance
- Use `transform` for animations (GPU accelerated)
- Avoid animating `width`, `height`, `top`, `left`
- Use `will-change` sparingly
- Optimize images and assets

### Browser Support
- Modern browsers only
- Use `backdrop-filter` (no fallback needed)
- Use CSS Grid and Flexbox
- Use CSS custom properties if needed

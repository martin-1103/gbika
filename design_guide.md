# GBI Website Design Guide untuk AI Worker

## 🎯 Design Principles
- **Spiritual & Peaceful:** Warna soft, spacing generous, atmosfer tenang
- **Family-Friendly:** Content appropriate untuk semua usia
- **Mobile-First:** 80% user menggunakan smartphone
- **Accessible:** Support untuk seniors dan visual impairments

---

## 🌅 Light Mode Specifications

### Colors
**Primary Palette:**
- Background: `#FEFEFE` (soft white)
- Surface: `#FFFFFF` (pure white untuk cards)
- Secondary Background: `#F9FAFB` (subtle gray)

**Brand Colors:**
- Primary: `#2563EB` (royal blue - wisdom)
- Secondary: `#059669` (emerald green - growth) 
- Accent: `#DC2626` (warm red - love)
- Warning: `#D97706` (amber orange)

**Text Colors:**
- Primary Text: `#1F2937` (dark gray)
- Secondary Text: `#6B7280` (medium gray)
- Muted Text: `#9CA3AF` (light gray)

**Borders:**
- Light: `#E5E7EB`
- Medium: `#D1D5DB`
- Strong: `#9CA3AF`

---

## 🌙 Dark Mode Specifications

### Colors
**Primary Palette:**
- Background: `#0F172A` (dark slate, bukan pure black)
- Surface: `#1E293B` (untuk cards)
- Elevated: `#334155` (untuk modals)

**Brand Colors:**
- Primary: `#3B82F6` (lighter blue untuk visibility)
- Secondary: `#10B981` (lighter emerald)
- Accent: `#EF4444` (softer red)
- Warning: `#F59E0B` (bright amber)

**Text Colors:**
- Primary Text: `#F8FAFC` (off-white)
- Secondary Text: `#CBD5E1` (light slate)
- Muted Text: `#94A3B8` (medium slate)

**Borders:**
- Light: `#334155`
- Medium: `#475569`
- Strong: `#64748B`

---

## 📝 Typography

### Font System
- **Font Family:** Inter (fallback: system fonts)
- **Base Size:** 16px
- **Line Height:** 1.6 untuk body text
- **Minimum Size:** 16px (18px untuk seniors)

### Heading Scale
- **H1:** 48px (36px mobile) - Bold
- **H2:** 32px (28px mobile) - SemiBold
- **H3:** 24px - SemiBold
- **H4:** 20px - SemiBold
- **Large Text:** 18px - Medium
- **Body:** 16px - Regular
- **Small:** 14px - Medium

---

## 🧩 Component Guidelines

### Buttons
**Sizing:**
- Height: 44px minimum (48px untuk seniors)
- Padding: 12px 24px
- Border Radius: 8px
- Font Weight: 500

**States:**
- Default: Brand colors dengan subtle shadow
- Hover: Darker shade + lift effect
- Focus: 2px outline dengan brand color
- Disabled: 50% opacity

### Cards
**Structure:**
- Border Radius: 12px
- Padding: 24px
- Border: 1px solid border-light
- Box Shadow: Subtle untuk light, enhanced untuk dark

**Hover Effects:**
- Desktop: Lift 2px + enhanced shadow
- Mobile: Haptic feedback priority

### Forms
**Input Fields:**
- Border Radius: 8px
- Padding: 12px 16px
- Focus: Brand color border + subtle glow
- Error State: Red border + error message

---

## 📱 Responsive Guidelines

### Breakpoints
- **Mobile:** < 768px (primary focus)
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px

### Mobile Optimizations
- Touch targets minimum 44px
- Single column layouts
- Simplified navigation
- Larger text untuk readability

### Desktop Enhancements
- Hover states
- Multi-column layouts
- Enhanced shadows dan effects
- Keyboard navigation support

---

## ♿ Accessibility Requirements

### Contrast
- **Minimum:** 4.5:1 untuk normal text
- **Large Text:** 3:1 minimum
- **UI Components:** 3:1 minimum

### Interactive Elements
- Clear focus indicators
- Keyboard navigation support
- Touch targets minimum 44px
- Screen reader friendly markup

### Dark Mode Considerations
- No pure black backgrounds
- Enhanced shadows untuk depth
- Adjusted contrast ratios
- Testing pada actual devices

---

## 🎨 Visual Hierarchy

### Elevation System
**Light Mode:**
- Level 0: Background color
- Level 1: Cards dengan subtle shadow
- Level 2: Modals dengan medium shadow
- Level 3: Tooltips dengan large shadow

**Dark Mode:**
- Level 0: Primary background
- Level 1: Secondary background
- Level 2: Elevated background
- Level 3: Maximum elevation

### Spacing Scale
- **XS:** 4px
- **SM:** 8px
- **MD:** 16px
- **LG:** 24px
- **XL:** 32px
- **2XL:** 48px
- **3XL:** 64px

---

## ⚡ Performance Guidelines

### Loading Priorities
1. Critical CSS (above-the-fold)
2. Font loading dengan fallbacks
3. Theme detection dan application
4. Progressive enhancement

### Optimization
- CSS custom properties untuk theme switching
- Minimal JavaScript untuk core functionality
- Optimize untuk mid-range smartphones
- Lazy loading untuk non-critical images

---

## 🚨 Critical Implementation Rules

### Must Do
- Always provide both light dan dark mode
- Respect system preferences sebagai default
- Manual override option
- Smooth theme transitions (300ms)
- Test accessibility dengan actual users

### Must Avoid
- Pure black (#000000) backgrounds
- Forced theme tanpa user choice
- Ignoring mobile-first approach
- Low contrast ratios
- Complex navigation untuk seniors

### Cultural Sensitivity
- Colors yang appropriate untuk religious context
- Family-safe content dan imagery
- Respectful tone dalam copy
- Indonesian cultural considerations

---

## 📊 Success Metrics untuk AI

### Usability Targets
- **Bounce Rate:** < 40% (mobile)
- **Load Time:** < 3 seconds
- **Accessibility Score:** AA compliance
- **Theme Adoption:** 50%+ dark mode usage

### User Satisfaction
- Easy navigation untuk all age groups
- Comfortable reading experience
- Spiritual atmosphere maintained
- Mobile-optimized interactions
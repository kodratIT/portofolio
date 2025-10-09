# 🎨 Bento Grid Hero - Modern Portfolio Layout

## Overview
Ultra-modern hero section dengan **Bento Grid Layout** - trendy design dengan cards interaktif dalam berbagai ukuran.

---

## 🎯 Bento Grid Layout

```
┌─────────────┬─────┬─────┐
│             │ YRS │ PRJ │  ← Stats cards
│   LARGE     ├─────┼─────┤
│   PHOTO     │ TCH │ CTA │  ← Tech + View Work
│   CARD      ├─────┴─────┤
│   2x3       │    BIO    │  ← About + Social
│             │   TEXT    │
├─────────────┴───────────┤
│   CONTACT CTA BANNER    │  ← Full-width CTA
└─────────────────────────┘
```

**7 Interactive Cards:**
1. 🖼️ Large Photo Card (2x3) - Main profile photo
2. 📅 Years Experience (1x1) - Animated counter
3. ✨ Projects Done (1x1) - Animated counter
4. 💻 Technologies (1x1) - Animated counter
5. 🎯 View Work CTA (1x1) - Link to projects
6. 📝 Bio & Social (2x2) - About text + social links
7. 📧 Contact Banner (2x1) - Full-width CTA

---

## ✨ Features

### 1. **Responsive Bento Grid**
Auto-adjusting grid yang perfect di semua screen sizes:

```tsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[minmax(120px,auto)]"
```

**Breakpoints:**
- Mobile: 1 column (stacked)
- Tablet: 2 columns
- Desktop: 4 columns bento layout

---

### 2. **Card 1: Large Photo Card (Hero)** 🖼️
**Size:** 2 columns × 3 rows (largest card)

**Features:**
- ✅ Full-screen photo with gradient overlay
- ✅ Hover zoom effect (scale 110%)
- ✅ Shine animation on hover
- ✅ Content overlay at bottom:
  - Available badge (green pulse)
  - Name (huge typography)
  - Position with icon
  - Location

**Hover Effects:**
```tsx
group-hover:scale-110  // Photo zoom
group-hover:opacity-95 // Overlay darkens
Shine effect sweeps across
```

---

### 3. **Card 2-4: Stats Cards** 📊
**Size:** 1 column × 1 row each

**Features:**
- ✅ Animated counters (count from 0)
- ✅ Icon in rounded box
- ✅ Hover scale effect on icon
- ✅ Gradient background on hover

**Stats Displayed:**
- 📅 **Years Experience** - Calendar icon
- ✨ **Projects Done** - Sparkles icon
- 💻 **Technologies** - Code2 icon

**Counter Animation:**
```tsx
<AnimatedCounter end={50} duration={2} />
// Smooth count from 0 to target in 2 seconds
```

---

### 4. **Card 5: View Work CTA** 🎯
**Size:** 1 column × 1 row

**Features:**
- ✅ Primary color background
- ✅ "View Work" text
- ✅ Arrow icon with hover translate
- ✅ Links to #projects section

**Hover Effects:**
```tsx
text scale: 1.1
arrow translateX: 2px
```

---

### 5. **Card 6: Bio & Social Links** 📝
**Size:** 2 columns × 2 rows

**Features:**
- ✅ Award icon + "About Me" heading
- ✅ Bio text (large, readable)
- ✅ Social link buttons:
  - GitHub
  - LinkedIn  
  - Email
- ✅ Each button has hover lift effect

**Social Buttons:**
```tsx
whileHover={{ scale: 1.05, y: -2 }}
whileTap={{ scale: 0.95 }}
```

---

### 6. **Card 7: Contact CTA Banner** 📧
**Size:** 2 columns × 1 row (full width bottom)

**Features:**
- ✅ Gradient primary background
- ✅ "Let's Work Together" heading
- ✅ Two CTA buttons:
  - Contact Me (secondary)
  - Download CV (outline)
- ✅ Hover shadow effect

**Button Features:**
```tsx
Mail icon rotates on hover
Shadow glow on card hover
```

---

## 🎨 Visual Effects

### Global Effects:
```tsx
1. Grid background pattern
2. Gradient orbs (top-left + bottom-right)
3. Pulse animations on orbs
4. Card stagger entry animation
```

### Per-Card Effects:
```tsx
✅ Scale up on hover (1.02)
✅ Lift up on hover (-4px)
✅ Gradient overlay on hover
✅ Border color change (border → primary)
✅ Smooth transitions (400ms)
```

### Animation Timeline:
```
0.1s - Photo card appears
0.2s - Years card appears
0.25s - Projects card appears
0.3s - Tech card appears
0.35s - CTA card appears
0.4s - Bio card appears
0.45s - Contact banner appears
```

---

## 🎯 Layout Strategy

### Desktop (lg):
```
┌─────────────┬─────┬─────┐  4 columns
│   Photo     │ Yr  │ Prj │
│   2 wide    ├─────┼─────┤
│   3 tall    │ Tch │ CTA │
│             ├─────┴─────┤
│             │    Bio    │
│             │   2 wide  │
├─────────────┴───────────┤
│      Contact CTA        │
└─────────────────────────┘
```

### Tablet (md):
```
┌─────┬─────┐  2 columns
│Photo│ Yr  │
│     ├─────┤
│     │ Prj │
│     ├─────┤
│     │ Tch │
├─────┼─────┤
│ CTA │ Bio │
├─────┴─────┤
│  Contact  │
└───────────┘
```

### Mobile:
```
┌───────────┐  1 column (stacked)
│   Photo   │
├───────────┤
│   Years   │
├───────────┤
│ Projects  │
├───────────┤
│   Tech    │
├───────────┤
│    CTA    │
├───────────┤
│    Bio    │
├───────────┤
│  Contact  │
└───────────┘
```

---

## 🚀 Technical Details

### Grid System:
```tsx
grid-cols-1           // Mobile: 1 column
md:grid-cols-2        // Tablet: 2 columns
lg:grid-cols-4        // Desktop: 4 columns
gap-4                 // 16px gap between cards
auto-rows-[minmax(120px,auto)]  // Min height 120px
```

### Card Sizing:
```tsx
md:col-span-1         // 1 column width
md:col-span-2         // 2 columns width
md:row-span-1         // 1 row height
md:row-span-2         // 2 rows height
md:row-span-3         // 3 rows height
```

### Framer Motion:
```tsx
variants={cardVariants}
initial="initial"     // Start state
animate="animate"     // Entry animation
whileHover="hover"    // Hover state
```

---

## 💡 Design Philosophy

### Why Bento Grid?
1. **Modern & Trendy** - Popular in 2024 design trends
2. **Information Dense** - Show more in compact space
3. **Visual Hierarchy** - Large photo draws attention
4. **Scannable** - Easy to find information
5. **Interactive** - Each card is actionable
6. **Flexible** - Easy to rearrange or add cards

### Card Priority:
```
🥇 Photo Card - Primary focus (largest)
🥈 Stats Cards - Quick metrics (visual interest)
🥉 Bio Card - More details (secondary)
🎯 CTA Cards - Clear actions (conversion)
```

---

## 📱 Responsive Strategy

### Mobile First:
- Start with single column
- Stack all cards vertically
- Full-width cards for readability
- Touch-friendly sizes

### Progressive Enhancement:
- Tablet: 2 columns for efficiency
- Desktop: 4 columns bento for style
- Large screens: Max-width container

---

## 🎨 Color Scheme

### Card Backgrounds:
- Photo: Gradient overlay
- Stats: White/Dark card background
- CTA Small: Primary/10 tint
- Bio: Card background
- Contact: Primary gradient

### Accents:
- Border: Border color
- Hover: Primary color
- Icons: Primary color
- Badges: Green (available status)

---

## 🔧 Customization

### Add More Cards:
```tsx
<motion.div
  variants={cardVariants}
  className="md:col-span-1 md:row-span-1..."
>
  Your content
</motion.div>
```

### Change Card Sizes:
```tsx
col-span-3  // Wider
row-span-4  // Taller
```

### Adjust Animation Delays:
```tsx
transition={{ delay: 0.5 }}  // Later entry
```

### Modify Grid Gaps:
```tsx
gap-6  // 24px gaps (more spacious)
gap-2  // 8px gaps (more compact)
```

---

## ✅ Advantages

**vs Traditional Hero:**
- ✅ More engaging (multiple interaction points)
- ✅ Information dense (stats visible immediately)
- ✅ Modern aesthetic (trendy design)
- ✅ Better mobile experience (cards stack naturally)
- ✅ Flexible layout (easy to modify)

**vs Previous Designs:**
- ✅ **More professional** than playful heroes
- ✅ **More content** than minimal designs
- ✅ **More interactive** than static layouts
- ✅ **Better hierarchy** than equal-weight sections

---

## 📊 Performance

### Optimizations:
- ✅ CSS Grid (native browser support)
- ✅ Framer Motion (optimized animations)
- ✅ Next/Image (automatic optimization)
- ✅ requestAnimationFrame (smooth counters)
- ✅ CSS transforms (GPU-accelerated)

### Bundle Size:
- No additional dependencies
- Reuses existing Framer Motion
- Minimal JavaScript overhead
- Most effects are CSS

---

## 🎯 Best For:

✅ **Modern portfolios**
✅ **Developer/designer profiles**
✅ **Creative professionals**
✅ **SaaS landing pages**
✅ **Personal brand sites**

---

## 💡 Future Enhancements

Possible additions:
- [ ] Drag & drop to rearrange cards
- [ ] Click card to expand full details
- [ ] Animated background patterns per card
- [ ] Theme switcher card
- [ ] Live stats from API
- [ ] Testimonials card
- [ ] Skills tags cloud card

---

**Created**: December 2024  
**Version**: 4.0.0 (Bento Grid)  
**Status**: ✅ Production Ready  
**Design**: 🎨 Ultra-Modern Trendy

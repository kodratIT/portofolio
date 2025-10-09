# 🎯 Hero Professional - Interactive Photo Card

## Overview
Hero section profesional dengan **interactive draggable photo card** yang bisa di-drag dan tilt effect 3D.

---

## ✨ Key Features

### 1. **Draggable Photo Card** 🖐️
Photo card yang **bisa di-drag** ke segala arah:

```tsx
<motion.div
  drag
  dragElastic={0.1}
  dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
  className="cursor-grab active:cursor-grabbing"
>
```

**Features:**
- ✅ Drag ke kiri/kanan/atas/bawah
- ✅ Elastic bounce effect saat release
- ✅ Constrained movement (max 50px)
- ✅ Cursor changes: grab → grabbing

---

### 2. **3D Tilt Effect** 🎭
Card berputar mengikuti posisi mouse untuk depth illusion:

```tsx
const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), {
  stiffness: 300,
  damping: 30,
});
const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), {
  stiffness: 300,
  damping: 30,
});
```

**Behavior:**
- Mouse di kiri → Card tilt ke kiri
- Mouse di kanan → Card tilt ke kanan
- Mouse di atas → Card tilt ke depan
- Mouse di bawah → Card tilt ke belakang
- Smooth spring animation dengan physics

---

### 3. **Professional Layout** 💼
Clean dan minimalist dengan fokus pada content:

**Left Column (7/12):**
- Status badge (Available for opportunities)
- Name dengan gradient text
- Position dengan icon
- Bio text
- Stats row dengan icons
- CTA buttons
- Social links

**Right Column (5/12):**
- Interactive photo card
- Name tag di bottom
- Drag hint indicator

---

### 4. **Icon-Based Stats** 📊
Stats ditampilkan dengan icon boxes yang lebih visual:

```tsx
<div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
  <Briefcase className="w-6 h-6 text-primary" />
</div>
<div>
  <div className="text-2xl font-bold">{stats.yearsExperience}+</div>
  <div className="text-sm text-muted-foreground">Years Exp</div>
</div>
```

**Icons Used:**
- 💼 Briefcase - Years Experience
- ✨ Sparkles - Projects Completed
- 💻 Code2 - Technologies

---

### 5. **Visual Effects** ✨

**Gradient Orbs:**
```tsx
<div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
<div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
```

**Grid Background:**
```tsx
<div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
```

**Glowing Photo Background:**
```tsx
<motion.div
  animate={{ opacity: isHovered ? 0.6 : 0.3 }}
  className="absolute -inset-4 bg-gradient-to-br from-primary/40 to-primary/10 rounded-3xl blur-2xl"
/>
```

---

## 🎨 Design Details

### Color Scheme:
- Primary gradient for name
- Muted colors for text
- Green badge for availability status
- Subtle glows and shadows

### Typography:
- Heading: 5xl → 7xl (responsive)
- Position: 2xl → 3xl
- Stats: 2xl bold numbers
- Body: lg text

### Spacing:
- Container: max-w-7xl
- Grid gap: 8 → 12
- Section padding: py-20

---

## 🖼️ Photo Card Anatomy

```
┌─────────────────────────┐
│  🖐️ Drag me!            │ ← Hint (hidden on hover)
│                         │
│                         │
│     PHOTO IMAGE         │
│                         │
│                         │
│   ╔═══════════════╗     │
│   ║ Gradient      ║     │
│   ║ Overlay       ║     │
│   ╚═══════════════╝     │
│   ┌─────────────┐       │
│   │ Name        │       │ ← Name tag (bottom)
│   │ Position    │       │
│   └─────────────┘       │
└─────────────────────────┘
   ↖️          ↗️
Corner accents (blur circles)
```

---

## 💡 Interactive States

### Default State:
- Card at center position
- Subtle glow (30% opacity)
- Drag hint visible
- No tilt

### Hover State:
- Glow increases (60% opacity)
- Scale up slightly (1.02)
- Drag hint fades out
- Tilt activated

### Dragging State:
- Cursor changes to grabbing
- Elastic drag within constraints
- Maintains tilt effect
- Returns to position on release

### After Drag:
- Card bounces back to constraints
- Smooth spring animation
- Hover state reactivates

---

## 📱 Responsive Behavior

### Mobile (< 1024px):
- Single column layout
- Photo card centered
- Stats stacked vertically
- Full width buttons

### Tablet (1024px - 1280px):
- Grid 12 columns active
- Photo card right-aligned
- Stats in row
- Optimal spacing

### Desktop (> 1280px):
- Full layout
- Large photo card
- All features active
- Maximum visual impact

---

## 🎯 User Experience

### Clear Hierarchy:
1. Name (largest, gradient)
2. Position (with icon)
3. Bio (readable size)
4. Stats (visual boxes)
5. CTAs (prominent buttons)
6. Social links (subtle)

### Call to Actions:
- Primary: "View My Work"
- Secondary: "Get in Touch"
- Both with hover effects

### Engagement Points:
- ✅ Draggable photo
- ✅ Tilt on hover
- ✅ Animated stats
- ✅ Interactive socials
- ✅ Gradient orbs

---

## 🚀 Performance

### Optimizations:
- Spring physics cached
- Mouse events throttled
- Images optimized with Next/Image
- GPU-accelerated transforms
- Lazy state updates

### Bundle Impact:
- Uses existing Framer Motion
- No new dependencies
- Minimal JS overhead
- CSS for static styles

---

## 🎨 Customization

### Change Photo Size:
```tsx
className="w-80 h-96 sm:w-96 sm:h-[28rem]"
// Adjust width and height
```

### Adjust Drag Constraints:
```tsx
dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
// Larger movement area
```

### Modify Tilt Range:
```tsx
useTransform(mouseY, [-0.5, 0.5], [15, -15]) // More tilt
useTransform(mouseX, [-0.5, 0.5], [-15, 15])
```

### Change Spring Physics:
```tsx
{ stiffness: 400, damping: 40 } // Stiffer, faster response
{ stiffness: 200, damping: 20 } // Softer, slower response
```

---

## 🔧 Technical Details

### Framer Motion Features Used:
- `motion.div` - Animated container
- `drag` - Drag functionality
- `dragElastic` - Bounce effect
- `dragConstraints` - Movement limits
- `whileHover` - Hover state
- `useMotionValue` - Mouse tracking
- `useTransform` - Value mapping
- `useSpring` - Physics simulation

### Event Handlers:
```tsx
onMouseMove={handleMouseMove}     // Track mouse position
onMouseEnter={() => setIsHovered(true)}
onMouseLeave={() => {
  setIsHovered(false);
  mouseX.set(0);  // Reset tilt
  mouseY.set(0);
}}
```

---

## 📊 Comparison with Previous Hero

### Old Hero Enhanced:
- ❌ Static photo (only hover scale)
- ✅ Animated counters
- ✅ Particles background
- ✅ Floating badges
- ❌ Limited interactivity

### New Hero Professional:
- ✅ **Draggable photo**
- ✅ **3D tilt effect**
- ✅ Animated stats (icon boxes)
- ✅ Cleaner layout
- ✅ **More interactive**
- ✅ Professional appearance
- ✅ Better content hierarchy

---

## 🎯 Best For:

✅ **Professional portfolios**
✅ **Creative developers**
✅ **Modern design showcase**
✅ **Interactive experiences**
✅ **High engagement sites**

---

## 💡 Pro Tips

1. **Photo Quality**: Use high-resolution photo (min 800x1000px)
2. **Drag Hint**: Auto-hides after first interaction
3. **Mobile**: Drag still works on touch devices
4. **Accessibility**: Maintains keyboard navigation
5. **Performance**: Smooth 60fps on modern devices

---

**Created**: December 2024  
**Version**: 3.0.0 (Professional)  
**Status**: ✅ Production Ready  
**Interactive**: 🖐️ Drag & Tilt Enabled

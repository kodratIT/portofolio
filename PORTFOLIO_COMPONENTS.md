# 🎨 Modern Portfolio Landing Page Components

## Overview
Portfolio IT landing page yang modern dengan animasi interaktif, responsive design, dan component-based architecture.

## 🧩 Components Created

### 1. **BackgroundEffects** (`background-effects.tsx`)
Background dinamis dengan efek visual yang menarik:
- ✨ Animated gradient mesh
- 🎯 Floating particles dengan animasi
- 🌊 Grid pattern overlay
- 🖱️ Mouse-follow gradient effect

**Usage:**
```tsx
<BackgroundEffects />
```

---

### 2. **HeroSection** (`hero-section.tsx`)
Hero section dengan animasi typewriter dan spotlight effect:
- ⌨️ Typewriter effect untuk posisi/role
- 💫 Spotlight animation dari Aceternity UI
- 🖼️ 3D rotating avatar dengan glowing effect
- 🔗 Social media links
- 📱 Fully responsive

**Props:**
```tsx
interface HeroSectionProps {
  profile: {
    displayName: string;
    bio?: string;
    avatar?: string;
    email?: string;
    github?: string;
    linkedin?: string;
  };
  latestPosition?: string;
}
```

**Features:**
- Auto-rotating role text (Full Stack Developer, UI/UX Designer, etc.)
- Animated avatar with rotating border
- Social links with hover effects
- CTA buttons for "View Work" and "Download CV"
- Scroll indicator animation

---

### 3. **TechStackFloat** (`tech-stack-float.tsx`)
Marquee effect untuk menampilkan tech stack:
- ♾️ Infinite horizontal scroll
- 🔄 Two rows dengan direction berbeda
- 🎨 Hover effects dengan scale dan lift
- 📂 Category tags untuk setiap skill

**Props:**
```tsx
interface TechStackFloatProps {
  skills: Skill[];
}
```

**Features:**
- Automatic marquee animation
- Hover pause and highlight
- Gradient fade edges
- Responsive sizing

---

### 4. **ProjectsBento** (`projects-bento.tsx`)
Bento grid layout untuk showcase projects:
- 📐 Irregular grid sizes (dynamic bento pattern)
- 🖼️ Hover image zoom effect
- 🏷️ Featured badge animation
- 🔗 Quick actions (Live Demo & GitHub)
- 📱 Mobile responsive grid

**Props:**
```tsx
interface ProjectsBentoProps {
  projects: Project[];
}
```

**Features:**
- Dynamic grid sizing (2x2, 1x1, 1x2, etc.)
- Gradient overlay on hover
- Technology badges
- View all projects CTA

---

### 5. **ExperienceTimeline** (`experience-timeline.tsx`)
Vertical timeline untuk experience:
- 📍 Animated timeline dots
- 🔀 Alternating left-right layout
- 📅 Date ranges with "Current" badge
- 🏷️ Skill tags per experience
- 🎯 Scroll-triggered animations

**Props:**
```tsx
interface ExperienceTimelineProps {
  experiences: Experience[];
}
```

**Features:**
- Animated vertical line
- Current position badge with pulse
- Expandable cards on hover
- Experience count badge

---

### 6. **SkillsVisual** (`skills-visual.tsx`)
Interactive skills showcase:
- 📑 Category-based tabs
- 📊 Skill cards with grouping
- 🎯 Proficiency indicators
- 📈 Stats overview

**Props:**
```tsx
interface SkillsVisualProps {
  skills: Skill[];
}
```

**Features:**
- Filterable by category
- Animated skill cards
- Stats grid (Total Skills, Categories, etc.)
- Smooth transitions

---

### 7. **ContactSection** (`contact-section.tsx`)
Contact section dengan 3D moving border:
- 🎨 Moving border effect (Aceternity UI)
- 📧 Social media grid
- ✅ Availability status indicator
- 🎯 Quick email CTA

**Props:**
```tsx
interface ContactSectionProps {
  profile: {
    displayName: string;
    email?: string;
    github?: string;
    linkedin?: string;
    twitter?: string;
    location?: string;
  };
}
```

**Features:**
- Moving gradient border animation
- Social links with icons and colors
- Availability status with pulse animation
- Responsive grid layout

---

## 🎨 Design Features

### Animations
- ✨ Scroll-triggered reveal animations
- 🖱️ Hover micro-interactions
- 🌊 Smooth transitions
- 💫 Framer Motion powered

### Color Scheme
- 🌗 Dark/Light mode support
- 🎨 Primary accent colors
- 🌈 Gradient overlays
- 💎 Glassmorphism effects

### Performance
- 🚀 Optimized animations (GPU-accelerated)
- 📦 Component-based architecture
- ⚡ Fast page loads
- 📱 Mobile-first responsive

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **UI Components**: Aceternity UI + Radix UI
- **Icons**: Lucide React
- **Data**: Firebase

---

## 📁 File Structure

```
src/
├── app/
│   └── page.tsx                          # Main landing page
└── components/
    └── portfolio/
        ├── background-effects.tsx        # Background animations
        ├── hero-section.tsx              # Hero with typewriter
        ├── tech-stack-float.tsx          # Marquee tech stack
        ├── projects-bento.tsx            # Bento grid projects
        ├── experience-timeline.tsx       # Vertical timeline
        ├── skills-visual.tsx             # Skills showcase
        └── contact-section.tsx           # Contact with moving border
```

---

## 🚀 Usage

The main landing page (`src/app/page.tsx`) imports and uses all components:

```tsx
import { BackgroundEffects } from "@/components/portfolio/background-effects";
import { HeroSection } from "@/components/portfolio/hero-section";
import { TechStackFloat } from "@/components/portfolio/tech-stack-float";
import { SkillsVisual } from "@/components/portfolio/skills-visual";
import { ProjectsBento } from "@/components/portfolio/projects-bento";
import { ExperienceTimeline } from "@/components/portfolio/experience-timeline";
import { ContactSection } from "@/components/portfolio/contact-section";

export default async function Home() {
  // Fetch data from Firebase
  const [profile, projects, skills, experiences] = await fetchData();

  return (
    <>
      <BackgroundEffects />
      <div className="relative min-h-screen">
        <HeroSection profile={profile} latestPosition={latestExperience?.position} />
        <TechStackFloat skills={skills} />
        <SkillsVisual skills={skills} />
        <ExperienceTimeline experiences={experiences} />
        <ProjectsBento projects={projects} />
        <ContactSection profile={profile} />
      </div>
    </>
  );
}
```

---

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

All components are fully responsive and optimized for mobile-first design.

---

## 🎯 Key Features

✅ **Modern Design**: Clean, professional, and eye-catching
✅ **Smooth Animations**: Framer Motion for buttery smooth effects
✅ **Fully Responsive**: Works perfectly on all devices
✅ **Dark Mode**: Native dark/light theme support
✅ **Performance**: Optimized for speed and SEO
✅ **Type Safe**: Full TypeScript coverage
✅ **Accessible**: ARIA labels and semantic HTML

---

## 📝 Notes

- Old page.tsx backed up as `page.old.tsx`
- All components use "use client" for interactivity
- Firebase integration for dynamic data
- Default fallback data when profile not set up
- Setup banner shown when no user profile exists

---

## 🔧 Customization

Each component accepts props for customization. You can:
- Change colors via Tailwind classes
- Adjust animation speeds in Framer Motion configs
- Modify grid layouts and patterns
- Add/remove sections as needed

---

**Created**: December 2024
**Version**: 1.0.0
**Status**: ✅ Production Ready

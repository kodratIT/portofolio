# Portfolio Dashboard Application - Development Plan

## Tech Stack
- **Frontend Framework**: Next.js 14+ (App Router)
- **UI Library**: shadcn/ui + Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Language**: TypeScript
- **Deployment**: Vercel (recommended for Next.js)

## Project Overview
Dashboard aplikasi untuk mengelola konten portofolio programmer, termasuk projects, skills, experience, dan informasi personal. Admin dapat login, CRUD data, dan data akan ditampilkan di halaman public portfolio.

---

## Phase 1: Project Setup & Configuration

### Task 1.1: Initialize Next.js Project
- [ ] Create Next.js app dengan TypeScript: `npx create-next-app@latest`
- [ ] Pilih opsi: TypeScript, ESLint, Tailwind CSS, App Router, src/ directory
- [ ] Verify project structure dan dependencies
- [ ] Test dev server: `npm run dev`

### Task 1.2: Install shadcn/ui
- [ ] Initialize shadcn: `npx shadcn-ui@latest init`
- [ ] Configure components.json dengan preferences
- [ ] Install essential components:
  - Button, Input, Label, Card, Table
  - Form, Dialog, Select, Textarea
  - Dropdown Menu, Avatar, Badge
  - Tabs, Alert, Toast (Sonner)
  - Sheet, Separator, ScrollArea

### Task 1.3: Setup Firebase
- [ ] Create Firebase project di console
- [ ] Enable Authentication (Email/Password)
- [ ] Create Firestore Database (start in production mode)
- [ ] Enable Firebase Storage
- [ ] Install Firebase SDK: `npm install firebase`
- [ ] Create `lib/firebase/config.ts` dengan Firebase configuration
- [ ] Create `lib/firebase/auth.ts` untuk auth helpers
- [ ] Create `lib/firebase/firestore.ts` untuk database helpers
- [ ] Create `lib/firebase/storage.ts` untuk storage helpers
- [ ] Add Firebase config ke `.env.local`

### Task 1.4: Project Structure Setup
- [ ] Create folder structure:
  ```
  src/
  ├── app/
  │   ├── (auth)/
  │   │   ├── login/
  │   │   └── register/
  │   ├── (dashboard)/
  │   │   ├── dashboard/
  │   │   ├── projects/
  │   │   ├── skills/
  │   │   ├── experience/
  │   │   └── settings/
  │   ├── (public)/
  │   │   └── portfolio/
  │   └── api/
  ├── components/
  │   ├── ui/ (shadcn components)
  │   ├── layout/
  │   ├── forms/
  │   └── common/
  ├── lib/
  │   ├── firebase/
  │   ├── hooks/
  │   ├── utils/
  │   └── types/
  └── contexts/
  ```

---

## Phase 2: Authentication System

### Task 2.1: Setup Auth Context
- [ ] Create `contexts/AuthContext.tsx`
- [ ] Implement useAuth hook
- [ ] Handle user state management
- [ ] Implement loading states
- [ ] Add auth state persistence

### Task 2.2: Login Page
- [ ] Create `app/(auth)/login/page.tsx`
- [ ] Build login form dengan shadcn Form + React Hook Form
- [ ] Add email/password validation
- [ ] Implement Firebase signInWithEmailAndPassword
- [ ] Add error handling dan toast notifications
- [ ] Implement redirect ke dashboard setelah login
- [ ] Add "Remember Me" functionality (optional)

### Task 2.3: Register Page
- [ ] Create `app/(auth)/register/page.tsx`
- [ ] Build register form
- [ ] Add password confirmation validation
- [ ] Implement Firebase createUserWithEmailAndPassword
- [ ] Add user profile creation di Firestore
- [ ] Implement auto-login setelah register
- [ ] Add redirect ke dashboard

### Task 2.4: Protected Routes
- [ ] Create middleware atau HOC untuk route protection
- [ ] Implement redirect ke login jika tidak authenticated
- [ ] Add loading states untuk auth check
- [ ] Create public route wrapper

### Task 2.5: Logout Functionality
- [ ] Implement logout function
- [ ] Add logout button di dashboard
- [ ] Clear auth state
- [ ] Redirect ke login page

---

## Phase 3: Dashboard Layout & Navigation

### Task 3.1: Dashboard Layout
- [ ] Create `app/(dashboard)/layout.tsx`
- [ ] Implement responsive sidebar navigation
- [ ] Add header dengan user info dan logout
- [ ] Implement mobile menu (hamburger)
- [ ] Add breadcrumb navigation
- [ ] Style dengan shadcn components

### Task 3.2: Sidebar Navigation
- [ ] Create `components/layout/Sidebar.tsx`
- [ ] Add navigation items:
  - Dashboard (overview)
  - Projects
  - Skills
  - Experience
  - Settings
- [ ] Implement active state untuk current page
- [ ] Add icons (lucide-react)
- [ ] Make responsive (collapsible)

### Task 3.3: Dashboard Overview Page
- [ ] Create `app/(dashboard)/dashboard/page.tsx`
- [ ] Display statistics cards:
  - Total projects
  - Total skills
  - Total experience entries
  - Profile views (optional)
- [ ] Add quick actions
- [ ] Show recent activities/updates

---

## Phase 4: Firestore Database Schema

### Task 4.1: Define Data Models
Create TypeScript types di `lib/types/`:

#### User Profile
```typescript
{
  uid: string;
  email: string;
  displayName: string;
  bio: string;
  avatar: string;
  location: string;
  website: string;
  github: string;
  linkedin: string;
  twitter: string;
  createdAt: timestamp;
  updatedAt: timestamp;
}
```

#### Project
```typescript
{
  id: string;
  userId: string;
  title: string;
  description: string;
  longDescription: string;
  images: string[];
  thumbnail: string;
  technologies: string[];
  category: string;
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  order: number;
  createdAt: timestamp;
  updatedAt: timestamp;
}
```

#### Skill
```typescript
{
  id: string;
  userId: string;
  name: string;
  category: string; // Frontend, Backend, DevOps, etc.
  level: number; // 1-5
  icon?: string;
  order: number;
  createdAt: timestamp;
  updatedAt: timestamp;
}
```

#### Experience
```typescript
{
  id: string;
  userId: string;
  company: string;
  position: string;
  description: string;
  startDate: date;
  endDate?: date;
  current: boolean;
  location: string;
  technologies: string[];
  order: number;
  createdAt: timestamp;
  updatedAt: timestamp;
}
```

### Task 4.2: Setup Firestore Collections
- [ ] Create collections: users, projects, skills, experiences
- [ ] Setup Firestore security rules
- [ ] Add indexes jika diperlukan
- [ ] Create helper functions untuk CRUD operations

---

## Phase 5: Projects Management (CRUD)

### Task 5.1: Projects List Page
- [ ] Create `app/(dashboard)/projects/page.tsx`
- [ ] Fetch projects dari Firestore
- [ ] Display projects dalam Table atau Card grid
- [ ] Add search/filter functionality
- [ ] Implement sorting (by date, featured, etc.)
- [ ] Add "Create New Project" button
- [ ] Add action buttons (Edit, Delete)
- [ ] Implement delete confirmation dialog

### Task 5.2: Create Project Form
- [ ] Create `app/(dashboard)/projects/new/page.tsx`
- [ ] Build form dengan shadcn components
- [ ] Fields: title, description, long description, category
- [ ] Add technologies multi-select
- [ ] Add image upload (multiple)
- [ ] Add thumbnail selection
- [ ] Add URLs (live, github)
- [ ] Add featured checkbox
- [ ] Implement form validation
- [ ] Handle form submission ke Firestore
- [ ] Add success toast dan redirect

### Task 5.3: Edit Project Form
- [ ] Create `app/(dashboard)/projects/[id]/edit/page.tsx`
- [ ] Fetch existing project data
- [ ] Pre-populate form
- [ ] Handle update operations
- [ ] Implement image replacement/deletion

### Task 5.4: Project Detail View (Dashboard)
- [ ] Create `app/(dashboard)/projects/[id]/page.tsx`
- [ ] Display full project information
- [ ] Show all images dalam gallery
- [ ] Add edit/delete actions
- [ ] Add preview button untuk public view

---

## Phase 6: Image Upload & Storage

### Task 6.1: Image Upload Component
- [ ] Create `components/common/ImageUpload.tsx`
- [ ] Implement drag-and-drop upload
- [ ] Add file type validation (jpeg, png, webp)
- [ ] Add file size validation (max 5MB)
- [ ] Show upload progress
- [ ] Generate thumbnail preview
- [ ] Handle multiple images

### Task 6.2: Firebase Storage Integration
- [ ] Create upload function di `lib/firebase/storage.ts`
- [ ] Implement file upload ke Firebase Storage
- [ ] Generate unique filenames
- [ ] Get download URLs
- [ ] Implement image deletion
- [ ] Handle upload errors

### Task 6.3: Image Optimization
- [ ] Add next/image optimization
- [ ] Implement responsive images
- [ ] Add loading states
- [ ] Add fallback images

---

## Phase 7: Skills Management (CRUD)

### Task 7.1: Skills List Page
- [ ] Create `app/(dashboard)/skills/page.tsx`
- [ ] Fetch dan display skills
- [ ] Group by category
- [ ] Show skill level (visual indicator)
- [ ] Add create/edit/delete actions
- [ ] Implement drag-and-drop reordering

### Task 7.2: Skill Form (Create/Edit)
- [ ] Create skill form component
- [ ] Fields: name, category, level (slider 1-5)
- [ ] Add icon selection (optional)
- [ ] Implement inline editing atau dialog
- [ ] Handle CRUD operations

---

## Phase 8: Experience Management (CRUD)

### Task 8.1: Experience List Page
- [ ] Create `app/(dashboard)/experience/page.tsx`
- [ ] Fetch dan display experience entries
- [ ] Sort by date (newest first)
- [ ] Display timeline view
- [ ] Add create/edit/delete actions
- [ ] Show current position indicator

### Task 8.2: Experience Form (Create/Edit)
- [ ] Create experience form
- [ ] Fields: company, position, description, dates
- [ ] Add "Currently Working Here" checkbox
- [ ] Add location field
- [ ] Add technologies multi-select
- [ ] Implement date validation
- [ ] Handle form submission

---

## Phase 9: Settings & Profile Management

### Task 9.1: Settings Page
- [ ] Create `app/(dashboard)/settings/page.tsx`
- [ ] Implement tabs: Profile, Account, Preferences

### Task 9.2: Profile Settings
- [ ] Form untuk edit user profile
- [ ] Fields: display name, bio, avatar, location
- [ ] Social links: website, github, linkedin, twitter
- [ ] Avatar upload
- [ ] Save to Firestore users collection

### Task 9.3: Account Settings
- [ ] Change email functionality
- [ ] Change password form
- [ ] Delete account option (dengan confirmation)

---

## Phase 10: Public Portfolio View

### Task 10.1: Public Layout
- [ ] Create `app/(public)/layout.tsx`
- [ ] Design public-facing layout
- [ ] Add navigation header
- [ ] Add footer dengan social links

### Task 10.2: Portfolio Home Page
- [ ] Create `app/(public)/portfolio/[userId]/page.tsx`
- [ ] Fetch user profile
- [ ] Display hero section dengan intro
- [ ] Show featured projects
- [ ] Display skills grouped by category
- [ ] Show experience timeline
- [ ] Add contact section
- [ ] Make responsive dan SEO-friendly

### Task 10.3: Public Project Detail
- [ ] Create public project detail page
- [ ] Display full project info
- [ ] Add image gallery/carousel
- [ ] Show technologies used
- [ ] Add back button

---

## Phase 11: Additional Features & Enhancements

### Task 11.1: Loading States & Skeletons
- [ ] Add loading skeletons untuk semua pages
- [ ] Implement suspense boundaries
- [ ] Add loading spinners

### Task 11.2: Error Handling
- [ ] Create error boundary components
- [ ] Add error pages (404, 500)
- [ ] Implement error toast notifications
- [ ] Add retry mechanisms

### Task 11.3: Form Validation
- [ ] Implement zod untuk schema validation
- [ ] Add react-hook-form untuk form management
- [ ] Show validation errors

### Task 11.4: SEO Optimization
- [ ] Add metadata untuk setiap page
- [ ] Implement Open Graph tags
- [ ] Add sitemap.xml
- [ ] Add robots.txt

### Task 11.5: Performance Optimization
- [ ] Implement code splitting
- [ ] Add image lazy loading
- [ ] Optimize bundle size
- [ ] Add caching strategies

### Task 11.6: Dark Mode (Optional)
- [ ] Implement theme toggle
- [ ] Add dark mode styles
- [ ] Persist theme preference

---

## Phase 12: Testing & Deployment

### Task 12.1: Testing
- [ ] Test all CRUD operations
- [ ] Test authentication flow
- [ ] Test file uploads
- [ ] Test responsive design
- [ ] Test error scenarios
- [ ] Cross-browser testing

### Task 12.2: Deployment Setup
- [ ] Setup environment variables di Vercel
- [ ] Configure Firebase untuk production
- [ ] Setup custom domain (optional)
- [ ] Add Firebase security rules
- [ ] Test production build

### Task 12.3: Documentation
- [ ] Create README.md
- [ ] Document environment variables
- [ ] Add setup instructions
- [ ] Document API/Firebase structure

---

## Environment Variables (.env.local)

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

---

## Dependencies yang Dibutuhkan

### Core
- next (14+)
- react, react-dom
- typescript
- tailwindcss

### UI & Styling
- shadcn/ui components
- @radix-ui/* (via shadcn)
- tailwind-merge
- clsx
- lucide-react (icons)

### Firebase
- firebase

### Forms & Validation
- react-hook-form
- zod
- @hookform/resolvers

### Utilities
- date-fns (date formatting)
- sonner (toast notifications)

---

## Git Workflow Recommendations

1. Initial commit dengan project setup
2. Branch untuk setiap major feature
3. Commit messages yang descriptive
4. Regular commits setelah setiap completed task

---

## Timeline Estimation

- **Phase 1-2**: Setup & Auth (2-3 hari)
- **Phase 3-4**: Dashboard & Database (1-2 hari)
- **Phase 5-6**: Projects & Images (2-3 hari)
- **Phase 7-8**: Skills & Experience (2 hari)
- **Phase 9**: Settings (1 hari)
- **Phase 10**: Public Portfolio (2-3 hari)
- **Phase 11**: Enhancements (2-3 hari)
- **Phase 12**: Testing & Deploy (1-2 hari)

**Total: 13-19 hari** (tergantung pengalaman dan waktu available)

---

## Notes & Best Practices

1. **Security**: Selalu validate di backend (Firestore rules)
2. **UX**: Add loading states di semua async operations
3. **Error Handling**: Always handle errors gracefully
4. **Responsive**: Mobile-first approach
5. **Performance**: Lazy load components, optimize images
6. **Code Quality**: Keep components small dan reusable
7. **TypeScript**: Strict typing untuk better DX
8. **Git**: Regular commits dengan meaningful messages

---

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

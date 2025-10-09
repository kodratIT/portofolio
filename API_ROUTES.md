# 🚀 API Routes Documentation

## Overview
Public API routes untuk mengambil data portfolio dari Firebase. Semua endpoints tidak memerlukan parameter userId karena ini adalah portfolio single-user.

---

## 📍 Available Endpoints

### 1. **GET /api/profile**
Mengambil profile user (masih perlu userId dari PORTFOLIO_CONFIG.ownerId untuk doc reference).

**Response:**
```json
{
  "success": true,
  "data": {
    "uid": "user123",
    "email": "user@example.com",
    "displayName": "John Doe",
    "bio": "Full Stack Developer",
    "avatar": "https://...",
    "location": "Jakarta, Indonesia",
    "github": "https://github.com/...",
    "linkedin": "https://linkedin.com/in/...",
    "twitter": "https://twitter.com/..."
  }
}
```

---

### 2. **GET /api/projects**
Mengambil semua projects.

**Query Parameters:**
- `featured` (optional): "true" untuk hanya ambil featured projects

**Examples:**
- `/api/projects` - All projects
- `/api/projects?featured=true` - Featured projects only

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "proj123",
      "title": "Project Name",
      "description": "Short description",
      "thumbnail": "https://...",
      "technologies": ["React", "Next.js", "TypeScript"],
      "liveUrl": "https://...",
      "githubUrl": "https://github.com/...",
      "featured": true,
      "order": 1
    }
  ],
  "count": 10
}
```

---

### 3. **GET /api/skills**
Mengambil semua skills dengan grouping by category.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "skill123",
      "name": "React",
      "category": "Frontend",
      "level": 90,
      "order": 1
    }
  ],
  "grouped": {
    "Frontend": [...],
    "Backend": [...],
    "DevOps": [...]
  },
  "count": 25,
  "categories": 5
}
```

---

### 4. **GET /api/experiences**
Mengambil semua work experiences.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "exp123",
      "company": "Company Name",
      "position": "Senior Developer",
      "description": "Job description",
      "responsibilities": ["Task 1", "Task 2"],
      "startDate": "2023-01-01",
      "endDate": null,
      "current": true,
      "location": "Jakarta",
      "order": 1
    }
  ],
  "count": 5,
  "current": {
    "id": "exp123",
    "position": "Senior Developer",
    ...
  }
}
```

---

## 🔧 Implementation

### Firebase Functions (src/lib/firebase/public.ts)
Semua fungsi di `public.ts` sudah diupdate untuk **tidak menggunakan filter `where("userId")`**:

```typescript
// ❌ OLD - dengan userId filter
export const getPublicProjects = async (userId: string) => {
  const q = query(
    collection(db, "projects"),
    where("userId", "==", userId)  // ❌ Filter tidak diperlukan
  );
}

// ✅ NEW - tanpa userId filter
export const getPublicProjects = async () => {
  const q = query(collection(db, "projects")); // ✅ Langsung ambil semua
}
```

### Kenapa Tanpa Filter?
1. **Single User Portfolio** - Ini portfolio untuk 1 user saja
2. **Simpler & Faster** - Tidak perlu filter, langsung ambil semua data
3. **Less Database Reads** - Lebih efisien karena tidak perlu index compound

### Cache Strategy
Semua API endpoints menggunakan cache headers:
- `Cache-Control: public, s-maxage=60-300, stale-while-revalidate=300-600`
- Profile: 5 menit cache
- Projects: 2 menit cache
- Skills: 3 menit cache
- Experiences: 3 menit cache

---

## 📱 Usage in Landing Page

### Server Component (Recommended)
```typescript
// src/app/page.tsx
import { getPublicProjects, getPublicSkills } from "@/lib/firebase/public";

export default async function Home() {
  // Langsung call tanpa userId parameter
  const projects = await getPublicProjects();
  const skills = await getPublicSkills();
  
  return <ProjectsBento projects={projects} />;
}
```

### Client Component (via API)
```typescript
"use client";

const response = await fetch('/api/projects?featured=true');
const { data } = await response.json();
```

---

## ⚠️ Important Notes

1. **Profile endpoint** masih perlu `PORTFOLIO_CONFIG.ownerId` untuk document reference
2. Semua collections (projects, skills, experiences, blog) sudah tidak pakai filter userId
3. API routes otomatis menggunakan `PORTFOLIO_CONFIG.ownerId` secara internal
4. Landing page tidak perlu kirim userId parameter sama sekali

---

## 🔒 Security

- Semua endpoints adalah **public read-only**
- Write operations hanya bisa dari dashboard dengan authentication
- Firestore rules protect write operations
- Cache headers untuk optimize performance

---

**Created**: December 2024  
**Version**: 2.0.0 (Simplified - No userId Filter)  
**Status**: ✅ Production Ready

# 🔧 Firebase Timestamp Serialization Fix

## Problem
Error terjadi saat passing data dari Server Components ke Client Components:
```
Error: Only plain objects can be passed to Client Components from Server Components. 
Objects with toJSON methods are not supported.
```

Firebase `Timestamp` objects punya method `toJSON()` yang tidak supported untuk serialization ke Client Components.

## Solution
Convert semua Firebase Timestamp ke ISO string format sebelum return data.

---

## Changes Made

### 1. **Updated Firebase Public Functions** (`src/lib/firebase/public.ts`)

Semua fungsi sekarang convert Timestamp → ISO String:

```typescript
// ❌ BEFORE
querySnapshot.forEach((doc) => {
  skills.push({
    id: doc.id,
    ...doc.data(), // Timestamps included!
  } as Skill);
});

// ✅ AFTER
querySnapshot.forEach((doc) => {
  const data = doc.data();
  skills.push({
    id: doc.id,
    ...data,
    // Convert Timestamps to ISO strings
    createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
    updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt,
  } as Skill);
});
```

### Updated Functions:
- ✅ `getPublicProjects()` - createdAt, updatedAt
- ✅ `getPublicSkills()` - createdAt, updatedAt
- ✅ `getPublicExperiences()` - startDate, endDate, createdAt, updatedAt
- ✅ `getPublicBlogPosts()` - publishedAt, createdAt, updatedAt
- ✅ `getPublicBlogPost()` - publishedAt, createdAt, updatedAt
- ✅ `getPublicBlogPostsByCategory()` - publishedAt, createdAt, updatedAt

---

### 2. **Updated TypeScript Types** (`src/lib/types/index.ts`)

Tambahkan `string` ke union types untuk dates:

```typescript
// Before
createdAt: Timestamp | Date;
updatedAt: Timestamp | Date;

// After
createdAt: Timestamp | Date | string;
updatedAt: Timestamp | Date | string;
```

Updated interfaces:
- ✅ `Project`
- ✅ `Skill`
- ✅ `Experience`
- ✅ `BlogPost`

---

### 3. **Updated Components** 

#### ExperienceTimeline (`src/components/portfolio/experience-timeline.tsx`)
```typescript
// Before
format(exp.startDate.toDate ? exp.startDate.toDate() : new Date(exp.startDate), 'MMM yyyy')

// After  
format(new Date(exp.startDate), 'MMM yyyy')
```

Sekarang langsung parse string ISO ke Date object.

---

## How It Works

### Conversion Flow:
```
Firestore Timestamp → toDate() → toISOString() → ISO String
```

Example:
```typescript
// In Firebase
createdAt: Timestamp { seconds: 1702394400, nanoseconds: 956000000 }

// After conversion
createdAt: "2023-12-12T12:00:00.956Z"

// In component
new Date(createdAt) // Valid Date object
format(new Date(createdAt), 'MMM yyyy') // "Dec 2023"
```

---

## Benefits

✅ **Compatible** - ISO strings can be passed to Client Components  
✅ **Standard** - ISO 8601 format is universally supported  
✅ **Simple** - Easy to parse with `new Date(isoString)`  
✅ **Sortable** - ISO strings can be compared directly  
✅ **Portable** - Works with any date library (date-fns, dayjs, etc.)

---

## Testing

```bash
# Run dev server
npm run dev

# Check browser console - no more Timestamp errors!
```

---

## Notes

⚠️ **Important**: Semua dates dari Firebase functions sekarang return sebagai ISO strings, bukan Timestamp objects.

💡 **Tip**: Saat display dates, selalu wrap dengan `new Date()`:
```typescript
// ✅ Correct
format(new Date(data.createdAt), 'MMM dd, yyyy')

// ❌ Wrong (jika data sudah di-convert)
format(data.createdAt.toDate(), 'MMM dd, yyyy')
```

---

**Fixed**: December 2024  
**Status**: ✅ Resolved  
**Impact**: All Server → Client Component data passing now works

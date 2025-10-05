# 🔥 Fix Firestore Rules for Projects

## Problem

Creating projects fails with permission denied error.

## Root Cause

Firestore security rules are not configured to allow write access to the `projects` collection.

---

## Solution: Update Firestore Rules

### Step 1: Go to Firestore Rules

Open this URL:
```
https://console.firebase.google.com/project/portofolio-ecd0d/firestore/rules
```

### Step 2: Replace Rules

Copy and paste these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection - only owner can read/write their profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Projects collection - authenticated users can write, public can read
    match /projects/{projectId} {
      // Anyone can read projects (for public portfolio)
      allow read: if true;
      
      // Only authenticated users can create projects
      allow create: if request.auth != null && 
                       request.resource.data.userId == request.auth.uid;
      
      // Only owner can update/delete their projects
      allow update, delete: if request.auth != null && 
                               resource.data.userId == request.auth.uid;
    }
    
    // Skills collection - same pattern as projects
    match /skills/{skillId} {
      allow read: if true;
      allow create: if request.auth != null && 
                       request.resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null && 
                               resource.data.userId == request.auth.uid;
    }
    
    // Experience collection - same pattern as projects
    match /experiences/{experienceId} {
      allow read: if true;
      allow create: if request.auth != null && 
                       request.resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null && 
                               resource.data.userId == request.auth.uid;
    }
  }
}
```

### Step 3: Click "Publish"

Click the **"Publish"** button to save the rules.

### Step 4: Wait

Wait ~5-10 seconds for rules to propagate.

---

## Quick Test (Development Only)

If you want to test immediately with permissive rules (⚠️ NOT for production):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**⚠️ Warning:** This allows ANY authenticated user to read/write ANYTHING. Use ONLY for testing!

---

## Verify Rules Work

### Test in Browser Console:

1. Open your app: http://localhost:3001/projects/new
2. Open DevTools (F12)
3. Try creating a project
4. Check console logs:

**Expected (Success):**
```
🚀 Starting project creation...
User ID: abc123...
Form data: { title: "Test", ... }
📝 Data to save: { ... }
✅ Project created successfully: xyz789
```

**If still failing:**
```
❌ Error creating project: FirebaseError
Error code: permission-denied
🔥 PERMISSION DENIED - Check Firestore rules!
```

---

## Understanding the Rules

### Users Collection
```javascript
match /users/{userId} {
  allow read, write: if request.auth != null && 
                        request.auth.uid == userId;
}
```
- Only logged-in users can access
- Users can only read/write their OWN profile
- `{userId}` must match their auth UID

### Projects Collection
```javascript
match /projects/{projectId} {
  allow read: if true;
  allow create: if request.auth != null && 
                   request.resource.data.userId == request.auth.uid;
  allow update, delete: if request.auth != null && 
                           resource.data.userId == request.auth.uid;
}
```
- **Read:** Anyone (for public portfolio viewing)
- **Create:** Only authenticated users, must set `userId` to their own UID
- **Update/Delete:** Only owner (userId matches auth UID)

### Why This is Secure

1. ✅ Users can only create projects with THEIR userId
2. ✅ Users can only edit/delete THEIR OWN projects
3. ✅ Public can read all projects (for portfolio display)
4. ✅ Cannot impersonate other users
5. ✅ Cannot delete other users' projects

---

## Common Errors & Fixes

### Error: "permission-denied"
**Cause:** Rules don't allow the operation  
**Fix:** Update Firestore rules as shown above

### Error: "Missing or insufficient permissions"
**Cause:** Same as permission-denied  
**Fix:** Update rules and wait 10 seconds

### Error: "Document doesn't exist"
**Cause:** Trying to update non-existent project  
**Fix:** Check if project exists before updating

### Error: "FIRESTORE_UNAVAILABLE"
**Cause:** Firestore not enabled or network issue  
**Fix:** Enable Firestore database in console

---

## After Fixing Rules

1. **Refresh your browser page**
2. **Try creating a project again**
3. **Check browser console for logs**
4. **Verify project appears in Firestore:**
   ```
   https://console.firebase.google.com/project/portofolio-ecd0d/firestore/data
   ```

---

## Testing Checklist

After updating rules, test:

- [ ] Create project (should work)
- [ ] View projects list (should work)
- [ ] Edit your own project (should work)
- [ ] Delete your own project (should work)
- [ ] Toggle featured (should work)
- [ ] Check Firestore console (project document exists)

---

## Production Rules (Later)

For production, consider:

1. **Rate limiting** - prevent abuse
2. **Data validation** - validate field types
3. **Size limits** - prevent large documents
4. **Audit logging** - track changes

Example with validation:
```javascript
match /projects/{projectId} {
  allow create: if request.auth != null && 
                   request.resource.data.userId == request.auth.uid &&
                   request.resource.data.title.size() > 3 &&
                   request.resource.data.title.size() < 100 &&
                   request.resource.data.technologies.size() <= 20;
}
```

---

## Quick Links

- **Firestore Rules:** https://console.firebase.google.com/project/portofolio-ecd0d/firestore/rules
- **Firestore Data:** https://console.firebase.google.com/project/portofolio-ecd0d/firestore/data
- **Firebase Docs:** https://firebase.google.com/docs/firestore/security/get-started

---

**Status:** Rules need to be updated manually in Firebase Console  
**Time:** 2 minutes to fix  
**Impact:** Projects CRUD will work after update ✅

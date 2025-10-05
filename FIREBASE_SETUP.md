# Firebase Setup Guide

## ✅ Configuration Complete

Your Firebase configuration has been successfully added to `.env.local`:

```
Project ID: portofolio-ecd0d
Auth Domain: portofolio-ecd0d.firebaseapp.com
Storage Bucket: portofolio-ecd0d.firebasestorage.app
```

---

## 🔧 Required Firebase Console Setup

Before testing the application, you need to enable these services in Firebase Console:

### 1. Enable Authentication

1. Go to: https://console.firebase.google.com/project/portofolio-ecd0d/authentication
2. Click "Get Started"
3. Click "Email/Password" under "Sign-in providers"
4. Enable "Email/Password"
5. Click "Save"

### 2. Create Firestore Database

1. Go to: https://console.firebase.google.com/project/portofolio-ecd0d/firestore
2. Click "Create database"
3. Select "Start in test mode" (for development)
4. Choose location (closest to you, e.g., asia-southeast1)
5. Click "Enable"

### 3. Enable Firebase Storage

1. Go to: https://console.firebase.google.com/project/portofolio-ecd0d/storage
2. Click "Get started"
3. Click "Next" (accept default rules for now)
4. Choose location (same as Firestore)
5. Click "Done"

---

## 🔒 Firestore Security Rules (Development)

After creating Firestore, update the security rules:

1. Go to: https://console.firebase.google.com/project/portofolio-ecd0d/firestore/rules
2. Replace with these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - only owner can read/write
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Projects - authenticated users can write, everyone can read
    match /projects/{projectId} {
      allow read: if true;
      allow create, update, delete: if request.auth != null && 
                                       request.resource.data.userId == request.auth.uid;
    }
    
    // Skills - authenticated users can write, everyone can read
    match /skills/{skillId} {
      allow read: if true;
      allow create, update, delete: if request.auth != null && 
                                       request.resource.data.userId == request.auth.uid;
    }
    
    // Experience - authenticated users can write, everyone can read
    match /experiences/{experienceId} {
      allow read: if true;
      allow create, update, delete: if request.auth != null && 
                                       request.resource.data.userId == request.auth.uid;
    }
  }
}
```

3. Click "Publish"

---

## 🔐 Storage Security Rules (Development)

Update Storage rules for image uploads:

1. Go to: https://console.firebase.google.com/project/portofolio-ecd0d/storage/rules
2. Replace with these rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /projects/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /avatars/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /skills/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click "Publish"

---

## 🧪 Testing the Setup

### 1. Start Development Server
```bash
cd /Users/kodrat/Public/Source\ Code/portofolio-v2
npm run dev
```

### 2. Test Registration
1. Open: http://localhost:3001
2. Should redirect to `/login`
3. Click "Daftar di sini"
4. Fill form:
   - Name: Test User
   - Email: test@example.com
   - Password: test123
   - Confirm Password: test123
5. Click "Daftar"
6. Should redirect to dashboard
7. Check Firestore Console - new user document should be created

### 3. Test Login
1. Logout from dashboard
2. Go to `/login`
3. Enter credentials:
   - Email: test@example.com
   - Password: test123
4. Should login successfully

### 4. Verify in Firebase Console

**Authentication:**
- Go to: https://console.firebase.google.com/project/portofolio-ecd0d/authentication/users
- Should see registered user

**Firestore:**
- Go to: https://console.firebase.google.com/project/portofolio-ecd0d/firestore/data
- Should see "users" collection with user document

---

## 📱 Quick Links

- **Firebase Console**: https://console.firebase.google.com/project/portofolio-ecd0d
- **Authentication**: https://console.firebase.google.com/project/portofolio-ecd0d/authentication
- **Firestore**: https://console.firebase.google.com/project/portofolio-ecd0d/firestore
- **Storage**: https://console.firebase.google.com/project/portofolio-ecd0d/storage
- **Project Settings**: https://console.firebase.google.com/project/portofolio-ecd0d/settings/general

---

## ⚠️ Important Notes

### Security
- ⚠️ These are **development** rules - they're permissive for testing
- ⚠️ Before production, tighten security rules
- ⚠️ Never commit `.env.local` to Git (it's already in .gitignore)

### Troubleshooting

**Error: "Firebase: Error (auth/configuration-not-found)"**
- Solution: Enable Email/Password authentication in Firebase Console

**Error: "Missing or insufficient permissions"**
- Solution: Update Firestore security rules as shown above

**Error: "Firebase Storage: Object not found"**
- Solution: Enable Firebase Storage in console

**Dev server not starting?**
```bash
# Kill any process on port 3000/3001
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9

# Start fresh
npm run dev
```

---

## 🎉 Next Steps

After setup is complete:
1. Test all authentication flows
2. Verify Firebase collections are created
3. Ready for Phase 3-4 development
4. Continue with Projects CRUD (Phase 5)

---

## 📞 Support

If you encounter issues:
1. Check Firebase Console for errors
2. Check browser console for error messages
3. Verify all Firebase services are enabled
4. Check `.env.local` values are correct

# 🚀 Quick Start Guide - Portfolio Dashboard

## ✅ Setup Status

### Phase 1: Project Setup - COMPLETED ✅
- Next.js 15 with TypeScript
- Tailwind CSS v4
- shadcn/ui components
- Firebase SDK installed

### Phase 2: Authentication System - COMPLETED ✅
- Login/Register pages
- Protected routes
- Dashboard with navigation
- User authentication working

### Firebase Configuration - COMPLETED ✅
- Environment variables configured
- Project: **portofolio-ecd0d**

---

## 🔥 Start Using the App - 3 STEPS

### Step 1: Enable Firebase Services (5 minutes)

**You need to do this ONCE in Firebase Console:**

#### 1.1 Enable Authentication
```
URL: https://console.firebase.google.com/project/portofolio-ecd0d/authentication

Steps:
1. Click "Get Started"
2. Click "Email/Password"
3. Enable toggle
4. Click "Save"
```

#### 1.2 Create Firestore Database
```
URL: https://console.firebase.google.com/project/portofolio-ecd0d/firestore

Steps:
1. Click "Create database"
2. Select "Test mode"
3. Choose location: asia-southeast1 (or closest)
4. Click "Enable"
```

#### 1.3 Enable Storage
```
URL: https://console.firebase.google.com/project/portofolio-ecd0d/storage

Steps:
1. Click "Get started"
2. Click "Next"
3. Same location as Firestore
4. Click "Done"
```

### Step 2: Update Security Rules (2 minutes)

Copy rules from `FIREBASE_SETUP.md` file:
- Firestore Rules (for database)
- Storage Rules (for images)

### Step 3: Run the App

```bash
# Navigate to project
cd "/Users/kodrat/Public/Source Code/portofolio-v2"

# Start development server
npm run dev
```

**Open:** http://localhost:3001

---

## 🧪 Test the App (2 minutes)

### 1. Register New Account
```
1. Open: http://localhost:3001
2. Click "Daftar di sini"
3. Fill form:
   Name: Your Name
   Email: youremail@example.com
   Password: yourpassword123
4. Click "Daftar"
5. ✅ Should redirect to Dashboard
```

### 2. Verify in Firebase Console
```
Check users created:
https://console.firebase.google.com/project/portofolio-ecd0d/authentication/users

Check Firestore document:
https://console.firebase.google.com/project/portofolio-ecd0d/firestore/data
```

### 3. Test Dashboard Navigation
```
✅ Dashboard home - Stats and profile
✅ Projects - Placeholder (Phase 5)
✅ Skills - Placeholder (Phase 7)
✅ Experience - Placeholder (Phase 8)
✅ Settings - Placeholder (Phase 9)
```

### 4. Test Logout
```
1. Click avatar in top right
2. Click "Logout"
3. ✅ Should redirect to login
```

### 5. Test Login
```
1. Go to /login
2. Enter your credentials
3. ✅ Should login to dashboard
```

---

## 📁 Important Files

```
portofolio-v2/
├── .env.local                    # ✅ Firebase config (DO NOT COMMIT!)
├── FIREBASE_SETUP.md             # 📖 Detailed Firebase setup
├── PHASE2_NOTES.md               # 📖 Phase 2 documentation
├── agent.md                      # 📖 Development plan
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx   # 🔐 Login page
│   │   │   └── register/page.tsx # 📝 Register page
│   │   └── (dashboard)/          # 🏠 Dashboard pages
│   ├── components/
│   │   ├── ui/                   # shadcn components
│   │   └── common/               # Custom components
│   ├── lib/
│   │   ├── firebase/             # Firebase helpers
│   │   ├── hooks/                # React hooks
│   │   └── types/                # TypeScript types
│   └── contexts/                 # React contexts
```

---

## 🎯 What's Working NOW

- ✅ User Registration
- ✅ User Login
- ✅ Protected Dashboard
- ✅ Logout
- ✅ Responsive Navigation (mobile + desktop)
- ✅ User Profile Display
- ✅ Form Validation
- ✅ Error Handling
- ✅ Toast Notifications
- ✅ Loading States

---

## 🚧 Coming Next

### Phase 3-4: Enhanced Dashboard
- Firestore indexes
- Breadcrumb navigation
- Theme toggle (dark/light)
- Notifications

### Phase 5: Projects CRUD
- Projects list
- Create/Edit forms
- Image upload
- Delete confirmation

### Phase 6: Image Management
- Multiple image upload
- Image preview
- Image deletion
- Drag & drop

### Phase 7: Skills Management
- Skills list
- Category grouping
- Skill level indicator
- Drag to reorder

### Phase 8: Experience Management
- Timeline view
- Work history
- Current position indicator
- Date validation

### Phase 9: Settings & Profile
- Profile editing
- Avatar upload
- Social links
- Account settings

### Phase 10: Public Portfolio
- Public view page
- SEO optimization
- Shareable portfolio

---

## ⚡ Quick Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run lint             # Run ESLint

# Git
git status               # Check changes
git add .                # Stage all changes
git commit -m "message"  # Commit changes
git push origin main     # Push to GitHub

# Firebase
# Check .env.local       # View Firebase config
# See FIREBASE_SETUP.md  # Setup instructions
```

---

## 🆘 Troubleshooting

### App won't start?
```bash
# Kill processes
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9

# Reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Firebase errors?
- Check if Authentication is enabled
- Check if Firestore is created
- Check if Storage is enabled
- Verify `.env.local` has correct values
- Check security rules are updated

### Can't login?
- Check Firebase Authentication users
- Check browser console for errors
- Verify email/password is correct
- Check if user exists in Firestore

---

## 📞 Need Help?

1. Check `FIREBASE_SETUP.md` - Detailed Firebase guide
2. Check `PHASE2_NOTES.md` - Implementation details
3. Check browser console - Error messages
4. Check Firebase Console - Service status

---

## 🎉 You're Ready!

Once Firebase is configured, your portfolio dashboard is fully functional and ready to use!

**Next:** Continue with Phase 3-4 development or start adding your portfolio data.

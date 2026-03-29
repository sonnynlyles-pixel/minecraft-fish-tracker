# Minecraft Fish Tracker — Setup Guide

## Step 1: Install Node.js
Download from https://nodejs.org (LTS version). Run the installer.

---

## Step 2: Install app dependencies
Open a terminal in this folder and run:
```
npm install
```

---

## Step 3: Create a Firebase project

1. Go to https://console.firebase.google.com
2. Click **"Add project"** → name it `minecraft-fish-tracker` → click through
3. Once created, click the **`</>`** (Web) icon to add a web app
4. Name it anything → click **"Register app"**
5. Copy the `firebaseConfig` object shown — you'll need these values

### Enable Google Sign-In
1. In Firebase Console → **Authentication** → **Sign-in method**
2. Enable **Google** → save

### Enable Firestore Database
1. In Firebase Console → **Firestore Database** → **Create database**
2. Choose **"Start in production mode"** → pick any region → enable
3. Go to **Rules** tab and paste:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /progress/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```
4. Click **Publish**

---

## Step 4: Add your Firebase config
1. Copy `.env.example` → rename to `.env`
2. Fill in the values from your Firebase config:
```
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123:web:abc123
```

---

## Step 5: Run locally
```
npm run dev
```
Open http://localhost:5173

---

## Step 6: Generate app icons
1. Open `public/icons/generate-icons.html` in a browser
2. Right-click each canvas → **Save image as**
   - Save as `public/icons/icon-192.png`
   - Save as `public/icons/icon-512.png`

---

## Step 7: Deploy to Vercel (share with friends)

1. Go to https://vercel.com → sign up with GitHub
2. Push this folder to a GitHub repo:
   ```
   git init
   git add .
   git commit -m "Initial commit"
   gh repo create minecraft-fish-tracker --public --push --source=.
   ```
3. In Vercel → **"Add New Project"** → import your GitHub repo
4. In **Environment Variables**, add all 6 `VITE_FIREBASE_*` values from your `.env`
5. Click **Deploy**

Your friends visit your Vercel URL, sign in with Google, and each get their own progress!

### Add authorized domains for Google Sign-In
After deploying, go to Firebase Console → Authentication → Settings → **Authorized domains** → add your Vercel URL (e.g. `minecraft-fish-tracker.vercel.app`).

---

## Step 8: Install as iPhone app
1. Open your Vercel URL in Safari on iPhone
2. Tap the **Share** button → **"Add to Home Screen"**
3. Done — it works like a native app!

# Voucher Manager - Setup Guide

## Step 1: Create Firebase Project (5 minutes, free)

1. Go to https://console.firebase.google.com/
2. Click **"Add project"**
3. Name it `voucher-manager` (or any name you like)
4. Disable Google Analytics (not needed) -> **Create project**
5. Wait for it to finish, then click **Continue**

### Enable Authentication

1. In the Firebase Console, go to **Build > Authentication**
2. Click **Get started**
3. Under **Sign-in providers**, enable:
   - **Google** (click it, toggle Enable, choose your email as support email, Save)
   - **Phone** (click it, toggle Enable, Save)

### Enable Firestore Database

1. Go to **Build > Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (we'll add proper rules next)
4. Select a region closest to you (e.g., `europe-west1` for Israel)
5. Click **Enable**

### Set Firestore Security Rules

1. In Firestore, go to the **Rules** tab
2. Replace the default rules with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /vm_phone_index/{phone} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    match /vm_accounts/{accountId} {
      allow read, write: if request.auth != null;
      match /vouchers/{voucherId} {
        allow read, write: if request.auth != null;
      }
    }
  }
}
```

3. Click **Publish**

> Note: These rules allow any authenticated user to read/write. The app itself enforces phone-number-based access control in the client. For extra security, you can tighten these rules later to check phone numbers server-side.

### Get Firebase Config

1. In Firebase Console, click the **gear icon** (top-left) > **Project settings**
2. Scroll down to **"Your apps"** section
3. Click the **Web** icon (looks like `</>`)
4. Register app name: `voucher-manager`
5. You'll see a config object like:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "voucher-manager-xxxxx.firebaseapp.com",
  projectId: "voucher-manager-xxxxx",
  storageBucket: "voucher-manager-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

6. Copy these values into your `firebase-config.js` file:

```javascript
const FIREBASE_CONFIG = {
  apiKey: "AIzaSy...",
  authDomain: "voucher-manager-xxxxx.firebaseapp.com",
  projectId: "voucher-manager-xxxxx",
  storageBucket: "voucher-manager-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

## Step 2: Deploy to GitHub Pages (3 minutes, free)

### Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `voucher-manager`
3. Set to **Public** (required for free GitHub Pages)
4. Click **Create repository**

### Push Files

Open a terminal in the `voucher-manager` folder and run:

```bash
cd C:\Users\liormol\projects\voucher-manager
git init
git add .
git commit -m "Initial voucher manager app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/voucher-manager.git
git push -u origin main
```

### Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** > **Pages** (left sidebar)
3. Under **Source**, select **Deploy from a branch**
4. Branch: `main`, folder: `/ (root)`
5. Click **Save**
6. Wait 1-2 minutes, then your app is live at:
   `https://YOUR_USERNAME.github.io/voucher-manager/`

### Configure Firebase for GitHub Pages Domain

1. Back in Firebase Console > **Authentication > Settings > Authorized domains**
2. Click **Add domain**
3. Add: `YOUR_USERNAME.github.io`
4. This allows Google/Phone sign-in from your GitHub Pages URL

## Step 3: Use the App

### On Phone (Install as App)

1. Open `https://YOUR_USERNAME.github.io/voucher-manager/` in Chrome (Android) or Safari (iPhone)
2. **Android**: Tap the menu (3 dots) > **"Install app"** or **"Add to Home screen"**
3. **iPhone**: Tap the Share button > **"Add to Home Screen"**
4. The app now appears as an icon on your home screen

### First-Time Setup

1. Open the app
2. Sign in with Google or Phone number
3. Set an encryption passphrase (remember it and share with family)
4. Start adding vouchers!

### Add Family Members

1. Go to **Settings > Family Sharing**
2. Add your family member's phone number (e.g., 0501234567)
3. They open the same URL on their phone
4. They sign in and enter the shared passphrase
5. All vouchers sync in real-time

## Troubleshooting

- **"Firebase not configured"** banner: Make sure `firebase-config.js` has real values (not `YOUR_API_KEY`)
- **Google sign-in fails**: Check that your GitHub Pages domain is in Firebase Authorized Domains
- **Phone SMS not received**: Firebase free tier allows 10 SMS/day. If exceeded, wait 24 hours or use Google sign-in instead
- **App not installing on home screen**: Make sure you're using HTTPS (GitHub Pages provides this automatically)

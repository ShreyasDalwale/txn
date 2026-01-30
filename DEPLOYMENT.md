# 🚀 Deployment Guide

## Prerequisites

- Node.js installed
- Firebase project created
- Git repository (optional)

## 🔥 Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name and follow the wizard
4. Enable Google Analytics (optional)

### 2. Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click "Get Started"
3. Click on "Sign-in method" tab
4. Enable **Google** as a sign-in provider
5. Add your domain to authorized domains (for production)

### 3. Create Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click "Create Database"
3. Choose "Start in production mode"
4. Select your preferred location
5. Click "Enable"

### 4. Set Security Rules

Go to **Firestore Database > Rules** and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Transactions collection
    match /transactions/{transaction} {
      // Users can only read their own transactions
      allow read: if request.auth != null 
        && request.auth.uid == resource.data.userId;
      
      // Users can create transactions with their own userId
      allow create: if request.auth != null 
        && request.auth.uid == request.resource.data.userId
        && request.resource.data.keys().hasAll(['amount', 'type', 'category', 'date', 'userId', 'is_deleted']);
      
      // Users can update their own transactions
      allow update: if request.auth != null 
        && request.auth.uid == resource.data.userId;
      
      // Users can delete their own transactions (soft delete)
      allow delete: if request.auth != null 
        && request.auth.uid == resource.data.userId;
    }
    
    // Users collection
    match /users/{userId} {
      // Users can only read and write their own data
      allow read, write: if request.auth != null 
        && request.auth.uid == userId;
    }
  }
}
```

Click "Publish"

### 5. Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll down to "Your apps"
3. Click on the web icon (</>)
4. Register your app
5. Copy the configuration object

## 📦 Local Setup

### 1. Install Dependencies

```bash
npm install
# or
yarn install
```

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Test Locally

```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:5173` and test the app.

## 🌐 Deployment Options

### Option 1: Firebase Hosting (Recommended)

#### Install Firebase CLI

```bash
npm install -g firebase-tools
```

#### Login to Firebase

```bash
firebase login
```

#### Initialize Firebase Hosting

```bash
firebase init hosting
```

Select:
- Use an existing project
- Choose your project
- Public directory: `dist`
- Configure as SPA: `Yes`
- Set up automatic builds: `No`

#### Build the App

```bash
npm run build
# or
yarn build
```

#### Deploy

```bash
firebase deploy
```

Your app will be live at: `https://your-project-id.web.app`

#### Set Environment Variables

For production environment variables:

1. Create `.env.production`:
```env
VITE_FIREBASE_API_KEY=your_production_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_production_domain
VITE_FIREBASE_PROJECT_ID=your_production_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_production_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_production_sender_id
VITE_FIREBASE_APP_ID=your_production_app_id
```

2. Build with production env:
```bash
npm run build
```

### Option 2: Vercel

#### Install Vercel CLI

```bash
npm install -g vercel
```

#### Deploy

```bash
vercel
```

Follow the prompts and add environment variables when asked.

#### Add Environment Variables in Vercel Dashboard

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add all `VITE_*` variables
4. Redeploy

### Option 3: Netlify

#### Install Netlify CLI

```bash
npm install -g netlify-cli
```

#### Build the App

```bash
npm run build
```

#### Deploy

```bash
netlify deploy --prod --dir=dist
```

#### Add Environment Variables

1. Go to your site settings in Netlify
2. Navigate to "Build & deploy" > "Environment"
3. Add all `VITE_*` variables
4. Trigger a redeploy

### Option 4: GitHub Pages

#### Install gh-pages

```bash
npm install --save-dev gh-pages
```

#### Update vite.config.js

```javascript
export default defineConfig({
  plugins: [react()],
  base: '/your-repo-name/', // Add this line
});
```

#### Add Deploy Scripts to package.json

```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

#### Deploy

```bash
npm run deploy
```

Your app will be live at: `https://your-username.github.io/your-repo-name/`

## 🔒 Production Checklist

Before going live, ensure:

- [ ] Environment variables are set correctly
- [ ] Firebase security rules are enabled
- [ ] Authentication is working
- [ ] All CRUD operations work
- [ ] Data is filtered by user
- [ ] Error handling is in place
- [ ] Loading states are visible
- [ ] Mobile responsiveness tested
- [ ] Different browsers tested
- [ ] No console errors
- [ ] `.env` is in `.gitignore`
- [ ] Production domain added to Firebase authorized domains

## 📊 Post-Deployment

### Monitor Your App

1. **Firebase Console**
   - Check Authentication usage
   - Monitor Firestore reads/writes
   - Review security rules logs

2. **Analytics** (Optional)
   - Set up Google Analytics in Firebase
   - Track user engagement
   - Monitor errors

### Update Authorized Domains

In Firebase Console:
1. Go to **Authentication > Settings**
2. Scroll to "Authorized domains"
3. Add your production domain (e.g., `your-app.com`)

### Custom Domain (Optional)

For Firebase Hosting:

```bash
firebase hosting:channel:deploy production --domain your-domain.com
```

Follow the instructions to verify domain ownership.

## 🐛 Troubleshooting

### Common Issues

1. **"Firebase config not found"**
   - Make sure `.env` file exists
   - Check variable names start with `VITE_`
   - Restart dev server after adding env variables

2. **"Permission denied" errors**
   - Check Firestore security rules
   - Ensure user is authenticated
   - Verify `userId` field in transactions

3. **Build errors**
   - Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
   - Clear build cache: `rm -rf dist`

4. **Authentication not working**
   - Check Firebase authorized domains
   - Ensure Google sign-in is enabled
   - Verify API key is correct

## 🔄 Continuous Deployment

### GitHub Actions (Firebase Hosting)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase Hosting

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        env:
          VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
          VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.VITE_FIREBASE_AUTH_DOMAIN }}
          VITE_FIREBASE_PROJECT_ID: ${{ secrets.VITE_FIREBASE_PROJECT_ID }}
          VITE_FIREBASE_STORAGE_BUCKET: ${{ secrets.VITE_FIREBASE_STORAGE_BUCKET }}
          VITE_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.VITE_FIREBASE_MESSAGING_SENDER_ID }}
          VITE_FIREBASE_APP_ID: ${{ secrets.VITE_FIREBASE_APP_ID }}
        run: npm run build
      
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: your-project-id
```

Add secrets in GitHub repository settings.

## 📈 Scaling Considerations

### Performance

- Enable Firebase caching
- Use Firebase Hosting CDN
- Optimize images
- Implement code splitting
- Use React.lazy() for large components

### Cost Management

- Monitor Firebase usage
- Set up billing alerts
- Use Firestore indexes for complex queries
- Implement pagination for large datasets

### Backup

- Enable Firebase automatic backups
- Export data periodically
- Keep a local backup script

## 🎉 You're Live!

Congratulations! Your expense tracker is now deployed and ready for users.

Remember to:
- Monitor usage and errors
- Keep dependencies updated
- Respond to user feedback
- Add new features gradually
- Test before deploying updates

Happy tracking! 💰

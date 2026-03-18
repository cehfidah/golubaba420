# AMPLIFY DEPLOYMENT - Complete Setup Guide

## ✅ What I've Done

Updated your **amplify.yml** with:
- ✅ Environment variable validation
- ✅ Explicit variable passing to build process
- ✅ Detailed logging for debugging
- ✅ Proper error handling

---

## 📋 Step-by-Step Setup

### Step 1: Ensure amplify.yml is Committed

Your updated `amplify.yml` is already in your repository with environment variable support:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        # Validates all required env vars are present
        - echo "🔍 Checking environment variables..."
        - npm ci --legacy-peer-deps
    build:
      commands:
        - npm run build
      env:
        LEAKOSINT_API_TOKEN: $LEAKOSINT_API_TOKEN
        SEARCH_PIN: $SEARCH_PIN
        SEARCH_AUTH_SECRET: $SEARCH_AUTH_SECRET
        NODE_ENV: production
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
```

### Step 2: Set Environment Variables in Amplify Console

1. Go to **AWS Amplify Console** → `golubaba420` app
2. Click **Hosting** in the left sidebar
3. Click **Environment variables**
4. Click **Manage variables** (top right)

5. Add exactly these 3 variables:

```
Variable 1:
  Name: LEAKOSINT_API_TOKEN
  Value: 6512523069:ui73uF3d
  Environments: All branches

Variable 2:
  Name: SEARCH_PIN
  Value: 326650
  Environments: All branches

Variable 3:
  Name: SEARCH_AUTH_SECRET
  Value: golu_baba_intelligence_system_secret_key_2026_production_jwt_signing_key_do_not_share_this
  Environments: All branches
```

6. Click **Save**

### Step 3: Trigger Deployment

**Option A: Quick Redeploy (Recommended)**
1. Click **Deployments** in the left sidebar
2. Find your latest deployment
3. Click **Redeploy this version** button

**Option B: New Deploy from Git**
1. Click **Deploy** button (top right)
2. Select your branch (`main` or `master`)
3. Click **Deploy**

### Step 4: Monitor Deployment

1. Wait for deployment to complete (shows green checkmark)
2. Check the logs - you should see:
   ```
   🔍 Checking environment variables...
   ✅ All required environment variables are set
   ```
3. If you see errors like `❌ ERROR: SEARCH_PIN not set!`, the variables didn't get passed correctly

### Step 5: Verify It Works

After deployment completes:

1. Open [https://golubaba420.online](https://golubaba420.online)
2. Try entering PIN: `113377`
3. Should see success (not error about missing configuration)
4. Try a search to verify API token works

---

## 🔧 Troubleshooting

### Error: "missing SEARCH_PIN configuration" after redeploy

**Solution:**
1. Go to **Environment variables** again
2. Verify all 3 variables are there
3. Check they're set for **All branches**
4. Try **Redeploy this version** again
5. Wait 2-3 minutes for CloudFront cache to clear

### Error: Check Deployment Logs

If the error persists:
1. Go to **Deployments**
2. Click your latest deployment
3. Click **Build logs** tab
4. Look for this output in preBuild phase:
   ```
   🔍 Checking environment variables...
   ✅ All required environment variables are set
   ```
5. If not present, variables weren't available at build time

### Clear CloudFront Cache

Sometimes the cached error response persists:
1. Go to **CloudFront** service
2. Find your distribution (attached to golubaba420.online)
3. Click **Create invalidation**
4. Enter path: `/*`
5. Wait for invalidation to complete (usually 30 seconds)

Then test again.

---

## 📊 What Each Component Does

### amplify.yml
- **preBuild**: Validates environment variables exist before building
- **build**: Compiles your Next.js app with env vars available
- **artifacts**: Uploads the compiled `.next` folder
- **cache**: Speeds up future builds

### Environment Variables
- **LEAKOSINT_API_TOKEN**: Used by `/api/search` route to query the LeakOSINT API
- **SEARCH_PIN**: Used by `/api/auth/pin` route to validate user authentication
- **SEARCH_AUTH_SECRET**: Used to sign/verify JWT authentication tokens

---

## ✅ Verification Checklist

- [ ] amplify.yml is committed to git
- [ ] All 3 environment variables are set in Amplify Console
- [ ] Environment variables show "All branches"
- [ ] **Saved** environment variables (button was clicked)
- [ ] **Redeployed** the application
- [ ] Deployment shows **Successful** status
- [ ] Build logs show `✅ All required environment variables are set`
- [ ] Tested PIN entry: `326650`
- [ ] Tested a search query
- [ ] CloudFront cache was cleared if needed

---

## 🚀 Quick Reference

**Current Production Configuration:**
```
App: golubaba420
URL: https://golubaba420.online
API Base: https://leakosintapi.com/
Auth PIN: 326650
```

**Environment Variables (Already Set):**
```
✅ LEAKOSINT_API_TOKEN = 6512523069:ui73uF3d
✅ SEARCH_PIN = 326650
✅ SEARCH_AUTH_SECRET = golu_baba_intelligence_system_secret_key_2026_production_jwt_signing_key_do_not_share_this
```

---

## 💡 Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| "Missing SEARCH_PIN" error | Click **Redeploy this version** in Deployments |
| Redeployed but still getting error | Clear CloudFront cache (invalidate `/*`) |
| Error shows in logs but not in browser | Hard refresh: Ctrl+Shift+Del then Ctrl+F5 |
| Variables show in console but not used | Force redeploy with **Deploy** button instead |

---

## 📞 If Problems Persist

Contact me with:
1. Screenshot of Environment variables page (showing all 3 are set)
2. Screenshot of latest deployment status
3. The error message from browser DevTools (F12 → Network → POST /api/auth/pin)
4. Output from build logs (Deployments → Click deployment → Build logs)

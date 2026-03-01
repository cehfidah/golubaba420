# Production Deployment Guide - GOLU BABA Intelligence System

## Required Environment Variables

Your production server (Amplify, Vercel, etc.) **must** have these environment variables configured:

### 1. LEAKOSINT_API_TOKEN
```
6512523069:ui73uF3d
```
- Your API token from leakosintapi.com
- **Required** for search functionality

### 2. SEARCH_PIN
```
326650
```
- 6-digit PIN users must enter to access the system
- **Required** for authentication

### 3. SEARCH_AUTH_SECRET
```
golu_baba_intelligence_system_secret_key_2026_production_jwt_signing_key_do_not_share_this
```
- Secret key used to sign JWT authentication tokens
- **Required** for secure session management
- **IMPORTANT**: Use a different, stronger secret in production!

---

## AWS Amplify Configuration

### Option 1: Through AWS Console

1. Go to **AWS Amplify Console**
2. Select your app: `golubaba420`
3. Click **Environment variables** in the left sidebar
4. Click **Manage variables**
5. Add these three variables:

```
Variable name: LEAKOSINT_API_TOKEN
Value: 6512523069:ui73uF3d

Variable name: SEARCH_PIN
Value: 326650

Variable name: SEARCH_AUTH_SECRET
Value: golu_baba_intelligence_system_secret_key_2026_production_jwt_signing_key_do_not_share_this
```

6. Click **Save**
7. **Redeploy** your application

### Option 2: Through amplify.yml (Build Settings)

Update your `amplify.yml` to include environment variables in the build:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
  # Environment variables can be set in Amplify Console
  # DO NOT commit sensitive values to git!
```

---

## Vercel Configuration

1. Go to **Vercel Dashboard**
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add these variables:

```
Name: LEAKOSINT_API_TOKEN
Value: 6512523069:ui73uF3d
Environment: Production, Preview, Development

Name: SEARCH_PIN
Value: 326650
Environment: Production, Preview, Development

Name: SEARCH_AUTH_SECRET
Value: golu_baba_intelligence_system_secret_key_2026_production_jwt_signing_key_do_not_share_this
Environment: Production, Preview, Development
```

5. **Redeploy** your application

---

## Troubleshooting

### Error: "Server is missing SEARCH_PIN configuration"
**Solution**: Add `SEARCH_PIN=326650` to your production environment variables

### Error: "Server is missing SEARCH_AUTH_SECRET configuration"
**Solution**: Add `SEARCH_AUTH_SECRET` with a strong random value to your production environment

### Error: "Server is missing LEAKOSINT_API_TOKEN configuration"
**Solution**: Add `LEAKOSINT_API_TOKEN=6512523069:ui73uF3d` to your production environment

### Error: "Invalid LEAKOSINT_API_TOKEN"
**Solution**: Make sure you're using a real API token from leakosintapi.com, not a placeholder

---

## Security Best Practices

1. **Never commit `.env.local` to git** (it's already in `.gitignore`)
2. **Use strong random secrets** for `SEARCH_AUTH_SECRET` in production:
   ```bash
   # Generate a strong secret (Windows PowerShell)
   -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
   
   # Generate a strong secret (Linux/Mac)
   openssl rand -base64 32
   ```
3. **Change the PIN** if it gets compromised
4. **Keep API tokens private** - never expose them in client-side code

---

## Verification

After deployment, check that environment variables are working:

1. Open your production URL
2. Open browser console (F12)
3. Try to search without entering PIN - you should see authentication required
4. Enter PIN `326650` - authentication should succeed
5. Try a search - it should query the LeakOSINT API

If any step fails, check the server logs for specific error messages about missing environment variables.

---

## Quick Copy-Paste for Production Console

```bash
# AWS Amplify / Vercel / Other platforms
LEAKOSINT_API_TOKEN=6512523069:ui73uF3d
SEARCH_PIN=326650
SEARCH_AUTH_SECRET=golu_baba_intelligence_system_secret_key_2026_production_jwt_signing_key_do_not_share_this
```

---

## Contact

If you continue experiencing issues:
1. Check server logs for specific error messages
2. Verify all three environment variables are set correctly
3. Ensure you've redeployed after adding environment variables
4. Clear browser cache and cookies

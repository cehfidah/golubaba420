# Quick Reference Commands

## 🚀 Running the Project

### Development Server
```bash
npm run dev
```
Access at: http://localhost:3000

### Production Build
```bash
npm run build
npm run start
```

## 📤 Push to GitHub

### First Time Setup
```bash
# 1. Create repository on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/golubaba420.git
git branch -M main
git push -u origin main
```

### Subsequent Pushes
```bash
git add .
git commit -m "Your commit message"
git push
```

## 🔧 Useful Git Commands

```bash
# Check status
git status

# View commit history
git log --oneline

# Create new branch
git checkout -b feature-name

# Switch branches
git checkout main

# Pull latest changes
git pull origin main

# View remote URL
git remote -v

# Change remote URL
git remote set-url origin https://github.com/NEW_USERNAME/golubaba420.git
```

## 📦 Package Management

```bash
# Install dependencies
npm install --legacy-peer-deps

# Add new package
npm install package-name --legacy-peer-deps

# Remove package
npm uninstall package-name

# Update packages
npm update

# Check for outdated packages
npm outdated
```

## 🧹 Maintenance

```bash
# Clean build cache
rm -rf .next node_modules
npm install --legacy-peer-deps

# Check for TypeScript errors
npx tsc --noEmit

# Run linter
npm run lint

# Fix linting issues
npm run lint -- --fix
```

## 🔐 Environment Setup

```bash
# Copy environment template
cp .env.example .env.local

# Edit environment variables
notepad .env.local  # or use your preferred editor
```

## 🌐 Deployment

### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Manual Deployment
```bash
# Build
npm run build

# The build output is in .next/
# Upload to your hosting service
```

## 📊 Project Info

```bash
# View package info
npm list --depth=0

# Check Node/npm versions
node --version
npm --version

# View build info
npm run build -- --help
```

## 🐛 Troubleshooting

### Port already in use
```bash
# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F

# Or use different port
npm run dev -- -p 3001
```

### Module not found
```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Git issues
```bash
# Reset to last commit
git reset --hard HEAD

# Discard local changes
git checkout -- .

# View what changed
git diff
```

---

## 📝 Quick Workflow

1. **Make changes** to your code
2. **Test locally**: `npm run dev`
3. **Build**: `npm run build` (to ensure no errors)
4. **Commit**:
   ```bash
   git add .
   git commit -m "Description of changes"
   ```
5. **Push**: `git push`

---

**Pro Tip**: Bookmark this file for quick access to commands!

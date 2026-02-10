# GitHub Push Instructions

Follow these steps to push your project to GitHub:

## 1. Create a new repository on GitHub

1. Go to [GitHub](https://github.com) and log in
2. Click the "+" icon in the top right and select "New repository"
3. Name it: `golubaba420` (or your preferred name)
4. Description: `OSINT Intelligence Platform - Search across multiple databases`
5. Choose "Public" or "Private"
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. Click "Create repository"

## 2. Connect your local repository to GitHub

Run these commands in your terminal:

```bash
# Add GitHub as remote origin (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/golubaba420.git

# Rename default branch to main (if needed)
git branch -M main

# Push your code to GitHub
git push -u origin main
```

## 3. Alternative: Using SSH

If you prefer SSH:

```bash
git remote add origin git@github.com:YOUR_USERNAME/golubaba420.git
git branch -M main
git push -u origin main
```

## 4. Verify the push

1. Go to your GitHub repository URL
2. You should see all your files
3. The README.md will display automatically

## 5. Update package.json (Optional)

After creating the repo, update the repository URL in [package.json](package.json):

```json
"repository": {
  "type": "git",
  "url": "https://github.com/YOUR_USERNAME/golubaba420.git"
}
```

Then commit and push:

```bash
git add package.json
git commit -m "Update repository URL"
git push
```

## 6. Set up GitHub Pages or Vercel (Optional)

### Vercel (Recommended):
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Import your `golubaba420` repository
4. Add environment variable: `LEAKOSINT_API_TOKEN`
5. Deploy!

### GitHub Pages:
For GitHub Pages, you'll need to adjust the build configuration since it requires a static export.

## Troubleshooting

### If you get authentication errors:

**For HTTPS:**
```bash
git config --global credential.helper store
```
Then push again and enter your credentials.

**For SSH:**
Make sure you've set up SSH keys:
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```
Then add the key to GitHub in Settings > SSH and GPG keys.

### If remote already exists:

```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/goluleaks.git
```

## Quick Copy-Paste (Replace YOUR_USERNAME)

```bash
cd c:\Users\fida2\golubaba420
git remote add origin https://github.com/YOUR_USERNAME/golubaba420.git
git branch -M main
git push -u origin main
```

---

**Note:** Remember to:
- Replace `YOUR_USERNAME` with your actual GitHub username
- Never commit `.env.local` or your API token
- The `.gitignore` file already excludes sensitive files

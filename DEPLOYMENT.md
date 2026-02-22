# GitHub Pages Deployment Guide

## Quick Deployment Steps

### Method 1: Using GitHub Web Interface (Easiest)

1. **Create a new repository on GitHub**
   - Go to https://github.com/new
   - Name it: `KidBattle` or `brain-tug-game`
   - Make it Public
   - Don't initialize with README (we already have one)
   - Click "Create repository"

2. **Upload files**
   - Click "uploading an existing file"
   - Drag and drop all files:
     - index.html
     - style.css
     - script.js
     - questions.js
     - README.md
     - .gitignore
   - Upload the `resources` folder as well
   - Commit the changes

3. **Enable GitHub Pages**
   - Go to repository Settings
   - Scroll to "Pages" section (left sidebar)
   - Under "Source", select "main" branch
   - Click "Save"
   - Wait 1-2 minutes

4. **Access your game**
   - Your game will be live at:
   - `https://yourusername.github.io/KidBattle/`

### Method 2: Using Git Command Line

```bash
# Navigate to the KidBattle folder
cd C:\Users\rabby\Desktop\KidBattle

# Initialize git repository
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Brain Tug learning game"

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/KidBattle.git

# Push to GitHub
git branch -M main
git push -u origin main
```

Then follow step 3 and 4 from Method 1.

## Testing Your Deployment

After deployment, test these features:

✅ **Difficulty Selection**
- All three difficulty buttons work
- Questions match the selected difficulty

✅ **Game Start**
- Timer counts down from 5:00
- Questions display properly
- Teams alternate turns

✅ **Answer Submission**
- Correct answers move rope
- Scores update
- Feedback shows

✅ **Game End**
- Winner is determined correctly
- Final scores display
- Play Again button works

✅ **Responsive Design**
- Test on mobile device
- Test on tablet
- Test on desktop

## Troubleshooting

**Issue: Page shows 404**
- Solution: Wait 2-3 minutes after enabling Pages
- Check the branch is set to "main" in settings

**Issue: Styles not loading**
- Solution: Ensure all files are in root directory
- Check file names match exactly (case-sensitive)

**Issue: Questions not appearing**
- Solution: Verify questions.js is uploaded
- Clear browser cache

**Issue: Sound not working**
- Solution: Add sound files to resources/sound/
- Or ignore - game works fine without sound

## Custom Domain (Optional)

If you have a custom domain:
1. Go to repository Settings > Pages
2. Add your custom domain in "Custom domain" field
3. Update your DNS records to point to GitHub Pages

## Updates

To update your game after deployment:
1. Make changes to your local files
2. Commit and push to GitHub
3. Changes will appear in 1-2 minutes

## Need Help?

- GitHub Pages Documentation: https://pages.github.com/
- GitHub Support: https://support.github.com/

---

**Your game is now ready to share with the world! 🎉**

Share your game URL with friends, family, and students!

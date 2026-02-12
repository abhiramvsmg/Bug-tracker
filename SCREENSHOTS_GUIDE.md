# How to Add Screenshots to Your GitHub Repository

## Step-by-Step Guide

### 1. Take Screenshots of Your Application

1. **Open your Bug Tracker app** in a browser: http://localhost:5173/
2. **Navigate through each page** and take screenshots:
   - Login page
   - Signup page
   - Dashboard
   - Projects list
   - Create project form
   - Ticket details
   - Kanban board
   - Any other features

3. **Use Windows Snipping Tool**:
   - Press `Win + Shift + S`
   - Select the area to capture
   - The screenshot will be copied to clipboard
   - Open Paint and paste (`Ctrl + V`)
   - Save with a descriptive name

### 2. Save Screenshots

Save your screenshots in the `screenshots` folder with these names:
- `login-page.png`
- `signup-page.png`
- `dashboard.png`
- `projects-list.png`
- `create-project.png`
- `ticket-details.png`
- `kanban-board.png`

**Location**: `C:\Users\abhir\Downloads\BugTracker System App\screenshots\`

### 3. Add to Git and Push to GitHub

```bash
# Navigate to your project directory
cd "C:\Users\abhir\Downloads\BugTracker System App"

# Add all files including screenshots
git add .

# Commit with a message
git commit -m "Add project screenshots and README"

# Push to GitHub
git push origin main
```

### 4. Verify on GitHub

1. Go to your GitHub repository
2. The README.md will automatically display with screenshots
3. Screenshots will be visible in the repository

## Alternative: Upload Screenshots Directly on GitHub

If you don't want to use Git commands:

1. Go to your GitHub repository
2. Click "Add file" → "Upload files"
3. Drag and drop all screenshots into the `screenshots` folder
4. Commit the changes

## Tips for Great Screenshots

✅ **Do:**
- Use full browser window (not just a small section)
- Show the entire page or feature
- Use consistent browser size for all screenshots
- Capture actual data (not empty states)
- Make sure text is readable

❌ **Don't:**
- Include personal/sensitive information
- Use low resolution images
- Crop important UI elements
- Mix different themes/styles

## Screenshot Naming Convention

Use descriptive, lowercase names with hyphens:
- ✅ `login-page.png`
- ✅ `create-project-modal.png`
- ✅ `kanban-board-view.png`
- ❌ `Screenshot1.png`
- ❌ `IMG_001.png`

## Markdown Syntax for Images

The README.md already includes the correct syntax:

```markdown
![Login Page](screenshots/login-page.png)
```

This will:
- Display the image from the `screenshots` folder
- Show "Login Page" as alt text
- Automatically render on GitHub

---

**Your README is ready!** Just add the screenshots and push to GitHub. 🚀

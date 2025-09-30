#!/bin/bash

# Windows 95 Desktop Simulator - Quick Deployment Script
# This script helps you quickly set up the GitHub repository

echo "🚀 Windows 95 Desktop Simulator - Quick Deployment"
echo "=================================================="

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ This is not a Git repository. Please run this script from the project directory."
    exit 1
fi

# Get GitHub username
echo "📝 Please enter your GitHub username:"
read -r GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo "❌ GitHub username is required."
    exit 1
fi

echo "🔧 Setting up repository for user: $GITHUB_USERNAME"

# Update package.json
echo "📦 Updating package.json..."
sed -i "s/your-username/$GITHUB_USERNAME/g" package.json

# Update README.md
echo "📖 Updating README.md..."
sed -i "s/your-username/$GITHUB_USERNAME/g" README.md

# Update CONTRIBUTING.md
echo "📝 Updating CONTRIBUTING.md..."
sed -i "s/your-username/$GITHUB_USERNAME/g" CONTRIBUTING.md

# Add remote repository
echo "🔗 Adding remote repository..."
git remote remove origin 2>/dev/null || true
git remote add origin "https://github.com/$GITHUB_USERNAME/windows95-desktop-simulator.git"

# Commit the updates
echo "💾 Committing username updates..."
git add .
git commit -m "🔧 Update repository URLs for user $GITHUB_USERNAME

- Updated package.json repository URLs
- Updated README.md links and badges  
- Updated CONTRIBUTING.md links
- Ready for GitHub deployment" || echo "No changes to commit"

# Set main branch
echo "🌳 Setting main branch..."
git branch -M main

echo ""
echo "✅ Setup complete! Next steps:"
echo ""
echo "1. Create a GitHub repository:"
echo "   - Go to https://github.com/new"
echo "   - Repository name: windows95-desktop-simulator"
echo "   - Description: 🖥️ A highly accurate Windows 95 desktop experience recreated with modern web technologies"
echo "   - Make it Public"
echo "   - Don't initialize with README, .gitignore, or license"
echo ""
echo "2. Push your code:"
echo "   git push -u origin main"
echo ""
echo "3. Enable GitHub Pages:"
echo "   - Go to repository Settings > Pages"
echo "   - Source: Deploy from a branch"
echo "   - Branch: main, folder: / (root)"
echo ""
echo "4. Your site will be available at:"
echo "   https://$GITHUB_USERNAME.github.io/windows95-desktop-simulator/"
echo ""
echo "🎉 Happy coding!"
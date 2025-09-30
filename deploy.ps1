# Windows 95 Desktop Simulator - Quick Deployment Script (PowerShell)
# This script helps you quickly set up the GitHub repository

Write-Host "🚀 Windows 95 Desktop Simulator - Quick Deployment" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# Check if we're in a git repository
if (!(Test-Path ".git")) {
    Write-Host "❌ This is not a Git repository. Please run this script from the project directory." -ForegroundColor Red
    exit 1
}

# Get GitHub username
$GITHUB_USERNAME = Read-Host "📝 Please enter your GitHub username"

if ([string]::IsNullOrEmpty($GITHUB_USERNAME)) {
    Write-Host "❌ GitHub username is required." -ForegroundColor Red
    exit 1
}

Write-Host "🔧 Setting up repository for user: $GITHUB_USERNAME" -ForegroundColor Green

# Update package.json
Write-Host "📦 Updating package.json..." -ForegroundColor Yellow
(Get-Content "package.json") -replace "your-username", $GITHUB_USERNAME | Set-Content "package.json"

# Update README.md
Write-Host "📖 Updating README.md..." -ForegroundColor Yellow
(Get-Content "README.md") -replace "your-username", $GITHUB_USERNAME | Set-Content "README.md"

# Update CONTRIBUTING.md
Write-Host "📝 Updating CONTRIBUTING.md..." -ForegroundColor Yellow
(Get-Content "CONTRIBUTING.md") -replace "your-username", $GITHUB_USERNAME | Set-Content "CONTRIBUTING.md"

# Remove existing remote and add new one
Write-Host "🔗 Adding remote repository..." -ForegroundColor Yellow
try {
    git remote remove origin 2>$null
} catch {
    # Ignore error if origin doesn't exist
}
git remote add origin "https://github.com/$GITHUB_USERNAME/windows95-desktop-simulator.git"

# Commit the updates
Write-Host "💾 Committing username updates..." -ForegroundColor Yellow
git add .
try {
    git commit -m "🔧 Update repository URLs for user $GITHUB_USERNAME

- Updated package.json repository URLs
- Updated README.md links and badges  
- Updated CONTRIBUTING.md links
- Ready for GitHub deployment"
} catch {
    Write-Host "No changes to commit" -ForegroundColor Gray
}

# Set main branch
Write-Host "🌳 Setting main branch..." -ForegroundColor Yellow
git branch -M main

Write-Host ""
Write-Host "✅ Setup complete! Next steps:" -ForegroundColor Green
Write-Host ""
Write-Host "1. Create a GitHub repository:" -ForegroundColor White
Write-Host "   - Go to https://github.com/new" -ForegroundColor Gray
Write-Host "   - Repository name: windows95-desktop-simulator" -ForegroundColor Gray
Write-Host "   - Description: 🖥️ A highly accurate Windows 95 desktop experience recreated with modern web technologies" -ForegroundColor Gray
Write-Host "   - Make it Public" -ForegroundColor Gray
Write-Host "   - Don't initialize with README, .gitignore, or license" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Push your code:" -ForegroundColor White
Write-Host "   git push -u origin main" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. Enable GitHub Pages:" -ForegroundColor White
Write-Host "   - Go to repository Settings > Pages" -ForegroundColor Gray
Write-Host "   - Source: Deploy from a branch" -ForegroundColor Gray
Write-Host "   - Branch: main, folder: / (root)" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Your site will be available at:" -ForegroundColor White
Write-Host "   https://$GITHUB_USERNAME.github.io/windows95-desktop-simulator/" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎉 Happy coding!" -ForegroundColor Green

# Ask if user wants to open GitHub in browser
$openGitHub = Read-Host "Would you like to open GitHub repository creation page? (y/n)"
if ($openGitHub -eq "y" -or $openGitHub -eq "Y") {
    Start-Process "https://github.com/new"
}
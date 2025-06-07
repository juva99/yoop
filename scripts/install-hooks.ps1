Write-Host "Installing git hooks..." -ForegroundColor Green

# Copy pre-commit hook
Copy-Item "scripts\pre-commit" ".git\hooks\pre-commit" -Force

Write-Host "Git hooks installed successfully!" -ForegroundColor Green

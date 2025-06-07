#!/bin/sh

echo "Installing git hooks..."

# Copy pre-commit hook
cp scripts/pre-commit .git/hooks/pre-commit

# Make it executable
chmod +x .git/hooks/pre-commit

echo "Git hooks installed successfully!"

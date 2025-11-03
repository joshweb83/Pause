#!/bin/bash

# Pause - Auto Commit & Push Script
# 자동으로 변경사항을 커밋하고 푸시합니다.

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}⏸ Pause - Auto Push Script${NC}"
echo "======================================"

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}Error: Not a git repository${NC}"
    exit 1
fi

# Get current branch
BRANCH=$(git branch --show-current)
echo -e "Current branch: ${YELLOW}$BRANCH${NC}"

# Check if there are changes
if [ -z "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}No changes to commit${NC}"
    exit 0
fi

# Show status
echo ""
echo "Changes detected:"
git status --short

# Auto-generate commit message based on changes
echo ""
echo "Generating commit message..."

COMMIT_MSG="chore: Auto-commit changes

Changes:
$(git status --short | head -10)

Auto-committed at $(date '+%Y-%m-%d %H:%M:%S')
"

echo ""
echo "Commit message:"
echo "----------------------------------------"
echo "$COMMIT_MSG"
echo "----------------------------------------"

# Ask for confirmation (optional - comment out for full automation)
if [ "${AUTO_CONFIRM}" != "true" ]; then
    read -p "Proceed with commit and push? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${RED}Aborted${NC}"
        exit 1
    fi
fi

# Stage all changes
echo ""
echo "Staging changes..."
git add .

# Commit
echo "Creating commit..."
git commit -m "$COMMIT_MSG"

# Push with retry logic
echo "Pushing to remote..."
MAX_RETRIES=4
RETRY_COUNT=0
DELAY=2

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if git push -u origin "$BRANCH"; then
        echo -e "${GREEN}✓ Successfully pushed to remote${NC}"
        exit 0
    else
        RETRY_COUNT=$((RETRY_COUNT + 1))
        if [ $RETRY_COUNT -lt $MAX_RETRIES ]; then
            echo -e "${YELLOW}Push failed. Retrying in ${DELAY}s... (Attempt $RETRY_COUNT/$MAX_RETRIES)${NC}"
            sleep $DELAY
            DELAY=$((DELAY * 2))
        fi
    fi
done

echo -e "${RED}✗ Failed to push after $MAX_RETRIES attempts${NC}"
exit 1

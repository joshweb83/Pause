#!/bin/bash

# Pause - One-Click Deploy Script
# 모든 변경사항을 커밋하고 GitHub + Vercel에 자동 배포

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}⏸ Pause - One-Click Deploy${NC}"
echo "======================================"

# Check for changes
if [ -z "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}No changes to deploy${NC}"
    exit 0
fi

# Show what will be deployed
echo ""
echo "Changes to deploy:"
git status --short | head -10

# Smart commit message generation
NEW_FILES=$(git status --porcelain | grep "^??" | wc -l)
MODIFIED_FILES=$(git status --porcelain | grep "^ M" | wc -l)

BACKEND_CHANGES=$(git status --porcelain | grep "backend/" | wc -l)
FRONTEND_CHANGES=$(git status --porcelain | grep "frontend/" | wc -l)

# Determine commit type and scope
if [ $FRONTEND_CHANGES -gt 0 ]; then
    COMMIT_TYPE="feat(frontend)"
    DEPLOY_TARGET="Vercel"
elif [ $BACKEND_CHANGES -gt 0 ]; then
    COMMIT_TYPE="feat(backend)"
    DEPLOY_TARGET="Backend"
else
    COMMIT_TYPE="chore"
    DEPLOY_TARGET="GitHub"
fi

COMMIT_MSG="${COMMIT_TYPE}: Deploy updates

Files changed:
$(git status --short | head -10)

Deployed at $(date '+%Y-%m-%d %H:%M:%S')
"

echo ""
echo -e "${GREEN}Commit message:${NC}"
echo "----------------------------------------"
echo "$COMMIT_MSG"
echo "----------------------------------------"
echo ""

# Confirm
read -p "Deploy to GitHub and Vercel? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}Deployment cancelled${NC}"
    exit 1
fi

# Stage and commit
echo ""
echo -e "${BLUE}[1/4]${NC} Staging changes..."
git add .

echo -e "${BLUE}[2/4]${NC} Creating commit..."
git commit -m "$COMMIT_MSG"

# Push to GitHub with retry
echo -e "${BLUE}[3/4]${NC} Pushing to GitHub..."
BRANCH=$(git branch --show-current)
MAX_RETRIES=4
RETRY_COUNT=0
DELAY=2

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if git push -u origin "$BRANCH"; then
        echo -e "${GREEN}✓ Pushed to GitHub${NC}"
        break
    else
        RETRY_COUNT=$((RETRY_COUNT + 1))
        if [ $RETRY_COUNT -lt $MAX_RETRIES ]; then
            echo -e "${YELLOW}Push failed. Retrying in ${DELAY}s...${NC}"
            sleep $DELAY
            DELAY=$((DELAY * 2))
        else
            echo -e "${RED}✗ Failed to push after $MAX_RETRIES attempts${NC}"
            exit 1
        fi
    fi
done

# Trigger Vercel deployment (automatic via GitHub integration)
echo -e "${BLUE}[4/4]${NC} Triggering Vercel deployment..."
echo ""

if [ $FRONTEND_CHANGES -gt 0 ]; then
    echo -e "${YELLOW}Frontend changes detected.${NC}"
    echo "Vercel will automatically deploy via GitHub integration."
    echo ""
    echo "Monitor deployment:"
    echo "  GitHub Actions: https://github.com/$(git config --get remote.origin.url | sed 's/.*github.com[:/]\(.*\)\.git/\1/')/actions"
    echo "  Vercel Dashboard: https://vercel.com/dashboard"
else
    echo -e "${YELLOW}No frontend changes. Vercel deployment skipped.${NC}"
fi

echo ""
echo -e "${GREEN}======================================"
echo "✓ Deployment initiated!"
echo "======================================${NC}"
echo ""
echo "Branch: $BRANCH"
echo "Target: $DEPLOY_TARGET"
echo ""
echo "Next steps:"
echo "1. Check GitHub Actions for CI status"
echo "2. Check Vercel dashboard for deployment status"
echo "3. Test the deployed application"
echo ""

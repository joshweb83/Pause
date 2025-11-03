#!/bin/bash

# Pause - Smart Commit Script
# 변경 사항을 분석하여 자동으로 의미있는 커밋 메시지를 생성합니다.

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}⏸ Pause - Smart Commit${NC}"
echo "======================================"

# Check for changes
if [ -z "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}No changes to commit${NC}"
    exit 0
fi

# Analyze changes
NEW_FILES=$(git status --porcelain | grep "^??" | wc -l)
MODIFIED_FILES=$(git status --porcelain | grep "^ M" | wc -l)
DELETED_FILES=$(git status --porcelain | grep "^ D" | wc -l)

# Determine commit type
COMMIT_TYPE="chore"
if [ $NEW_FILES -gt 0 ]; then
    COMMIT_TYPE="feat"
elif [ $MODIFIED_FILES -gt 3 ]; then
    COMMIT_TYPE="refactor"
elif [ $DELETED_FILES -gt 0 ]; then
    COMMIT_TYPE="refactor"
fi

# Check which parts of the project changed
BACKEND_CHANGES=$(git status --porcelain | grep "backend/" | wc -l)
FRONTEND_CHANGES=$(git status --porcelain | grep "frontend/" | wc -l)
DOCS_CHANGES=$(git status --porcelain | grep "docs/" | wc -l)
CONFIG_CHANGES=$(git status --porcelain | grep -E "\.(yml|yaml|json|env)" | wc -l)

# Generate scope
SCOPE=""
if [ $BACKEND_CHANGES -gt 0 ] && [ $FRONTEND_CHANGES -gt 0 ]; then
    SCOPE="full-stack"
elif [ $BACKEND_CHANGES -gt 0 ]; then
    SCOPE="backend"
elif [ $FRONTEND_CHANGES -gt 0 ]; then
    SCOPE="frontend"
elif [ $DOCS_CHANGES -gt 0 ]; then
    SCOPE="docs"
elif [ $CONFIG_CHANGES -gt 0 ]; then
    SCOPE="config"
fi

# Generate description
DESCRIPTION="Update project files"
if [ $NEW_FILES -gt 5 ]; then
    DESCRIPTION="Add new features and components"
elif [ $NEW_FILES -gt 0 ]; then
    DESCRIPTION="Add new files"
elif [ $MODIFIED_FILES -gt 5 ]; then
    DESCRIPTION="Update multiple components"
elif [ $MODIFIED_FILES -gt 0 ]; then
    DESCRIPTION="Update files"
fi

# Build commit message
if [ -n "$SCOPE" ]; then
    COMMIT_TITLE="${COMMIT_TYPE}(${SCOPE}): ${DESCRIPTION}"
else
    COMMIT_TITLE="${COMMIT_TYPE}: ${DESCRIPTION}"
fi

# Get file list for body
FILE_LIST=$(git status --short | head -15)

COMMIT_MSG="${COMMIT_TITLE}

Files changed:
${FILE_LIST}

Statistics:
- New files: ${NEW_FILES}
- Modified files: ${MODIFIED_FILES}
- Deleted files: ${DELETED_FILES}

Auto-generated commit at $(date '+%Y-%m-%d %H:%M:%S')
"

# Show commit message
echo ""
echo -e "${GREEN}Generated commit message:${NC}"
echo "----------------------------------------"
echo "$COMMIT_MSG"
echo "----------------------------------------"
echo ""

# Confirm
read -p "Proceed with commit and push? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}Aborted${NC}"
    exit 1
fi

# Stage, commit, and push
echo ""
echo "Staging changes..."
git add .

echo "Creating commit..."
git commit -m "$COMMIT_MSG"

echo "Pushing to remote..."
BRANCH=$(git branch --show-current)

# Push with retry logic
MAX_RETRIES=4
RETRY_COUNT=0
DELAY=2

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if git push -u origin "$BRANCH"; then
        echo -e "${GREEN}✓ Successfully pushed to $BRANCH${NC}"
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

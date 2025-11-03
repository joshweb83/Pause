#!/bin/bash

# Pause - Watch and Auto Push
# 파일 변경을 감지하고 자동으로 커밋/푸시합니다.

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}⏸ Pause - Watch and Auto Push${NC}"
echo "======================================"
echo "Watching for file changes..."
echo "Press Ctrl+C to stop"
echo ""

# Configuration
WATCH_INTERVAL=30  # Check every 30 seconds
LAST_COMMIT=""

# Function to check and push changes
check_and_push() {
    if [ -z "$(git status --porcelain)" ]; then
        return 0
    fi

    echo ""
    echo -e "${YELLOW}[$(date '+%H:%M:%S')] Changes detected!${NC}"

    # Generate simple commit message
    TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
    CHANGED_FILES=$(git status --short | wc -l)

    COMMIT_MSG="chore: Auto-save changes ($CHANGED_FILES files)

Auto-committed at $TIMESTAMP
"

    # Stage and commit
    git add .
    git commit -m "$COMMIT_MSG" > /dev/null 2>&1

    # Push with retry
    BRANCH=$(git branch --show-current)
    if git push -u origin "$BRANCH" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Changes pushed to $BRANCH${NC}"
        LAST_COMMIT=$TIMESTAMP
    else
        echo -e "${YELLOW}⚠ Push failed, will retry...${NC}"
    fi
}

# Main watch loop
while true; do
    check_and_push
    sleep $WATCH_INTERVAL
done

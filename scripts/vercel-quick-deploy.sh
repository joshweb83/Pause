#!/bin/bash

# Pause - Vercel Quick Deploy
# 빠른 Vercel 배포 스크립트

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}"
cat << "EOF"
⏸ Pause - Vercel Quick Deploy
================================
EOF
echo -e "${NC}"

# Check if in correct directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: Not in frontend directory${NC}"
    echo "Please run from: cd frontend"
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}Vercel CLI not found. Installing...${NC}"
    npm install -g vercel
fi

# Check if already logged in
echo -e "${BLUE}Step 1: Vercel Login${NC}"
if ! vercel whoami &> /dev/null; then
    echo "Please login to Vercel..."
    vercel login
else
    VERCEL_USER=$(vercel whoami)
    echo -e "${GREEN}✓ Already logged in as: $VERCEL_USER${NC}"
fi

# Check if project is linked
echo ""
echo -e "${BLUE}Step 2: Project Setup${NC}"
if [ ! -d ".vercel" ]; then
    echo "Linking to Vercel project..."
    vercel link
else
    echo -e "${GREEN}✓ Project already linked${NC}"
fi

# Show project info
if [ -f ".vercel/project.json" ]; then
    echo ""
    echo -e "${GREEN}Project Information:${NC}"
    echo "-----------------------------------"
    cat .vercel/project.json | jq '.'
    echo "-----------------------------------"

    ORG_ID=$(cat .vercel/project.json | jq -r '.orgId')
    PROJECT_ID=$(cat .vercel/project.json | jq -r '.projectId')

    echo ""
    echo -e "${YELLOW}GitHub Secrets 설정이 필요합니다:${NC}"
    echo "1. https://github.com/joshweb83/Pause/settings/secrets/actions"
    echo ""
    echo "VERCEL_ORG_ID: $ORG_ID"
    echo "VERCEL_PROJECT_ID: $PROJECT_ID"
    echo "VERCEL_TOKEN: (https://vercel.com/account/tokens에서 생성)"
    echo ""
fi

# Deploy options
echo -e "${BLUE}Step 3: Deploy${NC}"
echo "Choose deployment type:"
echo "1) Preview (테스트 배포)"
echo "2) Production (프로덕션 배포)"
echo "3) Skip (나중에)"
read -p "선택 (1-3): " DEPLOY_CHOICE

case $DEPLOY_CHOICE in
    1)
        echo ""
        echo -e "${YELLOW}Preview 배포 시작...${NC}"
        vercel
        ;;
    2)
        echo ""
        echo -e "${YELLOW}Production 배포 시작...${NC}"
        vercel --prod
        ;;
    3)
        echo ""
        echo -e "${YELLOW}배포를 건너뜁니다.${NC}"
        ;;
    *)
        echo ""
        echo -e "${RED}잘못된 선택${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}✓ Setup Complete!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""

# Next steps
echo -e "${BLUE}다음 단계:${NC}"
echo ""
echo "1. GitHub Secrets 설정"
echo "   https://github.com/joshweb83/Pause/settings/secrets/actions"
echo ""
echo "2. Vercel 환경 변수 설정"
echo "   https://vercel.com/dashboard"
echo "   Settings → Environment Variables"
echo "   NEXT_PUBLIC_API_URL 추가"
echo ""
echo "3. 자동 배포 테스트"
echo "   cd ~/Pause"
echo "   make deploy"
echo ""
echo -e "${GREEN}Happy deploying! 🚀${NC}"

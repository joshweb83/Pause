#!/bin/bash

# Pause - Vercel Setup Script
# Vercel 프로젝트 설정을 도와주는 스크립트

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}⏸ Pause - Vercel Setup${NC}"
echo "======================================"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}Vercel CLI not found. Installing...${NC}"
    npm install -g vercel
fi

echo -e "${GREEN}Step 1: Login to Vercel${NC}"
echo "브라우저에서 Vercel 로그인을 진행합니다..."
vercel login

echo ""
echo -e "${GREEN}Step 2: Link Project${NC}"
echo "Vercel 프로젝트와 연결합니다..."
cd frontend
vercel link

echo ""
echo -e "${GREEN}Step 3: Set Environment Variables${NC}"
echo ""
echo "다음 환경 변수를 Vercel에 설정합니다:"
echo "1. NEXT_PUBLIC_API_URL - Backend API URL"
echo ""

read -p "Backend API URL을 입력하세요 (예: https://api.pause.com): " API_URL

if [ -n "$API_URL" ]; then
    echo "환경 변수 설정 중..."
    vercel env add NEXT_PUBLIC_API_URL production <<< "$API_URL"
    vercel env add NEXT_PUBLIC_API_URL preview <<< "$API_URL"
    vercel env add NEXT_PUBLIC_API_URL development <<< "$API_URL"
    echo -e "${GREEN}✓ 환경 변수 설정 완료${NC}"
fi

echo ""
echo -e "${GREEN}Step 4: Get Project Info${NC}"
PROJECT_INFO=$(vercel project ls 2>/dev/null | grep pause || echo "")

if [ -n "$PROJECT_INFO" ]; then
    echo "Vercel 프로젝트 정보:"
    vercel project ls | grep pause
fi

echo ""
echo -e "${GREEN}Step 5: GitHub Secrets 설정${NC}"
echo ""
echo "GitHub Actions를 위해 다음 Secrets를 추가하세요:"
echo "GitHub Repository → Settings → Secrets and variables → Actions"
echo ""
echo "필요한 Secrets:"
echo "1. VERCEL_TOKEN - Vercel에서 생성 (https://vercel.com/account/tokens)"
echo "2. VERCEL_ORG_ID - vercel.json의 orgId 값"
echo "3. VERCEL_PROJECT_ID - vercel.json의 projectId 값"
echo ""

# Extract IDs from .vercel/project.json if exists
if [ -f ".vercel/project.json" ]; then
    echo "현재 프로젝트 정보:"
    echo "-----------------------------------"
    cat .vercel/project.json
    echo "-----------------------------------"
    echo ""

    ORG_ID=$(cat .vercel/project.json | grep -o '"orgId": "[^"]*' | cut -d'"' -f4)
    PROJECT_ID=$(cat .vercel/project.json | grep -o '"projectId": "[^"]*' | cut -d'"' -f4)

    if [ -n "$ORG_ID" ]; then
        echo "VERCEL_ORG_ID: $ORG_ID"
    fi
    if [ -n "$PROJECT_ID" ]; then
        echo "VERCEL_PROJECT_ID: $PROJECT_ID"
    fi
fi

echo ""
echo -e "${GREEN}Step 6: Test Deployment${NC}"
read -p "지금 테스트 배포를 진행하시겠습니까? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "배포 중..."
    vercel --prod
fi

echo ""
echo -e "${GREEN}======================================"
echo "✓ Vercel 설정 완료!"
echo "======================================${NC}"
echo ""
echo "다음 단계:"
echo "1. GitHub Secrets 설정 (위의 값들 사용)"
echo "2. 코드를 푸시하면 자동으로 Vercel에 배포됩니다"
echo "3. main 브랜치 → Production"
echo "4. 다른 브랜치 → Preview"
echo ""
echo "Vercel Dashboard: https://vercel.com/dashboard"
echo ""

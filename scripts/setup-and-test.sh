#!/bin/bash

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 이모지
ROCKET="🚀"
CHECK="✅"
CROSS="❌"
CLOCK="⏳"
EYES="👀"
POINT="👉"

echo ""
echo -e "${PURPLE}═══════════════════════════════════════════════════${NC}"
echo -e "${PURPLE}   Main 브랜치 생성 및 자동화 테스트 도우미${NC}"
echo -e "${PURPLE}═══════════════════════════════════════════════════${NC}"
echo ""

# Step 1: Main 브랜치 존재 확인
echo -e "${CYAN}${CLOCK} Step 1: Main 브랜치 확인 중...${NC}"
sleep 1

if git ls-remote --heads origin main | grep -q main; then
    echo -e "${GREEN}${CHECK} Main 브랜치가 이미 존재합니다!${NC}"
    MAIN_EXISTS=true
else
    echo -e "${YELLOW}${CROSS} Main 브랜치가 아직 없습니다.${NC}"
    MAIN_EXISTS=false
fi

echo ""

# Step 2: Main 브랜치가 없으면 생성 안내
if [ "$MAIN_EXISTS" = false ]; then
    echo -e "${YELLOW}════════════════════════════════════════════${NC}"
    echo -e "${YELLOW}  Main 브랜치 생성이 필요합니다 (1분 소요)${NC}"
    echo -e "${YELLOW}════════════════════════════════════════════${NC}"
    echo ""
    echo -e "${BLUE}${POINT} GitHub 웹사이트에서 3번의 클릭만 하면 됩니다!${NC}"
    echo ""

    # 저장소 URL 가져오기
    REPO_URL=$(git remote get-url origin | sed 's/\.git$//' | sed 's|git@github.com:|https://github.com/|')

    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}  👇 아래 단계를 따라해주세요${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""

    echo -e "${CYAN}1️⃣  GitHub 저장소 열기:${NC}"
    echo -e "   ${REPO_URL}"
    echo ""

    echo -e "${CYAN}2️⃣  'Settings' 탭 클릭 (오른쪽 상단)${NC}"
    echo ""

    echo -e "${CYAN}3️⃣  왼쪽 메뉴 'General' 클릭${NC}"
    echo ""

    echo -e "${CYAN}4️⃣  'Default branch' 섹션 찾기${NC}"
    echo "   현재: claude/pause-visual-archive-system-..."
    echo ""

    echo -e "${CYAN}5️⃣  연필 아이콘 (✏️) 클릭${NC}"
    echo ""

    echo -e "${CYAN}6️⃣  브랜치 이름을 'main'으로 변경${NC}"
    echo ""

    echo -e "${CYAN}7️⃣  'Rename branch' 버튼 클릭${NC}"
    echo ""

    echo -e "${CYAN}8️⃣  확인 팝업에서 'I understand...' 클릭${NC}"
    echo ""

    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""

    # 브라우저로 열기
    echo -e "${PURPLE}${ROCKET} 브라우저를 열까요?${NC}"
    read -p "Enter를 누르면 브라우저가 열립니다 (Skip: n) " -n 1 -r
    echo ""

    if [[ ! $REPLY =~ ^[Nn]$ ]]; then
        echo -e "${BLUE}${EYES} 브라우저 열기...${NC}"
        if command -v xdg-open &> /dev/null; then
            xdg-open "${REPO_URL}/settings" 2>/dev/null
        elif command -v open &> /dev/null; then
            open "${REPO_URL}/settings" 2>/dev/null
        else
            echo -e "${YELLOW}브라우저를 수동으로 열어주세요:${NC}"
            echo "${REPO_URL}/settings"
        fi
    fi

    echo ""
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}  Main 브랜치 생성 후 아무 키나 누르세요...${NC}"
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    read -n 1 -s
    echo ""

    # 생성 확인 (재시도)
    echo -e "${CYAN}${CLOCK} Main 브랜치 생성 확인 중...${NC}"
    MAX_RETRIES=5
    RETRY=0

    while [ $RETRY -lt $MAX_RETRIES ]; do
        sleep 2
        git fetch origin > /dev/null 2>&1

        if git ls-remote --heads origin main | grep -q main; then
            echo -e "${GREEN}${CHECK} Main 브랜치 생성 완료!${NC}"
            MAIN_EXISTS=true
            break
        else
            RETRY=$((RETRY + 1))
            if [ $RETRY -lt $MAX_RETRIES ]; then
                echo -e "${YELLOW}  재확인 중... ($RETRY/$MAX_RETRIES)${NC}"
            fi
        fi
    done

    if [ "$MAIN_EXISTS" = false ]; then
        echo -e "${RED}${CROSS} Main 브랜치를 찾을 수 없습니다.${NC}"
        echo -e "${YELLOW}다시 확인해주세요:${NC}"
        echo "  1. GitHub Settings → General"
        echo "  2. Default branch를 'main'으로 변경"
        echo ""
        echo -e "${BLUE}완료 후 다시 이 스크립트를 실행하세요:${NC}"
        echo "  bash scripts/setup-and-test.sh"
        exit 1
    fi
fi

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}   ${CHECK} Main 브랜치 준비 완료!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo ""

# Step 3: Local에서 main 가져오기
echo -e "${CYAN}${CLOCK} Step 2: Main 브랜치 로컬로 가져오기...${NC}"
git fetch origin main > /dev/null 2>&1

if git show-ref --verify --quiet refs/remotes/origin/main; then
    echo -e "${GREEN}${CHECK} Main 브랜치 가져오기 완료!${NC}"
else
    echo -e "${RED}${CROSS} Main 브랜치를 가져오지 못했습니다.${NC}"
    exit 1
fi

echo ""

# Step 4: 테스트 파일 생성
echo -e "${CYAN}${CLOCK} Step 3: 테스트 파일 생성...${NC}"

TEST_FILE="AUTO_DEPLOY_TEST.md"
cat > "$TEST_FILE" <<'EOF'
# 🤖 자동 배포 테스트

이 파일은 자동 PR 생성 및 자동 머지 기능을 테스트하기 위해 생성되었습니다.

## 테스트 항목

- [x] Main 브랜치 생성
- [x] 테스트 파일 생성
- [ ] 자동 PR 생성
- [ ] Vercel Preview 배포
- [ ] Auto-merge 활성화
- [ ] 자동 머지 완료
- [ ] Production 배포

## 생성 시간

$(date '+%Y-%m-%d %H:%M:%S')

## 브랜치 정보

- Source: $(git branch --show-current)
- Target: main
- Commit: $(git rev-parse --short HEAD)

---

**이 파일은 자동화 테스트 후 삭제해도 됩니다.**
EOF

echo -e "${GREEN}${CHECK} 테스트 파일 생성 완료: $TEST_FILE${NC}"
echo ""

# Step 5: Commit
echo -e "${CYAN}${CLOCK} Step 4: 변경사항 커밋...${NC}"

git add "$TEST_FILE"
git commit -m "test: Test auto PR creation and auto-merge workflow

This is an automated test commit to verify:
- Auto PR creation from claude/ branch to main
- Auto-merge enablement
- Vercel preview deployment
- Automatic merge after checks pass

Test file: $TEST_FILE
Timestamp: $(date '+%Y-%m-%d %H:%M:%S')" > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo -e "${GREEN}${CHECK} 커밋 완료!${NC}"
else
    echo -e "${RED}${CROSS} 커밋 실패${NC}"
    exit 1
fi

echo ""

# Step 6: Push
echo -e "${CYAN}${CLOCK} Step 5: GitHub에 푸시...${NC}"
echo -e "${YELLOW}  이제 자동화가 시작됩니다! ${ROCKET}${NC}"
echo ""

CURRENT_BRANCH=$(git branch --show-current)
git push -u origin "$CURRENT_BRANCH"

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}${CHECK} 푸시 완료!${NC}"
else
    echo -e "${RED}${CROSS} 푸시 실패${NC}"
    exit 1
fi

echo ""

# Step 7: 자동화 시작 안내
echo -e "${PURPLE}═══════════════════════════════════════════════════${NC}"
echo -e "${PURPLE}   ${ROCKET} 자동화 프로세스 시작!${NC}"
echo -e "${PURPLE}═══════════════════════════════════════════════════${NC}"
echo ""

echo -e "${CYAN}다음 작업들이 자동으로 실행됩니다:${NC}"
echo ""
echo -e "${YELLOW}1. ${CLOCK} PR 자동 생성${NC} (약 10초)"
echo "   └─ claude/$CURRENT_BRANCH → main"
echo ""
echo -e "${YELLOW}2. ${CLOCK} Auto-merge 활성화${NC} (즉시)"
echo "   └─ 모든 체크 통과 후 자동 머지"
echo ""
echo -e "${YELLOW}3. ${CLOCK} Vercel Preview 배포${NC} (약 2-3분)"
echo "   └─ Preview URL 생성"
echo ""
echo -e "${YELLOW}4. ${CLOCK} PR 댓글 추가${NC} (배포 완료 후)"
echo "   └─ Preview URL 및 상세 정보"
echo ""
echo -e "${YELLOW}5. ${CLOCK} 자동 머지${NC} (체크 통과 후)"
echo "   └─ Squash merge to main"
echo ""
echo -e "${YELLOW}6. ${CLOCK} Production 배포${NC} (머지 완료 후)"
echo "   └─ Vercel Production"
echo ""

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Step 8: 모니터링 링크 제공
REPO_URL=$(git remote get-url origin | sed 's/\.git$//' | sed 's|git@github.com:|https://github.com/|')

echo -e "${BLUE}${EYES} 진행 상황 확인:${NC}"
echo ""
echo -e "${CYAN}GitHub Actions:${NC}"
echo "  $REPO_URL/actions"
echo ""
echo -e "${CYAN}Pull Requests:${NC}"
echo "  $REPO_URL/pulls"
echo ""

# Step 9: 자동 모니터링 옵션
echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${PURPLE}  실시간 모니터링을 시작할까요?${NC}"
echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "  y = GitHub Actions 실시간 로그 보기"
echo "  p = Pull Request 웹에서 열기"
echo "  a = GitHub Actions 웹에서 열기"
echo "  n = 종료"
echo ""
read -p "선택 (y/p/a/n): " -n 1 -r
echo ""
echo ""

case $REPLY in
    [Yy]* )
        echo -e "${BLUE}${CLOCK} GitHub Actions 로그 모니터링...${NC}"
        echo ""
        sleep 3
        gh run watch 2>/dev/null || {
            echo -e "${YELLOW}gh CLI가 설치되지 않았거나 로그인이 필요합니다.${NC}"
            echo "웹에서 확인: $REPO_URL/actions"
        }
        ;;
    [Pp]* )
        echo -e "${BLUE}${EYES} Pull Request 열기...${NC}"
        if command -v gh &> /dev/null; then
            sleep 5  # PR 생성 대기
            gh pr view --web 2>/dev/null || {
                echo "PR 생성 대기 중..."
                sleep 5
                gh pr view --web 2>/dev/null || echo "웹에서 확인: $REPO_URL/pulls"
            }
        else
            echo "웹에서 확인: $REPO_URL/pulls"
        fi
        ;;
    [Aa]* )
        echo -e "${BLUE}${EYES} GitHub Actions 열기...${NC}"
        if command -v xdg-open &> /dev/null; then
            xdg-open "$REPO_URL/actions" 2>/dev/null
        elif command -v open &> /dev/null; then
            open "$REPO_URL/actions" 2>/dev/null
        fi
        ;;
    * )
        echo -e "${GREEN}${CHECK} 완료!${NC}"
        ;;
esac

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}   ${CHECK} 테스트 완료!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo ""
echo -e "${CYAN}다음 명령어로 상태를 확인할 수 있습니다:${NC}"
echo ""
echo "  make pr-list      # PR 목록"
echo "  make pr-view      # PR 웹에서 열기"
echo "  make pr-check     # 상태 확인"
echo ""
echo -e "${YELLOW}약 5-10분 후 모든 자동화가 완료됩니다! ${ROCKET}${NC}"
echo ""

# 🚀 빠른 시작 가이드 (1분!)

## 한 줄 명령어로 모든 자동화 테스트

```bash
make setup-test
```

**그게 다입니다!** 🎉

---

## 🎯 이 명령어가 하는 일

### 1. Main 브랜치 확인 ✅
- Main 브랜치가 있는지 자동으로 확인
- 없으면 생성 방법을 단계별로 안내

### 2. GitHub 웹사이트 자동으로 열기 🌐
- Settings 페이지가 브라우저에서 바로 열림
- 3번의 클릭만으로 Main 브랜치 생성 가능

### 3. 테스트 파일 자동 생성 📝
- `AUTO_DEPLOY_TEST.md` 파일 생성
- 현재 시간과 브랜치 정보 포함

### 4. 자동으로 커밋 & 푸시 🚀
- 테스트 커밋 메시지 자동 생성
- GitHub에 푸시

### 5. 자동화 프로세스 시작 🤖
- PR 자동 생성
- Auto-merge 활성화
- Vercel Preview 배포
- 자동 머지
- Production 배포

### 6. 실시간 모니터링 옵션 👀
- GitHub Actions 로그 실시간 보기
- Pull Request 웹에서 열기
- 배포 상태 확인

---

## 📖 상세 사용 방법

### Step 1: 명령어 실행
```bash
cd /home/user/Pause
make setup-test
```

### Step 2: 화면 안내 따라하기
스크립트가 모든 것을 안내합니다:

```
═══════════════════════════════════════════════════
   Main 브랜치 생성 및 자동화 테스트 도우미
═══════════════════════════════════════════════════

⏳ Step 1: Main 브랜치 확인 중...
❌ Main 브랜치가 아직 없습니다.

════════════════════════════════════════════
  Main 브랜치 생성이 필요합니다 (1분 소요)
════════════════════════════════════════════

👉 GitHub 웹사이트에서 3번의 클릭만 하면 됩니다!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  👇 아래 단계를 따라해주세요
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1️⃣  GitHub 저장소 열기:
   https://github.com/joshweb83/Pause

2️⃣  'Settings' 탭 클릭 (오른쪽 상단)

3️⃣  왼쪽 메뉴 'General' 클릭

4️⃣  'Default branch' 섹션 찾기
   현재: claude/pause-visual-archive-system-...

5️⃣  연필 아이콘 (✏️) 클릭

6️⃣  브랜치 이름을 'main'으로 변경

7️⃣  'Rename branch' 버튼 클릭

8️⃣  확인 팝업에서 'I understand...' 클릭

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 브라우저를 열까요?
Enter를 누르면 브라우저가 열립니다 (Skip: n)
```

### Step 3: Enter 누르기
- 브라우저가 자동으로 열림
- GitHub Settings 페이지로 이동

### Step 4: Main 브랜치 생성
- 화면 안내대로 클릭만 하면 됨 (약 30초)
- 완료 후 터미널로 돌아가서 아무 키나 누르기

### Step 5: 자동화 시작
스크립트가 자동으로:
- ✅ Main 브랜치 확인
- ✅ 테스트 파일 생성
- ✅ 커밋
- ✅ 푸시
- ✅ 자동화 트리거

### Step 6: 모니터링 (선택)
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  실시간 모니터링을 시작할까요?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  y = GitHub Actions 실시간 로그 보기
  p = Pull Request 웹에서 열기
  a = GitHub Actions 웹에서 열기
  n = 종료

선택 (y/p/a/n):
```

---

## 🎬 실제 사용 예시

### 케이스 1: Main 브랜치가 없을 때

```bash
$ make setup-test

⏳ Main 브랜치 확인 중...
❌ Main 브랜치가 아직 없습니다.

👉 GitHub 웹사이트에서 3번의 클릭만 하면 됩니다!

[단계별 안내 표시]

🚀 브라우저를 열까요?
[Enter 키 누름]

👀 브라우저 열기...
[브라우저가 GitHub Settings 페이지로 이동]

[GitHub에서 브랜치 이름 변경: main]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Main 브랜치 생성 후 아무 키나 누르세요...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[아무 키나 누름]

⏳ Main 브랜치 생성 확인 중...
✅ Main 브랜치 생성 완료!

✅ Main 브랜치 가져오기 완료!
✅ 테스트 파일 생성 완료!
✅ 커밋 완료!
✅ 푸시 완료!

🚀 자동화 프로세스 시작!

[자동화 항목 목록 표시]

선택 (y/p/a/n): p

👀 Pull Request 열기...
[브라우저가 PR 페이지로 이동]

✅ 완료!
```

### 케이스 2: Main 브랜치가 이미 있을 때

```bash
$ make setup-test

⏳ Main 브랜치 확인 중...
✅ Main 브랜치가 이미 존재합니다!

✅ Main 브랜치 가져오기 완료!
✅ 테스트 파일 생성 완료!
✅ 커밋 완료!
✅ 푸시 완료!

🚀 자동화 프로세스 시작!

[자동화 진행...]
```

---

## 📊 자동화 결과 확인

### 5초 후: PR 생성
```
https://github.com/joshweb83/Pause/pulls
→ 새로운 PR 확인: "🚀 Auto PR: pause-visual-archive-system"
```

### 2분 후: Vercel Preview 배포
```
PR 댓글에 Preview URL 추가됨:
"✅ Preview deployed to: https://pause-xxx.vercel.app"
```

### 5분 후: 자동 머지
```
PR이 자동으로 main에 머지됨
→ Production 배포 시작
```

### 7분 후: Production 배포 완료
```
https://pause.vercel.app (또는 설정한 도메인)
→ Production 사이트 업데이트 완료
```

---

## 🔍 상태 확인 명령어

### PR 목록 보기
```bash
make pr-list
```

### 현재 PR 웹에서 열기
```bash
make pr-view
```

### 상태 한눈에 확인
```bash
make pr-check
```

**출력 예시**:
```
🔍 Checking PR status...

GitHub Actions:
STATUS  WORKFLOW       BRANCH                         EVENT
✓       Vercel Deploy  claude/pause-visual-archive... push
*       Auto PR        claude/pause-visual-archive... push

Current PR:
title:   🚀 Auto PR: pause-visual-archive-system
state:   OPEN
url:     https://github.com/joshweb83/Pause/pull/1

Vercel deployments:
pause-xxx.vercel.app  (Preview)  Ready  2m ago
```

---

## 💡 문제 해결

### Q1: "Main 브랜치를 찾을 수 없습니다" 에러
**해결**:
1. GitHub 웹에서 브랜치 이름 변경 확인
2. 이름이 정확히 `main`인지 확인 (소문자)
3. 다시 실행: `make setup-test`

### Q2: 브라우저가 안 열려요
**해결**:
- 수동으로 열기: https://github.com/joshweb83/Pause/settings
- 또는 `n` 입력 후 수동으로 브라우저에서 진행

### Q3: Push가 실패해요
**해결**:
```bash
# 인증 확인
git config --global user.name
git config --global user.email

# 다시 시도
make setup-test
```

### Q4: PR이 생성 안 돼요
**확인사항**:
1. GitHub Actions 권한 확인
   - Settings → Actions → General
   - "Read and write permissions" 선택
   - "Allow GitHub Actions to create and approve pull requests" 체크

2. GitHub Actions 로그 확인
   ```bash
   gh run list
   gh run view --log
   ```

---

## 🎯 다음 단계

### 테스트 성공 후 일반 개발
```bash
# 1. 코드 작성
vim frontend/src/app/page.tsx

# 2. 커밋 & 푸시
make push

# 3. 자동으로 PR 생성, 배포, 머지됨!
```

### 추가 설정 (선택사항)
- Vercel Secrets 설정 (VERCEL_SETUP_GUIDE.md)
- GitHub Actions 권한 설정 (AUTO_PR_MERGE_GUIDE.md)
- Auto-merge 활성화 (AUTO_PR_MERGE_GUIDE.md)

---

## 📚 관련 문서

- `AUTO_PR_MERGE_GUIDE.md` - 자동 PR/머지 완전 가이드
- `SETUP_MAIN_BRANCH.md` - Main 브랜치 설정 상세 가이드
- `VERCEL_SETUP_GUIDE.md` - Vercel 초기 설정
- `VERCEL_PR_PREVIEW.md` - PR Preview 기능 설명

---

## 🎉 요약

**단 하나의 명령어**:
```bash
make setup-test
```

**결과**:
- ✅ Main 브랜치 설정
- ✅ 자동화 테스트
- ✅ 전체 워크플로우 확인
- ✅ 5-10분 후 완전 자동 배포

**이제 개발만 하면 됩니다!** 🚀

---

**바로 시작하기**:
```bash
cd /home/user/Pause
make setup-test
```

그리고 화면의 안내를 따라하세요! 🎊

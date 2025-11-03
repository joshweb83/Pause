# Pause - 자동화 가이드 (Automation Guide)

GitHub 자동 푸시 및 CI/CD 설정 가이드입니다.

## 🚀 자동 푸시 방법 (Auto-Push Methods)

### 방법 1: 스마트 커밋 스크립트 (권장)

변경 사항을 분석하여 의미있는 커밋 메시지를 자동 생성합니다.

```bash
# 한 번 실행
./scripts/smart-commit.sh

# 또는 Make 명령어 사용
make commit
```

**특징:**
- ✅ 변경된 파일 자동 분석
- ✅ 적절한 커밋 타입 자동 선택 (feat/fix/chore)
- ✅ 커밋 전 확인 가능
- ✅ 자동 재시도 로직

### 방법 2: 빠른 푸시 스크립트

간단하게 모든 변경사항을 커밋하고 푸시합니다.

```bash
# 자동으로 커밋하고 푸시
./scripts/auto-push.sh

# 확인 없이 자동 실행
AUTO_CONFIRM=true ./scripts/auto-push.sh

# Make 명령어
make push
```

### 방법 3: 자동 감시 모드 (Watch Mode)

파일 변경을 실시간으로 감지하여 자동으로 푸시합니다.

```bash
# 백그라운드에서 실행
./scripts/watch-and-push.sh

# Make 명령어
make watch

# 중지: Ctrl+C
```

**설정:**
- 기본 감시 간격: 30초
- `scripts/watch-and-push.sh`에서 `WATCH_INTERVAL` 수정 가능

### 방법 4: Git Hooks (자동 실행)

커밋할 때마다 자동으로 검사 및 푸시합니다.

```bash
# Husky 설치 (Node.js 프로젝트)
cd frontend
npm install husky --save-dev
npx husky install

# 또는 수동으로 Git hooks 복사
cp .husky/pre-commit .git/hooks/pre-commit
cp .husky/post-commit .git/hooks/post-commit
chmod +x .git/hooks/*
```

**자동 푸시 활성화:**

`.husky/post-commit` 파일에서 주석 해제:

```bash
# 이 부분의 주석을 제거하세요
echo "📤 Auto-pushing to remote..."
BRANCH=$(git branch --show-current)
git push -u origin "$BRANCH" 2>/dev/null || echo "⚠️  Push failed."
```

## 🤖 GitHub Actions (CI/CD)

Push할 때마다 자동으로 실행되는 워크플로우가 설정되어 있습니다.

### CI Pipeline (`.github/workflows/ci.yml`)

자동으로 실행되는 검사:

1. **Backend Linting** - Python 코드 품질 검사
   - Flake8로 에러 검사
   - Black으로 포맷 검사

2. **Backend Tests** - 백엔드 테스트 실행
   - PostgreSQL 테스트 DB 자동 생성
   - pytest 실행

3. **Frontend Linting** - TypeScript 코드 검사
   - ESLint 검사
   - TypeScript 타입 체크

4. **Frontend Build** - 프론트엔드 빌드 테스트
   - Next.js 빌드 검증

5. **Docker Build** - Docker 이미지 빌드 테스트

### 트리거 조건

```yaml
on:
  push:
    branches: [ main, develop, 'claude/**' ]
  pull_request:
    branches: [ main, develop ]
```

- `main`, `develop` 브랜치에 push
- `claude/` 로 시작하는 모든 브랜치에 push
- PR 생성 시

### 자동 커밋 기능

CI가 성공하면 변경사항을 자동으로 커밋/푸시합니다:

```yaml
auto-commit:
  needs: [backend-lint, frontend-lint, frontend-build]
  # 모든 검사 통과 후 실행
```

## 📋 Makefile 명령어

편리한 명령어 모음:

```bash
make help       # 사용 가능한 명령어 보기
make start      # Docker로 서비스 시작
make stop       # 서비스 중지
make commit     # 스마트 커밋
make push       # 빠른 푸시
make watch      # 자동 감시 모드
make logs       # Docker 로그 보기
make clean      # 정리
make test       # 테스트 실행
```

## 🔧 설정 방법

### 1. 스크립트 실행 권한 부여

```bash
chmod +x scripts/*.sh
chmod +x .husky/*
```

### 2. Git 설정

```bash
# 사용자 정보 설정
git config user.name "Your Name"
git config user.email "your.email@example.com"

# 자동 push 활성화 (선택사항)
git config push.default current
```

### 3. GitHub Actions 활성화

저장소 설정에서 Actions 활성화:

1. GitHub 저장소 → Settings
2. Actions → General
3. "Allow all actions" 선택
4. "Read and write permissions" 활성화

## 📦 추천 워크플로우

### 개발 중 (Development)

**옵션 A: 수동 제어 (추천)**
```bash
# 작업 완료 후
make commit    # 스마트 커밋으로 푸시
```

**옵션 B: 자동 감시**
```bash
# 터미널에서 실행 (별도 탭)
make watch     # 30초마다 자동 체크
```

**옵션 C: Git Hooks**
```bash
git commit -m "message"
# → 자동으로 검사 및 푸시
```

### 중요한 업데이트

```bash
# 직접 커밋 메시지 작성
git add .
git commit -m "feat: 새로운 기능 추가"
git push
```

## 🔐 보안 고려사항

### 자동 푸시 시 주의사항

❌ **절대 푸시하면 안 되는 것:**
- `.env` 파일 (환경 변수)
- 데이터베이스 백업
- API 키, 비밀번호
- 대용량 미디어 파일

✅ **자동으로 제외됨 (`.gitignore`):**
- `node_modules/`
- `venv/`, `__pycache__/`
- `*.env`
- `*.mp4`, `*.mov` (동영상)
- `*.pdf` (생성된 PDF)

### 민감한 정보 확인

```bash
# 푸시 전에 확인
git status
git diff --staged

# 실수로 추가된 파일 제거
git reset HEAD <file>
```

## 🐛 문제 해결

### Push 실패

```bash
# 원격 변경사항 가져오기
git pull origin $(git branch --show-current)

# 강제 푸시 (주의!)
git push -f origin $(git branch --show-current)
```

### 스크립트 실행 안 됨

```bash
# 권한 확인
ls -la scripts/

# 권한 부여
chmod +x scripts/*.sh

# Bash로 직접 실행
bash scripts/auto-push.sh
```

### GitHub Actions 실패

1. GitHub 저장소의 Actions 탭 확인
2. 실패한 워크플로우 클릭
3. 에러 로그 확인
4. 수정 후 다시 push

## 📊 모니터링

### GitHub Actions 상태 확인

```bash
# CLI로 확인 (gh 설치 필요)
gh run list
gh run view <run-id>
```

### 로컬 로그

```bash
# Git 로그
git log --oneline -10

# Docker 로그
make logs

# 특정 서비스 로그
docker-compose logs -f backend
docker-compose logs -f frontend
```

## 🎯 추천 설정

**빠른 개발을 위한 설정:**

1. `watch-and-push.sh` 사용
2. 백그라운드 실행: `nohup make watch > /dev/null 2>&1 &`
3. 작업 종료 시 중지: `pkill -f watch-and-push`

**안정적인 개발을 위한 설정:**

1. Git hooks 활성화
2. 수동 `make commit` 사용
3. PR 생성 전 CI 통과 확인

## 💡 팁

### 빠른 명령어 별칭 (Bash)

`~/.bashrc` 또는 `~/.zshrc`에 추가:

```bash
alias pause-push='cd ~/Pause && make push'
alias pause-commit='cd ~/Pause && make commit'
alias pause-watch='cd ~/Pause && make watch'
alias pause-start='cd ~/Pause && make start'
alias pause-stop='cd ~/Pause && make stop'
```

적용:
```bash
source ~/.bashrc  # 또는 source ~/.zshrc
```

사용:
```bash
pause-push     # 어디서든 푸시!
pause-commit   # 어디서든 커밋!
```

## 🚀 고급 기능

### 브랜치 자동 생성 및 푸시

```bash
# 새 기능 브랜치 생성 및 푸시
git checkout -b feature/new-feature
make push

# 자동으로 원격에 브랜치 생성 및 푸시
```

### 특정 파일만 자동 푸시

`scripts/` 디렉토리에 커스텀 스크립트 추가 가능:

```bash
# scripts/push-docs.sh
git add docs/
git commit -m "docs: Update documentation"
git push
```

## 📚 더 알아보기

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Husky Documentation](https://typicode.github.io/husky/)

---

**문제가 있나요?**
- GitHub Issues에 문의
- 또는 `make help` 명령어 확인

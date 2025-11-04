# 🤖 자동 PR 생성 및 자동 머지 가이드

## 📋 개요

이제 코드를 푸시하면 **자동으로**:
1. ✅ PR이 생성됩니다
2. ✅ Vercel Preview가 배포됩니다
3. ✅ 모든 체크가 통과하면 자동으로 main에 머지됩니다

---

## 🚀 사용 방법

### 1. 코드 작업 및 푸시
```bash
# 현재 claude/ 브랜치에서 작업
git add .
git commit -m "feat: Add new feature"
git push
```

### 2. 자동 실행 (건드릴 필요 없음!)
```
푸시 완료
   ↓
GitHub Actions 트리거
   ↓
PR 자동 생성 (main으로)
   ↓
Auto-merge 활성화
   ↓
Vercel Preview 배포
   ↓
모든 체크 통과 대기
   ↓
자동 머지! 🎉
```

### 3. 확인
```bash
# GitHub에서 PR 확인
https://github.com/joshweb83/Pause/pulls

# 또는 CLI로
gh pr list
gh pr view
```

---

## ⚙️ 필수 설정 (5분)

Auto-merge가 작동하려면 GitHub에서 몇 가지 설정이 필요합니다.

### Step 1: Main 브랜치 생성 (1분)

> ⚠️ **중요**: Main 브랜치가 없으면 PR을 생성할 수 없습니다!

**방법**: `SETUP_MAIN_BRANCH.md` 파일 참고

**빠른 방법**:
1. https://github.com/joshweb83/Pause 접속
2. Branches 메뉴 클릭
3. 현재 `claude/pause-visual-archive-system-...` 브랜치 찾기
4. 연필 아이콘 → `main`으로 이름 변경

### Step 2: GitHub Actions 권한 설정 (1분)

PR을 자동으로 생성하고 머지하려면 권한이 필요합니다.

**설정 방법**:
```
1. GitHub 저장소 → Settings
2. 왼쪽 메뉴 → Actions → General
3. "Workflow permissions" 섹션 찾기
4. "Read and write permissions" 선택 ✅
5. "Allow GitHub Actions to create and approve pull requests" 체크 ✅
6. Save 클릭
```

**스크린샷으로 확인**:
```
Settings > Actions > General > Workflow permissions

( ) Read repository contents and packages permissions
(●) Read and write permissions  ← 이거 선택!

[✓] Allow GitHub Actions to create and approve pull requests  ← 체크!
```

### Step 3: Auto-merge 활성화 (30초)

**설정 방법**:
```
1. GitHub 저장소 → Settings
2. 왼쪽 메뉴 → General
3. "Pull Requests" 섹션까지 스크롤
4. "Allow auto-merge" 체크 ✅
5. Save changes
```

### Step 4: 브랜치 보호 규칙 (선택사항)

자동 머지 전에 체크를 강제하려면:

**설정 방법**:
```
1. Settings → Branches
2. "Add rule" 클릭
3. Branch name pattern: main
4. 다음 옵션 선택:
   ✅ Require status checks to pass before merging
   ✅ Require branches to be up to date before merging

   Status checks (선택):
   ✅ Vercel Deploy

5. Create 또는 Save changes
```

**주의**: 너무 엄격한 규칙을 설정하면 자동 머지가 안 될 수 있습니다.

---

## 🎯 전체 워크플로우

### 개발자 작업 (직접 수행)
```bash
# 1. 코드 작성
vim frontend/src/app/page.tsx

# 2. 커밋
git add .
git commit -m "feat: Improve homepage UI"

# 3. 푸시
git push
```

### 자동 실행 (GitHub Actions)
```
┌─────────────────────────────────────────┐
│ 1. Push to claude/** branch             │
└────────────┬────────────────────────────┘
             ▼
┌─────────────────────────────────────────┐
│ 2. Auto PR workflow triggered           │
│    .github/workflows/auto-pr-and-merge  │
└────────────┬────────────────────────────┘
             ▼
┌─────────────────────────────────────────┐
│ 3. Check if main branch exists          │
│    ✅ Yes → Continue                    │
│    ❌ No → Exit with message            │
└────────────┬────────────────────────────┘
             ▼
┌─────────────────────────────────────────┐
│ 4. Check if PR already exists           │
│    ✅ Yes → Reuse PR                    │
│    ❌ No → Create new PR                │
└────────────┬────────────────────────────┘
             ▼
┌─────────────────────────────────────────┐
│ 5. Create PR to main                    │
│    - Title: "🚀 Auto PR: [feature]"    │
│    - Body: Auto-generated template      │
│    - Labels: auto-merge, automated-pr   │
└────────────┬────────────────────────────┘
             ▼
┌─────────────────────────────────────────┐
│ 6. Enable auto-merge                    │
│    - Method: Squash merge               │
│    - Wait for checks                    │
└────────────┬────────────────────────────┘
             ▼
┌─────────────────────────────────────────┐
│ 7. Vercel Deploy workflow triggered     │
│    - Deploy preview                     │
│    - Update PR comment                  │
│    - Set deployment status              │
└────────────┬────────────────────────────┘
             ▼
┌─────────────────────────────────────────┐
│ 8. Wait for all checks                  │
│    ⏳ Vercel Deploy: In progress        │
│    ⏳ Other checks: Pending             │
└────────────┬────────────────────────────┘
             ▼
┌─────────────────────────────────────────┐
│ 9. All checks passed ✅                 │
│    ✅ Vercel Deploy: Success            │
│    ✅ All required checks passed        │
└────────────┬────────────────────────────┘
             ▼
┌─────────────────────────────────────────┐
│ 10. Auto-merge! 🎉                      │
│     - Squash commits                    │
│     - Merge to main                     │
│     - Delete branch (optional)          │
└────────────┬────────────────────────────┘
             ▼
┌─────────────────────────────────────────┐
│ 11. Production deploy triggered         │
│     - Deploy to Vercel Production       │
│     - Update to main branch             │
└─────────────────────────────────────────┘
```

---

## 📊 PR 자동 생성 예시

### 생성되는 PR 내용:
```markdown
## 🤖 Auto-generated Pull Request

This PR was automatically created from branch `claude/feature-name`.

### 📊 Summary
- **Branch**: `claude/feature-name`
- **Author**: @joshweb83
- **Files Changed**: 5
- **Latest Commit**:
  ```
  feat: Add new dashboard widget
  ```

### 🚀 Deployment
- ✅ Preview deployment will be available automatically
- ✅ Auto-merge is enabled (after checks pass)

### 📋 Checklist
- [x] Code changes committed
- [x] Branch pushed to GitHub
- [x] PR created automatically
- [ ] Preview deployment successful
- [ ] All checks passed
- [ ] Auto-merge completed

---

> 💡 **Auto-merge**: This PR will automatically merge into `main` after all required checks pass.
```

---

## 🔧 커스터마이징

### PR 제목 형식 변경

`.github/workflows/auto-pr-and-merge.yml` 파일에서:

```yaml
# 현재
--title "🚀 Auto PR: $FEATURE_NAME"

# 변경 예시
--title "feat: $FEATURE_NAME"
--title "[AUTO] $FEATURE_NAME"
--title "🤖 Automated PR - $FEATURE_NAME"
```

### Merge 방식 변경

```yaml
# Squash merge (기본)
gh pr merge "$PR_NUMBER" --auto --squash

# Merge commit
gh pr merge "$PR_NUMBER" --auto --merge

# Rebase
gh pr merge "$PR_NUMBER" --auto --rebase
```

### 자동 레이블 추가

```yaml
# 레이블 추가/변경
gh pr edit "$PR_NUMBER" --add-label "auto-merge,automated-pr,frontend,enhancement"
```

---

## 🚨 문제 해결

### Q1: PR이 자동 생성되지 않아요
**확인사항**:
1. Main 브랜치가 존재하는지 확인
   ```bash
   git ls-remote --heads origin main
   ```
2. GitHub Actions 권한 확인 (Settings → Actions → General)
3. GitHub Actions 로그 확인
   ```bash
   gh run list
   gh run view --log
   ```

### Q2: Auto-merge가 활성화되지 않아요
**확인사항**:
1. Settings → General → "Allow auto-merge" 체크 확인
2. GitHub Actions 권한 확인
3. PR에서 직접 활성화:
   ```bash
   gh pr merge <PR번호> --auto --squash
   ```

### Q3: PR이 자동 머지되지 않아요
**확인사항**:
1. 모든 required checks가 통과했는지 확인
2. 브랜치 보호 규칙이 너무 엄격하지 않은지 확인
3. Vercel 배포가 성공했는지 확인
4. PR 상태 확인:
   ```bash
   gh pr view <PR번호>
   ```

### Q4: "403 Forbidden" 에러
**해결방법**:
- GitHub Actions의 "Read and write permissions" 활성화
- "Allow GitHub Actions to create and approve pull requests" 체크

### Q5: 브랜치 보호 규칙 충돌
**해결방법**:
1. Settings → Branches → main 규칙 편집
2. "Allow force pushes" 제거 (있다면)
3. Required reviewers를 0으로 설정 (자동 머지용)

---

## 💡 고급 사용법

### 1. Auto-merge 비활성화하고 싶을 때

PR 설명에 특정 키워드를 추가하면 자동 머지를 건너뛰도록 설정:

```yaml
# .github/workflows/auto-pr-and-merge.yml에 추가
- name: Check for skip label
  run: |
    if echo "${{ github.event.head_commit.message }}" | grep -q "\[skip-merge\]"; then
      echo "Skipping auto-merge"
      exit 0
    fi
```

**사용 방법**:
```bash
git commit -m "feat: Add feature [skip-merge]"
```

### 2. 특정 브랜치만 자동 PR

```yaml
# 현재 - 모든 claude/** 브랜치
branches:
  - 'claude/**'

# 변경 - 특정 패턴만
branches:
  - 'claude/feature-**'
  - 'claude/fix-**'
```

### 3. 머지 후 브랜치 자동 삭제

```yaml
- name: Delete branch after merge
  if: success()
  run: |
    gh pr merge "$PR_NUMBER" --auto --squash --delete-branch
```

---

## 📋 완료 체크리스트

설정 완료 확인:

- [ ] Main 브랜치 생성됨
- [ ] GitHub Actions 권한 설정 (Read and write)
- [ ] PR 생성 권한 활성화
- [ ] Auto-merge 활성화 (Settings → General)
- [ ] Vercel Secrets 설정 (3개)
- [ ] 테스트 푸시 완료
- [ ] PR 자동 생성 확인
- [ ] Auto-merge 활성화 확인
- [ ] Vercel Preview 배포 확인
- [ ] 자동 머지 완료 확인

---

## 🎉 테스트 방법

### 간단한 테스트:
```bash
# 1. 작은 변경사항 추가
echo "# Test Auto PR" >> TEST_AUTO_PR.md

# 2. 커밋
git add TEST_AUTO_PR.md
git commit -m "test: Test auto PR and merge"

# 3. 푸시
git push

# 4. GitHub 확인
# - Actions 탭: 워크플로우 실행 확인
# - Pull requests 탭: PR 자동 생성 확인
# - PR 페이지: Auto-merge 활성화 확인
# - 2-3분 후: 자동 머지 완료 확인
```

### 전체 프로세스 확인:
```bash
# 워크플로우 실행 모니터링
gh run watch

# PR 상태 확인
gh pr list
gh pr view --web

# Vercel 배포 확인
vercel ls
```

---

## 📚 추가 리소스

- **GitHub Auto-merge 공식 문서**: https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/incorporating-changes-from-a-pull-request/automatically-merging-a-pull-request
- **GitHub Actions 공식 문서**: https://docs.github.com/en/actions
- **Vercel 배포 가이드**: `VERCEL_SETUP_GUIDE.md`
- **Main 브랜치 설정**: `SETUP_MAIN_BRANCH.md`
- **PR Preview 가이드**: `VERCEL_PR_PREVIEW.md`

---

## 🎯 요약

### 이제 할 일:
1. **코드만 작성하세요** ✍️
2. **커밋하고 푸시하세요** 🚀
3. **나머지는 자동입니다!** 🤖

### 자동으로 실행되는 것:
- ✅ PR 생성
- ✅ Preview 배포
- ✅ 상태 체크
- ✅ 머지
- ✅ Production 배포

**개발에만 집중하세요!** 🎉

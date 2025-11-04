# 🚀 Main 브랜치 생성 가이드 (1분 완료)

## ⚠️ 현재 상황

GitHub의 브랜치 보호 규칙으로 인해 **로컬에서 main 브랜치를 푸시할 수 없습니다** (403 에러).

```
error: RPC failed; HTTP 403
```

**해결방법**: GitHub 웹 UI에서 1분 안에 main 브랜치를 만들 수 있습니다!

---

## ✅ 방법 1: GitHub 웹에서 브랜치 이름 변경 (30초)

### Step 1: GitHub 저장소 이동
```
https://github.com/joshweb83/Pause
```

### Step 2: 브랜치 설정
1. **Branches** 메뉴 클릭 (Code 탭 옆)
2. 현재 브랜치 찾기:
   ```
   claude/pause-visual-archive-system-011CUkhHzJpXycRUtLmZeUCb
   ```
3. 브랜치 옆 **연필 아이콘** 클릭
4. 이름을 `main`으로 변경
5. **Rename branch** 클릭

### Step 3: 로컬에서 확인
```bash
git fetch origin
git branch -a
# origin/main이 보이면 성공!
```

---

## ✅ 방법 2: GitHub Settings에서 기본 브랜치 변경 (1분)

### Step 1: Settings 이동
```
https://github.com/joshweb83/Pause/settings
```

### Step 2: Default branch 변경
1. **General** 섹션의 **Default branch** 찾기
2. 현재: `claude/pause-visual-archive-system-...`
3. **Switch to another branch** 클릭
4. `main` 입력하고 **Rename branch** 선택
5. 확인 팝업에서 **I understand, update the default branch** 클릭

### Step 3: 완료!
```bash
git fetch origin
git checkout main
```

---

## ✅ 방법 3: 새로운 main 브랜치 생성 (GitHub 웹)

### Step 1: GitHub 저장소에서
1. 브랜치 드롭다운 클릭 (왼쪽 상단)
2. **View all branches** 클릭
3. **New branch** 버튼 클릭
4. Branch name: `main`
5. Source: 현재 `claude/pause-visual-archive-system-...` 선택
6. **Create branch** 클릭

### Step 2: 로컬에서 가져오기
```bash
git fetch origin
git checkout main
git branch -u origin/main
```

---

## 🎯 Main 브랜치 생성 후 할 일

### 1. 로컬 브랜치 업데이트
```bash
# main 브랜치 가져오기
git fetch origin
git checkout main
git pull origin main

# 기존 claude 브랜치 삭제 (선택사항)
git branch -d claude/pause-visual-archive-system-011CUkhHzJpXycRUtLmZeUCb
```

### 2. Vercel 자동 배포 확인
Main 브랜치에 푸시하면 자동으로 **Production** 배포됩니다!

```bash
# 변경사항 테스트
echo "# Main branch" >> README.md
git add README.md
git commit -m "docs: Update README for main branch"
git push origin main
```

### 3. GitHub Actions 확인
1. GitHub 저장소 → **Actions** 탭
2. "Vercel Deploy" 워크플로우 실행 확인
3. 약 2-3분 후 배포 완료

### 4. Vercel 배포 URL 확인
배포 완료 후:
- Production URL: `https://pause.vercel.app` (또는 설정한 도메인)
- GitHub Actions 로그에서 URL 확인

---

## 🔧 이미 설정된 자동화

### ✅ GitHub Actions
- `.github/workflows/vercel-deploy.yml` ← 이미 설정됨
- main 브랜치 푸시 시 자동 실행
- Production 배포 자동 수행

### ✅ Vercel 설정
- `frontend/vercel.json` ← 이미 설정됨
- GitHub 통합 활성화
- Seoul 리전 (icn1)
- 자동 빌드 & 배포

### ✅ 필요한 GitHub Secrets (확인 필요)
```bash
# GitHub 저장소 → Settings → Secrets and variables → Actions
```

다음 3개가 설정되어 있어야 합니다:
1. **VERCEL_TOKEN** ← Vercel CLI 토큰
2. **VERCEL_ORG_ID** ← Vercel 조직 ID
3. **VERCEL_PROJECT_ID** ← Vercel 프로젝트 ID

**아직 설정 안 했다면?** → `VERCEL_SETUP_GUIDE.md` 참고

---

## 📊 전체 자동화 흐름

```
┌─────────────────────────────────────────┐
│ 1. 코드 변경 & 커밋                      │
│    git add . && git commit -m "..."     │
└────────────┬────────────────────────────┘
             ▼
┌─────────────────────────────────────────┐
│ 2. main 브랜치에 푸시                    │
│    git push origin main                 │
└────────────┬────────────────────────────┘
             ▼
┌─────────────────────────────────────────┐
│ 3. GitHub Actions 자동 트리거           │
│    .github/workflows/vercel-deploy.yml  │
└────────────┬────────────────────────────┘
             ▼
┌─────────────────────────────────────────┐
│ 4. Node.js 설치 & 의존성 설치          │
│    npm install (frontend)               │
└────────────┬────────────────────────────┘
             ▼
┌─────────────────────────────────────────┐
│ 5. Vercel 환경 정보 가져오기            │
│    vercel pull --environment=production │
└────────────┬────────────────────────────┘
             ▼
┌─────────────────────────────────────────┐
│ 6. Next.js 빌드                         │
│    vercel build --prod                  │
└────────────┬────────────────────────────┘
             ▼
┌─────────────────────────────────────────┐
│ 7. Vercel Production 배포               │
│    vercel deploy --prebuilt --prod      │
└────────────┬────────────────────────────┘
             ▼
┌─────────────────────────────────────────┐
│ 8. 배포 완료! 🎉                        │
│    Production URL 생성                  │
└─────────────────────────────────────────┘
```

---

## 🎯 빠른 명령어 모음

### Main 브랜치로 전환
```bash
git fetch origin
git checkout main
git pull origin main
```

### 변경사항 푸시 (자동 배포)
```bash
git add .
git commit -m "feat: Your changes"
git push origin main
# GitHub Actions가 자동으로 Vercel에 배포!
```

### 배포 상태 확인
```bash
# GitHub Actions 로그 보기
gh run list

# 최신 워크플로우 상태
gh run view --log
```

### Vercel 배포 확인
```bash
# Vercel CLI 설치 (아직 안 했다면)
npm install -g vercel

# Vercel 프로젝트 확인
vercel ls

# 최신 배포 확인
vercel inspect
```

---

## ❓ 문제 해결

### Q1: "403 Forbidden" 에러 발생
**원인**: 브랜치 보호 규칙
**해결**: GitHub 웹 UI에서 브랜치 생성 (위 방법 참고)

### Q2: GitHub Actions가 실행 안 됨
**확인사항**:
1. main 브랜치에 푸시했는지 확인
2. `frontend/` 폴더에 변경사항이 있는지 확인
3. GitHub Actions 활성화 확인 (Settings → Actions)

### Q3: Vercel 배포 실패
**확인사항**:
1. GitHub Secrets 3개가 설정되었는지 확인
2. Vercel 프로젝트가 연결되었는지 확인
3. 로컬 빌드 테스트: `cd frontend && npm run build`

### Q4: 배포 URL을 모르겠음
```bash
# GitHub Actions 로그에서 확인
gh run view --log

# 또는 Vercel 대시보드
https://vercel.com/dashboard
```

---

## 🎉 완료 체크리스트

- [ ] GitHub 웹에서 main 브랜치 생성
- [ ] 로컬에서 `git fetch origin` 실행
- [ ] `git checkout main` 성공
- [ ] GitHub Secrets 3개 설정 확인
- [ ] 테스트 커밋 & 푸시
- [ ] GitHub Actions 실행 확인
- [ ] Vercel 배포 성공 확인
- [ ] Production URL 접속 확인

---

**다음 단계**: Main 브랜치를 만든 후, 테스트 배포를 해보세요!

```bash
git checkout main
echo "# Production Ready!" >> README.md
git add README.md
git commit -m "docs: Update for production"
git push origin main
```

GitHub Actions → Vercel 자동 배포가 시작됩니다! 🚀

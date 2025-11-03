# 🚀 Vercel 배포 빠른 시작 가이드

이 가이드를 따라하면 5분 안에 배포 완료!

---

## ✅ 사전 준비 확인

- [ ] Node.js 18+ 설치됨
- [ ] npm 또는 yarn 설치됨
- [ ] Vercel 계정 (없으면: https://vercel.com/signup)
- [ ] GitHub 저장소 접근 권한

---

## 🎯 Step 1: Vercel CLI 설치 및 로그인

### 1-1. Vercel CLI 설치

```bash
npm install -g vercel
# 또는
yarn global add vercel
```

**설치 확인:**
```bash
vercel --version
```

### 1-2. Vercel 로그인

```bash
vercel login
```

브라우저가 열리면:
1. GitHub, GitLab, 또는 Email로 로그인
2. 인증 완료
3. 터미널로 돌아오기

---

## 🔗 Step 2: 프로젝트 연결

### 2-1. Frontend 디렉토리로 이동

```bash
cd ~/Pause/frontend
```

### 2-2. Vercel 프로젝트 연결

```bash
vercel link
```

질문에 답변:
```
? Set up and deploy "~/Pause/frontend"?
→ Y (Enter)

? Which scope do you want to deploy to?
→ (본인의 계정 선택)

? Link to existing project?
→ N (새 프로젝트)

? What's your project's name?
→ pause (또는 원하는 이름)

? In which directory is your code located?
→ ./ (Enter - 현재 디렉토리)
```

### 2-3. 프로젝트 정보 확인

```bash
cat .vercel/project.json
```

출력 예시:
```json
{
  "orgId": "team_xxxxxxxxxxxxx",
  "projectId": "prj_xxxxxxxxxxxxx"
}
```

**이 값들을 복사해두세요! GitHub Secrets에 필요합니다.**

---

## 🔐 Step 3: GitHub Secrets 설정

### 3-1. Vercel Token 생성

1. https://vercel.com/account/tokens 접속
2. **Create Token** 클릭
3. Token name: `Pause GitHub Actions`
4. Scope: **Full Account**
5. **Create** 클릭
6. 생성된 토큰 복사 (한 번만 보입니다!)

### 3-2. GitHub Repository Settings

1. GitHub 저장소 접속
2. **Settings** 탭 클릭
3. **Secrets and variables** → **Actions** 클릭
4. **New repository secret** 클릭

### 3-3. Secrets 추가 (3개)

**Secret 1: VERCEL_TOKEN**
```
Name: VERCEL_TOKEN
Value: (위에서 생성한 토큰 붙여넣기)
```

**Secret 2: VERCEL_ORG_ID**
```
Name: VERCEL_ORG_ID
Value: (project.json의 orgId 값)
예: team_xxxxxxxxxxxxx
```

**Secret 3: VERCEL_PROJECT_ID**
```
Name: VERCEL_PROJECT_ID
Value: (project.json의 projectId 값)
예: prj_xxxxxxxxxxxxx
```

---

## 🌍 Step 4: Vercel 환경 변수 설정

### 4-1. Vercel Dashboard 접속

```bash
# 브라우저에서 열기
https://vercel.com/dashboard
```

또는:
```bash
vercel project ls
# 프로젝트 목록에서 'pause' 찾아서 클릭
```

### 4-2. Environment Variables 설정

1. 프로젝트 선택 (pause)
2. **Settings** 탭
3. **Environment Variables** 메뉴
4. 다음 변수 추가:

**변수 1: NEXT_PUBLIC_API_URL (Production)**
```
Key: NEXT_PUBLIC_API_URL
Value: https://pause-api.vercel.app
       (또는 실제 백엔드 URL)
Environment: Production
```

**변수 2: NEXT_PUBLIC_API_URL (Preview)**
```
Key: NEXT_PUBLIC_API_URL
Value: https://pause-api.vercel.app
Environment: Preview
```

**변수 3: NEXT_PUBLIC_API_URL (Development)**
```
Key: NEXT_PUBLIC_API_URL
Value: http://localhost:8000
Environment: Development
```

**Save** 클릭!

---

## 🚀 Step 5: 첫 번째 배포!

### 5-1. Preview 배포 (테스트)

```bash
cd ~/Pause/frontend
vercel
```

출력 예시:
```
Vercel CLI 33.0.0
🔍 Inspect: https://vercel.com/...
✅ Preview: https://pause-git-main-username.vercel.app [2s]
```

**Preview URL 접속해서 확인!**

### 5-2. Production 배포

```bash
vercel --prod
```

출력 예시:
```
🔍 Inspect: https://vercel.com/...
✅ Production: https://pause.vercel.app [2s]
```

**Production URL 접속!**

---

## 🎉 Step 6: 자동 배포 테스트

### 6-1. 코드 변경 및 푸시

```bash
cd ~/Pause

# 간단한 변경
echo "# Vercel Test" >> TEST.md

# 자동 배포!
make deploy
```

### 6-2. 배포 확인

**GitHub Actions 확인:**
```
https://github.com/joshweb83/Pause/actions
```

**Vercel Dashboard 확인:**
```
https://vercel.com/dashboard
```

약 1-2분 후 배포 완료!

---

## ✅ 배포 성공 확인 체크리스트

- [ ] Vercel CLI로 첫 배포 성공
- [ ] Preview URL 접속 가능
- [ ] Production URL 접속 가능
- [ ] GitHub Secrets 3개 설정됨
- [ ] Vercel 환경 변수 설정됨
- [ ] GitHub Actions 워크플로우 실행됨
- [ ] 자동 배포 테스트 성공

---

## 🐛 문제 해결

### 문제 1: Vercel CLI 로그인 실패

**해결:**
```bash
# 로그아웃 후 재로그인
vercel logout
vercel login
```

### 문제 2: 빌드 에러

**로컬 빌드 테스트:**
```bash
cd frontend
npm run build
```

에러 확인 후 수정하고 다시 배포

### 문제 3: 환경 변수 없음

**Vercel Dashboard에서 확인:**
1. Settings → Environment Variables
2. NEXT_PUBLIC_API_URL 있는지 확인
3. 없으면 추가

### 문제 4: GitHub Actions 실패

**확인:**
1. GitHub → Actions 탭
2. 실패한 워크플로우 클릭
3. 로그 확인
4. Secrets 설정 확인

**Secrets 재확인:**
```bash
# 로컬에서
cd ~/Pause/frontend
cat .vercel/project.json
```

이 값들이 GitHub Secrets과 일치하는지 확인

---

## 🎯 빠른 명령어 정리

```bash
# Preview 배포
vercel

# Production 배포
vercel --prod

# 프로젝트 정보
vercel project ls

# 배포 목록
vercel ls

# 배포 로그
vercel logs

# 환경 변수 설정 (CLI)
vercel env add NEXT_PUBLIC_API_URL production
```

---

## 📊 배포 후 확인사항

### 1. 기본 기능 테스트

```
✅ 홈페이지 로딩
✅ 로그인 페이지 접근
✅ 회원가입 페이지 접근
✅ 정적 리소스 로딩 (CSS, JS)
✅ 이미지 표시
```

### 2. API 연결 테스트

```
⚠️ 회원가입 시도 → 백엔드 연결 확인
⚠️ 로그인 시도 → API 응답 확인
```

**참고:** 백엔드가 아직 배포되지 않았다면 API 호출은 실패합니다.
로컬 백엔드를 사용하거나, 백엔드 배포 후 테스트하세요.

---

## 🔄 배포 프로세스 요약

```
로컬 개발
   ↓
git push
   ↓
GitHub Actions 트리거
   ↓
Vercel 빌드 시작
   ↓
빌드 성공
   ↓
CDN 배포
   ↓
완료! 🎉
```

---

## 🎊 다음 단계

### 백엔드 배포 (선택사항)

백엔드도 배포하려면:
1. Railway / Render / Fly.io 선택
2. PostgreSQL 데이터베이스 설정
3. 환경 변수 설정
4. 배포 후 Vercel 환경 변수 업데이트

**가이드:**
- Railway: https://railway.app
- Render: https://render.com
- Fly.io: https://fly.io

### 커스텀 도메인 (선택사항)

1. Vercel Dashboard → Settings → Domains
2. 도메인 추가
3. DNS 설정

---

## 💡 팁

### 빠른 배포
```bash
# 저장소 루트에서
make deploy
```

### 배포 상태 확인
```bash
# Vercel 상태
vercel ls

# GitHub Actions 상태
gh run list
```

### 롤백
```bash
# Vercel Dashboard에서:
# Deployments → 이전 배포 선택 → Promote to Production
```

---

## 📞 도움이 필요하면

- 📖 Vercel 문서: https://vercel.com/docs
- 💬 Vercel Discord: https://vercel.com/discord
- 🐛 GitHub Issues
- 📧 Vercel Support

---

**준비되셨나요? 시작하세요!** 🚀

```bash
# 1단계부터 시작!
npm install -g vercel
vercel login
```

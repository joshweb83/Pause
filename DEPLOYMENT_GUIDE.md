# 🚀 Pause - 완벽한 배포 가이드

GitHub 푸시 자동화 + Vercel 자동 배포 완전 정복!

## ✨ 완성된 자동화 시스템

이제 **코드만 작성하면** 모든 것이 자동입니다:

```
코드 작성
   ↓
make deploy (단 한 줄!)
   ↓
✅ GitHub 자동 푸시
✅ CI/CD 자동 실행
✅ Vercel 자동 배포
✅ Production/Preview 자동 선택
   ↓
완료! 🎉
```

---

## 🎯 1단계: Vercel 초기 설정 (최초 1회만)

### 방법 1: 자동 스크립트 (추천) ⚡

```bash
make vercel-setup
```

스크립트가 자동으로:
1. Vercel CLI 설치
2. 로그인 처리
3. 프로젝트 연결
4. 환경 변수 설정
5. 필요한 정보 출력

### 방법 2: 수동 설정

#### A. Vercel CLI 설치
```bash
npm install -g vercel
```

#### B. Vercel 로그인
```bash
vercel login
```

#### C. 프로젝트 연결
```bash
cd frontend
vercel link
```

질문에 답변:
- Set up and deploy "~/Pause/frontend"? → **Y**
- Which scope? → **Your Account**
- Link to existing project? → **N**
- What's your project's name? → **pause**
- In which directory is your code located? → **./** (엔터)

#### D. 프로젝트 정보 확인
```bash
cat .vercel/project.json
```

다음 정보를 기록:
- `orgId`: VERCEL_ORG_ID
- `projectId`: VERCEL_PROJECT_ID

---

## 🔐 2단계: GitHub Secrets 설정

### A. Vercel Token 생성

1. https://vercel.com/account/tokens 접속
2. **Create Token** 클릭
3. Token Name: `Pause GitHub Actions`
4. Scope: **Full Account**
5. **Create** 클릭
6. 생성된 토큰 복사 (한 번만 보입니다!)

### B. GitHub Secrets 추가

1. GitHub 저장소 이동
2. **Settings** → **Secrets and variables** → **Actions**
3. **New repository secret** 클릭

**추가할 3개의 Secrets:**

| Name | Value | 설명 |
|------|-------|------|
| `VERCEL_TOKEN` | (위에서 생성한 토큰) | Vercel API 토큰 |
| `VERCEL_ORG_ID` | (project.json의 orgId) | Vercel 조직 ID |
| `VERCEL_PROJECT_ID` | (project.json의 projectId) | Vercel 프로젝트 ID |

---

## 🌍 3단계: 환경 변수 설정

### Vercel Dashboard에서 설정

1. https://vercel.com/dashboard 접속
2. **pause** 프로젝트 선택
3. **Settings** → **Environment Variables**
4. 다음 변수 추가:

| Key | Value | Environment |
|-----|-------|-------------|
| `NEXT_PUBLIC_API_URL` | `https://your-backend-url.com` | Production |
| `NEXT_PUBLIC_API_URL` | `https://your-backend-url.com` | Preview |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | Development |

**백엔드 URL은 나중에 실제 URL로 변경하세요!**

---

## 🎉 설정 완료! 이제 사용하기

### 방법 1: 원클릭 배포 (가장 쉬움!)

```bash
make deploy
```

이 명령어 하나로:
- ✅ 변경사항 자동 분석
- ✅ 커밋 메시지 자동 생성
- ✅ GitHub 자동 푸시
- ✅ CI/CD 자동 실행
- ✅ Vercel 자동 배포

### 방법 2: 일반 푸시

```bash
git add .
git commit -m "feat: 새 기능"
git push
```

푸시하면 자동으로 Vercel 배포!

### 방법 3: 자동 감시 모드

```bash
make watch
```

30초마다 자동으로 푸시 & 배포!

---

## 📊 배포 전략

### 브랜치별 자동 배포

| 브랜치 | 환경 | URL 예시 | 설명 |
|--------|------|----------|------|
| `main` | **Production** | https://pause.vercel.app | 프로덕션 배포 |
| `develop` | **Preview** | https://pause-git-develop.vercel.app | 개발 환경 |
| `claude/**` | **Preview** | https://pause-git-claude-xxx.vercel.app | 작업 브랜치 |
| Feature | **Preview** | https://pause-git-feature-xxx.vercel.app | 기능 브랜치 |
| **Pull Request** | **Preview** | 자동 URL 생성 + PR 코멘트 | PR별 미리보기 |

### 자동화 프로세스

```
코드 푸시
   ↓
GitHub Actions 시작
   ├─→ Lint 검사
   ├─→ Build 테스트
   └─→ 통과 시 계속
   ↓
Vercel 배포
   ├─→ main → Production
   └─→ 기타 → Preview
   ↓
완료!
```

---

## 🛠️ 주요 명령어

### 배포 관련

```bash
# 원클릭 배포 (추천!)
make deploy

# Vercel 초기 설정
make vercel-setup

# Production 배포
make vercel-deploy

# Preview 배포
make vercel-preview
```

### Git 자동화

```bash
# 스마트 커밋
make commit

# 빠른 푸시
make push

# 자동 감시
make watch
```

### 개발 관련

```bash
# 서비스 시작
make start

# 로그 보기
make logs

# 도움말
make help
```

---

## 📱 배포 확인하기

### 1. GitHub Actions 확인

```bash
# 브라우저에서
https://github.com/joshweb83/Pause/actions

# 또는
git push
# → Actions 탭에서 실시간 확인
```

### 2. Vercel Dashboard 확인

```bash
https://vercel.com/dashboard

# 또는 CLI로
vercel ls
```

### 3. 배포된 사이트 접속

```bash
# Production
https://pause.vercel.app

# Preview (브랜치명에 따라 다름)
https://pause-git-[branch-name].vercel.app
```

---

## 🎯 실제 사용 시나리오

### 시나리오 1: 새 기능 개발

```bash
# 1. 기능 개발
# ... 코드 작성 ...

# 2. 원클릭 배포
make deploy

# 3. Preview URL 확인
# GitHub Actions → Vercel Deploy → URL 클릭

# 4. 테스트 완료 후 main에 머지
git checkout main
git merge feature-branch
git push

# 5. Production 자동 배포!
```

### 시나리오 2: 빠른 수정

```bash
# 1. 수정
vim frontend/src/app/page.tsx

# 2. 배포
make deploy

# 3. 몇 초 후 반영 확인!
```

### 시나리오 3: 연속 작업

```bash
# 터미널 1: 자동 배포 켜기
make watch

# 터미널 2: 작업하기
# ... 작업 ...
# → 30초마다 자동 배포!

# 작업 끝나면 watch 중지 (Ctrl+C)
```

---

## 🐛 문제 해결

### 배포 실패 시

#### 1. GitHub Actions 확인
```bash
https://github.com/joshweb83/Pause/actions
# → 실패한 워크플로우 클릭
# → 로그 확인
```

#### 2. Vercel 로그 확인
```bash
https://vercel.com/dashboard
# → Deployments 탭
# → 실패한 배포 클릭
```

#### 3. 로컬 빌드 테스트
```bash
cd frontend
npm run build

# 에러 확인 및 수정
```

### Secrets 설정 확인

```bash
# GitHub Settings → Secrets 확인
# 3개 모두 있는지 확인:
# - VERCEL_TOKEN
# - VERCEL_ORG_ID
# - VERCEL_PROJECT_ID
```

### 환경 변수 확인

```bash
# Vercel Dashboard
# Settings → Environment Variables
# NEXT_PUBLIC_API_URL이 모든 환경에 있는지 확인
```

---

## 🎨 커스터마이징

### 커스텀 도메인 연결

1. Vercel Dashboard → Settings → Domains
2. 도메인 추가
3. DNS 설정:
   ```
   Type: CNAME
   Name: pause (또는 원하는 서브도메인)
   Value: cname.vercel-dns.com
   ```

### 배포 알림 설정

1. Vercel Dashboard → Settings → Notifications
2. Slack, Discord, Email 연결
3. 알림 받을 이벤트 선택:
   - Deployment Started
   - Deployment Ready
   - Deployment Failed

---

## 📈 다음 단계

### 1. 백엔드 배포

백엔드는 별도로 배포 필요:
- Railway: https://railway.app
- Render: https://render.com
- Fly.io: https://fly.io
- AWS/GCP/Azure

### 2. 데이터베이스 설정

- Supabase (PostgreSQL)
- PlanetScale (MySQL)
- MongoDB Atlas
- Railway Database

### 3. 스토리지 설정

- AWS S3
- Cloudflare R2
- Vercel Blob

---

## 🎓 학습 자료

- [Vercel 문서](https://vercel.com/docs)
- [Next.js 배포](https://nextjs.org/docs/deployment)
- [GitHub Actions](https://docs.github.com/en/actions)
- [자세한 가이드](docs/VERCEL_DEPLOYMENT.md)

---

## ✅ 최종 체크리스트

배포 전 확인:

- [ ] Vercel CLI 설치 및 로그인
- [ ] 프로젝트 연결 완료
- [ ] GitHub Secrets 3개 추가
- [ ] Vercel 환경 변수 설정
- [ ] 로컬 빌드 테스트 성공
- [ ] 첫 배포 테스트 완료

모두 체크되었다면:

```bash
make deploy
```

**축하합니다! 🎉**

이제 `make deploy` 한 번이면 모든 것이 자동입니다!

---

## 🔥 핵심 정리

### 가장 쉬운 사용법

```bash
# 1. 최초 1회 설정
make vercel-setup

# 2. GitHub Secrets 추가 (3개)

# 3. 이제부터는 이것만!
make deploy
```

### 그게 전부입니다! 🚀

- ✅ 코드 작성
- ✅ `make deploy`
- ✅ 완료!

**더 이상 배포 걱정 없이 개발에만 집중하세요!**

---

**문제가 있나요?**
- 📖 [VERCEL_DEPLOYMENT.md](docs/VERCEL_DEPLOYMENT.md) 참고
- 💬 GitHub Issues에 문의
- 🆘 `make help` 실행

# Vercel 자동 배포 가이드

Pause를 Vercel에 자동으로 배포하는 완벽한 가이드입니다.

## 🎯 개요

이 설정을 완료하면:
- ✅ GitHub에 푸시만 하면 **자동으로 Vercel에 배포**
- ✅ `main` 브랜치 → **Production** 배포
- ✅ 다른 브랜치 → **Preview** 배포
- ✅ PR 생성 시 **자동 Preview URL** 생성
- ✅ CI/CD 파이프라인 자동 실행

## 🚀 빠른 시작 (3단계)

### 1단계: Vercel 프로젝트 생성

#### 방법 A: 자동 스크립트 (추천)
```bash
./scripts/vercel-setup.sh
```

#### 방법 B: 수동 설정
1. [Vercel](https://vercel.com)에 로그인
2. "Add New Project" 클릭
3. GitHub 저장소 연결 (joshweb83/Pause)
4. Framework Preset: **Next.js**
5. Root Directory: **frontend**
6. Deploy 클릭

### 2단계: GitHub Secrets 설정

GitHub 저장소 → Settings → Secrets and variables → Actions

다음 3개의 Secret 추가:

#### 1. VERCEL_TOKEN
Vercel 토큰 생성:
1. https://vercel.com/account/tokens
2. "Create Token" 클릭
3. 이름: `Pause GitHub Actions`
4. Scope: Full Account
5. 생성된 토큰 복사
6. GitHub Secret에 `VERCEL_TOKEN`으로 추가

#### 2. VERCEL_ORG_ID
```bash
# 로컬에서 실행
cd frontend
cat .vercel/project.json | grep orgId
```
출력된 `orgId` 값을 GitHub Secret에 추가

#### 3. VERCEL_PROJECT_ID
```bash
# 로컬에서 실행
cd frontend
cat .vercel/project.json | grep projectId
```
출력된 `projectId` 값을 GitHub Secret에 추가

### 3단계: 환경 변수 설정

Vercel Dashboard → Project → Settings → Environment Variables

추가할 변수:

| Key | Value | Environment |
|-----|-------|-------------|
| `NEXT_PUBLIC_API_URL` | `https://your-backend-api.com` | Production |
| `NEXT_PUBLIC_API_URL` | `https://your-backend-api.com` | Preview |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | Development |

## ✅ 설정 완료!

이제 코드를 푸시하면 자동으로 배포됩니다:

```bash
# 원클릭 배포
make deploy

# 또는
./scripts/deploy.sh

# 또는 일반 푸시
git push
```

## 🔄 배포 프로세스

### 자동 배포 흐름

```
코드 변경
    ↓
git push
    ↓
GitHub Actions 트리거
    ↓
├─→ CI 테스트 (Lint, Build)
│
└─→ Vercel 배포
    ↓
    ├─→ main 브랜치 → Production
    └─→ 다른 브랜치 → Preview
    ↓
배포 완료! 🎉
```

### 브랜치별 배포 전략

| 브랜치 | 배포 환경 | URL 예시 |
|--------|----------|----------|
| `main` | Production | https://pause.vercel.app |
| `develop` | Preview | https://pause-git-develop.vercel.app |
| `claude/**` | Preview | https://pause-git-claude-xxx.vercel.app |
| Feature branches | Preview | https://pause-git-feature-xxx.vercel.app |

## 📋 배포 명령어

### 1. 원클릭 배포 (추천)
```bash
make deploy
```

모든 것을 자동으로 처리:
- ✅ 변경사항 분석
- ✅ 커밋 메시지 생성
- ✅ GitHub 푸시
- ✅ Vercel 배포 트리거

### 2. 수동 배포
```bash
# 일반 푸시
git add .
git commit -m "feat: new feature"
git push

# GitHub Actions가 자동으로 Vercel에 배포
```

### 3. 즉시 배포 (Vercel CLI)
```bash
cd frontend

# Preview 배포
vercel

# Production 배포
vercel --prod
```

## 🔍 배포 상태 확인

### GitHub Actions
```bash
# 브라우저에서
https://github.com/joshweb83/Pause/actions

# CLI로 (gh 설치 필요)
gh run list
gh run watch
```

### Vercel Dashboard
```bash
# 브라우저에서
https://vercel.com/dashboard

# CLI로
vercel ls
vercel inspect <deployment-url>
```

## 🛠️ 고급 설정

### 커스텀 도메인 연결

1. Vercel Dashboard → Project → Settings → Domains
2. "Add Domain" 클릭
3. 도메인 입력 (예: pause.yourdomain.com)
4. DNS 레코드 추가:
   ```
   Type: CNAME
   Name: pause
   Value: cname.vercel-dns.com
   ```

### 배포 Hook 설정

특정 조건에서만 배포하도록 설정:

`.github/workflows/vercel-deploy.yml` 수정:

```yaml
on:
  push:
    branches:
      - main        # main만 자동 배포
    paths:
      - 'frontend/**'  # frontend 변경 시에만
```

### 빌드 캐싱

빌드 속도 향상을 위한 캐싱:

`vercel.json`에 추가:
```json
{
  "github": {
    "silent": false,
    "autoJobCancelation": true
  },
  "build": {
    "env": {
      "ENABLE_EXPERIMENTAL_COREPACK": "1"
    }
  }
}
```

## 🐛 문제 해결

### 배포 실패

#### 1. 빌드 에러
```bash
# 로컬에서 빌드 테스트
cd frontend
npm run build

# 에러 확인 및 수정
```

#### 2. 환경 변수 누락
Vercel Dashboard → Settings → Environment Variables
필요한 변수가 모두 설정되었는지 확인

#### 3. GitHub Actions 실패
- GitHub Actions 탭에서 로그 확인
- Secrets가 올바르게 설정되었는지 확인
- 권한 문제: Settings → Actions → General → Workflow permissions

### 배포 롤백

```bash
# Vercel Dashboard에서
1. Deployments 탭
2. 이전 배포 선택
3. "Promote to Production" 클릭

# CLI로
vercel rollback
```

### 배포 취소

```bash
# GitHub Actions 취소
gh run cancel <run-id>

# Vercel 배포 취소
vercel rm <deployment-url>
```

## 📊 모니터링

### Vercel Analytics
```bash
# Vercel Dashboard → Analytics
- 방문자 수
- 페이지 로드 시간
- Core Web Vitals
```

### 배포 알림

Vercel → Settings → Notifications:
- ✅ Deployment Started
- ✅ Deployment Ready
- ✅ Deployment Failed

Slack, Discord, Email로 알림 가능

## 🔐 보안 설정

### 환경 변수 보호
- ❌ 절대 `.env` 파일을 커밋하지 마세요
- ✅ Vercel Dashboard에서만 환경 변수 설정
- ✅ 민감한 정보는 Secret으로 관리

### 배포 보호
```json
// vercel.json
{
  "github": {
    "enabled": true,
    "autoAlias": true
  }
}
```

## 💡 최적화 팁

### 1. 빌드 시간 단축
```json
// next.config.js
{
  "swcMinify": true,
  "compiler": {
    "removeConsole": process.env.NODE_ENV === "production"
  }
}
```

### 2. 이미지 최적화
```typescript
// Next.js Image 사용
import Image from 'next/image'

<Image
  src="/logo.png"
  width={500}
  height={300}
  alt="Pause Logo"
/>
```

### 3. CDN 활용
Vercel의 Edge Network 자동 사용:
- 전 세계 CDN
- 자동 캐싱
- 빠른 로딩

## 📈 성능 모니터링

### Core Web Vitals
Vercel에서 자동으로 측정:
- LCP (Largest Contentful Paint)
- FID (First Input Delay)
- CLS (Cumulative Layout Shift)

### Real User Monitoring
```typescript
// pages/_app.tsx
export function reportWebVitals(metric) {
  console.log(metric)
  // Analytics 전송
}
```

## 🔄 CI/CD 파이프라인

### 전체 프로세스

```
1. 개발자가 코드 변경
   ↓
2. Git 푸시
   ↓
3. GitHub Actions 시작
   ├─→ Lint 검사
   ├─→ Type 검사
   ├─→ 빌드 테스트
   └─→ 통과 시 계속
   ↓
4. Vercel 배포
   ├─→ 빌드
   ├─→ 최적화
   └─→ CDN 배포
   ↓
5. Preview URL 생성 (PR의 경우)
   ↓
6. Production 배포 (main 브랜치)
   ↓
7. 알림 전송
```

## 📚 추가 자료

- [Vercel 문서](https://vercel.com/docs)
- [Next.js 배포](https://nextjs.org/docs/deployment)
- [GitHub Actions](https://docs.github.com/en/actions)

## 🎯 체크리스트

배포 전 확인사항:

- [ ] Vercel 프로젝트 생성됨
- [ ] GitHub Secrets 설정됨 (3개)
- [ ] Vercel 환경 변수 설정됨
- [ ] 로컬에서 빌드 테스트 완료
- [ ] `.env.example` 파일 업데이트
- [ ] 문서 업데이트
- [ ] 첫 배포 테스트 완료

## 🚀 첫 배포 테스트

```bash
# 1. 간단한 변경
echo "# Test" >> test.md

# 2. 원클릭 배포
make deploy

# 3. 배포 확인
# - GitHub Actions 확인
# - Vercel Dashboard 확인
# - 배포된 URL 접속

# 4. 성공! 🎉
```

---

**문제가 있나요?**
- GitHub Issues에 문의
- Vercel Support 문의
- `make help` 명령어 확인

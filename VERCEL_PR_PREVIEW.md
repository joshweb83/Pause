# 🚀 Vercel PR Preview 설정 완료!

## ✅ 설정된 기능들

### 1. **자동 PR Preview 배포**
Pull Request를 만들 때마다 자동으로 Vercel에 Preview 배포가 됩니다.

### 2. **GitHub PR 댓글에 Preview URL 표시**
PR을 만들면 자동으로 봇이 댓글을 달아서 Preview URL을 알려줍니다.

**댓글 예시:**
```markdown
## 🚀 Vercel Preview Deployment

✅ **Preview is ready!**

| Name | Link |
|------|------|
| 🔍 **Preview URL** | Visit Preview |
| 📝 **Commit** | `a1b2c3d` |
| 🌿 **Branch** | `feature/new-ui` |
| 👤 **Author** | @joshweb83 |

---

### 📱 Test on devices:
- Desktop Preview
- Mobile Preview

<details>
<summary>📊 Deployment Details</summary>

- **Environment**: Preview
- **Framework**: Next.js 14
- **Build Time**: `2025-11-04 12:30:00 UTC`
- **Region**: Seoul (icn1)

</details>
```

### 3. **Deployment Status Check**
PR에 Deployment status가 표시됩니다:
- ⏳ Deploying... (배포 중)
- ✅ Deployed successfully (성공)
- ❌ Deployment failed (실패)

### 4. **자동 댓글 업데이트**
같은 PR에 새로운 커밋을 푸시하면 기존 댓글이 업데이트됩니다. (새 댓글이 계속 생기지 않음)

---

## 🎯 사용 방법

### Step 1: PR 만들기
```bash
# 새 브랜치 생성
git checkout -b feature/my-feature

# 변경사항 작업
# ...

# 커밋 및 푸시
git add .
git commit -m "feat: Add new feature"
git push -u origin feature/my-feature
```

### Step 2: GitHub에서 PR 생성
1. GitHub 저장소로 이동
2. "Compare & pull request" 버튼 클릭
3. PR 템플릿이 자동으로 로드됨
4. 필요한 정보 입력 후 "Create pull request" 클릭

### Step 3: 자동 배포 대기
- GitHub Actions가 자동으로 실행됨
- 약 2-3분 후 배포 완료
- PR에 자동으로 댓글이 달림

### Step 4: Preview 확인
- PR 댓글의 "Visit Preview" 링크 클릭
- Preview 사이트에서 변경사항 확인
- 모바일 뷰도 테스트 가능

---

## 📋 Vercel 환경 변수 설정

### Production 환경
```
NEXT_PUBLIC_API_URL=https://api.pause.your-domain.com
```

### Preview 환경
```
NEXT_PUBLIC_API_URL=https://api-preview.pause.your-domain.com
```

### 설정 방법
1. Vercel 대시보드 접속
2. 프로젝트 선택
3. Settings → Environment Variables
4. 환경별로 변수 추가:
   - Production
   - Preview
   - Development

---

## 🔧 GitHub Secrets 확인

다음 3개의 Secrets이 설정되어야 합니다:

### 1. VERCEL_TOKEN
```bash
# Vercel CLI로 생성
vercel login
vercel token create
```

### 2. VERCEL_ORG_ID
```bash
# .vercel/project.json에서 확인
cat frontend/.vercel/project.json | grep orgId
```

### 3. VERCEL_PROJECT_ID
```bash
# .vercel/project.json에서 확인
cat frontend/.vercel/project.json | grep projectId
```

### GitHub Secrets 추가 방법
1. GitHub 저장소 → Settings
2. Secrets and variables → Actions
3. "New repository secret" 클릭
4. Name과 Value 입력 후 저장

---

## 🎨 PR 템플릿

PR을 만들면 자동으로 템플릿이 로드됩니다:
- 📝 Description
- 🎯 Type of Change (체크리스트)
- 🔗 Related Issues
- 🧪 Testing checklist
- 📸 Screenshots
- ✅ Final checklist

템플릿 위치: `.github/pull_request_template.md`

---

## 🚨 문제 해결

### Preview 배포가 안 될 때
```bash
# 1. GitHub Secrets 확인
# 저장소 Settings → Secrets and variables → Actions

# 2. Vercel 연결 확인
cd frontend
vercel link

# 3. 로컬에서 빌드 테스트
npm run build

# 4. GitHub Actions 로그 확인
# Actions 탭에서 실패한 워크플로우 로그 확인
```

### PR 댓글이 안 달릴 때
- GitHub Actions의 GITHUB_TOKEN 권한 확인
- 저장소 Settings → Actions → General
- Workflow permissions: "Read and write permissions" 선택

### Deployment Status가 안 보일 때
- GitHub Deployments 기능 활성화 확인
- 저장소 Settings → Environments
- "Preview" environment가 자동 생성되어야 함

---

## 📊 워크플로우 동작 방식

```
┌─────────────────────────────────────────────────────────────┐
│ 1. PR 생성/업데이트                                          │
│    git push origin feature/my-feature                        │
└─────────────────────┬───────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. GitHub Actions 트리거                                     │
│    .github/workflows/vercel-deploy.yml                       │
└─────────────────────┬───────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Node.js 설치 & 의존성 설치                               │
│    npm install (frontend)                                    │
└─────────────────────┬───────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Vercel 환경 정보 가져오기                                │
│    vercel pull --environment=preview                         │
└─────────────────────┬───────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. Next.js 빌드                                             │
│    vercel build                                              │
└─────────────────────┬───────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. Deployment Status 생성                                   │
│    GitHub Deployment API 호출                                │
└─────────────────────┬───────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────┐
│ 7. Vercel 배포                                              │
│    vercel deploy --prebuilt                                  │
└─────────────────────┬───────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────┐
│ 8. Deployment Status 업데이트 (success/failure)             │
│    environment_url 설정                                      │
└─────────────────────┬───────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────┐
│ 9. PR 댓글 작성/업데이트                                    │
│    Preview URL과 상세 정보 표시                             │
└─────────────────────┬───────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────┐
│ 10. 완료! 🎉                                                │
│     PR에서 Preview 확인 가능                                │
└─────────────────────────────────────────────────────────────┘
```

---

## 💡 팁과 모범 사례

### 1. Preview 환경 변수 분리
```javascript
// frontend/src/config/env.ts
export const API_URL = process.env.NEXT_PUBLIC_API_URL ||
  (process.env.VERCEL_ENV === 'production'
    ? 'https://api.pause.com'
    : 'https://api-preview.pause.com'
  );
```

### 2. Preview URL에서 기능 플래그 사용
```javascript
// Preview 환경에서만 특정 기능 활성화
const isPreview = process.env.VERCEL_ENV === 'preview';
if (isPreview) {
  // 실험적 기능 활성화
}
```

### 3. PR Description에 체크리스트 활용
- [ ] Desktop에서 테스트 완료
- [ ] Mobile에서 테스트 완료
- [ ] API 연동 확인
- [ ] 에러 핸들링 확인

### 4. Preview 댓글 활용
팀원들에게 Preview URL을 공유하고 피드백 요청:
```
@팀원 Preview 배포 완료했습니다!
새로운 UI 확인해주세요 👆 (위의 Visit Preview 링크)
```

---

## 🎯 다음 단계

### 선택 1: 실제 PR 만들어 테스트
```bash
git checkout -b test/pr-preview
echo "# Test PR Preview" > TEST.md
git add TEST.md
git commit -m "test: Test PR preview deployment"
git push -u origin test/pr-preview
# GitHub에서 PR 생성
```

### 선택 2: Production 배포
```bash
# main 브랜치에 머지하면 자동으로 Production 배포
git checkout main
git merge feature/my-feature
git push origin main
```

### 선택 3: Vercel 대시보드 확인
1. https://vercel.com/dashboard 접속
2. Pause 프로젝트 선택
3. Deployments 탭에서 모든 배포 내역 확인

---

## 📚 추가 리소스

- [Vercel Deployments 공식 문서](https://vercel.com/docs/deployments/overview)
- [GitHub Actions 공식 문서](https://docs.github.com/en/actions)
- [Next.js 배포 가이드](https://nextjs.org/docs/deployment)

---

**설정 완료!** 🎉 이제 PR을 만들 때마다 자동으로 Preview 배포가 됩니다!

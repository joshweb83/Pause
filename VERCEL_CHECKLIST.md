# Vercel 배포 체크리스트

완료한 항목에 체크하세요!

## 📋 사전 준비

- [ ] Node.js 18+ 설치
- [ ] npm 설치
- [ ] Vercel 계정 생성 (https://vercel.com/signup)
- [ ] GitHub 저장소 접근 권한

## 🚀 배포 단계

### Step 1: Vercel CLI 설정

- [ ] Vercel CLI 설치
  ```bash
  npm install -g vercel
  ```

- [ ] Vercel 로그인
  ```bash
  vercel login
  ```

- [ ] 로그인 확인
  ```bash
  vercel whoami
  ```

### Step 2: 프로젝트 연결

- [ ] Frontend 디렉토리 이동
  ```bash
  cd frontend
  ```

- [ ] Vercel 프로젝트 연결
  ```bash
  vercel link
  ```

- [ ] 프로젝트 정보 확인
  ```bash
  cat .vercel/project.json
  ```

- [ ] orgId 복사: `_____________________`
- [ ] projectId 복사: `_____________________`

### Step 3: Vercel Token 생성

- [ ] https://vercel.com/account/tokens 접속
- [ ] "Create Token" 클릭
- [ ] Token name: `Pause GitHub Actions`
- [ ] Scope: Full Account 선택
- [ ] Token 복사: `_____________________`

### Step 4: GitHub Secrets 설정

GitHub Repository → Settings → Secrets and variables → Actions

- [ ] VERCEL_TOKEN 추가
  - Name: `VERCEL_TOKEN`
  - Value: (위에서 생성한 토큰)

- [ ] VERCEL_ORG_ID 추가
  - Name: `VERCEL_ORG_ID`
  - Value: (project.json의 orgId)

- [ ] VERCEL_PROJECT_ID 추가
  - Name: `VERCEL_PROJECT_ID`
  - Value: (project.json의 projectId)

### Step 5: Vercel 환경 변수 설정

Vercel Dashboard → Project → Settings → Environment Variables

- [ ] Production 환경
  - Key: `NEXT_PUBLIC_API_URL`
  - Value: `https://your-backend-url.com`
  - Environment: Production

- [ ] Preview 환경
  - Key: `NEXT_PUBLIC_API_URL`
  - Value: `https://your-backend-url.com`
  - Environment: Preview

- [ ] Development 환경
  - Key: `NEXT_PUBLIC_API_URL`
  - Value: `http://localhost:8000`
  - Environment: Development

### Step 6: 첫 배포

- [ ] Preview 배포 테스트
  ```bash
  vercel
  ```

- [ ] Preview URL 확인: `_____________________`

- [ ] Preview URL 접속 및 테스트

- [ ] Production 배포
  ```bash
  vercel --prod
  ```

- [ ] Production URL 확인: `_____________________`

- [ ] Production URL 접속 및 테스트

### Step 7: 자동 배포 테스트

- [ ] 코드 변경 및 푸시
  ```bash
  cd ~/Pause
  make deploy
  ```

- [ ] GitHub Actions 실행 확인
  - https://github.com/joshweb83/Pause/actions

- [ ] Vercel 배포 상태 확인
  - https://vercel.com/dashboard

- [ ] 자동 배포 성공 확인

## ✅ 배포 성공 확인

### 기본 기능 테스트

- [ ] 홈페이지 로딩 (`/`)
- [ ] 로그인 페이지 (`/login`)
- [ ] 회원가입 페이지 (`/register`)
- [ ] CSS/JS 로딩
- [ ] 이미지 표시
- [ ] 반응형 디자인

### 배포 URL 기록

- Production URL: `_____________________________`
- Preview URL: `_____________________________`
- Vercel Dashboard: `_____________________________`

## 🐛 문제 해결 체크

문제가 발생하면 체크:

- [ ] Vercel CLI 버전 확인 (`vercel --version`)
- [ ] GitHub Secrets 3개 모두 설정됨
- [ ] Vercel 환경 변수 설정됨
- [ ] 로컬 빌드 성공 (`npm run build`)
- [ ] project.json 파일 존재
- [ ] GitHub Actions 워크플로우 파일 존재

## 📝 메모

문제 발생 시 여기에 기록:

```
_______________________________________________

_______________________________________________

_______________________________________________
```

## 🎉 완료!

모든 항목 체크 완료 시:

- [ ] 배포 성공
- [ ] 자동 배포 작동
- [ ] Production URL 접속 가능
- [ ] 팀원들과 URL 공유

축하합니다! Vercel 배포가 완료되었습니다! 🚀

---

**문제가 있나요?**
- 📖 VERCEL_SETUP_GUIDE.md 참고
- 💬 GitHub Issues에 문의
- 📧 Vercel Support

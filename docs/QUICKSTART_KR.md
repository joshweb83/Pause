# ⏸ Pause - 빠른 시작 가이드 (한국어)

Pause Visual Archive System을 빠르게 시작하는 방법입니다.

## 📋 준비사항

### 필수 설치
- Node.js 18 이상
- Python 3.11 이상
- PostgreSQL 15 이상
- ffmpeg
- Tesseract OCR

### 맥(macOS)에서 설치
```bash
# Homebrew 설치 (없는 경우)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 의존성 설치
brew install postgresql@15 ffmpeg tesseract tesseract-lang
brew install node python@3.11
```

### 우분투/데비안에서 설치
```bash
sudo apt update
sudo apt install -y postgresql-15 ffmpeg tesseract-ocr tesseract-ocr-eng tesseract-ocr-kor
sudo apt install -y nodejs npm python3.11 python3.11-venv
```

## 🚀 시작하기

### 방법 1: Docker 사용 (가장 쉬움)

```bash
# 1. 저장소 클론
git clone <repository-url>
cd Pause

# 2. 환경 변수 설정
cp .env.example .env

# 3. 서비스 시작
docker-compose up -d

# 4. 접속
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
# API 문서: http://localhost:8000/docs
```

### 방법 2: 수동 설치

#### 1. 데이터베이스 설정
```bash
# PostgreSQL 시작
# macOS
brew services start postgresql@15

# Ubuntu
sudo systemctl start postgresql

# 데이터베이스 생성
createdb pause_db

# 스키마 적용
psql pause_db < database/schema.sql
```

#### 2. 백엔드 설정
```bash
cd backend

# 가상환경 생성
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 의존성 설치
pip install -r requirements.txt

# 환경 변수 설정
cp ../.env.example .env
# .env 파일 수정 (데이터베이스 URL 등)

# 서버 실행
uvicorn main:app --reload
```

백엔드 실행: http://localhost:8000

#### 3. 프론트엔드 설정 (새 터미널)
```bash
cd frontend

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env.local

# 개발 서버 실행
npm run dev
```

프론트엔드 실행: http://localhost:3000

## 🎯 첫 영상 처리하기

### 1. 회원가입
1. http://localhost:3000 접속
2. "Get Started" 버튼 클릭
3. 이메일, 사용자명, 비밀번호 입력

### 2. 영상 업로드
1. 대시보드에서 "Upload Video" 클릭
2. 영상 파일 선택 (mp4, mov 등)
3. 업로드 대기

### 3. 처리 과정 (자동)
- ✅ 프레임 추출 (초당 1프레임)
- ✅ 중복 프레임 필터링
- ✅ OCR 텍스트 추출
- ✅ 검색 가능한 PDF 생성

### 4. 결과 확인
1. 아카이브 목록에서 처리된 영상 클릭
2. PDF 뷰어로 프레임 탐색
3. 텍스트 검색 기능 사용
4. PDF 다운로드

## 🤖 자동 푸시 설정

### 간단한 방법
```bash
# 스마트 커밋 (변경사항 분석)
make commit

# 빠른 푸시
make push

# 자동 감시 모드 (30초마다 체크)
make watch
```

### 스크립트 직접 실행
```bash
# 실행 권한 부여
chmod +x scripts/*.sh

# 스마트 커밋
./scripts/smart-commit.sh

# 빠른 푸시
./scripts/auto-push.sh

# 자동 감시
./scripts/watch-and-push.sh
```

자세한 내용: [docs/AUTOMATION.md](AUTOMATION.md)

## 📝 주요 명령어

### Make 명령어
```bash
make help       # 도움말
make start      # 서비스 시작
make stop       # 서비스 중지
make logs       # 로그 보기
make commit     # 스마트 커밋
make push       # 빠른 푸시
make clean      # 정리
```

### Git 명령어
```bash
git status                  # 상태 확인
git add .                   # 모든 변경사항 추가
git commit -m "메시지"      # 커밋
git push                    # 푸시
```

### Docker 명령어
```bash
docker-compose up -d        # 백그라운드 실행
docker-compose down         # 중지
docker-compose logs -f      # 로그 보기
docker-compose ps           # 상태 확인
```

## 🔧 문제 해결

### 포트 충돌
```bash
# 사용 중인 포트 확인
lsof -i :3000   # Frontend
lsof -i :8000   # Backend
lsof -i :5432   # PostgreSQL

# 프로세스 종료
kill -9 <PID>
```

### 데이터베이스 연결 실패
```bash
# PostgreSQL 상태 확인
# macOS
brew services list

# Ubuntu
sudo systemctl status postgresql

# 재시작
# macOS
brew services restart postgresql@15

# Ubuntu
sudo systemctl restart postgresql
```

### Tesseract 못 찾음
```bash
# Tesseract 위치 확인
which tesseract

# .env 파일에 경로 설정
TESSERACT_PATH=/usr/local/bin/tesseract
```

## 📚 더 알아보기

- [전체 설정 가이드](SETUP.md)
- [API 문서](API.md)
- [아키텍처 문서](ARCHITECTURE.md)
- [자동화 가이드](AUTOMATION.md)

## 💡 팁

### 개발 시 유용한 설정

1. **VSCode 확장 프로그램**
   - Python
   - ESLint
   - Prettier
   - Docker

2. **별칭 설정** (`~/.bashrc` 또는 `~/.zshrc`)
   ```bash
   alias pause='cd ~/Pause'
   alias pause-start='cd ~/Pause && make start'
   alias pause-stop='cd ~/Pause && make stop'
   alias pause-push='cd ~/Pause && make push'
   ```

3. **환경 분리**
   - 개발: `docker-compose up`
   - 프로덕션: 별도 설정 필요

## 🎨 UI 미리보기

- **다크 테마**: 검정/회색 기반
- **강조 색**: 호박색 (#f59e0b)
- **폰트**: Inter
- **애니메이션**: 부드러운 페이드

## ⚡ 성능 최적화

- 프레임 추출: 초당 1프레임 (설정 가능)
- 중복 필터링: 95% 유사도 기준
- OCR 신뢰도: 60% 이상만 사용
- 데이터베이스: 인덱스 최적화

## 🔐 보안

- JWT 토큰 인증
- 비밀번호 bcrypt 암호화
- SQL 인젝션 방지
- XSS 방어

## 🚀 다음 단계

1. ✅ 로컬에서 실행
2. ⬜ 첫 영상 업로드
3. ⬜ 검색 기능 테스트
4. ⬜ PDF 다운로드
5. ⬜ 프로덕션 배포

---

**문제가 있나요?** GitHub Issues에 문의해주세요!

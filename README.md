# ⏸ Pause – Visual Archive System

> Transform videos into searchable, archival documents

## 🎯 Overview

**Pause** is a visual archive platform that extracts frames from YouTube Shorts or uploaded videos, performs OCR analysis, and presents them in a PDF-like viewer with search, annotation, and archival capabilities.

### Key Features

- 🎥 **Video Input**: YouTube Shorts URL or direct video upload (mp4, mov)
- 📄 **Frame Extraction**: Automatic frame extraction with duplicate filtering
- 🔍 **OCR Analysis**: Text extraction from each frame using Tesseract/PaddleOCR
- 📖 **PDF Viewer**: Navigate frames like pages with zoom, annotations, and highlights
- 💾 **Private Vault**: User-specific storage for PDFs and metadata
- 📥 **Export**: Download as searchable PDF with OCR text layer
- 🏷️ **Smart Tagging**: AI-powered content tagging and search

## 🏗️ Architecture

```
Pause/
├── frontend/          # Next.js + TailwindCSS + TypeScript
├── backend/           # FastAPI + Python for video processing
├── database/          # PostgreSQL schemas and migrations
├── docker/            # Docker configurations
└── docs/              # Documentation
```

## 🚀 Tech Stack

| Component | Technology |
|-----------|-----------|
| **Frontend** | Next.js 14, TailwindCSS, Framer Motion, React-PDF |
| **Backend** | FastAPI, Python 3.11+ |
| **Video Processing** | OpenCV, ffmpeg, Tesseract OCR |
| **Database** | PostgreSQL 15+ |
| **Storage** | AWS S3 / Local filesystem |
| **PDF Generation** | PyMuPDF (fitz) |
| **AI (Optional)** | LangChain, OpenAI API |

## 🎨 Design Philosophy

**calm · precise · archival · cinematic**

- **Color Palette**: Monochrome with Amber accents
- **Typography**: Inter / Pretendard
- **Logo**: "⏸ Pause" - Two vertical bars symbolizing book pages
- **Motion**: Slow fades with frame-stop effects

## 🛠️ Quick Start

### Prerequisites

- Node.js 18+
- Python 3.11+
- PostgreSQL 15+
- ffmpeg
- Tesseract OCR

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd Pause

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Set up database
createdb pause_db
cd ../database
psql pause_db < schema.sql

# Configure environment
cp .env.example .env
# Edit .env with your configurations
```

### Development

#### Option 1: Docker (Recommended)
```bash
# Start all services
docker-compose up -d

# Or use Makefile
make start

# View logs
make logs
```

#### Option 2: Manual
```bash
# Terminal 1: Start frontend
cd frontend
npm run dev

# Terminal 2: Start backend
cd backend
uvicorn main:app --reload

# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

## 🤖 Automation & CI/CD

### Quick Commands (Makefile)

```bash
make help       # Show all available commands
make start      # Start all services
make stop       # Stop all services
make commit     # Smart commit with auto-generated message
make push       # Quick commit and push
make watch      # Auto-watch and push on changes
make test       # Run tests
make logs       # View docker logs
```

### Auto-Push Scripts

#### 1. One-Click Deploy (Recommended) 🚀
```bash
make deploy                 # Deploy to GitHub + Vercel automatically
```

#### 2. Smart Commit
```bash
./scripts/smart-commit.sh   # Analyzes changes and generates commit message
# or
make commit
```

#### 3. Quick Push
```bash
./scripts/auto-push.sh      # Quick commit and push
# or
make push
```

#### 4. Watch Mode
```bash
./scripts/watch-and-push.sh # Auto-push every 30 seconds
# or
make watch
```

### Vercel Automatic Deployment

Push to GitHub → Automatic deployment to Vercel!

```bash
# Initial setup (one-time)
make vercel-setup

# After setup, just push code
git push

# Or use one-click deploy
make deploy
```

**Deployment Strategy:**
- `main` branch → **Production** (https://pause.vercel.app)
- Other branches → **Preview** (automatic preview URLs)
- Pull requests → **Preview** with comment

See [docs/VERCEL_DEPLOYMENT.md](docs/VERCEL_DEPLOYMENT.md) for detailed setup guide.

### GitHub Actions

Automatically runs on every push:

- ✅ Backend linting (flake8, black)
- ✅ Frontend linting (ESLint, TypeScript)
- ✅ Build tests
- ✅ Docker image builds
- ✅ **Vercel deployment**
- ✅ Preview URL for PRs

See [docs/AUTOMATION.md](docs/AUTOMATION.md) for detailed setup guide.

## 📦 Core Modules

### 1. Video Processing Pipeline
- Frame extraction at configurable FPS
- Duplicate frame detection and filtering
- Scene change detection
- Thumbnail generation

### 2. OCR Engine
- Multi-language text detection
- Text positioning and bounding boxes
- Confidence scoring
- Text layer embedding in PDF

### 3. PDF Generation
- One frame per page
- Searchable text layer
- Bookmarks and annotations
- Metadata embedding

### 4. Viewer Interface
- Keyboard navigation (←/→)
- Zoom controls
- Annotation tools
- Timeline slider with video timestamp sync
- Full-text search across frames

### 5. Archive System
- User authentication
- Private vaults per user
- Tagging and categorization
- Share links with expiration
- Download management

## 🔐 Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/pause_db

# Storage
STORAGE_TYPE=s3  # or 'local'
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_S3_BUCKET=pause-storage

# API Keys
OPENAI_API_KEY=your_openai_key  # Optional, for AI features

# Application
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:8000
SECRET_KEY=your_secret_key_here
```

## 🎯 Roadmap

### Phase 1: Core System ✅
- [x] Project initialization
- [x] Backend API with FastAPI
- [x] Video frame extraction service
- [x] OCR integration (Tesseract)
- [x] PDF generation with searchable text
- [x] Database schema and models
- [x] User authentication (JWT)
- [x] Frontend with Next.js + TypeScript
- [x] PDF viewer component
- [x] CI/CD with GitHub Actions
- [x] Auto-push scripts and automation

### Phase 2: Features (In Progress)
- [ ] YouTube Shorts URL download
- [ ] Full-text search UI
- [ ] Frame annotations and bookmarks
- [ ] Archive sharing with tokens
- [ ] User dashboard

### Phase 3: Enhancement
- [ ] AI-powered tagging with LLM
- [ ] Batch video processing
- [ ] Advanced search filters
- [ ] Mobile responsive design
- [ ] Real-time processing updates

### Phase 4: Scale
- [ ] Cloud deployment (AWS/GCP)
- [ ] CDN integration
- [ ] Performance optimization
- [ ] API rate limiting
- [ ] Analytics dashboard

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## 📞 Contact

For questions or suggestions, please open an issue on GitHub.

---

**Built with 💛 by the Pause team**

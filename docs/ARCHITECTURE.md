# Pause Architecture Documentation

## System Overview

Pause is a full-stack web application that transforms videos into searchable, archival documents using frame extraction, OCR, and PDF generation technologies.

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Browser   │────────▶│   Next.js   │────────▶│   FastAPI   │
│  (Client)   │◀────────│  Frontend   │◀────────│   Backend   │
└─────────────┘         └─────────────┘         └──────┬──────┘
                                                        │
                                                        ▼
                        ┌─────────────────────────────────────┐
                        │         PostgreSQL Database          │
                        └─────────────────────────────────────┘
                                         │
                        ┌────────────────┼────────────────┐
                        ▼                ▼                ▼
                   ┌────────┐      ┌────────┐      ┌────────┐
                   │ Videos │      │Archives│      │ Frames │
                   └────────┘      └────────┘      └────────┘
```

## Technology Stack

### Frontend
- **Framework:** Next.js 14 (React 18)
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **UI Components:** Custom components + Framer Motion
- **PDF Viewing:** React-PDF (PDF.js)
- **State Management:** Zustand (optional)
- **HTTP Client:** Axios
- **Forms:** React Hook Form

### Backend
- **Framework:** FastAPI (Python 3.11+)
- **Video Processing:** OpenCV, ffmpeg
- **OCR Engine:** Tesseract OCR
- **PDF Generation:** PyMuPDF (fitz)
- **Database ORM:** SQLAlchemy
- **Authentication:** JWT (python-jose)
- **Task Queue:** Celery + Redis (optional)

### Database
- **Primary Database:** PostgreSQL 15+
- **Caching/Queue:** Redis (optional)

### Infrastructure
- **Containerization:** Docker + Docker Compose
- **Web Server:** Uvicorn (ASGI)
- **Reverse Proxy:** Nginx (production)

## Architecture Patterns

### Backend Architecture

#### Layered Architecture
```
┌─────────────────────────────────────┐
│          API Layer                   │  ◀── FastAPI Routes
├─────────────────────────────────────┤
│       Service Layer                  │  ◀── Business Logic
├─────────────────────────────────────┤
│       Data Layer                     │  ◀── SQLAlchemy Models
├─────────────────────────────────────┤
│       Database                       │  ◀── PostgreSQL
└─────────────────────────────────────┘
```

#### Core Services

**VideoProcessor**
- Frame extraction from video files
- Duplicate frame detection using perceptual hashing
- Scene change detection
- Thumbnail generation
- Video metadata extraction

**OCRService**
- Text extraction from images using Tesseract
- Multi-language support
- Confidence filtering
- Bounding box detection
- Text preprocessing for improved accuracy

**PDFGenerator**
- PDF creation from image frames
- Searchable text layer embedding
- Bookmarks and table of contents
- Page annotations
- Metadata embedding

### Frontend Architecture

#### Component Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── login/             # Auth pages
│   └── dashboard/         # Main app
├── components/
│   ├── ui/                # Reusable UI components
│   ├── layout/            # Layout components
│   └── viewer/            # PDF/Frame viewer
├── lib/                   # Utilities
│   └── api.ts            # API client
├── hooks/                 # Custom React hooks
└── types/                 # TypeScript types
```

## Data Flow

### Video Upload & Processing Flow

```
1. User uploads video
   │
   ▼
2. Backend validates & saves file
   │
   ▼
3. Video record created in database (status: uploaded)
   │
   ▼
4. Background task starts processing
   │
   ├─▶ Extract frames at specified FPS
   │    │
   │    ├─▶ Calculate perceptual hash
   │    └─▶ Filter duplicates
   │
   ├─▶ Perform OCR on each frame
   │    │
   │    ├─▶ Preprocess image
   │    ├─▶ Extract text with Tesseract
   │    └─▶ Get bounding boxes
   │
   ├─▶ Generate PDF with text layer
   │    │
   │    ├─▶ Create page per frame
   │    ├─▶ Embed OCR text layer
   │    └─▶ Add bookmarks
   │
   └─▶ Create archive & frame records
        │
        ▼
5. Update video status to 'completed'
   │
   ▼
6. User can view/search/download archive
```

### Search Flow

```
1. User enters search query
   │
   ▼
2. Backend performs full-text search
   │
   ├─▶ Query frames.ocr_text using PostgreSQL
   │    (using GIN index for performance)
   │
   └─▶ Extract context around matches
   │
   ▼
3. Return matching frames with highlights
   │
   ▼
4. Frontend displays results
   └─▶ User can click to jump to frame
```

## Database Schema

### Core Tables

**users**
- Authentication and user management
- One-to-many with videos and archives

**videos**
- Uploaded or downloaded video metadata
- Processing status tracking
- One-to-one with archives

**archives**
- Processed video converted to searchable document
- PDF metadata and statistics
- Sharing configuration

**frames**
- Individual frame/page from video
- OCR text and confidence scores
- User annotations and bookmarks
- Full-text search indexed

### Relationships
```
users ──┬──▶ videos ───▶ archives ───▶ frames
        │
        └──▶ archives
```

### Indexes
- `users.email` - Unique index for fast lookup
- `videos.owner_id` - Foreign key index
- `videos.status` - For filtering by status
- `archives.share_token` - Unique index for sharing
- `frames.archive_id, frame_number` - Composite index
- `frames.ocr_text` - GIN index for full-text search

## Security

### Authentication
- JWT-based authentication
- Bcrypt password hashing
- Token expiration (configurable)
- HTTP-only cookies (optional)

### Authorization
- Row-level security (user can only access their own data)
- Share token validation for public archives
- API key rotation (future)

### Input Validation
- File type validation
- File size limits
- SQL injection prevention (SQLAlchemy)
- XSS prevention (React escaping)

## Performance Optimizations

### Backend
- **Background Processing:** Long-running tasks (video processing) run in background
- **Database Connection Pooling:** Reuse database connections
- **Lazy Loading:** Load relationships only when needed
- **Pagination:** Limit query results with offset/limit

### Frontend
- **Code Splitting:** Next.js automatic code splitting
- **Image Optimization:** Next.js Image component
- **Lazy Loading:** React.lazy for components
- **Caching:** SWR or React Query for data caching

### Database
- **Indexes:** Strategic indexing on frequently queried columns
- **Full-Text Search:** PostgreSQL GIN index for text search
- **Vacuum:** Regular database maintenance

## Scalability Considerations

### Horizontal Scaling
- **API Servers:** Multiple FastAPI instances behind load balancer
- **Database:** Read replicas for read-heavy workloads
- **Storage:** Distributed file storage (S3, MinIO)
- **Task Queue:** Celery workers for background processing

### Vertical Scaling
- **Database:** Increase PostgreSQL resources
- **Caching:** Redis for frequently accessed data
- **CDN:** Static asset delivery

## Monitoring & Logging

### Application Logs
- Structured logging with log levels
- Request/response logging
- Error tracking

### Metrics (Future)
- Request latency
- Processing time per video
- OCR accuracy statistics
- Storage usage

### Health Checks
- `/api/v1/health` - Basic health check
- `/api/v1/health/db` - Database connectivity
- `/api/v1/health/detailed` - All services

## Future Enhancements

### Phase 2
- [ ] YouTube URL download support
- [ ] Batch processing
- [ ] Advanced search (filters, date range)
- [ ] Mobile responsive design

### Phase 3
- [ ] AI-powered tagging and summarization
- [ ] Multi-user collaboration
- [ ] Video annotation tools
- [ ] REST API for third-party integrations

### Phase 4
- [ ] Real-time processing updates (WebSocket)
- [ ] Advanced OCR with PaddleOCR
- [ ] Multiple PDF export formats
- [ ] Cloud deployment templates

## Development Guidelines

### Code Organization
- Keep services focused and single-purpose
- Use dependency injection for testability
- Follow PEP 8 (Python) and ESLint (TypeScript)
- Write docstrings for all functions

### Testing Strategy
- Unit tests for services
- Integration tests for API endpoints
- E2E tests for critical user flows
- Test coverage target: 80%

### Git Workflow
- Feature branches: `feature/description`
- Bug fixes: `fix/description`
- Pull requests required for main branch
- CI/CD pipeline on merge

## Deployment

### Development
```bash
docker-compose up
```

### Production
- Docker containers on cloud platform (AWS, GCP, Azure)
- Kubernetes for orchestration
- Managed PostgreSQL database
- CDN for static assets
- SSL/TLS certificates

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

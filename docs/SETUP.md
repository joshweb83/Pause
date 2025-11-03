# Pause Setup Guide

Complete setup instructions for the Pause Visual Archive System.

## Prerequisites

### System Requirements
- Node.js 18+ and npm
- Python 3.11+
- PostgreSQL 15+
- ffmpeg
- Tesseract OCR

### macOS Installation
```bash
# Install Homebrew if not installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install dependencies
brew install postgresql@15 ffmpeg tesseract tesseract-lang
brew install node python@3.11
```

### Ubuntu/Debian Installation
```bash
# Update package list
sudo apt update

# Install dependencies
sudo apt install -y postgresql-15 ffmpeg tesseract-ocr tesseract-ocr-eng tesseract-ocr-kor
sudo apt install -y nodejs npm python3.11 python3.11-venv
```

### Windows Installation
1. Install [PostgreSQL](https://www.postgresql.org/download/windows/)
2. Install [Node.js](https://nodejs.org/)
3. Install [Python 3.11](https://www.python.org/downloads/)
4. Install [ffmpeg](https://ffmpeg.org/download.html)
5. Install [Tesseract OCR](https://github.com/UB-Mannheim/tesseract/wiki)

## Database Setup

### 1. Create Database
```bash
# Start PostgreSQL
# macOS
brew services start postgresql@15

# Ubuntu
sudo systemctl start postgresql

# Create database
createdb pause_db

# Or using psql
psql -U postgres
CREATE DATABASE pause_db;
\q
```

### 2. Initialize Schema
```bash
cd database
psql pause_db < schema.sql
```

## Backend Setup

### 1. Create Virtual Environment
```bash
cd backend
python3 -m venv venv

# Activate virtual environment
# macOS/Linux
source venv/bin/activate

# Windows
venv\Scripts\activate
```

### 2. Install Dependencies
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 3. Configure Environment
```bash
# Copy example environment file
cp ../.env.example .env

# Edit .env with your settings
nano .env
```

Required environment variables:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/pause_db
SECRET_KEY=your-secret-key-here
JWT_SECRET=your-jwt-secret-here
```

### 4. Run Backend
```bash
# Development mode
uvicorn main:app --reload

# Production mode
uvicorn main:app --host 0.0.0.0 --port 8000
```

Backend will be available at: http://localhost:8000
API documentation: http://localhost:8000/docs

## Frontend Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure Environment
```bash
# Copy example environment file
cp .env.example .env.local

# Edit .env.local
nano .env.local
```

Required environment variables:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Run Frontend
```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

Frontend will be available at: http://localhost:3000

## Docker Setup (Alternative)

### 1. Install Docker
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### 2. Run with Docker Compose
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Services:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- PostgreSQL: localhost:5432
- Redis: localhost:6379

## Verification

### 1. Check Backend Health
```bash
curl http://localhost:8000/api/v1/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "Pause API",
  "version": "1.0.0"
}
```

### 2. Check Database Connection
```bash
curl http://localhost:8000/api/v1/health/db
```

### 3. Access Frontend
Open http://localhost:3000 in your browser.

## Common Issues

### Issue: PostgreSQL Connection Failed
**Solution:**
```bash
# Check PostgreSQL status
pg_isadmin

# Restart PostgreSQL
# macOS
brew services restart postgresql@15

# Ubuntu
sudo systemctl restart postgresql
```

### Issue: Tesseract Not Found
**Solution:**
```bash
# Find Tesseract path
which tesseract

# Update .env with correct path
TESSERACT_PATH=/usr/local/bin/tesseract
```

### Issue: ffmpeg Not Found
**Solution:**
```bash
# Install ffmpeg
# macOS
brew install ffmpeg

# Ubuntu
sudo apt install ffmpeg
```

### Issue: Port Already in Use
**Solution:**
```bash
# Find process using port
lsof -i :8000
lsof -i :3000

# Kill process
kill -9 <PID>
```

## Next Steps

1. Create a test user account
2. Upload a video or paste a YouTube URL
3. Wait for processing to complete
4. View your archive with the PDF viewer
5. Try searching across frames

## Development Tips

### Backend Hot Reload
The backend uses `--reload` flag for hot reloading during development.

### Frontend Hot Reload
Next.js automatically hot reloads on file changes.

### Database Migrations
If you modify the schema:
```bash
# Export schema
pg_dump -s pause_db > database/schema.sql

# Import schema
psql pause_db < database/schema.sql
```

### Logs
Backend logs are in console output.
Frontend logs are in browser console.

## Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment instructions.

## Support

For issues or questions:
- Check [README.md](../README.md)
- Open an issue on GitHub
- Check API docs at http://localhost:8000/docs

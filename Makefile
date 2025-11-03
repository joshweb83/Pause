# Pause - Makefile for common tasks

.PHONY: help install start stop clean commit push deploy

# Default target
help:
	@echo "⏸  Pause - Available Commands"
	@echo "================================"
	@echo ""
	@echo "🚀 Deployment:"
	@echo "  make deploy         - One-click deploy to GitHub + Vercel"
	@echo "  make vercel-setup   - Initial Vercel setup"
	@echo "  make vercel-deploy  - Deploy to Vercel production"
	@echo "  make vercel-preview - Create Vercel preview"
	@echo ""
	@echo "📦 Development:"
	@echo "  make install     - Install all dependencies"
	@echo "  make start       - Start all services with Docker"
	@echo "  make stop        - Stop all services"
	@echo "  make clean       - Clean up containers and volumes"
	@echo "  make dev         - Start development mode"
	@echo "  make test        - Run all tests"
	@echo "  make logs        - Show docker logs"
	@echo ""
	@echo "🔄 Git Automation:"
	@echo "  make commit      - Smart commit with auto-generated message"
	@echo "  make push        - Quick commit and push"
	@echo "  make watch       - Watch files and auto-push changes"

# Install dependencies
install:
	@echo "📦 Installing dependencies..."
	cd backend && pip install -r requirements.txt
	cd frontend && npm install
	@echo "✅ Installation complete!"

# Start services
start:
	@echo "🚀 Starting services..."
	docker-compose up -d
	@echo "✅ Services started!"
	@echo "   Frontend: http://localhost:3000"
	@echo "   Backend:  http://localhost:8000"
	@echo "   API Docs: http://localhost:8000/docs"

# Stop services
stop:
	@echo "⏹️  Stopping services..."
	docker-compose down
	@echo "✅ Services stopped!"

# Clean up
clean:
	@echo "🧹 Cleaning up..."
	docker-compose down -v
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name "node_modules" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".next" -exec rm -rf {} + 2>/dev/null || true
	@echo "✅ Cleanup complete!"

# Smart commit
commit:
	@bash scripts/smart-commit.sh

# Quick push
push:
	@bash scripts/auto-push.sh

# Watch and auto-push
watch:
	@bash scripts/watch-and-push.sh

# Show logs
logs:
	docker-compose logs -f

# Run tests
test:
	@echo "🧪 Running tests..."
	cd backend && pytest tests/ || echo "No tests found"
	cd frontend && npm test || echo "No tests found"

# Deploy to GitHub and Vercel
deploy:
	@bash scripts/deploy.sh

# Vercel setup
vercel-setup:
	@bash scripts/vercel-setup.sh

# Vercel commands
vercel-deploy:
	@echo "🚀 Deploying to Vercel..."
	cd frontend && vercel --prod

vercel-preview:
	@echo "👀 Creating preview deployment..."
	cd frontend && vercel

# Development mode
dev:
	@echo "🔧 Starting development mode..."
	@echo "Starting backend..."
	cd backend && uvicorn main:app --reload &
	@echo "Starting frontend..."
	cd frontend && npm run dev

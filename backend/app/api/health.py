"""
Health check endpoints
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.core.database import get_db
from app.core.config import settings

router = APIRouter()


@router.get("/health")
async def health_check():
    """Basic health check endpoint"""
    return {
        "status": "healthy",
        "service": "Pause API",
        "version": "1.0.0"
    }


@router.get("/health/db")
async def database_health(db: Session = Depends(get_db)):
    """Database health check"""
    try:
        # Try to execute a simple query
        db.execute(text("SELECT 1"))
        return {
            "status": "healthy",
            "database": "connected"
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e)
        }


@router.get("/health/detailed")
async def detailed_health(db: Session = Depends(get_db)):
    """Detailed health check with all services"""
    health_status = {
        "status": "healthy",
        "service": "Pause API",
        "version": "1.0.0",
        "environment": settings.ENVIRONMENT,
        "checks": {}
    }

    # Database check
    try:
        db.execute(text("SELECT 1"))
        health_status["checks"]["database"] = {"status": "healthy"}
    except Exception as e:
        health_status["status"] = "degraded"
        health_status["checks"]["database"] = {
            "status": "unhealthy",
            "error": str(e)
        }

    # Storage check
    try:
        settings.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
        settings.STORAGE_DIR.mkdir(parents=True, exist_ok=True)
        health_status["checks"]["storage"] = {"status": "healthy"}
    except Exception as e:
        health_status["status"] = "degraded"
        health_status["checks"]["storage"] = {
            "status": "unhealthy",
            "error": str(e)
        }

    return health_status

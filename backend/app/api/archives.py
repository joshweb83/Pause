"""
Archive management endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from pathlib import Path
import secrets

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.archive import Archive, Frame

router = APIRouter()


# Pydantic schemas
class ArchiveInfo(BaseModel):
    id: int
    title: str
    description: Optional[str]
    tags: List[str]
    total_pages: int
    total_text_length: int
    average_ocr_confidence: Optional[float]
    is_public: bool
    created_at: str

    class Config:
        from_attributes = True


class FrameInfo(BaseModel):
    id: int
    frame_number: int
    timestamp: float
    ocr_text: Optional[str]
    ocr_confidence: Optional[float]
    width: Optional[int]
    height: Optional[int]
    notes: Optional[str]
    bookmarked: bool

    class Config:
        from_attributes = True


class ArchiveUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    tags: Optional[List[str]] = None


class FrameUpdate(BaseModel):
    notes: Optional[str] = None
    bookmarked: Optional[bool] = None


class SearchResult(BaseModel):
    frame_id: int
    frame_number: int
    timestamp: float
    ocr_text: str
    match_context: str


@router.get("/", response_model=List[ArchiveInfo])
async def list_archives(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List all archives for current user"""
    archives = db.query(Archive).filter(Archive.owner_id == current_user.id).all()
    return [ArchiveInfo.model_validate(a) for a in archives]


@router.get("/{archive_id}", response_model=ArchiveInfo)
async def get_archive(
    archive_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get archive details"""
    archive = db.query(Archive).filter(
        Archive.id == archive_id,
        Archive.owner_id == current_user.id
    ).first()

    if not archive:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Archive not found"
        )

    return ArchiveInfo.model_validate(archive)


@router.put("/{archive_id}", response_model=ArchiveInfo)
async def update_archive(
    archive_id: int,
    update_data: ArchiveUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update archive metadata"""
    archive = db.query(Archive).filter(
        Archive.id == archive_id,
        Archive.owner_id == current_user.id
    ).first()

    if not archive:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Archive not found"
        )

    if update_data.title is not None:
        archive.title = update_data.title
    if update_data.description is not None:
        archive.description = update_data.description
    if update_data.tags is not None:
        archive.tags = update_data.tags

    db.commit()
    db.refresh(archive)

    return ArchiveInfo.model_validate(archive)


@router.delete("/{archive_id}")
async def delete_archive(
    archive_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete an archive"""
    archive = db.query(Archive).filter(
        Archive.id == archive_id,
        Archive.owner_id == current_user.id
    ).first()

    if not archive:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Archive not found"
        )

    # Delete PDF and frames if they exist
    try:
        if archive.pdf_path:
            pdf_path = Path(archive.pdf_path)
            if pdf_path.exists():
                pdf_path.unlink()

        # Delete frame images
        for frame in archive.frames:
            frame_path = Path(frame.image_path)
            if frame_path.exists():
                frame_path.unlink()

    except Exception as e:
        # Log error but continue with database deletion
        import logging
        logging.error(f"Error deleting archive files: {e}")

    # Delete from database
    db.delete(archive)
    db.commit()

    return {"message": "Archive deleted successfully"}


@router.get("/{archive_id}/frames", response_model=List[FrameInfo])
async def get_archive_frames(
    archive_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    page: int = 1,
    limit: int = 50
):
    """Get frames for an archive with pagination"""
    archive = db.query(Archive).filter(
        Archive.id == archive_id,
        Archive.owner_id == current_user.id
    ).first()

    if not archive:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Archive not found"
        )

    offset = (page - 1) * limit
    frames = db.query(Frame).filter(
        Frame.archive_id == archive_id
    ).order_by(Frame.frame_number).offset(offset).limit(limit).all()

    return [FrameInfo.model_validate(f) for f in frames]


@router.get("/{archive_id}/frames/{frame_id}", response_model=FrameInfo)
async def get_frame(
    archive_id: int,
    frame_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get specific frame details"""
    archive = db.query(Archive).filter(
        Archive.id == archive_id,
        Archive.owner_id == current_user.id
    ).first()

    if not archive:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Archive not found"
        )

    frame = db.query(Frame).filter(
        Frame.id == frame_id,
        Frame.archive_id == archive_id
    ).first()

    if not frame:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Frame not found"
        )

    return FrameInfo.model_validate(frame)


@router.put("/{archive_id}/frames/{frame_id}", response_model=FrameInfo)
async def update_frame(
    archive_id: int,
    frame_id: int,
    update_data: FrameUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update frame (add notes, bookmark, etc.)"""
    archive = db.query(Archive).filter(
        Archive.id == archive_id,
        Archive.owner_id == current_user.id
    ).first()

    if not archive:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Archive not found"
        )

    frame = db.query(Frame).filter(
        Frame.id == frame_id,
        Frame.archive_id == archive_id
    ).first()

    if not frame:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Frame not found"
        )

    if update_data.notes is not None:
        frame.notes = update_data.notes
    if update_data.bookmarked is not None:
        frame.bookmarked = update_data.bookmarked

    db.commit()
    db.refresh(frame)

    return FrameInfo.model_validate(frame)


@router.get("/{archive_id}/download")
async def download_pdf(
    archive_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Download archive as PDF"""
    archive = db.query(Archive).filter(
        Archive.id == archive_id,
        Archive.owner_id == current_user.id
    ).first()

    if not archive:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Archive not found"
        )

    if not archive.pdf_path:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="PDF not found for this archive"
        )

    pdf_path = Path(archive.pdf_path)
    if not pdf_path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="PDF file not found"
        )

    return FileResponse(
        path=pdf_path,
        filename=f"{archive.title}.pdf",
        media_type="application/pdf"
    )


@router.get("/{archive_id}/search", response_model=List[SearchResult])
async def search_archive(
    archive_id: int,
    query: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Search text within archive frames"""
    archive = db.query(Archive).filter(
        Archive.id == archive_id,
        Archive.owner_id == current_user.id
    ).first()

    if not archive:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Archive not found"
        )

    # Search frames
    frames = db.query(Frame).filter(
        Frame.archive_id == archive_id,
        Frame.ocr_text.ilike(f"%{query}%")
    ).all()

    results = []
    for frame in frames:
        # Find context around match
        text = frame.ocr_text or ""
        query_lower = query.lower()
        text_lower = text.lower()

        if query_lower in text_lower:
            index = text_lower.index(query_lower)
            start = max(0, index - 50)
            end = min(len(text), index + len(query) + 50)
            context = text[start:end]

            results.append(SearchResult(
                frame_id=frame.id,
                frame_number=frame.frame_number,
                timestamp=frame.timestamp,
                ocr_text=text,
                match_context=f"...{context}..."
            ))

    return results


@router.post("/{archive_id}/share")
async def create_share_link(
    archive_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a shareable link for archive"""
    archive = db.query(Archive).filter(
        Archive.id == archive_id,
        Archive.owner_id == current_user.id
    ).first()

    if not archive:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Archive not found"
        )

    # Generate share token if doesn't exist
    if not archive.share_token:
        archive.share_token = secrets.token_urlsafe(32)
        archive.is_public = True
        db.commit()

    from app.core.config import settings
    share_url = f"{settings.FRONTEND_URL}/archive/shared/{archive.share_token}"

    return {
        "share_token": archive.share_token,
        "share_url": share_url
    }


@router.delete("/{archive_id}/share")
async def revoke_share_link(
    archive_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Revoke share link for archive"""
    archive = db.query(Archive).filter(
        Archive.id == archive_id,
        Archive.owner_id == current_user.id
    ).first()

    if not archive:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Archive not found"
        )

    archive.share_token = None
    archive.is_public = False
    db.commit()

    return {"message": "Share link revoked"}

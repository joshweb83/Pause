"""
Video processing endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, BackgroundTasks
from sqlalchemy.orm import Session
from pydantic import BaseModel, HttpUrl
from typing import Optional, List
from pathlib import Path
import shutil
import logging

from app.core.database import get_db
from app.core.security import get_current_user
from app.core.config import settings
from app.models.user import User
from app.models.video import Video, VideoStatus, VideoSource
from app.models.archive import Archive
from app.services.video_processor import VideoProcessor
from app.services.ocr_service import OCRService
from app.services.pdf_generator import PDFGenerator

router = APIRouter()
logger = logging.getLogger(__name__)


# Pydantic schemas
class VideoUploadResponse(BaseModel):
    id: int
    filename: str
    status: str
    message: str


class VideoInfo(BaseModel):
    id: int
    title: Optional[str]
    filename: str
    duration: Optional[float]
    fps: Optional[float]
    width: Optional[int]
    height: Optional[int]
    status: str
    source: str
    total_frames: Optional[int]
    extracted_frames: Optional[int]
    created_at: str

    class Config:
        from_attributes = True


class YouTubeDownload(BaseModel):
    url: HttpUrl


@router.post("/upload", response_model=VideoUploadResponse)
async def upload_video(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upload a video file for processing"""

    # Validate file type
    file_ext = Path(file.filename).suffix.lower().lstrip('.')
    if file_ext not in settings.SUPPORTED_VIDEO_FORMATS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file format. Supported: {', '.join(settings.SUPPORTED_VIDEO_FORMATS)}"
        )

    # Create unique filename
    import uuid
    unique_filename = f"{uuid.uuid4()}_{file.filename}"
    upload_path = settings.get_upload_path(unique_filename)

    # Save uploaded file
    try:
        with upload_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Get file size
        file_size = upload_path.stat().st_size

        # Check file size
        if file_size > settings.max_video_size_bytes:
            upload_path.unlink()  # Delete file
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"File too large. Max size: {settings.MAX_VIDEO_SIZE_MB}MB"
            )

        # Get video info
        processor = VideoProcessor()
        video_info = processor.get_video_info(upload_path)

        # Create database record
        video = Video(
            owner_id=current_user.id,
            title=file.filename,
            filename=unique_filename,
            file_path=str(upload_path),
            file_size=file_size,
            duration=video_info['duration'],
            fps=video_info['fps'],
            width=video_info['width'],
            height=video_info['height'],
            source=VideoSource.UPLOAD,
            status=VideoStatus.UPLOADED,
            total_frames=video_info['frame_count']
        )

        db.add(video)
        db.commit()
        db.refresh(video)

        # Process video in background
        background_tasks.add_task(process_video_task, video.id, db)

        logger.info(f"Video uploaded: {video.id} by user {current_user.id}")

        return VideoUploadResponse(
            id=video.id,
            filename=file.filename,
            status="uploaded",
            message="Video uploaded successfully and is being processed"
        )

    except Exception as e:
        logger.error(f"Failed to upload video: {e}")
        if upload_path.exists():
            upload_path.unlink()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload video: {str(e)}"
        )


@router.get("/", response_model=List[VideoInfo])
async def list_videos(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List all videos for current user"""
    videos = db.query(Video).filter(Video.owner_id == current_user.id).all()
    return [VideoInfo.model_validate(v) for v in videos]


@router.get("/{video_id}", response_model=VideoInfo)
async def get_video(
    video_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get video details"""
    video = db.query(Video).filter(
        Video.id == video_id,
        Video.owner_id == current_user.id
    ).first()

    if not video:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Video not found"
        )

    return VideoInfo.model_validate(video)


@router.delete("/{video_id}")
async def delete_video(
    video_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a video"""
    video = db.query(Video).filter(
        Video.id == video_id,
        Video.owner_id == current_user.id
    ).first()

    if not video:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Video not found"
        )

    # Delete file
    try:
        video_path = Path(video.file_path)
        if video_path.exists():
            video_path.unlink()
    except Exception as e:
        logger.error(f"Failed to delete video file: {e}")

    # Delete from database (cascade will delete related records)
    db.delete(video)
    db.commit()

    return {"message": "Video deleted successfully"}


def process_video_task(video_id: int, db: Session):
    """
    Background task to process video
    Extracts frames, performs OCR, and generates PDF
    """
    try:
        # Get video from database
        video = db.query(Video).filter(Video.id == video_id).first()
        if not video:
            logger.error(f"Video {video_id} not found")
            return

        # Update status
        video.status = VideoStatus.PROCESSING
        db.commit()

        logger.info(f"Processing video {video_id}...")

        # Create output directory for frames
        frames_dir = settings.STORAGE_DIR / f"video_{video_id}" / "frames"
        frames_dir.mkdir(parents=True, exist_ok=True)

        # Extract frames
        processor = VideoProcessor(fps=settings.FRAME_EXTRACTION_FPS)
        frames_data = processor.extract_frames(
            Path(video.file_path),
            frames_dir,
            remove_duplicates=True
        )

        logger.info(f"Extracted {len(frames_data)} frames")

        # Update video stats
        video.extracted_frames = len(frames_data)
        video.unique_frames = len(frames_data)
        db.commit()

        # Perform OCR on frames
        ocr_service = OCRService()
        logger.info("Performing OCR on frames...")

        for i, frame_data in enumerate(frames_data):
            ocr_result = ocr_service.extract_text_with_boxes(Path(frame_data['image_path']))
            frame_data['ocr_text'] = ocr_result['text']
            frame_data['ocr_confidence'] = ocr_result['confidence']
            frame_data['ocr_data'] = {
                'boxes': ocr_result['boxes'],
                'word_count': ocr_result['word_count']
            }

            if (i + 1) % 10 == 0:
                logger.info(f"OCR processed {i + 1}/{len(frames_data)} frames")

        # Generate PDF
        pdf_generator = PDFGenerator()
        pdf_path = settings.STORAGE_DIR / f"video_{video_id}" / f"archive_{video_id}.pdf"

        logger.info("Generating PDF...")
        pdf_result = pdf_generator.create_pdf_from_frames(
            frames_data,
            pdf_path,
            title=video.title or f"Archive {video_id}",
            include_ocr=True
        )

        if not pdf_result['success']:
            raise Exception(f"PDF generation failed: {pdf_result.get('error')}")

        # Create archive record
        archive = Archive(
            owner_id=video.owner_id,
            video_id=video.id,
            title=video.title or f"Archive {video_id}",
            pdf_path=str(pdf_path),
            pdf_size=pdf_result['file_size'],
            total_pages=len(frames_data)
        )

        db.add(archive)

        # Add frame records
        from app.models.archive import Frame
        total_text_length = 0

        for frame_data in frames_data:
            frame = Frame(
                archive_id=archive.id,
                frame_number=frame_data['frame_number'],
                timestamp=frame_data['timestamp'],
                image_path=frame_data['image_path'],
                ocr_text=frame_data.get('ocr_text', ''),
                ocr_confidence=frame_data.get('ocr_confidence'),
                ocr_data=frame_data.get('ocr_data'),
                width=frame_data['width'],
                height=frame_data['height']
            )
            db.add(frame)
            total_text_length += len(frame_data.get('ocr_text', ''))

        # Update archive stats
        archive.total_text_length = total_text_length
        confidences = [f.get('ocr_confidence', 0) for f in frames_data if f.get('ocr_confidence')]
        if confidences:
            archive.average_ocr_confidence = sum(confidences) / len(confidences)

        # Mark video as completed
        video.status = VideoStatus.COMPLETED
        from datetime import datetime
        video.processed_at = datetime.utcnow()

        db.commit()

        logger.info(f"Video {video_id} processed successfully")

    except Exception as e:
        logger.error(f"Failed to process video {video_id}: {e}")

        # Mark video as failed
        video = db.query(Video).filter(Video.id == video_id).first()
        if video:
            video.status = VideoStatus.FAILED
            video.error_message = str(e)
            db.commit()

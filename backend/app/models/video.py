"""
Video model
"""

from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Enum as SQLEnum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum

from app.core.database import Base


class VideoStatus(str, enum.Enum):
    """Video processing status"""
    UPLOADED = "uploaded"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class VideoSource(str, enum.Enum):
    """Video source type"""
    UPLOAD = "upload"
    YOUTUBE = "youtube"


class Video(Base):
    """Video model for uploaded or downloaded videos"""

    __tablename__ = "videos"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Video metadata
    title = Column(String, nullable=True)
    filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    file_size = Column(Integer, nullable=False)  # bytes
    duration = Column(Float, nullable=True)  # seconds
    fps = Column(Float, nullable=True)
    width = Column(Integer, nullable=True)
    height = Column(Integer, nullable=True)

    # Source info
    source = Column(SQLEnum(VideoSource), default=VideoSource.UPLOAD)
    source_url = Column(String, nullable=True)  # YouTube URL if applicable

    # Processing status
    status = Column(SQLEnum(VideoStatus), default=VideoStatus.UPLOADED, index=True)
    error_message = Column(String, nullable=True)

    # Statistics
    total_frames = Column(Integer, nullable=True)
    extracted_frames = Column(Integer, nullable=True)
    unique_frames = Column(Integer, nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    processed_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    owner = relationship("User", back_populates="videos")
    archive = relationship("Archive", back_populates="video", uselist=False, cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Video(id={self.id}, title={self.title}, status={self.status})>"

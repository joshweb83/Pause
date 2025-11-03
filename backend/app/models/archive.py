"""
Archive and Frame models
"""

from sqlalchemy import Column, Integer, String, Text, Float, ForeignKey, DateTime, JSON, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.core.database import Base


class Archive(Base):
    """Archive model - represents a processed video converted to searchable document"""

    __tablename__ = "archives"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    video_id = Column(Integer, ForeignKey("videos.id"), nullable=False, unique=True)

    # Archive metadata
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    tags = Column(JSON, default=list)  # List of tags

    # PDF info
    pdf_path = Column(String, nullable=True)
    pdf_size = Column(Integer, nullable=True)  # bytes
    total_pages = Column(Integer, default=0)

    # Statistics
    total_text_length = Column(Integer, default=0)
    average_ocr_confidence = Column(Float, nullable=True)

    # Sharing
    is_public = Column(Boolean, default=False)
    share_token = Column(String, unique=True, nullable=True, index=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    owner = relationship("User", back_populates="archives")
    video = relationship("Video", back_populates="archive")
    frames = relationship("Frame", back_populates="archive", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Archive(id={self.id}, title={self.title}, pages={self.total_pages})>"


class Frame(Base):
    """Frame model - represents a single frame/page from the video"""

    __tablename__ = "frames"

    id = Column(Integer, primary_key=True, index=True)
    archive_id = Column(Integer, ForeignKey("archives.id"), nullable=False, index=True)

    # Frame metadata
    frame_number = Column(Integer, nullable=False)
    timestamp = Column(Float, nullable=False)  # seconds in original video
    image_path = Column(String, nullable=False)

    # OCR data
    ocr_text = Column(Text, nullable=True)
    ocr_confidence = Column(Float, nullable=True)
    ocr_data = Column(JSON, nullable=True)  # Detailed OCR data with bounding boxes

    # Image properties
    width = Column(Integer, nullable=True)
    height = Column(Integer, nullable=True)
    file_size = Column(Integer, nullable=True)  # bytes

    # User annotations
    notes = Column(Text, nullable=True)
    bookmarked = Column(Boolean, default=False)

    # AI-generated metadata (optional)
    ai_summary = Column(Text, nullable=True)
    ai_tags = Column(JSON, nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    archive = relationship("Archive", back_populates="frames")

    def __repr__(self):
        return f"<Frame(id={self.id}, frame_number={self.frame_number}, timestamp={self.timestamp})>"

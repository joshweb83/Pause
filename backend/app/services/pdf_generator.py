"""
PDF generation service for creating searchable PDFs from frames
"""

import fitz  # PyMuPDF
from pathlib import Path
from typing import List, Dict, Optional
from PIL import Image
import logging

from app.core.config import settings

logger = logging.getLogger(__name__)


class PDFGenerator:
    """Service for generating searchable PDFs from video frames"""

    def __init__(self):
        """Initialize PDF generator"""
        pass

    def create_pdf_from_frames(
        self,
        frames_data: List[Dict],
        output_path: Path,
        title: str = "Pause Archive",
        author: str = "Pause System",
        include_ocr: bool = True
    ) -> Dict:
        """
        Create a PDF from video frames with optional OCR text layer

        Args:
            frames_data: List of frame dictionaries with image paths and OCR data
            output_path: Path to save the PDF
            title: PDF title
            author: PDF author
            include_ocr: Whether to include OCR text layer

        Returns:
            Dictionary containing PDF metadata
        """
        try:
            # Create new PDF
            doc = fitz.open()

            # Set metadata
            doc.metadata = {
                'title': title,
                'author': author,
                'producer': 'Pause Visual Archive System',
                'creator': 'Pause',
            }

            logger.info(f"Creating PDF with {len(frames_data)} pages...")

            for i, frame_data in enumerate(frames_data):
                image_path = Path(frame_data['image_path'])

                if not image_path.exists():
                    logger.warning(f"Image not found: {image_path}")
                    continue

                # Get image dimensions
                img = Image.open(image_path)
                img_width, img_height = img.size

                # Create page with image dimensions (converted to PDF points: 1 inch = 72 points)
                # Standard A4 width is 595 points, so we'll scale accordingly
                max_width = 595  # A4 width in points
                scale = max_width / img_width
                page_width = max_width
                page_height = img_height * scale

                page = doc.new_page(width=page_width, height=page_height)

                # Insert image
                page.insert_image(
                    fitz.Rect(0, 0, page_width, page_height),
                    filename=str(image_path)
                )

                # Add OCR text layer if available
                if include_ocr and 'ocr_data' in frame_data and frame_data['ocr_data']:
                    self._add_text_layer(page, frame_data['ocr_data'], scale)

                # Add page number annotation
                self._add_page_annotation(page, i + 1, frame_data.get('timestamp', 0))

                if (i + 1) % 10 == 0:
                    logger.info(f"Processed {i + 1}/{len(frames_data)} pages")

            # Add table of contents / bookmarks
            self._add_bookmarks(doc, frames_data)

            # Save PDF
            output_path.parent.mkdir(parents=True, exist_ok=True)
            doc.save(str(output_path), garbage=4, deflate=True, clean=True)
            doc.close()

            # Get PDF info
            pdf_size = output_path.stat().st_size

            logger.info(f"PDF created successfully: {output_path}")
            logger.info(f"PDF size: {pdf_size / 1024 / 1024:.2f} MB")

            return {
                'pdf_path': str(output_path),
                'page_count': len(frames_data),
                'file_size': pdf_size,
                'success': True
            }

        except Exception as e:
            logger.error(f"Failed to create PDF: {e}")
            return {
                'success': False,
                'error': str(e)
            }

    def _add_text_layer(self, page: fitz.Page, ocr_data: Dict, scale: float):
        """
        Add invisible text layer to PDF page for searchability

        Args:
            page: PyMuPDF page object
            ocr_data: OCR data with bounding boxes
            scale: Scale factor for coordinates
        """
        if 'boxes' not in ocr_data:
            return

        for box in ocr_data['boxes']:
            text = box['text']
            left = box['left'] * scale
            top = box['top'] * scale
            width = box['width'] * scale
            height = box['height'] * scale

            # Create text rectangle
            rect = fitz.Rect(left, top, left + width, top + height)

            # Insert invisible text
            page.insert_text(
                (left, top + height * 0.8),  # Position at baseline
                text,
                fontsize=height * 0.7,
                color=(1, 1, 1),  # White color (invisible on white background)
                render_mode=3  # Invisible text
            )

    def _add_page_annotation(self, page: fitz.Page, page_number: int, timestamp: float):
        """
        Add page number and timestamp annotation

        Args:
            page: PyMuPDF page object
            page_number: Page number
            timestamp: Video timestamp in seconds
        """
        # Add footer with page number and timestamp
        footer_text = f"Page {page_number} | {self._format_timestamp(timestamp)}"

        # Position at bottom center
        page_rect = page.rect
        footer_point = fitz.Point(page_rect.width / 2 - 50, page_rect.height - 20)

        page.insert_text(
            footer_point,
            footer_text,
            fontsize=8,
            color=(0.5, 0.5, 0.5)  # Gray color
        )

    def _add_bookmarks(self, doc: fitz.Document, frames_data: List[Dict]):
        """
        Add bookmarks/table of contents to PDF

        Args:
            doc: PyMuPDF document
            frames_data: List of frame data
        """
        toc = []

        # Add bookmark every 10 pages or at scene changes
        for i, frame_data in enumerate(frames_data):
            if i % 10 == 0 or frame_data.get('scene_change', False):
                timestamp = frame_data.get('timestamp', 0)
                title = f"Frame {i + 1} - {self._format_timestamp(timestamp)}"
                toc.append([1, title, i + 1])  # [level, title, page_number]

        if toc:
            doc.set_toc(toc)

    def _format_timestamp(self, seconds: float) -> str:
        """
        Format timestamp in HH:MM:SS format

        Args:
            seconds: Timestamp in seconds

        Returns:
            Formatted timestamp string
        """
        hours = int(seconds // 3600)
        minutes = int((seconds % 3600) // 60)
        secs = int(seconds % 60)

        if hours > 0:
            return f"{hours:02d}:{minutes:02d}:{secs:02d}"
        else:
            return f"{minutes:02d}:{secs:02d}"

    def merge_pdfs(self, pdf_paths: List[Path], output_path: Path) -> Dict:
        """
        Merge multiple PDFs into one

        Args:
            pdf_paths: List of PDF file paths to merge
            output_path: Path to save merged PDF

        Returns:
            Dictionary containing merge result
        """
        try:
            merged_doc = fitz.open()

            for pdf_path in pdf_paths:
                if pdf_path.exists():
                    doc = fitz.open(pdf_path)
                    merged_doc.insert_pdf(doc)
                    doc.close()

            merged_doc.save(str(output_path))
            merged_doc.close()

            return {
                'success': True,
                'output_path': str(output_path),
                'merged_count': len(pdf_paths)
            }

        except Exception as e:
            logger.error(f"Failed to merge PDFs: {e}")
            return {
                'success': False,
                'error': str(e)
            }

    def add_watermark(self, pdf_path: Path, watermark_text: str, output_path: Path) -> Dict:
        """
        Add watermark to PDF

        Args:
            pdf_path: Path to input PDF
            watermark_text: Text to use as watermark
            output_path: Path to save watermarked PDF

        Returns:
            Dictionary containing result
        """
        try:
            doc = fitz.open(pdf_path)

            for page in doc:
                # Add watermark at center
                page_rect = page.rect
                center = page_rect.width / 2, page_rect.height / 2

                page.insert_text(
                    center,
                    watermark_text,
                    fontsize=48,
                    color=(0.9, 0.9, 0.9),  # Light gray
                    rotate=45,
                    overlay=True
                )

            doc.save(str(output_path))
            doc.close()

            return {
                'success': True,
                'output_path': str(output_path)
            }

        except Exception as e:
            logger.error(f"Failed to add watermark: {e}")
            return {
                'success': False,
                'error': str(e)
            }

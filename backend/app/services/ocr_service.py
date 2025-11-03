"""
OCR service for text extraction from images
"""

import pytesseract
from PIL import Image
from pathlib import Path
from typing import Dict, List, Optional
import logging
import cv2
import numpy as np

from app.core.config import settings

logger = logging.getLogger(__name__)


class OCRService:
    """Service for performing OCR on images"""

    def __init__(self, languages: str = None, confidence_threshold: int = None):
        """
        Initialize OCR service

        Args:
            languages: Languages to use for OCR (e.g., 'eng+kor')
            confidence_threshold: Minimum confidence score to accept text
        """
        self.languages = languages or settings.OCR_LANGUAGES
        self.confidence_threshold = confidence_threshold or settings.OCR_CONFIDENCE_THRESHOLD

        # Set Tesseract path if configured
        if settings.TESSERACT_PATH:
            pytesseract.pytesseract.tesseract_cmd = settings.TESSERACT_PATH

    def extract_text(self, image_path: Path, preprocess: bool = True) -> Dict:
        """
        Extract text from an image

        Args:
            image_path: Path to image file
            preprocess: Whether to preprocess image before OCR

        Returns:
            Dictionary containing extracted text and metadata
        """
        try:
            # Load image
            image = Image.open(image_path)

            # Preprocess if requested
            if preprocess:
                image = self._preprocess_image(image)

            # Perform OCR
            ocr_data = pytesseract.image_to_data(
                image,
                lang=self.languages,
                output_type=pytesseract.Output.DICT
            )

            # Filter by confidence
            filtered_text, filtered_data = self._filter_by_confidence(ocr_data)

            # Calculate average confidence
            confidences = [c for c in ocr_data['conf'] if c != -1]
            avg_confidence = sum(confidences) / len(confidences) if confidences else 0

            return {
                "text": filtered_text,
                "confidence": avg_confidence,
                "data": filtered_data,
                "word_count": len(filtered_text.split()),
                "char_count": len(filtered_text),
            }

        except Exception as e:
            logger.error(f"OCR failed for {image_path}: {e}")
            return {
                "text": "",
                "confidence": 0.0,
                "data": {},
                "word_count": 0,
                "char_count": 0,
                "error": str(e)
            }

    def extract_text_with_boxes(self, image_path: Path, preprocess: bool = True) -> Dict:
        """
        Extract text with bounding box coordinates

        Args:
            image_path: Path to image file
            preprocess: Whether to preprocess image before OCR

        Returns:
            Dictionary containing text, boxes, and metadata
        """
        try:
            # Load image
            image = Image.open(image_path)

            # Preprocess if requested
            if preprocess:
                image = self._preprocess_image(image)

            # Perform OCR with bounding boxes
            ocr_data = pytesseract.image_to_data(
                image,
                lang=self.languages,
                output_type=pytesseract.Output.DICT
            )

            # Extract words with boxes
            boxes = []
            full_text = []

            for i in range(len(ocr_data['text'])):
                conf = int(ocr_data['conf'][i])
                text = ocr_data['text'][i].strip()

                if conf >= self.confidence_threshold and text:
                    box = {
                        'text': text,
                        'confidence': conf,
                        'left': ocr_data['left'][i],
                        'top': ocr_data['top'][i],
                        'width': ocr_data['width'][i],
                        'height': ocr_data['height'][i],
                        'block_num': ocr_data['block_num'][i],
                        'line_num': ocr_data['line_num'][i],
                        'word_num': ocr_data['word_num'][i],
                    }
                    boxes.append(box)
                    full_text.append(text)

            # Calculate average confidence
            confidences = [b['confidence'] for b in boxes]
            avg_confidence = sum(confidences) / len(confidences) if confidences else 0

            return {
                "text": " ".join(full_text),
                "boxes": boxes,
                "confidence": avg_confidence,
                "word_count": len(boxes),
                "char_count": len(" ".join(full_text)),
            }

        except Exception as e:
            logger.error(f"OCR with boxes failed for {image_path}: {e}")
            return {
                "text": "",
                "boxes": [],
                "confidence": 0.0,
                "word_count": 0,
                "char_count": 0,
                "error": str(e)
            }

    def _preprocess_image(self, image: Image.Image) -> Image.Image:
        """
        Preprocess image to improve OCR accuracy

        Args:
            image: PIL Image

        Returns:
            Preprocessed PIL Image
        """
        # Convert PIL to OpenCV
        opencv_image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)

        # Convert to grayscale
        gray = cv2.cvtColor(opencv_image, cv2.COLOR_BGR2GRAY)

        # Apply adaptive thresholding
        thresh = cv2.adaptiveThreshold(
            gray, 255,
            cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
            cv2.THRESH_BINARY,
            11, 2
        )

        # Denoise
        denoised = cv2.fastNlMeansDenoising(thresh, None, 10, 7, 21)

        # Convert back to PIL
        processed = Image.fromarray(denoised)

        return processed

    def _filter_by_confidence(self, ocr_data: Dict) -> tuple[str, Dict]:
        """
        Filter OCR results by confidence threshold

        Args:
            ocr_data: Raw OCR data from Tesseract

        Returns:
            Tuple of (filtered_text, filtered_data)
        """
        filtered_words = []
        filtered_data = {
            'words': [],
            'confidences': [],
            'boxes': []
        }

        for i in range(len(ocr_data['text'])):
            conf = int(ocr_data['conf'][i])
            text = ocr_data['text'][i].strip()

            if conf >= self.confidence_threshold and text:
                filtered_words.append(text)
                filtered_data['words'].append(text)
                filtered_data['confidences'].append(conf)
                filtered_data['boxes'].append({
                    'left': ocr_data['left'][i],
                    'top': ocr_data['top'][i],
                    'width': ocr_data['width'][i],
                    'height': ocr_data['height'][i]
                })

        return " ".join(filtered_words), filtered_data

    def batch_extract(self, image_paths: List[Path], preprocess: bool = True) -> List[Dict]:
        """
        Extract text from multiple images

        Args:
            image_paths: List of paths to image files
            preprocess: Whether to preprocess images before OCR

        Returns:
            List of dictionaries containing extracted text and metadata
        """
        results = []

        for i, image_path in enumerate(image_paths):
            logger.info(f"Processing OCR for image {i+1}/{len(image_paths)}: {image_path.name}")
            result = self.extract_text_with_boxes(image_path, preprocess)
            result['image_path'] = str(image_path)
            results.append(result)

        return results

    def search_text_in_images(
        self,
        image_paths: List[Path],
        search_query: str,
        case_sensitive: bool = False
    ) -> List[Dict]:
        """
        Search for text across multiple images

        Args:
            image_paths: List of paths to image files
            search_query: Text to search for
            case_sensitive: Whether search should be case-sensitive

        Returns:
            List of dictionaries containing matching images and positions
        """
        results = []

        for image_path in image_paths:
            ocr_result = self.extract_text_with_boxes(image_path)

            text = ocr_result['text']
            if not case_sensitive:
                text = text.lower()
                search_query = search_query.lower()

            if search_query in text:
                # Find matching boxes
                matching_boxes = []
                for box in ocr_result['boxes']:
                    box_text = box['text']
                    if not case_sensitive:
                        box_text = box_text.lower()

                    if search_query in box_text:
                        matching_boxes.append(box)

                results.append({
                    'image_path': str(image_path),
                    'text': ocr_result['text'],
                    'matching_boxes': matching_boxes,
                    'confidence': ocr_result['confidence']
                })

        return results

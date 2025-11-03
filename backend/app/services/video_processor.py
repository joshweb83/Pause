"""
Video processing service for frame extraction and analysis
"""

import cv2
import numpy as np
from pathlib import Path
from typing import List, Tuple, Optional, Dict
import imagehash
from PIL import Image
import logging

from app.core.config import settings

logger = logging.getLogger(__name__)


class VideoProcessor:
    """Service for processing videos and extracting frames"""

    def __init__(self, fps: int = None):
        """
        Initialize video processor

        Args:
            fps: Frames per second to extract (default from settings)
        """
        self.fps = fps or settings.FRAME_EXTRACTION_FPS
        self.duplicate_threshold = settings.DUPLICATE_THRESHOLD

    def get_video_info(self, video_path: Path) -> Dict:
        """
        Get video metadata

        Args:
            video_path: Path to video file

        Returns:
            Dictionary containing video metadata
        """
        cap = cv2.VideoCapture(str(video_path))

        if not cap.isOpened():
            raise ValueError(f"Could not open video file: {video_path}")

        try:
            fps = cap.get(cv2.CAP_PROP_FPS)
            frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
            height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
            duration = frame_count / fps if fps > 0 else 0

            return {
                "fps": fps,
                "frame_count": frame_count,
                "width": width,
                "height": height,
                "duration": duration,
            }
        finally:
            cap.release()

    def extract_frames(
        self,
        video_path: Path,
        output_dir: Path,
        remove_duplicates: bool = True
    ) -> List[Dict]:
        """
        Extract frames from video

        Args:
            video_path: Path to video file
            output_dir: Directory to save extracted frames
            remove_duplicates: Whether to filter out duplicate frames

        Returns:
            List of dictionaries containing frame information
        """
        output_dir.mkdir(parents=True, exist_ok=True)

        cap = cv2.VideoCapture(str(video_path))
        if not cap.isOpened():
            raise ValueError(f"Could not open video file: {video_path}")

        try:
            video_fps = cap.get(cv2.CAP_PROP_FPS)
            frame_interval = int(video_fps / self.fps) if self.fps > 0 else 1

            frames_data = []
            frame_count = 0
            saved_count = 0
            previous_hash = None

            logger.info(f"Extracting frames from {video_path} at {self.fps} FPS")
            logger.info(f"Video FPS: {video_fps}, Frame interval: {frame_interval}")

            while True:
                ret, frame = cap.read()
                if not ret:
                    break

                # Only process frames at the specified interval
                if frame_count % frame_interval == 0:
                    # Calculate timestamp
                    timestamp = frame_count / video_fps

                    # Check for duplicates if enabled
                    if remove_duplicates and previous_hash is not None:
                        current_hash = self._calculate_frame_hash(frame)
                        similarity = 1 - (current_hash - previous_hash) / 64.0

                        if similarity >= self.duplicate_threshold:
                            logger.debug(f"Skipping duplicate frame at {timestamp:.2f}s")
                            frame_count += 1
                            continue

                        previous_hash = current_hash
                    elif remove_duplicates:
                        previous_hash = self._calculate_frame_hash(frame)

                    # Save frame
                    frame_filename = f"frame_{saved_count:06d}.jpg"
                    frame_path = output_dir / frame_filename

                    cv2.imwrite(str(frame_path), frame, [cv2.IMWRITE_JPEG_QUALITY, 95])

                    frames_data.append({
                        "frame_number": saved_count,
                        "original_frame": frame_count,
                        "timestamp": timestamp,
                        "image_path": str(frame_path),
                        "width": frame.shape[1],
                        "height": frame.shape[0],
                    })

                    saved_count += 1

                    if saved_count % 10 == 0:
                        logger.info(f"Extracted {saved_count} frames...")

                frame_count += 1

            logger.info(f"Extracted {saved_count} frames from {frame_count} total frames")
            return frames_data

        finally:
            cap.release()

    def _calculate_frame_hash(self, frame: np.ndarray) -> imagehash.ImageHash:
        """
        Calculate perceptual hash of a frame for duplicate detection

        Args:
            frame: OpenCV frame (numpy array)

        Returns:
            Perceptual hash of the frame
        """
        # Convert BGR to RGB
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        pil_image = Image.fromarray(frame_rgb)
        return imagehash.phash(pil_image)

    def create_thumbnail(
        self,
        video_path: Path,
        output_path: Path,
        timestamp: float = 0.0,
        size: Tuple[int, int] = (320, 180)
    ) -> Path:
        """
        Create a thumbnail from video at specified timestamp

        Args:
            video_path: Path to video file
            output_path: Path to save thumbnail
            timestamp: Timestamp in seconds
            size: Thumbnail size (width, height)

        Returns:
            Path to saved thumbnail
        """
        cap = cv2.VideoCapture(str(video_path))

        if not cap.isOpened():
            raise ValueError(f"Could not open video file: {video_path}")

        try:
            # Seek to timestamp
            fps = cap.get(cv2.CAP_PROP_FPS)
            frame_number = int(timestamp * fps)
            cap.set(cv2.CAP_PROP_POS_FRAMES, frame_number)

            ret, frame = cap.read()
            if not ret:
                raise ValueError(f"Could not read frame at timestamp {timestamp}")

            # Resize frame
            thumbnail = cv2.resize(frame, size, interpolation=cv2.INTER_AREA)

            # Save thumbnail
            output_path.parent.mkdir(parents=True, exist_ok=True)
            cv2.imwrite(str(output_path), thumbnail, [cv2.IMWRITE_JPEG_QUALITY, 90])

            return output_path

        finally:
            cap.release()

    def detect_scene_changes(
        self,
        video_path: Path,
        threshold: float = 30.0
    ) -> List[float]:
        """
        Detect scene changes in video

        Args:
            video_path: Path to video file
            threshold: Scene change threshold

        Returns:
            List of timestamps where scene changes occur
        """
        cap = cv2.VideoCapture(str(video_path))

        if not cap.isOpened():
            raise ValueError(f"Could not open video file: {video_path}")

        try:
            fps = cap.get(cv2.CAP_PROP_FPS)
            scene_changes = []
            prev_frame = None
            frame_count = 0

            while True:
                ret, frame = cap.read()
                if not ret:
                    break

                # Convert to grayscale for comparison
                gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

                if prev_frame is not None:
                    # Calculate frame difference
                    diff = cv2.absdiff(prev_frame, gray)
                    mean_diff = np.mean(diff)

                    if mean_diff > threshold:
                        timestamp = frame_count / fps
                        scene_changes.append(timestamp)
                        logger.debug(f"Scene change detected at {timestamp:.2f}s")

                prev_frame = gray
                frame_count += 1

            logger.info(f"Detected {len(scene_changes)} scene changes")
            return scene_changes

        finally:
            cap.release()

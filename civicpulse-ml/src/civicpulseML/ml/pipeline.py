from .detector import detector
from .ocr import ocr_engine
import logging
import cv2
import numpy as np

logger = logging.getLogger(__name__)

class ValidationPipeline:
    def __init__(self):
        self.detector = detector
        self.ocr = ocr_engine

    def process_plate_image(self, image_bytes: bytes):
        try:
            plate_roi, detection_conf = self.detector.detect_plate(image_bytes)

            if plate_roi is None:
                return {
                    "detected": False,
                    "plate_number": None,
                    "confidence": 0.0,
                    "message": "No license plate detected in image"
                }

            plate_text, ocr_conf = self.ocr.extract_text(plate_roi)

            if plate_text is None or len(plate_text) < 3:
                return {
                    "detected": True,
                    "plate_number": None,
                    "confidence": detection_conf,
                    "message": "Plate detected but text extraction failed"
                }

            final_confidence = (detection_conf + ocr_conf) / 2

            return {
                "detected": True,
                "plate_number": plate_text,
                "confidence": round(final_confidence, 2),
                "message": "Success"
            }

        except Exception as e:
            logger.error(f"Error in validation pipeline: {e}")
            return {
                "detected": False,
                "plate_number": None,
                "confidence": 0.0,
                "message": f"Error: {str(e)}"
            }

    def validate_image_quality(self, image_bytes: bytes):
        try:
            nparr = np.frombuffer(image_bytes, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

            if img is None:
                return {
                    "valid": False,
                    "message": "Invalid image format"
                }

            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            blur_score = cv2.Laplacian(gray, cv2.CV_64F).var()

            if blur_score < 100:
                return {
                    "valid": False,
                    "message": "Image is too blurry",
                    "blur_score": round(blur_score, 2)
                }

            return {
                "valid": True,
                "message": "Image quality is acceptable",
                "blur_score": round(blur_score, 2)
            }

        except Exception as e:
            logger.error(f"Error in image validation: {e}")
            return {
                "valid": True,
                "message": "Quality check skipped due to error"
            }

pipeline = ValidationPipeline()

import easyocr
import numpy as np
import logging
import re

logger = logging.getLogger(__name__)

class OCREngine:
    def __init__(self):
        self.reader = None
        self.initialize()

    def initialize(self):
        try:
            self.reader = easyocr.Reader(['en'], gpu=False)
            logger.info("OCR engine initialized successfully")
        except Exception as e:
            logger.error(f"Error initializing OCR: {e}")
            self.reader = None

    def extract_text(self, image):
        if self.reader is None:
            return None, 0.0

        try:
            results = self.reader.readtext(image)

            if not results:
                return None, 0.0

            texts = []
            confidences = []

            for detection in results:
                text = detection[1]
                conf = detection[2]
                texts.append(text)
                confidences.append(conf)

            full_text = ' '.join(texts)
            avg_confidence = sum(confidences) / len(confidences) if confidences else 0.0

            cleaned_text = self.clean_plate_text(full_text)

            return cleaned_text, avg_confidence

        except Exception as e:
            logger.error(f"Error in OCR extraction: {e}")
            return None, 0.0

    def clean_plate_text(self, text: str) -> str:
        text = re.sub(r'[^A-Z0-9]', '', text.upper())
        return text

ocr_engine = OCREngine()

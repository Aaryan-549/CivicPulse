from ultralytics import YOLO
import cv2
import numpy as np
from pathlib import Path
from ..config import MODELS_DIR, CUDA_AVAILABLE
import logging

logger = logging.getLogger(__name__)

class PlateDetector:
    def __init__(self):
        self.model = None
        self.load_model()

    def load_model(self):
        try:
            model_path = MODELS_DIR / "plate_detector.pt"
            if model_path.exists():
                self.model = YOLO(str(model_path))
                logger.info(f"Loaded model from {model_path}")
            else:
                logger.warning(f"Model not found at {model_path}, using pretrained YOLOv8")
                self.model = YOLO('yolov8n.pt')
        except Exception as e:
            logger.error(f"Error loading model: {e}")
            self.model = YOLO('yolov8n.pt')

    def detect_plate(self, image_bytes: bytes, confidence_threshold: float = 0.5):
        try:
            nparr = np.frombuffer(image_bytes, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

            if img is None:
                return None, 0.0

            results = self.model(img, conf=confidence_threshold, device='cuda' if CUDA_AVAILABLE else 'cpu')

            if len(results) == 0 or len(results[0].boxes) == 0:
                return None, 0.0

            best_box = None
            best_conf = 0.0

            for box in results[0].boxes:
                conf = float(box.conf[0])
                if conf > best_conf:
                    best_conf = conf
                    best_box = box

            if best_box is None:
                return None, 0.0

            x1, y1, x2, y2 = map(int, best_box.xyxy[0])
            plate_roi = img[y1:y2, x1:x2]

            return plate_roi, best_conf

        except Exception as e:
            logger.error(f"Error in plate detection: {e}")
            return None, 0.0

detector = PlateDetector()

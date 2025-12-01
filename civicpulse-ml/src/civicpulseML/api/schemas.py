from pydantic import BaseModel
from typing import Optional

class PlateDetectionResponse(BaseModel):
    detected: bool
    plate_number: Optional[str] = None
    confidence: float
    message: str

class ImageValidationResponse(BaseModel):
    valid: bool
    message: str
    blur_score: Optional[float] = None

class HealthResponse(BaseModel):
    status: str
    version: str
    message: str

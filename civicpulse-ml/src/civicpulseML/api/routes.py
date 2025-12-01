from fastapi import APIRouter, File, UploadFile, HTTPException
from .schemas import PlateDetectionResponse, ImageValidationResponse, HealthResponse
from ..ml.pipeline import pipeline
from ..config import BASE_DIR
from dotenv import load_dotenv
import os

load_dotenv()

router = APIRouter()

MAX_IMAGE_SIZE = 10 * 1024 * 1024

@router.post("/api/ocr/plate", response_model=PlateDetectionResponse)
async def detect_plate(image: UploadFile = File(...)):
    try:
        if image.content_type not in ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']:
            raise HTTPException(status_code=400, detail="Invalid image format")

        image_bytes = await image.read()

        if len(image_bytes) > MAX_IMAGE_SIZE:
            raise HTTPException(status_code=400, detail="Image size exceeds limit")

        result = pipeline.process_plate_image(image_bytes)

        return PlateDetectionResponse(**result)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/api/validate/image", response_model=ImageValidationResponse)
async def validate_image(image: UploadFile = File(...)):
    try:
        if image.content_type not in ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']:
            raise HTTPException(status_code=400, detail="Invalid image format")

        image_bytes = await image.read()

        if len(image_bytes) > MAX_IMAGE_SIZE:
            raise HTTPException(status_code=400, detail="Image size exceeds limit")

        result = pipeline.validate_image_quality(image_bytes)

        return ImageValidationResponse(**result)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse(
        status="healthy",
        version="1.0.0",
        message="ML service is running"
    )

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from civicpulseML.api.routes import router

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler(sys.stdout)]
)

logger = logging.getLogger(__name__)

app = FastAPI(
    title="CivicPulse ML API",
    version="1.0.0",
    description="ML service for Civic Pulse platform - License plate detection and image validation"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

@app.on_event("startup")
async def startup_event():
    logger.info("CivicPulse ML API v1.0.0 started")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("ML service shutting down")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

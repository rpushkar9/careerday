from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json
import sys
from pathlib import Path

# Add the engines directory to Python path
engines_dir = Path(__file__).parent / "src"
sys.path.append(str(engines_dir))

from src.api_wrapper import CareerAPIWrapper

app = FastAPI(title="CareerDay API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CareerRequest(BaseModel):
    major: Optional[str] = ""
    cip_code: Optional[str] = ""
    interests: Optional[List[str]] = []
    skills: Optional[List[str]] = []
    university: Optional[str] = ""
    top_n: Optional[int] = 3

@app.get("/")
async def root():
    return {"message": "CareerDay API is running!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/api/career-recommendations")
async def get_career_recommendations(request: CareerRequest):
    try:
        wrapper = CareerAPIWrapper()
        recommendations = wrapper.get_career_recommendations(
            major=request.major,
            cip_code=request.cip_code,
            interests=request.interests,
            skills=request.skills,
            university=request.university,
            top_n=request.top_n
        )
        return recommendations
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json
import sys
import os
from pathlib import Path

# Set up proper Python path for Railway
# In Railway, the working directory might be different, so we need to be more explicit
script_dir = Path(__file__).parent.absolute()
current_dir = Path.cwd()

print(f"Script directory: {script_dir}")
print(f"Current working directory: {current_dir}")

# Always use the script directory as the base for finding other files
backend_dir = script_dir
src_dir = backend_dir / "src"
engines_dir = src_dir / "engines"
data_dir = backend_dir / "data"

# Add all necessary directories to Python path
sys.path.insert(0, str(backend_dir))
sys.path.insert(0, str(src_dir))
sys.path.insert(0, str(engines_dir))
sys.path.insert(0, str(data_dir))

# Set environment variable for data directory
os.environ['DATA_DIR'] = str(data_dir)

# Debug: Print current paths
print(f"Backend directory: {backend_dir}")
print(f"Source directory: {src_dir}")
print(f"Data directory: {data_dir}")
print(f"Python path: {sys.path}")

try:
    from api_wrapper import CareerAPIWrapper
    print("Successfully imported CareerAPIWrapper")
except ImportError as e:
    print(f"Import error: {e}")
    print(f"Files in script dir: {list(script_dir.glob('*'))}")
    print(f"Files in src: {list(src_dir.glob('*')) if src_dir.exists() else 'src dir not found'}")
    print(f"Files in data: {list(data_dir.glob('*')) if data_dir.exists() else 'data dir not found'}")
    raise

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

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import shutil
import os

from predict import predict

app = FastAPI(title="Voice Emotion Recognition API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api")
def api_home():
    return {"message": "Voice Emotion Recognition API is running"}

@app.post("/predict")
async def predict_emotion(file: UploadFile = File(...)):
    if not file.filename.endswith(".wav"):
        return {"error": "Only WAV files are accepted"}

    temp_path = "temp_audio.wav"

    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        result = predict(temp_path)
        return result

    except Exception as e:
        return {"error": str(e)}

    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

# =========================
# SERVE REACT FRONTEND
# =========================

dist_path = "frontend/dist"

# Serve assets folder
assets_path = os.path.join(dist_path, "assets")

if os.path.exists(assets_path):
    app.mount(
        "/assets",
        StaticFiles(directory=assets_path),
        name="assets",
    )

# Serve React app
@app.get("/{full_path:path}")
async def serve_react_app(full_path: str):
    index_path = os.path.join(dist_path, "index.html")

    if os.path.exists(index_path):
        return FileResponse(index_path)

    return {"message": "Frontend build not found. API is running."}

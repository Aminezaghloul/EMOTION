from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import shutil, os
from predict import predict

app = FastAPI(title="Voice Emotion Recognition API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/")
def home():
    return {"message": "Voice Emotion Recognition API is running"}

@app.post("/api/predict")
async def predict_emotion(file: UploadFile = File(...)):
    temp_path = "temp_audio.wav"
    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        return predict(temp_path)
    except Exception as e:
        return {"error": str(e)}
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

app.mount("/assets", StaticFiles(directory="frontend/dist/assets"), name="assets")

@app.get("/{full_path:path}")
def serve_react(full_path: str):
    return FileResponse("frontend/dist/index.html")

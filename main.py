from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import shutil
import os

from predict import predict

app = FastAPI(title="Voice Emotion Recognition API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API HOME
@app.get("/api/")
def home():
    return {"message": "Voice Emotion Recognition API is running"}

# PREDICT ROUTE
@app.post("/api/predict")
async def predict_emotion(file: UploadFile = File(...)):

    if not file:
        return {"error": "No file uploaded"}

    if not file.filename.endswith(".wav"):
        return {"error": "Only WAV files are accepted"}

    temp_path = "temp_audio.wav"

    try:
        # Save uploaded file
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Predict emotion
        result = predict(temp_path)

        return result

    except Exception as e:
        return {"error": str(e)}

    finally:
        # Remove temp file
        if os.path.exists(temp_path):
            os.remove(temp_path)


# SERVE REACT STATIC FILES
app.mount(
    "/assets",
    StaticFiles(directory="frontend/dist/assets"),
    name="assets"
)

# SERVE REACT APP
@app.get("/{full_path:path}")
async def serve_react_app(full_path: str):
    return FileResponse("frontend/dist/index.html")
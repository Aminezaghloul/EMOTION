import io
import torch
import librosa
import librosa.display
import numpy as np
import matplotlib.pyplot as plt
from PIL import Image
from torchvision import transforms

CLASSES = ["Angry", "Happy", "Neutral", "Sad"]

# Don't load at module level — load once on first call
_model = None

def get_model():
    global _model
    if _model is None:
        from model_loader import load_model
        _model = load_model()
    return _model

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406],
                         [0.229, 0.224, 0.225])
])

def audio_to_tensor(path):
    y, sr = librosa.load(path, sr=16000)
    y = librosa.util.fix_length(y, size=16000 * 4)
    stft = librosa.stft(y, n_fft=1024, hop_length=512)
    db = librosa.amplitude_to_db(np.abs(stft), ref=np.max)
    plt.figure(figsize=(3, 3))
    librosa.display.specshow(db, sr=sr, hop_length=512)
    plt.axis("off")
    buffer = io.BytesIO()
    plt.savefig(buffer, format="png", bbox_inches="tight", pad_inches=0)
    plt.close()
    buffer.seek(0)
    image = Image.open(buffer).convert("RGB")
    return transform(image).unsqueeze(0)

def predict(audio_path):
    model = get_model()  # loads only on first call
    tensor = audio_to_tensor(audio_path)
    with torch.no_grad():
        probs = torch.softmax(model(tensor), dim=1)[0]
        index = torch.argmax(probs).item()
    return {
        "class_name": CLASSES[index],
        "confidence": float(probs[index])
    }

if __name__ == "__main__":
    print(predict("test.wav"))

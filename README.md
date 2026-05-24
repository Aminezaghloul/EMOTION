# Voice Emotion Recognition API

## Description
Cette application permet de reconnaître l'émotion à partir d'un fichier audio WAV.

## Technologies utilisées
- Python
- FastAPI
- PyTorch
- Docker

## Lancer avec Docker

```bash
docker build -t voice-emotion-api .
docker run -p 8000:8000 voice-emotion-api
Utilisation

Ouvrir :

http://localhost:8000/docs

Puis utiliser le endpoint :

POST /predict

Uploader un fichier WAV.
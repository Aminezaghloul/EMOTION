# Voice Emotion AI — Frontend

A modern React + Vite + Tailwind dark-mode UI for the Voice Emotion Recognition API
(`main.py` → `POST /predict`).

## Features

- Drag & drop **.wav** upload (validated client-side)
- Built-in **audio player** with progress bar
- Animated **loader** while predicting
- Beautiful **result card** with emoji, dynamic colors, and confidence bar
- Glassmorphism, gradients, animated aurora background

## Run locally

```bash
# 1. Start the FastAPI backend (from project root)
uvicorn main:app --host 0.0.0.0 --port 8000

# 2. Install + run the frontend
cd frontend
npm install
npm run dev
```

Open http://localhost:5173.

The dev server proxies `/api/*` → `http://localhost:8000/*`, so no extra config is needed.

## Configure API URL

To target a different backend (e.g. a deployed server), create `frontend/.env`:

```
VITE_API_BASE_URL=https://your-api.example.com
```

When set, axios calls go directly to that URL instead of the dev proxy.

## Production build

```bash
npm run build
npm run preview
```

The static output in `dist/` can be served by any static host or behind your FastAPI app.

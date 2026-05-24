# FRONTEND BUILD
FROM node:20 AS frontend-build

WORKDIR /frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend ./

RUN npm run build


# BACKEND
FROM python:3.10-slim

WORKDIR /app

RUN apt-get update && apt-get install -y libsndfile1 ffmpeg

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

# COPY REACT BUILD
COPY --from=frontend-build /frontend/dist /app/frontend/dist

EXPOSE 8080

CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8080}"]

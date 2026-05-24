FROM node:20 AS frontend-build
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

FROM python:3.11-slim
WORKDIR /app
RUN apt-get update && apt-get install -y ffmpeg libsndfile1
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
COPY --from=frontend-build /frontend/dist ./frontend/dist

ENV PYTORCH_NO_CUDA_MEMORY_CACHING=1
ENV OMP_NUM_THREADS=1

EXPOSE 8080
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]

import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "/api";

export const api = axios.create({
  baseURL,
  timeout: 60000,
});

export async function predictEmotion(file, { onProgress } = {}) {
  const form = new FormData();
  form.append("file", file, file.name);

  const { data } = await api.post("/predict", form, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (event) => {
      if (!onProgress || !event.total) return;
      onProgress(Math.round((event.loaded / event.total) * 100));
    },
  });

  if (data?.error) {
    throw new Error(data.error);
  }
  return data;
}

export async function pingApi() {
  const { data } = await api.get("/");
  return data;
}

import axios from "axios";

const API_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";

export const geminiAxios = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    "x-goog-api-key": process.env.GEMINI_API_KEY || "",
  },
});

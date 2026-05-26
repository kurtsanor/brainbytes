import axios from "axios";

// const API_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";
// export const geminiAxios = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 60000,
//   headers: {
//     "x-goog-api-key": process.env.GEMINI_API_KEY || "",
//   },
// });

const API_BASE_URL = "https://router.huggingface.co/v1";

/**
 * Shared Axios client for Hugging Face chat-completions requests.
 *
 * @returns A configured Axios instance for the Hugging Face router endpoint.
 */
export const huggingFaceAxios = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY || ""}`,
  },
});

export const AI_PREDICT_API_URL =
  import.meta.env.VITE_AI_PREDICT_API_URL || "";

export const AI_PREDICT_TIMEOUT_MS = Number(
  import.meta.env.VITE_AI_PREDICT_TIMEOUT_MS || "60000"
);

export const MAX_UPLOAD_SIZE_MB = 20;

export const APP_NAME = "FloodScope";

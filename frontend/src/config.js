const ROOT = (process.env.REACT_APP_API_URL || "http://localhost:5000").replace(/\/$/, "");
export const ENDPOINT_SOLICITUDES = `${ROOT}/solicitudes/`;
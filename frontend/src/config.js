const ROOT = (process.env.REACT_APP_API_URL || "http://localhost:5000").replace(/\/$/, "");
export const BASE_SOLICITUDES = `${ROOT}/solicitudes`;   // sin “/” final

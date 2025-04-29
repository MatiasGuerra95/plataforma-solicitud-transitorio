// frontend/src/config.js
const ROOT = (process.env.REACT_APP_API_URL || "http://localhost:5000")
               .replace(/\/$/, "");           // quita barra final si viene

// Ruta base SIN slash final
export const SOLICITUDES_API = `${ROOT}/solicitudes`;

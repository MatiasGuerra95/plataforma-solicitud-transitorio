import { useEffect, useState, useCallback } from "react";
import { Toaster, toast } from "react-hot-toast";
import FormularioSolicitud from "./components/FormularioSolicitud";
import ListadoSolicitudes from "./components/ListadoSolicitudes";

// Usa variable de entorno si existe, si no cae en localhost
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function App() {
  /** ------------------------------
   *  Estados de la vista
   * ------------------------------*/
  // Datos principales
  const [solicitudes, setSolicitudes] = useState([]);

  // Meta‑data de paginación; nunca será undefined
  const [meta, setMeta] = useState({
    page: 1,
    pages: 1,
    has_prev: false,
    has_next: false,
  });

  // Flag de carga global
  const [loading, setLoading] = useState(false);

  /** ------------------------------
   *  Helpers
   * ------------------------------*/
  // Obtiene una página concreta del backend
  const fetchSolicitudes = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/solicitudes?page=${page}`);
      if (!res.ok) throw new Error("Error al cargar solicitudes");

      // El backend debería devolver { items: [...], meta: { page, pages, ... } }
      const data = await res.json();

      // Si por alguna razón llega un array plano, lo aceptamos igual
      setSolicitudes(Array.isArray(data) ? data : data.items);
      setMeta(data.meta ?? {
        page: 1,
        pages: 1,
        has_prev: false,
        has_next: false,
      });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Carga inicial
  useEffect(() => {
    fetchSolicitudes();
  }, [fetchSolicitudes]);

  // Navegación entre páginas
  const setPage = (newPage) => {
    if (newPage < 1 || newPage > meta.pages) return; // límites
    fetchSolicitudes(newPage);
  };

  /** ------------------------------
   *  CRUD
   * ------------------------------*/
  const handleNuevaSolicitud = (solicitud) => {
    // Si estamos en la primera página añadimos al listado actual,
    // en caso contrario recargamos la página para mantener consistencia
    if (meta.page === 1) setSolicitudes((prev) => [solicitud, ...prev]);
    else fetchSolicitudes(meta.page);
  };

  const handleEditarSolicitud = async (id, empresa, cargo) => {
    try {
      const res = await fetch(`${API_URL}/solicitudes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ empresa, cargo }),
      });
      if (!res.ok) throw new Error("Error actualizando solicitud");

      const updated = await res.json();
      setSolicitudes((prev) => prev.map((s) => (s.id === id ? updated : s)));
      toast.success("Solicitud actualizada.");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEliminarSolicitud = async (id) => {
    try {
      const res = await fetch(`${API_URL}/solicitudes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error eliminando solicitud");

      setSolicitudes((prev) => prev.filter((s) => s.id !== id));
      toast.success("Solicitud eliminada.");
    } catch (err) {
      toast.error(err.message);
    }
  };

  /** ------------------------------
   *  Render
   * ------------------------------*/
  return (
    <>
      <Toaster position="top-center" />

      <div className="p-6 max-w-xl mx-auto space-y-6">
        {/* Formulario para crear nueva solicitud */}
        <FormularioSolicitud onNuevaSolicitud={handleNuevaSolicitud} />

        {/* Listado principal */}
        {loading ? (
          <p className="text-center">Cargando…</p>
        ) : (
          <>
            <ListadoSolicitudes
              solicitudes={solicitudes}
              onEditarSolicitud={handleEditarSolicitud}
              onEliminarSolicitud={handleEliminarSolicitud}
            />

            {/* Paginación protegida con meta siempre definido */}
            <div className="flex justify-between items-center pt-4">
              <button
                onClick={() => meta.has_prev && setPage(meta.page - 1)}
                disabled={!meta.has_prev}
                className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
              >
                Anterior
              </button>

              <span className="text-sm">
                Página {meta.page} de {meta.pages}
              </span>

              <button
                onClick={() => meta.has_next && setPage(meta.page + 1)}
                disabled={!meta.has_next}
                className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

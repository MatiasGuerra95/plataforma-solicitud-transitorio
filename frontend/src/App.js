// frontend/src/App.js
import { useEffect, useState, useCallback } from "react";
import { BASE_SOLICITUDES } from "./config";          // ← NUEVO
import { Toaster, toast } from "react-hot-toast";
import FormularioSolicitud from "./components/FormularioSolicitud";
import ListadoSolicitudes from "./components/ListadoSolicitudes";

export default function App() {
  /* ----------------------------- estados ----------------------------- */
  const [solicitudes, setSolicitudes]   = useState([]);
  const [meta, setMeta]                 = useState({ page: 1, pages: 1, has_prev: false, has_next: false });
  const [loading, setLoading]           = useState(false);

  /* -------------------------- helpers fetch -------------------------- */
  const fetchSolicitudes = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const res  = await fetch(`${BASE_SOLICITUDES}/?page=${page}`);   // ← nota la “/”
      if (!res.ok) throw new Error("Error al cargar solicitudes");
      const data = await res.json();
      setSolicitudes(Array.isArray(data) ? data : data.items);
      setMeta(data.meta ?? { page: 1, pages: 1, has_prev: false, has_next: false });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSolicitudes(); }, [fetchSolicitudes]);

  const setPage = (p) => p >= 1 && p <= meta.pages && fetchSolicitudes(p);

  /* ------------------------------ CRUD ------------------------------ */
  const handleNuevaSolicitud = (s) =>
    meta.page === 1 ? setSolicitudes((prev) => [s, ...prev]) : fetchSolicitudes(meta.page);

  const handleEditarSolicitud = async (id, empresa, cargo) => {
    try {
      const res = await fetch(`${BASE_SOLICITUDES}/${id}`, {          // ← SIN “/” al final
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
      const res = await fetch(`${BASE_SOLICITUDES}/${id}`, { method: "DELETE" }); // ← idem
      if (!res.ok) throw new Error("Error eliminando solicitud");
      setSolicitudes((prev) => prev.filter((s) => s.id !== id));
      toast.success("Solicitud eliminada.");
    } catch (err) {
      toast.error(err.message);
    }
  };

  /* ----------------------------- render ------------------------------ */
  return (
    <>
      <Toaster position="top-center" />
      <div className="p-6 max-w-xl mx-auto space-y-6">
        <FormularioSolicitud onNuevaSolicitud={handleNuevaSolicitud} />

        {loading ? (
          <p className="text-center">Cargando…</p>
        ) : (
          <>
            <ListadoSolicitudes
              solicitudes={solicitudes}
              onEditarSolicitud={handleEditarSolicitud}
              onEliminarSolicitud={handleEliminarSolicitud}
            />

            <div className="flex justify-between items-center pt-4">
              <button
                onClick={() => meta.has_prev && setPage(meta.page - 1)}
                disabled={!meta.has_prev}
                className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
              >
                Anterior
              </button>

              <span className="text-sm">Página {meta.page} de {meta.pages}</span>

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

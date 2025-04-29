import React, { useEffect, useState, useCallback } from 'react';
import { ENDPOINT_SOLICITUDES } from './config';
import { Toaster, toast } from 'react-hot-toast';
import FormularioSolicitud from './components/FormularioSolicitud';
import ListadoSolicitudes from './components/ListadoSolicitudes';

export default function App() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [meta, setMeta] = useState({ page: 1, pages: 1, has_prev: false, has_next: false });
  const [loading, setLoading] = useState(false);

  // Helper para cargar solicitudes con paginación
  const fetchSolicitudes = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`${ENDPOINT_SOLICITUDES}?page=${page}`);
      if (!res.ok) throw new Error('Error al cargar solicitudes');
      const json = await res.json();
      // El backend devuelve { data: [...], meta: {...} }
      const items = Array.isArray(json) ? json : json.data || [];
      setSolicitudes(items);
      setMeta(json.meta || { page, pages: 1, has_prev: false, has_next: false });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Carga inicial y cuando cambien dependencias
  useEffect(() => {
    fetchSolicitudes();
  }, [fetchSolicitudes]);

  // Cambia página
  const setPage = (p) => {
    if (p >= 1 && p <= meta.pages) fetchSolicitudes(p);
  };

  // CRUD handlers
  const handleNuevaSolicitud = (nueva) => {
    if (meta.page === 1) {
      setSolicitudes((prev) => [nueva, ...prev]);
    } else {
      setPage(1);
    }
  };

  const handleEditarSolicitud = async (id, empresa, cargo) => {
    try {
      const res = await fetch(`${ENDPOINT_SOLICITUDES}${id}/`, {   //
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ empresa, cargo }),
      });
      if (!res.ok) throw new Error('Error actualizando solicitud');
      const updated = await res.json();
      setSolicitudes((prev) => prev.map((s) => (s.id === id ? updated : s)));
      toast.success('Solicitud actualizada.');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEliminarSolicitud = async (id) => {
    try {
      const res = await fetch(`${ENDPOINT_SOLICITUDES}${id}/`, {   // 
        method: 'DELETE' });
      if (!res.ok) throw new Error('Error eliminando solicitud');
      setSolicitudes((prev) => prev.filter((s) => s.id !== id));
      toast.success('Solicitud eliminada.');
    } catch (err) {
      toast.error(err.message);
    }
  };

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
                onClick={() => setPage(meta.page - 1)}
                disabled={!meta.has_prev}
                className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="text-sm">
                Página {meta.page} de {meta.pages}
              </span>
              <button
                onClick={() => setPage(meta.page + 1)}
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

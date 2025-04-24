export default function ListadoSolicitudes({ solicitudes, onEditarSolicitud, onEliminarSolicitud }) {
    if (!Array.isArray(solicitudes) || solicitudes.length === 0)
      return <p className="text-gray-500">No hay solicitudes aún.</p>;
  
    return (
      <ul className="space-y-2">
        {solicitudes.map((s) => (
          <li key={s.id} className="flex justify-between items-center p-2 border rounded bg-white shadow">
            <div>
              <strong>{s.empresa}</strong>: {s.cargo}
            </div>
            <div className="space-x-2">
              <button
                className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                onClick={() => {
                  const nuevaEmpresa = prompt("Empresa:", s.empresa);
                  const nuevoCargo = prompt("Cargo:", s.cargo);
                  if (nuevaEmpresa && nuevoCargo) onEditarSolicitud(s.id, nuevaEmpresa, nuevoCargo);
                }}
              >
                Editar
              </button>
              <button
                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => {
                  if (window.confirm("¿Eliminar esta solicitud?")) onEliminarSolicitud(s.id);
                }}
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    );
  }
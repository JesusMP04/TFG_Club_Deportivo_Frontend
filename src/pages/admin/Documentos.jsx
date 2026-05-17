import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

export default function Documentos() {
  const [documentos, setDocumentos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    cargarDocumentos();
  }, []);

  const cargarDocumentos = async () => {
    try {
      const res = await api.get('/documentos/pendientes');
      setDocumentos(res.data.documentos);
    } catch (err) {
      setError('Error al cargar los documentos');
    } finally {
      setCargando(false);
    }
  };

  const eliminarDocumento = async (id) => {
    if (!confirm('¿Seguro que quieres eliminar este documento?')) return;
    try {
      await api.delete(`/documentos/${id}`);
      setDocumentos(documentos.filter(d => d.id !== id));
    } catch (err) {
      alert('Error al eliminar el documento');
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-[#2222FF] text-white px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">⚽ Club Deportivo</h1>
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="bg-white text-[#2222FF] text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          ← Volver
        </button>
      </nav>

      <section className="p-8">
        <header className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Documentos pendientes</h2>
          <p className="text-gray-500 mt-1">Revisa los documentos enviados por los usuarios</p>
        </header>

        {cargando && <p className="text-gray-500">Cargando...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!cargando && !error && (
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-gray-600 font-medium">Título</th>
                  <th className="text-left px-6 py-3 text-gray-600 font-medium">Usuario</th>
                  <th className="text-left px-6 py-3 text-gray-600 font-medium">Fecha subida</th>
                  <th className="text-left px-6 py-3 text-gray-600 font-medium">Estado</th>
                  <th className="text-left px-6 py-3 text-gray-600 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {documentos.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-400">No hay documentos pendientes</td>
                  </tr>
                ) : documentos.map(d => (
                  <tr key={d.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-800">{d.titulo}</td>
                    <td className="px-6 py-4 text-gray-600">{d.usuario_id}</td>
                    <td className="px-6 py-4 text-gray-600">{d.fecha_subida?.split('T')[0]}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                        {d.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex gap-3">
                      
                        href={d.url_archivo}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#2222FF] hover:underline text-sm font-medium"
                      <a>
                        Ver
                      </a>
                      <button
                        onClick={() => eliminarDocumento(d.id)}
                        className="text-red-500 hover:underline text-sm font-medium"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
      </section>
    </main>
  );
}
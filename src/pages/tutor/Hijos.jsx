import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';

export default function Hijos() {
  const [hijos, setHijos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    cargarHijos();
  }, []);

  const cargarHijos = async () => {
    try {
      const res = await api.get('/tutores/mis-hijos');
      setHijos(res.data.hijos || []);
    } catch (err) {
      setError('Error al cargar los hijos vinculados');
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-[#2222FF] text-white px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">⚽ Club Deportivo</h1>
        <button
          onClick={() => navigate('/tutor/dashboard')}
          className="bg-white text-[#2222FF] text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          ← Volver
        </button>
      </nav>

      <section className="p-8">
        <header className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Mis Hijos</h2>
          <p className="text-gray-500 mt-1">Jugadores vinculados a tu cuenta</p>

          <button
            onClick={() =>  navigate('/vincular')}
            className="bg-[#2222FF] text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors "
          >
            + Añadir hijo
          </button>
        </header>

        {cargando && <Spinner />}
        {error && <p className="text-red-500">{error}</p>}

        {!cargando && !error && hijos.length === 0 && (
          <p className="text-gray-400">No tienes ningún jugador vinculado todavía.</p>
        )}

        {!cargando && !error && (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hijos.map(h => (
              <article
                key={h.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
              >
                <span className="text-4xl">👦</span>
                <h3 className="text-lg font-semibold text-gray-800 mt-3">{h.nombre} {h.apellidos}</h3>
                <p className="text-gray-500 text-sm mt-1">Relación: {h.tipo}</p>
                {h.equipo_id && (
                    <section className="flex flex-col gap-2 mt-4">
                        <button
                        onClick={() => navigate(`/tutor/sesiones/${h.equipo_id}`)}
                        className="w-full bg-[#2222FF] text-white text-sm font-semibold py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                        Ver partidos
                        </button>
                        <button
                        onClick={() => navigate(`/tutor/chat/${encodeURIComponent(h.equipo_nombre || h.equipo_id)}`)}
                        className="w-full bg-gray-100 text-gray-700 text-sm font-semibold py-2 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                        💬 Chat del equipo
                        </button>
                        <button
                          onClick={() => navigate(`/tutor/estadisticas/${h.id}`)}
                          className="w-full bg-gray-100 text-gray-700 text-sm font-semibold py-2 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          📊 Estadísticas
                        </button>
                    </section>
                )}
                {!h.equipo_id && (
                  <p className="text-gray-400 text-sm mt-4">Sin equipo asignado</p>
                )}
              </article>
            ))}
          </section>
        )}
      </section>
    </main>
  );
}
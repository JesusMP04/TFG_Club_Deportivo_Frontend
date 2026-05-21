import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';

export default function Estadisticas() {
  const { equipo_id, sesion_id } = useParams();
  const [estadisticas, setEstadisticas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    inicializarYCargar();
  }, []);

  const inicializarYCargar = async () => {
    try {
      await api.post(`/estadisticas/partido/${sesion_id}/inicializar`);
      const res = await api.get(`/estadisticas/partido/${sesion_id}`);
      setEstadisticas(res.data.estadisticas);
    } catch (err) {
      console.error('Error al cargar estadísticas');
    } finally {
      setCargando(false);
    }
  };

  const actualizar = async (jugador_id, campo, valor) => {
    const stats = estadisticas.find(e => e.jugador_id === jugador_id);
    const nuevasStats = {
      goles: stats.goles,
      tarjetas_amarillas: stats.tarjetas_amarillas,
      tarjetas_rojas: stats.tarjetas_rojas,
      [campo]: Math.max(0, valor) // no permitir negativos
    };

    // Actualizar UI inmediatamente
    setEstadisticas(estadisticas.map(e =>
      e.jugador_id === jugador_id ? { ...e, ...nuevasStats } : e
    ));

    try {
      await api.put(`/estadisticas/partido/${sesion_id}/jugador/${jugador_id}`, nuevasStats);
    } catch (err) {
      console.error('Error al actualizar estadística');
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-[#2222FF] text-white px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold whitespace-nowrap">⚽ Club Deportivo</h1>
        <button
          onClick={() => navigate(`/entrenador/equipos/${equipo_id}/sesiones`)}
          className="bg-white text-[#2222FF] text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          ← Volver
        </button>
      </nav>

      <section className="p-4 sm:p-8 max-w-2xl mx-auto">
        <header className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Estadísticas del partido</h2>
          <p className="text-gray-500 mt-1">Anota en tiempo real durante el partido</p>
        </header>

        {cargando && <Spinner />}

        {!cargando && estadisticas.length === 0 && (
          <p className="text-gray-400 text-center py-8">No hay jugadores en este equipo</p>
        )}

        {!cargando && estadisticas.map(e => (
          <article key={e.jugador_id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-3">
            <h3 className="font-semibold text-gray-800 mb-3">{e.nombre} {e.apellidos}</h3>
            <section className="flex flex-wrap gap-3">

              {/* Goles */}
              <section className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
                <span className="text-lg">⚽</span>
                <button
                  onClick={() => actualizar(e.jugador_id, 'goles', e.goles - 1)}
                  className="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold transition-colors"
                >
                  −
                </button>
                <span className="w-6 text-center font-bold text-gray-800">{e.goles}</span>
                <button
                  onClick={() => actualizar(e.jugador_id, 'goles', e.goles + 1)}
                  className="w-7 h-7 rounded-full bg-[#2222FF] hover:bg-blue-700 text-white font-bold transition-colors"
                >
                  +
                </button>
              </section>

              {/* Tarjetas amarillas */}
              <section className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
                <span className="text-lg">🟨</span>
                <button
                  onClick={() => actualizar(e.jugador_id, 'tarjetas_amarillas', e.tarjetas_amarillas - 1)}
                  className="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold transition-colors"
                >
                  −
                </button>
                <span className="w-6 text-center font-bold text-gray-800">{e.tarjetas_amarillas}</span>
                <button
                  onClick={() => actualizar(e.jugador_id, 'tarjetas_amarillas', e.tarjetas_amarillas + 1)}
                  className="w-7 h-7 rounded-full bg-yellow-400 hover:bg-yellow-500 text-white font-bold transition-colors"
                >
                  +
                </button>
              </section>

              {/* Tarjetas rojas */}
              <section className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
                <span className="text-lg">🟥</span>
                <button
                  onClick={() => actualizar(e.jugador_id, 'tarjetas_rojas', e.tarjetas_rojas - 1)}
                  className="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold transition-colors"
                >
                  −
                </button>
                <span className="w-6 text-center font-bold text-gray-800">{e.tarjetas_rojas}</span>
                <button
                  onClick={() => actualizar(e.jugador_id, 'tarjetas_rojas', e.tarjetas_rojas + 1)}
                  className="w-7 h-7 rounded-full bg-red-500 hover:bg-red-600 text-white font-bold transition-colors"
                >
                  +
                </button>
              </section>

            </section>
          </article>
        ))}
      </section>
    </main>
  );
}
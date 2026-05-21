import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';

export default function EstadisticasTemporada() {
  const { equipo_id } = useParams();
  const [estadisticas, setEstadisticas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      const res = await api.get(`/estadisticas/temporada/${equipo_id}`);
      setEstadisticas(res.data.estadisticas);
    } catch (err) {
      console.error('Error al cargar estadísticas');
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-[#2222FF] text-white px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold whitespace-nowrap">⚽ Club Deportivo</h1>
        <button
          onClick={() => navigate('/entrenador/equipos')}
          className="bg-white text-[#2222FF] text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          ← Volver
        </button>
      </nav>

      <section className="p-8">
        <header className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Estadísticas de temporada</h2>
          <p className="text-gray-500 mt-1">Rendimiento de todos los jugadores del equipo</p>
        </header>

        {cargando && <Spinner />}

        {!cargando && estadisticas.length === 0 && (
          <p className="text-gray-400 text-center py-8">No hay estadísticas disponibles</p>
        )}

        {!cargando && estadisticas.length > 0 && (
          <>
            {/* Tabla para escritorio */}
            <section className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-gray-600 font-medium">Jugador</th>
                    <th className="text-center px-6 py-3 text-gray-600 font-medium">⚽ Goles</th>
                    <th className="text-center px-6 py-3 text-gray-600 font-medium">🏟️ Partidos</th>
                    <th className="text-center px-6 py-3 text-gray-600 font-medium">🎯 Goles/partido</th>
                    <th className="text-center px-6 py-3 text-gray-600 font-medium">🟨 Amarillas</th>
                    <th className="text-center px-6 py-3 text-gray-600 font-medium">🟥 Rojas</th>
                  </tr>
                </thead>
                <tbody>
                  {estadisticas.map(e => (
                    <tr key={e.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-800">{e.nombre} {e.apellidos}</td>
                      <td className="px-6 py-4 text-center font-bold text-gray-800">{e.total_goles}</td>
                      <td className="px-6 py-4 text-center text-gray-600">{e.partidos_jugados}</td>
                      <td className="px-6 py-4 text-center text-[#2222FF] font-semibold">
                        {e.partidos_jugados > 0
                          ? (e.total_goles / e.partidos_jugados).toFixed(2)
                          : '0.00'}
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-yellow-500">{e.total_amarillas}</td>
                      <td className="px-6 py-4 text-center font-bold text-red-500">{e.total_rojas}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            {/* Tarjetas para móvil */}
            <section className="md:hidden flex flex-col gap-4">
              {estadisticas.map(e => (
                <article key={e.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
                  <h3 className="font-semibold text-gray-800 mb-3">{e.nombre} {e.apellidos}</h3>
                  <section className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-xl font-bold text-gray-800">{e.total_goles}</p>
                      <p className="text-xs text-gray-500">⚽ Goles</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-yellow-500">{e.total_amarillas}</p>
                      <p className="text-xs text-gray-500">🟨 Amarillas</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-red-500">{e.total_rojas}</p>
                      <p className="text-xs text-gray-500">🟥 Rojas</p>
                    </div>
                  </section>
                </article>
              ))}
            </section>
          </>
        )}
      </section>
    </main>
  );
}
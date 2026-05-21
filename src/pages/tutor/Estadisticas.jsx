import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';

export default function Estadisticas() {
  const { jugador_id } = useParams();
  const [estadisticas, setEstadisticas] = useState(null);
  const [hijo, setHijo] = useState(null);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const resHijos = await api.get('/tutores/mis-hijos');
      const hijoEncontrado = resHijos.data.hijos?.find(h => h.id === parseInt(jugador_id));
      setHijo(hijoEncontrado);

      const resStats = await api.get(`/estadisticas/jugador/${jugador_id}`);
      setEstadisticas(resStats.data.estadisticas);
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
          onClick={() => navigate('/tutor/hijos')}
          className="bg-white text-[#2222FF] text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          ← Volver
        </button>
      </nav>

      <section className="p-8 max-w-xl mx-auto">
        <header className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Estadísticas {hijo ? `— ${hijo.nombre} ${hijo.apellidos}` : ''}
          </h2>
          <p className="text-gray-500 mt-1">Acumulado de temporada</p>
        </header>

        {cargando && <Spinner />}

        {!cargando && estadisticas && (
          <section className="grid grid-cols-2 gap-4">
            <article className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center">
              <span className="text-4xl">⚽</span>
              <p className="text-3xl font-bold text-gray-800 mt-3">{estadisticas.total_goles}</p>
              <p className="text-gray-500 text-sm mt-1">Goles</p>
            </article>

            <article className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center">
              <span className="text-4xl">🏟️</span>
              <p className="text-3xl font-bold text-gray-800 mt-3">{estadisticas.partidos_jugados}</p>
              <p className="text-gray-500 text-sm mt-1">Partidos</p>
            </article>

            <article className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center">
              <span className="text-4xl">🟨</span>
              <p className="text-3xl font-bold text-yellow-500 mt-3">{estadisticas.total_amarillas}</p>
              <p className="text-gray-500 text-sm mt-1">Tarjetas amarillas</p>
            </article>

            <article className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center">
              <span className="text-4xl">🟥</span>
              <p className="text-3xl font-bold text-red-500 mt-3">{estadisticas.total_rojas}</p>
              <p className="text-gray-500 text-sm mt-1">Tarjetas rojas</p>
            </article>

            <article className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center">
              <span className="text-4xl">🎯</span>
              <p className="text-3xl font-bold text-[#2222FF] mt-3">
                {estadisticas.partidos_jugados > 0
                  ? (estadisticas.total_goles / estadisticas.partidos_jugados).toFixed(2)
                  : '0.00'}
              </p>
              <p className="text-gray-500 text-sm mt-1">Goles por partido</p>
            </article>

            <article className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center">
              <span className="text-4xl">⚠️</span>
              <p className="text-3xl font-bold text-yellow-500 mt-3">
                {estadisticas.partidos_jugados > 0
                  ? (estadisticas.total_amarillas / estadisticas.partidos_jugados).toFixed(2)
                  : '0.00'}
              </p>
              <p className="text-gray-500 text-sm mt-1">Amarillas por partido</p>
            </article>
          </section>
        )}
      </section>
    </main>
  );
}
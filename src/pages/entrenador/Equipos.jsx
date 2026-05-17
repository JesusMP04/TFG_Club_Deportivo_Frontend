import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

export default function Equipos() {
  const [equipos, setEquipos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const { usuario } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    cargarEquipos();
  }, []);

  const cargarEquipos = async () => {
    try {
      const res = await api.get('/equipos');
      // Filtrar solo los equipos donde el entrenador está asignado
      const misEquipos = res.data.equipos.filter(e => e.entrenador_id === usuario?.id);
      setEquipos(misEquipos);
    } catch (err) {
      setError('Error al cargar los equipos');
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-[#2222FF] text-white px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">⚽ Club Deportivo</h1>
        <button
          onClick={() => navigate('/entrenador/dashboard')}
          className="bg-white text-[#2222FF] text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          ← Volver
        </button>
      </nav>

      <section className="p-8">
        <header className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Mis Equipos</h2>
          <p className="text-gray-500 mt-1">Equipos asignados a tu cuenta</p>
        </header>

        {cargando && <p className="text-gray-500">Cargando...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!cargando && !error && equipos.length === 0 && (
          <p className="text-gray-400">No tienes ningún equipo asignado todavía.</p>
        )}

        {!cargando && !error && (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {equipos.map(e => (
              <article
                key={e.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md hover:border-[#2222FF] transition-all"
              >
                <span className="text-4xl">🏆</span>
                <h3 className="text-lg font-semibold text-gray-800 mt-3">{e.nombre}</h3>
                <p className="text-gray-500 text-sm mt-1">Temporada {e.temporada}</p>
                <section className="flex gap-2 mt-4">
                  <button
                    onClick={() => navigate(`/entrenador/equipos/${e.id}/sesiones`)}
                    className="flex-1 bg-[#2222FF] text-white text-sm font-semibold py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Sesiones
                  </button>
                  <button
                    onClick={() => navigate(`/entrenador/chat/${encodeURIComponent(e.nombre)}`)}
                    className="flex-1 bg-gray-100 text-gray-700 text-sm font-semibold py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Chat equipo
                  </button>
                </section>
              </article>
            ))}
          </section>
        )}
      </section>
    </main>
  );
}
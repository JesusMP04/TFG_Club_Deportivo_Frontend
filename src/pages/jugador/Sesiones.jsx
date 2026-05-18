import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

export default function Sesiones() {
  const [sesiones, setSesiones] = useState([]);
  const [equipo, setEquipo] = useState(null);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    cargarPerfil();
  }, []);

  const cargarPerfil = async () => {
    try {
      const res = await api.get('/jugadores/mi-perfil');
      const jugador = res.data.jugador;
      setEquipo(jugador);
      if (jugador.equipo_id) {
        await cargarSesiones(jugador.equipo_id);
      }
    } catch (err) {
      console.error('Error al cargar perfil');
    } finally {
      setCargando(false);
    }
  };

  const cargarSesiones = async (equipo_id) => {
    try {
      const res = await api.get(`/sesiones/${equipo_id}`);
      setSesiones(res.data.sesiones);
    } catch (err) {
      console.error('Error al cargar sesiones');
    }
  };

  const proximoPartido = sesiones
    .filter(s => s.tipo === 'partido' && new Date(s.fecha) >= new Date())
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))[0];

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-[#2222FF] text-white px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">⚽ Club Deportivo</h1>
        <button
          onClick={() => navigate('/jugador/dashboard')}
          className="bg-white text-[#2222FF] text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          ← Volver
        </button>
      </nav>

      <section className="p-8">
        <header className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Mis Sesiones {equipo ? `— ${equipo.equipo_nombre}` : ''}
          </h2>
          <p className="text-gray-500 mt-1">Calendario de entrenamientos y partidos</p>
        </header>

        {proximoPartido && (
          <article className="bg-[#2222FF] text-white rounded-2xl p-6 mb-8">
            <p className="text-blue-200 text-sm font-semibold mb-1">⚽ Próximo partido</p>
            <h3 className="text-xl font-bold">{proximoPartido.descripcion || 'Partido'}</h3>
            <p className="text-blue-200 mt-1">
              {new Date(proximoPartido.fecha).toLocaleDateString('es-ES', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
              })}
            </p>
          </article>
        )}

        {cargando && <p className="text-gray-500">Cargando...</p>}

        {!cargando && !equipo?.equipo_id && (
          <p className="text-gray-400">No tienes equipo asignado todavía.</p>
        )}

        {!cargando && equipo?.equipo_id && (
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-gray-600 font-medium">Tipo</th>
                  <th className="text-left px-6 py-3 text-gray-600 font-medium">Fecha</th>
                  <th className="text-left px-6 py-3 text-gray-600 font-medium">Descripción</th>
                </tr>
              </thead>
              <tbody>
                {sesiones.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-gray-400">No hay sesiones programadas</td>
                  </tr>
                ) : sesiones.map(s => (
                  <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        s.tipo === 'partido' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {s.tipo}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{s.fecha?.split('T')[0]}</td>
                    <td className="px-6 py-4 text-gray-600">{s.descripcion || '—'}</td>
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
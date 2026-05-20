import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';

export default function Asistencia() {
  const { equipo_id } = useParams();
  const [sesiones, setSesiones] = useState([]);
  const [sesionSeleccionada, setSesionSeleccionada] = useState(null);
  const [jugadores, setJugadores] = useState([]);
  const [asistencias, setAsistencias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    cargarSesiones();
    cargarJugadores();
  }, []);

  const cargarSesiones = async () => {
    try {
      const res = await api.get(`/sesiones/${equipo_id}`);
      setSesiones(res.data.sesiones);
    } catch (err) {
      console.error('Error al cargar sesiones');
    } finally {
      setCargando(false);
    }
  };

  const cargarJugadores = async () => {
    try {
      const res = await api.get(`/jugadores/equipo/${equipo_id}`);
      setJugadores(res.data.jugadores);
    } catch (err) {
      console.error('Error al cargar jugadores');
    }
  };

  const cargarAsistencias = async (sesion_id) => {
    try {
      const res = await api.get(`/asistencia/sesion/${sesion_id}`);
      setAsistencias(res.data.asistencia || []);
    } catch (err) {
      setAsistencias([]); // si no hay asistencias, array vacío
    }
  };

  const seleccionarSesion = async (sesion) => {
    setSesionSeleccionada(sesion);
    await cargarAsistencias(sesion.id);
  };

  const obtenerEstado = (jugador_id) => {
    const asistencia = asistencias.find(a => a.jugador_id === jugador_id);
    return asistencia?.estado || null;
  };

  const marcarAsistencia = async (jugador_id, estado) => {
    try {
      const asistenciaExistente = asistencias.find(a => a.jugador_id === jugador_id);
      if (asistenciaExistente) {
        await api.patch(`/asistencia/${asistenciaExistente.id}`, { estado });
      } else {
        await api.post(`/asistencia/${sesionSeleccionada.id}`, {
          jugador_id,
          estado
        });
      }
      await cargarAsistencias(sesionSeleccionada.id);
    } catch (err) {
      alert('Error al registrar asistencia');
    }
  };

  const colorEstado = (estado) => {
    if (estado === 'presente') return 'bg-green-100 text-green-700 border-green-300';
    if (estado === 'ausente') return 'bg-red-100 text-red-700 border-red-300';
    if (estado === 'justificado') return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    return 'bg-gray-100 text-gray-500 border-gray-300';
  };

  const marcarObservacion = async (jugador_id, observacion) => {
  try {
    const asistenciaExistente = asistencias.find(a => a.jugador_id === jugador_id);
    if (asistenciaExistente) {
      await api.patch(`/asistencia/${asistenciaExistente.id}`, { 
        estado: 'justificado', 
        observacion 
      });
      await cargarAsistencias(sesionSeleccionada.id);
    }
  } catch (err) {
    console.error('Error al guardar observación');
  }
};

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-[#2222FF] text-white px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">⚽ Club Deportivo</h1>
        <button
          onClick={() => navigate(`/entrenador/equipos/${equipo_id}/sesiones`)}
          className="bg-white text-[#2222FF] text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          ← Volver
        </button>
      </nav>

      <section className="p-8">
        <header className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Control de asistencia</h2>
          <p className="text-gray-500 mt-1">Selecciona una sesión para registrar asistencia</p>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Lista de sesiones */}
          <aside className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-700 mb-3 text-sm">Sesiones</h3>
            {cargando && <Spinner />}
            {sesiones.map(s => (
              <button
                key={s.id}
                onClick={() => seleccionarSesion(s)}
                className={`w-full text-left px-4 py-3 rounded-xl mb-2 text-sm transition-all ${
                  sesionSeleccionada?.id === s.id
                    ? 'bg-[#2222FF] text-white'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <p className="font-semibold">{s.tipo === 'partido' ? '⚽ Partido' : '🏃 Entrenamiento'}</p>
                <p className={`text-xs mt-0.5 ${sesionSeleccionada?.id === s.id ? 'text-blue-200' : 'text-gray-400'}`}>
                  {s.fecha?.split('T')[0]}
                </p>
              </button>
            ))}
          </aside>

          {/* Lista de jugadores */}
          <section className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            {!sesionSeleccionada ? (
              <p className="text-gray-400 text-center mt-10">Selecciona una sesión para ver los jugadores</p>
            ) : (
              <>
                <h3 className="font-semibold text-gray-700 mb-4">
                  Jugadores — {sesionSeleccionada.fecha?.split('T')[0]}
                </h3>
                {jugadores.length === 0 ? (
                  <p className="text-gray-400 text-sm">No hay jugadores en este equipo</p>
                ) : jugadores.map(j => (
                <article key={j.id} className="flex flex-col py-3 border-b border-gray-100 last:border-0 gap-2">
                  <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <p className="font-medium text-gray-800">{j.nombre} {j.apellidos}</p>
                    <section className="flex flex-wrap gap-2">
                      {['presente', 'ausente', 'justificado'].map(estado => (
                        <button
                          key={estado}
                          onClick={() => marcarAsistencia(j.id, estado)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                            obtenerEstado(j.id) === estado
                              ? colorEstado(estado)
                              : 'bg-white text-gray-400 border-gray-200 hover:border-gray-400'
                          }`}
                        >
                          {estado.charAt(0).toUpperCase() + estado.slice(1)}
                        </button>
                      ))}
                    </section>
                  </section>
                  {obtenerEstado(j.id) === 'justificado' && (
                    <input
                      type="text"
                      placeholder="Motivo de la justificación..."
                      defaultValue={asistencias.find(a => a.jugador_id === j.id)?.observacion || ''}
                      onBlur={(e) => marcarObservacion(j.id, e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2222FF]"
                    />
                  )}
                </article>
                ))}
              </>
            )}
          </section>
        </section>
      </section>
    </main>
  );
}
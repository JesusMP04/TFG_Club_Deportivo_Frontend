import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import ModalConfirmacion from '../../components/ModalConfirmacion';
import Spinner from '../../components/Spinner';

export default function Jugadores() {
  const [jugadores, setJugadores] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [jugadorEditar, setJugadorEditar] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [form, setForm] = useState({ nombre: '', apellidos: '', fecha_nac: '', equipo_id: '' });
  const navigate = useNavigate();
  const [modalEliminar, setModalEliminar] = useState(null);


  useEffect(() => {
    cargarJugadores();
    cargarEquipos();
  }, []);

  const cargarJugadores = async () => {
    try {
      const res = await api.get('/jugadores');
      setJugadores(res.data.jugadores);
    } catch (err) {
      setError('Error al cargar los jugadores');
    } finally {
      setCargando(false);
    }
  };

  const cargarEquipos = async () => {
    try {
      const res = await api.get('/equipos');
      setEquipos(res.data.equipos);
    } catch (err) {
      console.error('Error al cargar equipos');
    }
  };

  const guardarJugador = async (e) => {
    e.preventDefault();
    try {
      if (jugadorEditar) {
        await api.patch(`/jugadores/${jugadorEditar.id}`, form);
      } else {
        await api.post('/jugadores', form);
      }
      await cargarJugadores();
      setMostrarFormulario(false);
      setJugadorEditar(null);
      setForm({ nombre: '', apellidos: '', fecha_nac: '', equipo_id: '' });
    } catch (err) {
      alert('Error al guardar el jugador');
    }
  };

  const eliminarJugador = async (id) => {
    try {
      await api.delete(`/jugadores/${id}`);
      setJugadores(jugadores.filter(j => j.id !== id));
      setModalEliminar(null);
    } catch (err) {
      alert('Error al eliminar el jugador');
    }
  };

  const abrirEditar = (jugador) => {
    setJugadorEditar(jugador);
    setForm({
      nombre: jugador.nombre,
      apellidos: jugador.apellidos,
      fecha_nac: jugador.fecha_nac?.split('T')[0] || '',
      equipo_id: jugador.equipo_id || ''
    });
    setMostrarFormulario(true);
  };

  const nombreEquipo = (equipo_id) => {
    const equipo = equipos.find(e => e.id === equipo_id);
    return equipo ? equipo.nombre : '—';
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
        <header className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Jugadores</h2>
            <p className="text-gray-500 mt-1">Gestiona los jugadores del club</p>
          </div>
          <button
            onClick={() => { setJugadorEditar(null); setForm({ nombre: '', apellidos: '', fecha_nac: '', equipo_id: '' }); setMostrarFormulario(true); }}
            className="bg-[#2222FF] text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Nuevo jugador
          </button>
        </header>

        {cargando && <Spinner />}
        {error && <p className="text-red-500">{error}</p>}

        {!cargando && !error && (
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Tabla para escritorio */}
            <section className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-gray-600 font-medium">Nombre</th>
                    <th className="text-left px-6 py-3 text-gray-600 font-medium">Fecha nac.</th>
                    <th className="text-left px-6 py-3 text-gray-600 font-medium">Equipo</th>
                    <th className="text-left px-6 py-3 text-gray-600 font-medium">Código vinc.</th>
                    <th className="text-left px-6 py-3 text-gray-600 font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {jugadores.map(j => (
                    <tr key={j.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-800">{j.nombre} {j.apellidos}</td>
                      <td className="px-6 py-4 text-gray-600">{j.fecha_nac?.split('T')[0] || '—'}</td>
                      <td className="px-6 py-4 text-gray-600">{nombreEquipo(j.equipo_id)}</td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{j.codigo_vinculacion}</span>
                      </td>
                      <td className="px-6 py-4 flex gap-3">
                        <button onClick={() => abrirEditar(j)} className="text-[#2222FF] hover:underline text-sm font-medium">Editar</button>
                        <button onClick={() => setModalEliminar(j.id)} className="text-red-500 hover:underline text-sm font-medium">Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            {/* Tarjetas para móvil */}
            <section className="md:hidden flex flex-col gap-4">
              {jugadores.map(j => (
                <article key={j.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
                  <section className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-800">{j.nombre} {j.apellidos}</h3>
                    <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{j.codigo_vinculacion}</span>
                  </section>
                  <p className="text-sm text-gray-600 mb-1">Nacimiento: {j.fecha_nac?.split('T')[0] || '—'}</p>
                  <p className="text-sm text-gray-600 mb-3">Equipo: {nombreEquipo(j.equipo_id)}</p>
                  <footer className="flex gap-3 border-t border-gray-100 pt-3">
                    <button onClick={() => abrirEditar(j)} className="flex-1 text-center text-[#2222FF] text-sm font-medium">Editar</button>
                    <button onClick={() => setModalEliminar(j.id)} className="flex-1 text-center text-red-500 text-sm font-medium">Eliminar</button>
                  </footer>
                </article>
              ))}
            </section>
          </section>
        )}
      </section>

      {mostrarFormulario && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <article className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              {jugadorEditar ? 'Editar jugador' : 'Nuevo jugador'}
            </h3>
            <form onSubmit={guardarJugador}>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Nombre
                <input type="text" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-[#2222FF]" />
              </label>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Apellidos
                <input type="text" value={form.apellidos} onChange={(e) => setForm({ ...form, apellidos: e.target.value })} required className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-[#2222FF]" />
              </label>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Fecha de nacimiento
                <input type="date" value={form.fecha_nac} onChange={(e) => setForm({ ...form, fecha_nac: e.target.value })} required className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-[#2222FF]" />
              </label>
              <label className="block text-sm font-medium text-gray-700 mb-6">
                Equipo
                <select value={form.equipo_id} onChange={(e) => setForm({ ...form, equipo_id: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-[#2222FF]">
                  <option value="">Sin asignar</option>
                  {equipos.map(e => (
                    <option key={e.id} value={e.id}>{e.nombre}</option>
                  ))}
                </select>
              </label>
              <footer className="flex gap-3">
                <button type="submit" className="flex-1 bg-[#2222FF] text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition-colors">Guardar</button>
                <button type="button" onClick={() => setMostrarFormulario(false)} className="flex-1 bg-gray-100 text-gray-700 font-semibold py-2.5 rounded-lg hover:bg-gray-200 transition-colors">Cancelar</button>
              </footer>
            </form>
          </article>
        </div>
      )}
      {modalEliminar && (
        <ModalConfirmacion
          mensaje="Esta acción eliminará el jugador permanentemente."
          onConfirmar={() => eliminarJugador(modalEliminar)}
          onCancelar={() => setModalEliminar(null)}
        />
      )}
    </main>
  );
}
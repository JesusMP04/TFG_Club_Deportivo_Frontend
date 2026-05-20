import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import ModalConfirmacion from '../../components/ModalConfirmacion';
import Spinner from '../../components/Spinner';

export default function Equipos() {
  const [equipos, setEquipos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [equipoEditar, setEquipoEditar] = useState(null);
  const [entrenadores, setEntrenadores] = useState([]);
  const [form, setForm] = useState({ nombre: '', temporada: '', entrenador_id: '' });
  const navigate = useNavigate();
  const [modalEliminar, setModalEliminar] = useState(null);


  useEffect(() => {
    cargarEquipos();
    cargarEntrenadores();
  }, []);

  const cargarEquipos = async () => {
    try {
      const res = await api.get('/equipos');
      setEquipos(res.data.equipos);
    } catch (err) {
      setError('Error al cargar los equipos');
    } finally {
      setCargando(false);
    }
  };

  const cargarEntrenadores = async () => {
    try {
      const res = await api.get('/usuarios');
      setEntrenadores(res.data.usuarios.filter(u => u.rol === 'entrenador'));
    } catch (err) {
      console.error('Error al cargar entrenadores');
    }
  };

  const guardarEquipo = async (e) => {
    e.preventDefault();
    try {
      if (equipoEditar) {
        await api.patch(`/equipos/${equipoEditar.id}`, form);
      } else {
        await api.post('/equipos', form);
      }
      await cargarEquipos();
      setMostrarFormulario(false);
      setEquipoEditar(null);
      setForm({ nombre: '', temporada: '', entrenador_id: '' });
    } catch (err) {
      alert('Error al guardar el equipo');
    }
  };

  const eliminarEquipo = async (id) => {
    try {
      await api.delete(`/equipos/${id}`);
      setEquipos(equipos.filter(e => e.id !== id));
      setModalEliminar(null);
    } catch (err) {
      alert('Error al eliminar el equipo');
    }
  };

  const abrirEditar = (equipo) => {
    setEquipoEditar(equipo);
    setForm({ nombre: equipo.nombre, temporada: equipo.temporada, entrenador_id: equipo.entrenador_id || '' });
    setMostrarFormulario(true);
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
            <h2 className="text-2xl font-bold text-gray-800">Equipos</h2>
            <p className="text-gray-500 mt-1">Gestiona los equipos del club</p>
          </div>
          <button
            onClick={() => { setEquipoEditar(null); setForm({ nombre: '', temporada: '', entrenador_id: '' }); setMostrarFormulario(true); }}
            className="bg-[#2222FF] text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Nuevo equipo
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
                    <th className="text-left px-6 py-3 text-gray-600 font-medium">Temporada</th>
                    <th className="text-left px-6 py-3 text-gray-600 font-medium">Entrenador</th>
                    <th className="text-left px-6 py-3 text-gray-600 font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {equipos.map(e => (
                    <tr key={e.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-800">{e.nombre}</td>
                      <td className="px-6 py-4 text-gray-600">{e.temporada}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {entrenadores.find(u => u.id === e.entrenador_id)
                          ? `${entrenadores.find(u => u.id === e.entrenador_id).nombre} ${entrenadores.find(u => u.id === e.entrenador_id).apellidos}`
                          : '—'}
                      </td>
                      <td className="px-6 py-4 flex gap-3">
                        <button onClick={() => navigate(`/admin/equipos/${e.id}/sesiones`)} className="text-green-600 hover:underline text-sm font-medium">Sesiones</button>
                        <button onClick={() => abrirEditar(e)} className="text-[#2222FF] hover:underline text-sm font-medium">Editar</button>
                        <button onClick={() => setModalEliminar(e.id)} className="text-red-500 hover:underline text-sm font-medium">Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            {/* Tarjetas para móvil */}
            <section className="md:hidden flex flex-col gap-4">
              {equipos.map(e => (
                <article key={e.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
                  <section className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-800">{e.nombre}</h3>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{e.temporada}</span>
                  </section>
                  <p className="text-sm text-gray-600 mb-3">
                    {entrenadores.find(u => u.id === e.entrenador_id)
                      ? `${entrenadores.find(u => u.id === e.entrenador_id).nombre} ${entrenadores.find(u => u.id === e.entrenador_id).apellidos}`
                      : 'Sin entrenador'}
                  </p>
                  <footer className="flex gap-2 border-t border-gray-100 pt-3">
                    <button onClick={() => navigate(`/admin/equipos/${e.id}/sesiones`)} className="flex-1 text-center text-green-600 text-sm font-medium">Sesiones</button>
                    <button onClick={() => abrirEditar(e)} className="flex-1 text-center text-[#2222FF] text-sm font-medium">Editar</button>
                    <button onClick={() => setModalEliminar(e.id)} className="flex-1 text-center text-red-500 text-sm font-medium">Eliminar</button>
                  </footer>
                </article>
              ))}
            </section>
          </section>
        )}
      </section>

      {/* Modal */}
      {mostrarFormulario && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <article className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              {equipoEditar ? 'Editar equipo' : 'Nuevo equipo'}
            </h3>
            <form onSubmit={guardarEquipo}>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Nombre del equipo
                <input
                  type="text"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-[#2222FF]"
                />
              </label>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Temporada
                <input
                  type="text"
                  value={form.temporada}
                  onChange={(e) => setForm({ ...form, temporada: e.target.value })}
                  placeholder="2025/2026"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-[#2222FF]"
                />
              </label>
              <label className="block text-sm font-medium text-gray-700 mb-6">
                Entrenador
                <select
                  value={form.entrenador_id}
                  onChange={(e) => setForm({ ...form, entrenador_id: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-[#2222FF]"
                >
                  <option value="">Sin asignar</option>
                  {entrenadores.map(u => (
                    <option key={u.id} value={u.id}>{u.nombre} {u.apellidos}</option>
                  ))}
                </select>
              </label>
              <footer className="flex gap-3">
                <button type="submit" className="flex-1 bg-[#2222FF] text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition-colors">
                  Guardar
                </button>
                <button type="button" onClick={() => setMostrarFormulario(false)} className="flex-1 bg-gray-100 text-gray-700 font-semibold py-2.5 rounded-lg hover:bg-gray-200 transition-colors">
                  Cancelar
                </button>
              </footer>
            </form>
          </article>
        </div>
      )}

      {modalEliminar && (
        <ModalConfirmacion
          mensaje="Esta acción eliminará el equipo permanentemente."
          onConfirmar={() => eliminarEquipo(modalEliminar)}
          onCancelar={() => setModalEliminar(null)}
        />
      )}
    </main>
  );
}
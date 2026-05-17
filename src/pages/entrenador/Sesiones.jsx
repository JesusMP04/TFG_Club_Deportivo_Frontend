import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';

export default function Sesiones() {
  const { equipo_id } = useParams();
  const [sesiones, setSesiones] = useState([]);
  const [equipo, setEquipo] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [sesionEditar, setSesionEditar] = useState(null);
  const [form, setForm] = useState({ tipo: 'entrenamiento', fecha: '', descripcion: '' });
  const navigate = useNavigate();

  useEffect(() => {
    cargarSesiones();
    cargarEquipo();
  }, []);

  const cargarSesiones = async () => {
    try {
      const res = await api.get(`/sesiones/${equipo_id}`);
      setSesiones(res.data.sesiones);
    } catch (err) {
      setError('Error al cargar las sesiones');
    } finally {
      setCargando(false);
    }
  };

  const cargarEquipo = async () => {
    try {
      const res = await api.get(`/equipos/${equipo_id}`);
      setEquipo(res.data.equipo);
    } catch (err) {
      console.error('Error al cargar equipo');
    }
  };

  const guardarSesion = async (e) => {
    e.preventDefault();
    try {
      if (sesionEditar) {
        await api.patch(`/sesiones/${sesionEditar.id}`, form);
      } else {
        await api.post('/sesiones', { ...form, equipo_id });
      }
      await cargarSesiones();
      setMostrarFormulario(false);
      setSesionEditar(null);
      setForm({ tipo: 'entrenamiento', fecha: '', descripcion: '' });
    } catch (err) {
      alert('Error al guardar la sesión');
    }
  };

  const eliminarSesion = async (id) => {
    if (!confirm('¿Seguro que quieres eliminar esta sesión?')) return;
    try {
      await api.delete(`/sesiones/${id}`);
      setSesiones(sesiones.filter(s => s.id !== id));
    } catch (err) {
      alert('Error al eliminar la sesión');
    }
  };

  const abrirEditar = (sesion) => {
    setSesionEditar(sesion);
    setForm({
      tipo: sesion.tipo,
      fecha: sesion.fecha?.split('T')[0] || '',
      descripcion: sesion.descripcion || ''
    });
    setMostrarFormulario(true);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-[#2222FF] text-white px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">⚽ Club Deportivo</h1>
        <button
          onClick={() => navigate('/entrenador/equipos')}
          className="bg-white text-[#2222FF] text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          ← Volver
        </button>
      </nav>

      <section className="p-8">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Sesiones {equipo ? `— ${equipo.nombre}` : ''}
            </h2>
            <p className="text-gray-500 mt-1">Entrenamientos y partidos del equipo</p>
          </div>
          <section className="flex gap-3">
            <button
              onClick={() => navigate(`/entrenador/equipos/${equipo_id}/asistencia`)}
              className="bg-gray-100 text-gray-700 text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-gray-200 transition-colors"
            >
              📋 Asistencia
            </button>
            <button
              onClick={() => navigate(`/entrenador/equipos/${equipo_id}/multimedia`)}
              className="bg-gray-100 text-gray-700 text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-gray-200 transition-colors"
            >
              🎥 Multimedia
            </button>
            <button
              onClick={() => { setSesionEditar(null); setForm({ tipo: 'entrenamiento', fecha: '', descripcion: '' }); setMostrarFormulario(true); }}
              className="bg-[#2222FF] text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Nueva sesión
            </button>
          </section>
        </header>

        {cargando && <p className="text-gray-500">Cargando...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!cargando && !error && (
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-gray-600 font-medium">Tipo</th>
                  <th className="text-left px-6 py-3 text-gray-600 font-medium">Fecha</th>
                  <th className="text-left px-6 py-3 text-gray-600 font-medium">Descripción</th>
                  <th className="text-left px-6 py-3 text-gray-600 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {sesiones.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-400">No hay sesiones para este equipo</td>
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
                    <td className="px-6 py-4 flex gap-3">
                      <button onClick={() => abrirEditar(s)} className="text-[#2222FF] hover:underline text-sm font-medium">Editar</button>
                      <button onClick={() => eliminarSesion(s.id)} className="text-red-500 hover:underline text-sm font-medium">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
      </section>

      {mostrarFormulario && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <article className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              {sesionEditar ? 'Editar sesión' : 'Nueva sesión'}
            </h3>
            <form onSubmit={guardarSesion}>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Tipo
                <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-[#2222FF]">
                  <option value="entrenamiento">Entrenamiento</option>
                  <option value="partido">Partido</option>
                </select>
              </label>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Fecha
                <input type="datetime-local" value={form.fecha} onChange={(e) => setForm({ ...form, fecha: e.target.value })} required className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-[#2222FF]" />
              </label>
              <label className="block text-sm font-medium text-gray-700 mb-6">
                Descripción
                <textarea value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} rows={3} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-[#2222FF]" placeholder="Descripción opcional..." />
              </label>
              <footer className="flex gap-3">
                <button type="submit" className="flex-1 bg-[#2222FF] text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition-colors">Guardar</button>
                <button type="button" onClick={() => setMostrarFormulario(false)} className="flex-1 bg-gray-100 text-gray-700 font-semibold py-2.5 rounded-lg hover:bg-gray-200 transition-colors">Cancelar</button>
              </footer>
            </form>
          </article>
        </div>
      )}
    </main>
  );
}
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import ModalConfirmacion from '../../components/ModalConfirmacion';
import Spinner from '../../components/Spinner';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [usuarioEditar, setUsuarioEditar] = useState(null);
  const navigate = useNavigate();
  const [modalEliminar, setModalEliminar] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const res = await api.get('/usuarios');
      setUsuarios(res.data.usuarios);
    } catch (err) {
      setError('Error al cargar los usuarios');
    } finally {
      setCargando(false);
    }
  };

  const eliminarUsuario = async (id) => {
  try {
    await api.delete(`/usuarios/${id}`);
    setUsuarios(usuarios.filter(u => u.id !== id));
    setModalEliminar(null);
  } catch (err) {
    alert('Error al eliminar el usuario');
  }
};

  const guardarCambios = async () => {
    try {
      await api.patch(`/usuarios/${usuarioEditar.id}`, {
        nombre: usuarioEditar.nombre,
        apellidos: usuarioEditar.apellidos,
        telefono: usuarioEditar.telefono,
        rol: usuarioEditar.rol
      });
      await cargarUsuarios();
      setUsuarioEditar(null);
    } catch (err) {
      alert('Error al actualizar el usuario');
    }
  };

  const usuariosFiltrados = usuarios.filter(u =>
    `${u.nombre} ${u.apellidos} ${u.email} ${u.rol}`.toLowerCase().includes(busqueda.toLowerCase())
  );

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
        <header className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Usuarios</h2>
          <p className="text-gray-500 mt-1">Gestiona los usuarios del sistema</p>
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre, email o rol..."
            className="w-full md:w-80 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2222FF] mt-4"
          />
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
                    <th className="text-left px-6 py-3 text-gray-600 font-medium">Email</th>
                    <th className="text-left px-6 py-3 text-gray-600 font-medium">Teléfono</th>
                    <th className="text-left px-6 py-3 text-gray-600 font-medium">Rol</th>
                    <th className="text-left px-6 py-3 text-gray-600 font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuariosFiltrados.map(u => (
                    <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-800">{u.nombre} {u.apellidos}</td>
                      <td className="px-6 py-4 text-gray-600">{u.email}</td>
                      <td className="px-6 py-4 text-gray-600">{u.telefono || '—'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          u.rol === 'admin' ? 'bg-blue-100 text-blue-700' :
                          u.rol === 'entrenador' ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {u.rol}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex gap-3">
                        <button onClick={() => setUsuarioEditar({ ...u })} className="text-[#2222FF] hover:underline text-sm font-medium">Editar</button>
                        <button onClick={() => setModalEliminar(u.id)} className="text-red-500 hover:underline text-sm font-medium">Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            {/* Tarjetas para móvil */}
            <section className="md:hidden flex flex-col gap-4">
              {usuariosFiltrados.map(u => (
                <article key={u.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
                  <section className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-800">{u.nombre} {u.apellidos}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      u.rol === 'admin' ? 'bg-blue-100 text-blue-700' :
                      u.rol === 'entrenador' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {u.rol}
                    </span>
                  </section>
                  <p className="text-sm text-gray-600 mb-1">{u.email}</p>
                  <p className="text-sm text-gray-600 mb-3">{u.telefono || 'Sin teléfono'}</p>
                  <footer className="flex gap-3 border-t border-gray-100 pt-3">
                    <button onClick={() => setUsuarioEditar({ ...u })} className="flex-1 text-center text-[#2222FF] text-sm font-medium">Editar</button>
                    <button onClick={() => setModalEliminar(u.id)} className="flex-1 text-center text-red-500 text-sm font-medium">Eliminar</button>
                  </footer>
                </article>
              ))}
            </section>
          </section>
        )}
      </section>

      {/* Modal de edición */}
      {usuarioEditar && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <article className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Editar usuario</h3>

            <form onSubmit={(e) => { e.preventDefault(); guardarCambios(); }}>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Nombre
                <input
                  type="text"
                  value={usuarioEditar.nombre}
                  onChange={(e) => setUsuarioEditar({ ...usuarioEditar, nombre: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-[#2222FF]"
                />
              </label>

              <label className="block text-sm font-medium text-gray-700 mb-4">
                Apellidos
                <input
                  type="text"
                  value={usuarioEditar.apellidos}
                  onChange={(e) => setUsuarioEditar({ ...usuarioEditar, apellidos: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-[#2222FF]"
                />
              </label>

              <label className="block text-sm font-medium text-gray-700 mb-4">
                Teléfono
                <input
                  type="text"
                  value={usuarioEditar.telefono || ''}
                  onChange={(e) => setUsuarioEditar({ ...usuarioEditar, telefono: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-[#2222FF]"
                />
              </label>

              <label className="block text-sm font-medium text-gray-700 mb-6">
                Rol
                <select
                  value={usuarioEditar.rol}
                  onChange={(e) => setUsuarioEditar({ ...usuarioEditar, rol: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-[#2222FF]"
                >
                  <option value="admin">Admin</option>
                  <option value="entrenador">Entrenador</option>
                  <option value="tutor">Tutor</option>
                  <option value="jugador">Jugador</option>
                  <option value="pendiente">Pendiente</option>
                </select>
              </label>

              <footer className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-[#2222FF] text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={() => setUsuarioEditar(null)}
                  className="flex-1 bg-gray-100 text-gray-700 font-semibold py-2.5 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
              </footer>
            </form>
          </article>
        </div>
      )}
      {modalEliminar && (
        <ModalConfirmacion
          mensaje="Esta acción eliminará el usuario permanentemente."
          onConfirmar={() => eliminarUsuario(modalEliminar)}
          onCancelar={() => setModalEliminar(null)}
        />
      )}
    </main>
  );
}
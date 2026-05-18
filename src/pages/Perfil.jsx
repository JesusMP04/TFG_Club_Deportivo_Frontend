import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Perfil() {
  const { usuario, login } = useAuth();
  const navigate = useNavigate();
  const [editando, setEditando] = useState(false);
  const [datosCompletos, setDatosCompletos] = useState(null);
  const [form, setForm] = useState({ nombre: '', apellidos: '', email: '', telefono: '' });
  const [exito, setExito] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const res = await api.get(`/usuarios/${usuario.id}`);
      const u = res.data.usuario;
      setDatosCompletos(u);
      setForm({
        nombre: u.nombre || '',
        apellidos: u.apellidos || '',
        email: u.email || '',
        telefono: u.telefono || ''
      });
    } catch (err) {
      console.error('Error al cargar datos del perfil');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setExito('');
    setError('');

    try {
      const res = await api.patch(`/usuarios/${usuario.id}`, form);
      const token = localStorage.getItem('token');
      login(token, { ...usuario, ...res.data.usuario });
      setDatosCompletos(res.data.usuario);
      setExito('Perfil actualizado correctamente');
      setEditando(false);
    } catch (err) {
      setError('Error al actualizar el perfil');
    } finally {
      setCargando(false);
    }
  };

  const volverAlPanel = () => {
    if (usuario?.rol === 'admin') navigate('/admin/dashboard');
    else if (usuario?.rol === 'entrenador') navigate('/entrenador/dashboard');
    else if (usuario?.rol === 'tutor') navigate('/tutor/dashboard');
    else navigate('/jugador/dashboard');
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <section className="w-full max-w-md p-8">

        <header className="text-center mb-8">
          <figure className="w-16 h-16 bg-[#2222FF] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">
              {datosCompletos?.nombre?.charAt(0).toUpperCase()}
            </span>
          </figure>
          <h1 className="text-2xl font-bold text-gray-800">{datosCompletos?.nombre} {datosCompletos?.apellidos}</h1>
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full mt-2 inline-block">
            {usuario?.rol}
          </span>
        </header>

        <article className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8">
          {exito && (
            <p className="bg-green-50 border border-green-200 text-green-600 rounded-lg px-4 py-3 mb-6 text-sm">
              {exito}
            </p>
          )}
          {error && (
            <p role="alert" className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 mb-6 text-sm">
              {error}
            </p>
          )}

          {!editando ? (
            <section>
              <section className="mb-4">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Nombre</p>
                <p className="text-gray-800 font-medium mt-1">{datosCompletos?.nombre}</p>
              </section>
              <section className="mb-4">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Apellidos</p>
                <p className="text-gray-800 font-medium mt-1">{datosCompletos?.apellidos}</p>
              </section>
              <section className="mb-4">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Email</p>
                <p className="text-gray-800 font-medium mt-1">{datosCompletos?.email}</p>
              </section>
              <section className="mb-6">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Teléfono</p>
                <p className="text-gray-800 font-medium mt-1">{datosCompletos?.telefono || '—'}</p>
              </section>
              <footer className="flex gap-3">
                <button
                  onClick={() => setEditando(true)}
                  className="flex-1 bg-[#2222FF] text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Editar perfil
                </button>
                <button
                  onClick={volverAlPanel}
                  className="flex-1 bg-gray-100 text-gray-700 font-semibold py-2.5 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  ← Volver
                </button>
              </footer>
            </section>
          ) : (
            <form onSubmit={handleSubmit}>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Nombre
                <input
                  type="text"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-[#2222FF]"
                />
              </label>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Apellidos
                <input
                  type="text"
                  value={form.apellidos}
                  onChange={(e) => setForm({ ...form, apellidos: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-[#2222FF]"
                />
              </label>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Email
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-[#2222FF]"
                />
              </label>
              <label className="block text-sm font-medium text-gray-700 mb-6">
                Teléfono
                <input
                  type="tel"
                  value={form.telefono}
                  onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-[#2222FF]"
                />
              </label>
              <footer className="flex gap-3">
                <button
                  type="submit"
                  disabled={cargando}
                  className="flex-1 bg-[#2222FF] hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50"
                >
                  {cargando ? 'Guardando...' : 'Guardar'}
                </button>
                <button
                  type="button"
                  onClick={() => { setEditando(false); setError(''); setExito(''); }}
                  className="flex-1 bg-gray-100 text-gray-700 font-semibold py-2.5 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
              </footer>
            </form>
          )}
        </article>
      </section>
    </main>
  );
}
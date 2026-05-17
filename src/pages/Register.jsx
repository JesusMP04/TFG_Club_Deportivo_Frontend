import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { login } = useAuth();
  const [form, setForm] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    password: '',
    telefono: ''
  });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError('');

    try {
      const res = await api.post('/auth/register', form);
      login (res.data.token, res.data.usuario);
      navigate('/vincular');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear la cuenta');
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="min-h-screen bg-white flex items-center justify-center">
      <section className="w-full max-w-md">

        <header className="text-center mb-10">
          <figure className="w-20 h-20 bg-[#2222FF] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-3xl font-bold">⚽</span>
          </figure>
          <h1 className="text-3xl font-bold text-[#2222FF]">Club Deportivo</h1>
          <p className="text-gray-500 mt-1">Crea tu cuenta</p>
        </header>

        <article className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8">
          {error && (
            <p role="alert" className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 mb-6 text-sm">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Nombre
              <input
                type="text"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-[#2222FF]"
                placeholder="Tu nombre"
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
                placeholder="Tus apellidos"
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
                placeholder="tu@email.com"
              />
            </label>

            <label className="block text-sm font-medium text-gray-700 mb-4">
              Teléfono
              <input
                type="tel"
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-[#2222FF]"
                placeholder="600000000"
              />
            </label>

            <label className="block text-sm font-medium text-gray-700 mb-6">
              Contraseña
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-[#2222FF]"
                placeholder="••••••••"
              />
            </label>

            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-[#2222FF] hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50"
            >
              {cargando ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>

            <p className="text-center text-sm text-gray-500 mt-4">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-[#2222FF] font-medium hover:underline">
                Inicia sesión
              </Link>
            </p>
          </form>
        </article>

      </section>
    </main>
  );
}
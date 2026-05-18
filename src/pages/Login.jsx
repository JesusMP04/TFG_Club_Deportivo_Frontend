import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError('');

    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.token, res.data.usuario);

      const rol = res.data.usuario.rol;
      if (rol === 'admin') navigate('/admin/dashboard');
      else if (rol === 'entrenador') navigate('/entrenador/dashboard');
      else if (rol === 'jugador') navigate('/jugador/dashboard');
      else if (rol === 'tutor') navigate('/tutor/dashboard');
      else navigate('/vincular');

    } catch (err) {
      setError('Email o contraseña incorrectos');
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
          <p className="text-gray-500 mt-1">Accede a tu panel</p>
        </header>

        <article className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8">
          {error && (
            <p role="alert" className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 mb-6 text-sm">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-[#2222FF] focus:border-transparent"
                placeholder="tu@email.com"
                required
              />
            </label>

            <label className="block text-sm font-medium text-gray-700 mb-6 mt-5">
              Contraseña
              <input
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-[#2222FF] focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </label>

            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-[#2222FF] hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50"
            >
              {cargando ? 'Entrando...' : 'Iniciar sesión'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-4">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-[#2222FF] font-medium hover:underline">
                Regístrate
            </Link>
          </p>
        </article>

      </section>
    </main>
  );
}
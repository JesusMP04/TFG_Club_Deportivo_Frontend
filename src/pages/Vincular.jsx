import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Vincular() {
  const [tipo, setTipo] = useState(''); // 'jugador' o 'tutor'
  const [codigo, setCodigo] = useState('');
  const [tipoTutor, setTipoTutor] = useState('padre');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const { usuario, login } = useAuth();
  const navigate = useNavigate();

  const handleVincular = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError('');

    try {
      if (tipo === 'jugador') {
        await api.post('/jugadores/vincular-perfil', { codigo_vinculacion: codigo });
      } else {
        await api.post('/tutores/vincular', { codigo_vinculacion: codigo, tipo: tipoTutor });
      }

      // Actualizar el usuario en el contexto con el nuevo rol
      const token = localStorage.getItem('token');
      const rolNuevo = tipo === 'jugador' ? 'jugador' : 'tutor';
      const usuarioActualizado = { ...usuario, rol: rolNuevo };
      login(token, usuarioActualizado);

      navigate(tipo === 'jugador' ? '/jugador/dashboard' : '/tutor/dashboard');

    } catch (err) {
      setError(err.response?.data?.Error || 'Código de vinculación incorrecto');
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
          <p className="text-gray-500 mt-1">Vincula tu cuenta</p>
        </header>

        <article className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8">

          {!tipo ? (
            <section>
              <h2 className="text-lg font-bold text-gray-800 mb-2">¿Cómo quieres vincularte?</h2>
              <p className="text-gray-500 text-sm mb-6">Selecciona tu rol en el club</p>
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => setTipo('jugador')}
                  className="w-full border-2 border-gray-200 hover:border-[#2222FF] rounded-xl p-5 text-left transition-all"
                >
                  <span className="text-2xl">⚽</span>
                  <p className="font-semibold text-gray-800 mt-2">Soy jugador</p>
                  <p className="text-gray-500 text-sm">Vincula tu cuenta a tu perfil de jugador</p>
                </button>
                <button
                  onClick={() => setTipo('tutor')}
                  className="w-full border-2 border-gray-200 hover:border-[#2222FF] rounded-xl p-5 text-left transition-all"
                >
                  <span className="text-2xl">👨‍👧</span>
                  <p className="font-semibold text-gray-800 mt-2">Soy tutor/familiar</p>
                  <p className="text-gray-500 text-sm">Vincula tu cuenta al perfil de tu hijo/a</p>
                </button>
              </div>
            </section>
          ) : (
            <form onSubmit={handleVincular}>
              <button
                type="button"
                onClick={() => { setTipo(''); setError(''); }}
                className="text-sm text-gray-500 hover:text-gray-700 mb-6 flex items-center gap-1"
              >
                ← Volver
              </button>

              <h2 className="text-lg font-bold text-gray-800 mb-6">
                {tipo === 'jugador' ? 'Vincular como jugador' : 'Vincular como tutor'}
              </h2>

              {error && (
                <p role="alert" className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 mb-6 text-sm">
                  {error}
                </p>
              )}

              {tipo === 'tutor' && (
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Tipo de tutor
                  <select
                    value={tipoTutor}
                    onChange={(e) => setTipoTutor(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-[#2222FF]"
                  >
                    <option value="padre">Padre</option>
                    <option value="madre">Madre</option>
                    <option value="tutor_legal">Tutor legal</option>
                  </select>
                </label>
              )}

              <label className="block text-sm font-medium text-gray-700 mb-6">
                Código de vinculación
                <input
                  type="text"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                  required
                  placeholder="Ej: AB3X7K"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-[#2222FF] font-mono tracking-widest"
                />
              </label>

              <button
                type="submit"
                disabled={cargando}
                className="w-full bg-[#2222FF] hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50"
              >
                {cargando ? 'Vinculando...' : 'Vincular cuenta'}
              </button>
            </form>
          )}

        </article>
      </section>
    </main>
  );
}
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NotFound() {
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const volverAlPanel = () => {
    if (!usuario) navigate('/login');
    else if (usuario.rol === 'admin') navigate('/admin/dashboard');
    else if (usuario.rol === 'entrenador') navigate('/entrenador/dashboard');
    else if (usuario.rol === 'tutor') navigate('/tutor/dashboard');
    else if (usuario.rol === 'jugador') navigate('/jugador/dashboard');
    else navigate('/login');
  };

  return (
    <main className="min-h-screen bg-white flex items-center justify-center">
      <section className="text-center px-8">
        <figure className="w-24 h-24 bg-[#2222FF] rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <span className="text-white text-4xl font-bold">⚽</span>
        </figure>
        <h1 className="text-8xl font-bold text-[#2222FF] mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Página no encontrada</h2>
        <p className="text-gray-500 mb-8">La página que buscas no existe o no tienes acceso a ella.</p>
        <button
          onClick={volverAlPanel}
          className="bg-[#2222FF] text-white font-semibold px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors"
        >
          Volver al inicio
        </button>
      </section>
    </main>
  );
}
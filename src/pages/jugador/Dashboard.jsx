import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

export default function Dashboard() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [equipo, setEquipo] = useState(null);

  useEffect(() => {
    cargarPerfil();
  }, []);

  const cargarPerfil = async () => {
    try {
      const res = await api.get('/jugadores/mi-perfil');
      setEquipo(res.data.jugador);
    } catch (err) {
      console.error('Error al cargar perfil');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-[#2222FF] text-white px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold whitespace-nowrap">⚽ Club Deportivo</h1>
        <section className="flex items-center gap-2">
            <span className="text-sm hidden sm:block">Hola, {usuario?.nombre}</span>
            <button
            onClick={() => navigate('/perfil')}
            className="bg-white text-[#2222FF] text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
            Mi perfil
            </button>
            <button
            onClick={handleLogout}
            className="bg-white text-[#2222FF] text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
            Cerrar sesión
            </button>
        </section>
      </nav>

      <section className="p-8">
        <header className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Panel de Jugador</h2>
          <p className="text-gray-500 mt-1">Tu espacio en el club</p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <article
            onClick={() => navigate('/jugador/sesiones')}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md hover:border-[#2222FF] transition-all"
          >
            <span className="text-4xl">📅</span>
            <h3 className="text-lg font-semibold text-gray-800 mt-3">Mis Sesiones</h3>
            <p className="text-gray-500 text-sm mt-1">Ver el calendario de sesiones</p>
          </article>

          <article
            onClick={() => equipo?.equipo_nombre
              ? navigate(`/jugador/chat/${encodeURIComponent(equipo.equipo_nombre)}`)
              : null
            }
            className={`bg-white rounded-2xl shadow-sm border border-gray-200 p-6 transition-all ${
              equipo?.equipo_nombre
                ? 'cursor-pointer hover:shadow-md hover:border-[#2222FF]'
                : 'opacity-50 cursor-not-allowed'
            }`}
          >
            <span className="text-4xl">💬</span>
            <h3 className="text-lg font-semibold text-gray-800 mt-3">Chat de Equipo</h3>
            <p className="text-gray-500 text-sm mt-1">
              {equipo?.equipo_nombre ? equipo.equipo_nombre : 'Sin equipo asignado'}
            </p>
          </article>

          <article
            onClick={() => navigate('/jugador/chat/general')}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md hover:border-[#2222FF] transition-all"
          >
            <span className="text-4xl">📢</span>
            <h3 className="text-lg font-semibold text-gray-800 mt-3">Tablón de Anuncios</h3>
            <p className="text-gray-500 text-sm mt-1">Anuncios del club</p>
          </article>
        </section>
      </section>
    </main>
  );
}
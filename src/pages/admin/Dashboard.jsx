import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <main className="min-h-screen bg-gray-50">

      {/* Navbar */}
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

      {/* Contenido */}
      <section className="p-8">
        <header className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Panel de Administración</h2>
          <p className="text-gray-500 mt-1">Gestiona todos los recursos del club</p>
        </header>

        {/* Tarjetas de navegación */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { titulo: 'Usuarios', descripcion: 'Gestionar usuarios del sistema', icono: '👥', ruta: '/admin/usuarios' },
            { titulo: 'Equipos', descripcion: 'Gestionar equipos del club', icono: '🏆', ruta: '/admin/equipos' },
            { titulo: 'Jugadores', descripcion: 'Gestionar jugadores', icono: '⚽', ruta: '/admin/jugadores' },
            { titulo: 'Documentos', descripcion: 'Revisar documentos pendientes', icono: '📄', ruta: '/admin/documentos' },
            { titulo: 'Chat', descripcion: 'Comunicación interna', icono: '💬', ruta: '/admin/chat' },
          ].map((item) => (
            <article
              key={item.ruta}
              onClick={() => navigate(item.ruta)}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md hover:border-[#2222FF] transition-all"
            >
              <span className="text-4xl">{item.icono}</span>
              <h3 className="text-lg font-semibold text-gray-800 mt-3">{item.titulo}</h3>
              <p className="text-gray-500 text-sm mt-1">{item.descripcion}</p>
            </article>
          ))}
        </section>
      </section>

    </main>
  );
}
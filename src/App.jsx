import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Dashboard from './pages/admin/Dashboard';
import Usuarios from './pages/admin/Usuarios';
import Equipos from './pages/admin/Equipos';
import Register from './pages/Register';
import Vincular from './pages/Vincular';
import Jugadores from './pages/admin/Jugadores';
import Sesiones from './pages/admin/Sesiones';
import Documentos from './pages/admin/Documentos';
import Chat from './pages/admin/Chat';
import EntrenadorDashboard from './pages/entrenador/Dashboard';
import EntrenadorEquipos from './pages/entrenador/Equipos';
import EntrenadorSesiones from './pages/entrenador/Sesiones';
import EntrenadorAsistencia from './pages/entrenador/Asistencia';
import EntrenadorChat from './pages/entrenador/Chat';
import EntrenadorMultimedia from './pages/entrenador/Multimedia';
import TutorDashboard from './pages/tutor/Dashboard';
import TutorHijos from './pages/tutor/Hijos';
import TutorSesiones from './pages/tutor/Sesiones';
import TutorDocumentos from './pages/tutor/Documentos';
import TutorChat from './pages/entrenador/Chat';
import JugadorDashboard from './pages/jugador/Dashboard';
import JugadorSesiones from './pages/jugador/Sesiones';
import JugadorDocumentos from './pages/jugador/Documentos';
import Perfil from './pages/Perfil';
import NotFound from './pages/NotFound';
import EntrenadorEstadisticas from './pages/entrenador/Estadisticas';
import JugadorEstadisticas from './pages/jugador/Estadisticas';
import TutorEstadisticas from './pages/tutor/Estadisticas';
import EntrenadorEstadisticasTemporada from './pages/entrenador/EstadisticasTemporada';


const RutaProtegida = ({ children, roles }) => {
  const { usuario, cargando } = useAuth();

  if (cargando) return <div>Cargando...</div>;
  if (!usuario) return <Navigate to="/login" />;
  if (roles && !roles.includes(usuario.rol)) return <Navigate to="/login" />;

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/dashboard" element={<RutaProtegida roles={['admin']}><Dashboard /></RutaProtegida>}/>
          <Route path="/admin/usuarios" element={<RutaProtegida roles={['admin']}><Usuarios /></RutaProtegida>}/>
          <Route path="/admin/equipos" element={<RutaProtegida roles={['admin']}><Equipos /></RutaProtegida>} />
          <Route path="/admin/jugadores" element={<RutaProtegida roles={['admin']}><Jugadores /></RutaProtegida>} />
          <Route path="/admin/equipos/:equipo_id/sesiones" element={<RutaProtegida roles={['admin']}><Sesiones /></RutaProtegida>} />
          <Route path="/admin/documentos" element={<RutaProtegida roles={['admin']}><Documentos /></RutaProtegida>} />
          <Route path="/admin/chat" element={<RutaProtegida roles={['admin']}><Chat /></RutaProtegida>} />
          <Route path="/entrenador/dashboard" element={<RutaProtegida roles={['entrenador']}><EntrenadorDashboard /></RutaProtegida>} />
          <Route path="/entrenador/equipos" element={<RutaProtegida roles={['entrenador']}><EntrenadorEquipos /></RutaProtegida>} />
          <Route path="/entrenador/equipos/:equipo_id/sesiones" element={<RutaProtegida roles={['entrenador']}><EntrenadorSesiones /></RutaProtegida>} />
          <Route path="/entrenador/equipos/:equipo_id/asistencia" element={<RutaProtegida roles={['entrenador']}><EntrenadorAsistencia /></RutaProtegida>} />
          <Route path="/entrenador/chat/:sala_id" element={<RutaProtegida roles={['entrenador']}><EntrenadorChat /></RutaProtegida>} />
          <Route path="/entrenador/equipos/:equipo_id/multimedia" element={<RutaProtegida roles={['entrenador']}><EntrenadorMultimedia /></RutaProtegida>} />
          <Route path="/tutor/dashboard" element={<RutaProtegida roles={['tutor']}><TutorDashboard /></RutaProtegida>} />
          <Route path="/tutor/hijos" element={<RutaProtegida roles={['tutor']}><TutorHijos /></RutaProtegida>} />
          <Route path="/tutor/sesiones/:equipo_id" element={<RutaProtegida roles={['tutor']}><TutorSesiones /></RutaProtegida>} />
          <Route path="/tutor/documentos" element={<RutaProtegida roles={['tutor']}><TutorDocumentos /></RutaProtegida>} />
          <Route path="/tutor/chat/:sala_id" element={<RutaProtegida roles={['tutor']}><TutorChat /></RutaProtegida>} />
          <Route path="/jugador/dashboard" element={<RutaProtegida roles={['jugador']}><JugadorDashboard /></RutaProtegida>} />
          <Route path="/jugador/sesiones" element={<RutaProtegida roles={['jugador']}><JugadorSesiones /></RutaProtegida>} />
          <Route path="/jugador/sesiones" element={<RutaProtegida roles={['jugador']}><JugadorSesiones /></RutaProtegida>} />
          <Route path="/jugador/chat/:sala_id" element={<RutaProtegida roles={['jugador']}><EntrenadorChat /></RutaProtegida>} />
          <Route path="/jugador/documentos" element={<RutaProtegida roles={['jugador']}><JugadorDocumentos /></RutaProtegida>} />
          <Route path="/perfil" element={<RutaProtegida roles={['admin', 'entrenador', 'tutor', 'jugador']}><Perfil /></RutaProtegida>} />
          <Route path="/entrenador/equipos/:equipo_id/sesiones/:sesion_id/estadisticas" element={<RutaProtegida roles={['entrenador']}><EntrenadorEstadisticas /></RutaProtegida>} />
          <Route path="/jugador/estadisticas" element={<RutaProtegida roles={['jugador']}><JugadorEstadisticas /></RutaProtegida>} />
          <Route path="/tutor/estadisticas/:jugador_id" element={<RutaProtegida roles={['tutor']}><TutorEstadisticas /></RutaProtegida>} />
          <Route path="/entrenador/equipos/:equipo_id/estadisticas" element={<RutaProtegida roles={['entrenador']}><EntrenadorEstadisticasTemporada /></RutaProtegida>} />

          <Route path="/register" element={<Register />} />
          <Route path="/vincular" element={<Vincular/>} />
          <Route path="*" element={<NotFound/>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
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
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" />} />
          <Route path="/admin/dashboard" element={<RutaProtegida roles={['admin']}><Dashboard /></RutaProtegida>}/>
          <Route path="/admin/usuarios" element={<RutaProtegida roles={['admin']}><Usuarios /></RutaProtegida>}/>
          <Route path="/admin/equipos" element={<RutaProtegida roles={['admin']}><Equipos /></RutaProtegida>} />
          <Route path="/admin/jugadores" element={<RutaProtegida roles={['admin']}><Jugadores /></RutaProtegida>} />
          <Route path="/admin/equipos/:equipo_id/sesiones" element={<RutaProtegida roles={['admin']}><Sesiones /></RutaProtegida>} />
          <Route path="/admin/documentos" element={<RutaProtegida roles={['admin']}><Documentos /></RutaProtegida>} />
          <Route path="/admin/chat" element={<RutaProtegida roles={['admin']}><Chat /></RutaProtegida>} />
          <Route path="/register" element={<Register />} />
          <Route path="/vincular" element={<Vincular/>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';

export default function Chat() {
  const [mensajes, setMensajes] = useState([]);
  const [contenido, setContenido] = useState('');
  const [cargando, setCargando] = useState(true);
  const [editarId, setEditarId] = useState(null);
  const [editarContenido, setEditarContenido] = useState('');
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const { sala_id } = useParams();
  const bottomRef = useRef(null);

  useEffect(() => {
    cargarMensajes();
    const intervalo = setInterval(cargarMensajes, 5000);
    return () => clearInterval(intervalo);
  }, [sala_id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes]);

  const cargarMensajes = async () => {
    try {
      const res = await api.get(`/chat/salas/${sala_id}/mensajes`);
      setMensajes(res.data);
    } catch (err) {
      console.error('Error al cargar mensajes');
    } finally {
      setCargando(false);
    }
  };

  const enviarMensaje = async (e) => {
    e.preventDefault();
    if (!contenido.trim()) return;
    try {
      await api.post(`/chat/salas/${sala_id}/mensajes`, { contenido });
      setContenido('');
      await cargarMensajes();
    } catch (err) {
      console.error('Error al enviar mensaje');
    }
  };

  const editarMensaje = async (id) => {
    try {
      await api.patch(`/chat/mensajes/${id}`, { contenido: editarContenido });
      setEditarId(null);
      setEditarContenido('');
      await cargarMensajes();
    } catch (err) {
      console.error('Error al editar mensaje');
    }
  };

  const eliminarMensaje = async (id) => {
    try {
      await api.delete(`/chat/mensajes/${id}`);
      setMensajes(mensajes.filter(m => m.id !== id));
    } catch (err) {
      console.error('Error al eliminar mensaje');
    }
  };

  const titulaSala = sala_id === 'general' ? 'Tablón de Anuncios' : `Chat — ${decodeURIComponent(sala_id)}`;

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-[#2222FF] text-white px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">⚽ Club Deportivo</h1>
        <button
          onClick={() => navigate(-1)}
          className="bg-white text-[#2222FF] text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          ← Volver
        </button>
      </nav>

      <section className="flex flex-col flex-1 p-8 max-w-3xl mx-auto w-full">
        <header className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{titulaSala}</h2>
          {sala_id === 'general' && (
            <p className="text-gray-500 mt-1">Solo los administradores pueden publicar anuncios</p>
          )}
        </header>

        <section className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 overflow-y-auto mb-4 min-h-96">
          {cargando && <Spinner />}

          {!cargando && mensajes.length === 0 && (
            <p className="text-gray-400 text-center">
              {sala_id === 'general' ? 'No hay anuncios todavía' : 'No hay mensajes aún. ¡Sé el primero!'}
            </p>
          )}
          {mensajes.map(m => (
            <article key={m.id} className={`mb-4 flex ${m.autor_id === usuario?.id ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-sm rounded-2xl px-4 py-3 ${m.autor_id === usuario?.id ? 'bg-[#2222FF] text-white' : 'bg-gray-100 text-gray-800'}`}>
                <p className={`text-xs font-semibold mb-1 ${m.autor_id === usuario?.id ? 'text-blue-200' : 'text-gray-500'}`}>
                  {m.autor_nombre}
                </p>
                {editarId === m.id ? (
                  <div className="flex gap-2 mt-1">
                    <input
                      value={editarContenido}
                      onChange={(e) => setEditarContenido(e.target.value)}
                      className="flex-1 text-sm rounded px-2 py-1 text-gray-800 border border-gray-300 focus:outline-none"
                    />
                    <button onClick={() => editarMensaje(m.id)} className="text-xs font-semibold underline">Guardar</button>
                    <button onClick={() => setEditarId(null)} className="text-xs underline">Cancelar</button>
                  </div>
                ) : (
                  <p className="text-sm">{m.contenido}</p>
                )}
                {m.autor_id === usuario?.id && editarId !== m.id && (
                  <footer className="flex gap-2 mt-1 justify-end">
                    <button
                      onClick={() => { setEditarId(m.id); setEditarContenido(m.contenido); }}
                      className="text-xs text-blue-200 hover:text-white underline"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => eliminarMensaje(m.id)}
                      className="text-xs text-blue-200 hover:text-white underline"
                    >
                      Eliminar
                    </button>
                  </footer>
                )}
              </div>
            </article>
          ))}
          <div ref={bottomRef} />
        </section>

        {sala_id === 'general' && usuario?.rol !== 'admin' ? (
          <p className="text-center text-sm text-gray-400 py-3 bg-white rounded-xl border border-gray-200">
            📢 Solo los administradores pueden publicar en el tablón de anuncios
          </p>
        ) : (
          <form onSubmit={enviarMensaje} className="flex gap-3">
            <input
              type="text"
              value={contenido}
              onChange={(e) => setContenido(e.target.value)}
              placeholder={sala_id === 'general' ? 'Escribe un anuncio...' : 'Escribe un mensaje...'}
              className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2222FF]"
            />
            <button
              type="submit"
              className="bg-[#2222FF] text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
            >
              {sala_id === 'general' ? 'Publicar' : 'Enviar'}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
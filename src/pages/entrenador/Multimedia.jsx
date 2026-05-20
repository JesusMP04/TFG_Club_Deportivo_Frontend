import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';
import ModalConfirmacion from '../../components/ModalConfirmacion';
import Spinner from '../../components/Spinner';

export default function Multimedia() {
  const { equipo_id } = useParams();
  const [sesiones, setSesiones] = useState([]);
  const [sesionSeleccionada, setSesionSeleccionada] = useState(null);
  const [archivos, setArchivos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [subiendo, setSubiendo] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [archivo, setArchivo] = useState(null);
  const navigate = useNavigate();
  const [modalEliminar, setModalEliminar] = useState(null);

  useEffect(() => {
    cargarSesiones();
  }, []);

  const cargarSesiones = async () => {
    try {
      const res = await api.get(`/sesiones/${equipo_id}`);
      setSesiones(res.data.sesiones);
    } catch (err) {
      console.error('Error al cargar sesiones');
    } finally {
      setCargando(false);
    }
  };

  const seleccionarSesion = async (sesion) => {
    setSesionSeleccionada(sesion);
    await cargarArchivos(sesion.id);
  };

  const cargarArchivos = async (sesion_id) => {
    try {
      const res = await api.get(`/multimedia/sesiones/${sesion_id}`);
      setArchivos(res.data.archivos);
    } catch (err) {
      console.error('Error al cargar archivos');
      setArchivos([]);
    }
  };

  const subirArchivo = async (e) => {
    e.preventDefault();
    if (!archivo || !titulo.trim()) return;
    setSubiendo(true);
    try {
      const formData = new FormData();
      formData.append('archivo', archivo);
      formData.append('titulo', titulo);
      await api.post(`/multimedia/sesiones/${sesionSeleccionada.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setTitulo('');
      setArchivo(null);
      await cargarArchivos(sesionSeleccionada.id);
    } catch (err) {
      alert('Error al subir el archivo');
    } finally {
      setSubiendo(false);
    }
  };

  const eliminarArchivo = async (id) => {
    try {
      await api.delete(`/multimedia/${id}`);
      setArchivos(archivos.filter(a => a.id !== id));
      setModalEliminar(null);
    } catch (err) {
      alert('Error al eliminar el archivo');
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-[#2222FF] text-white px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">⚽ Club Deportivo</h1>
        <button
          onClick={() => navigate(`/entrenador/equipos/${equipo_id}/sesiones`)}
          className="bg-white text-[#2222FF] text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          ← Volver
        </button>
      </nav>

      <section className="p-8">
        <header className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Multimedia</h2>
          <p className="text-gray-500 mt-1">Sube y gestiona vídeos e imágenes de las sesiones</p>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Lista de sesiones */}
          <aside className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-700 mb-3 text-sm">Sesiones</h3>
            {cargando && <Spinner />}
            {sesiones.map(s => (
              <button
                key={s.id}
                onClick={() => seleccionarSesion(s)}
                className={`w-full text-left px-4 py-3 rounded-xl mb-2 text-sm transition-all ${
                  sesionSeleccionada?.id === s.id
                    ? 'bg-[#2222FF] text-white'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <p className="font-semibold">{s.tipo === 'partido' ? '⚽ Partido' : '🏃 Entrenamiento'}</p>
                <p className={`text-xs mt-0.5 ${sesionSeleccionada?.id === s.id ? 'text-blue-200' : 'text-gray-400'}`}>
                  {s.fecha?.split('T')[0]}
                </p>
              </button>
            ))}
          </aside>

          {/* Archivos y subida */}
          <section className="lg:col-span-2 flex flex-col gap-6">
            {!sesionSeleccionada ? (
              <article className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
                <p className="text-gray-400">Selecciona una sesión para ver y subir archivos</p>
              </article>
            ) : (
              <>
                {/* Formulario subida */}
                <article className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-700 mb-4">Subir archivo</h3>
                  <form onSubmit={subirArchivo} className="flex flex-col gap-3">
                    <label className="text-sm font-medium text-gray-700">
                      Título
                      <input
                        type="text"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-[#2222FF]"
                        placeholder="Ej: Análisis táctica primera parte"
                      />
                    </label>
                    <label className="text-sm font-medium text-gray-700">
                      Archivo (imagen o vídeo, máx. 500MB)
                      <section className="mt-1">
                        <label className="w-full flex items-center gap-3 border border-gray-300 rounded-lg px-4 py-2.5 cursor-pointer hover:border-[#2222FF] transition-colors">
                          <span className="text-[#2222FF] text-sm font-semibold whitespace-nowrap">Seleccionar archivo</span>
                          <span className="text-sm text-gray-500 truncate">
                            {archivo ? archivo.name : 'Ningún archivo seleccionado'}
                          </span>
                          <input
                            type="file"
                            accept="image/*,video/*"
                            onChange={(e) => setArchivo(e.target.files[0])}
                            required
                            className="hidden"
                          />
                        </label>
                      </section>
                    </label>
                    <button
                      type="submit"
                      disabled={subiendo}
                      className="bg-[#2222FF] text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {subiendo ? 'Subiendo...' : 'Subir archivo'}
                    </button>
                  </form>
                </article>

                {/* Lista de archivos */}
                <article className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-700 mb-4">Archivos de la sesión</h3>
                  {archivos.length === 0 ? (
                    <p className="text-gray-400 text-sm">No hay archivos en esta sesión</p>
                  ) : archivos.map(a => (
                    <section key={a.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                      <section className="flex items-center gap-3">
                        <span className="text-2xl">{a.tipo === 'video' ? '🎥' : '🖼️'}</span>
                        <div>
                          <p className="font-medium text-gray-800 text-sm">{a.titulo}</p>
                          <p className="text-gray-400 text-xs">{a.fecha_subida?.split('T')[0]}</p>
                        </div>
                      </section>
                      <section className="flex gap-3">
                        <a
                          href={a.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#2222FF] hover:underline text-sm font-medium"
                        >
                          Ver
                        </a>
                        <button
                          onClick={() => setModalEliminar(a.id)}
                          className="text-red-500 hover:underline text-sm font-medium"
                        >
                          Eliminar
                        </button>
                      </section>
                    </section>
                  ))}
                </article>
              </>
            )}
          </section>
        </section>
      </section>
      {modalEliminar && (
        <ModalConfirmacion
          mensaje= "Esta accion eliminara el archivo permanentemente."
          onConfirmar={() => eliminarArchivo(modalEliminar)}
          onCancelar={() => setModalEliminar(null)}
        />
      )}
    </main>
  );
}
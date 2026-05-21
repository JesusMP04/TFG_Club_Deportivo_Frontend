import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';
import toast from 'react-hot-toast';

export default function Documentos() {
  const [documentos, setDocumentos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [subiendo, setSubiendo] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [archivo, setArchivo] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const { usuario } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    cargarDocumentos();
    cargarPerfil();
  }, []);

  const cargarPerfil = async () => {
    try {
        const res = await api.get('/jugadores/mi-perfil');
        setPerfil(res.data.jugador);
    } catch (err) {
        console.error('Error al cargar perfil');
    }
  };

  const cargarDocumentos = async () => {
    try {
      const res = await api.get(`/documentos/usuario/${usuario.id}`);
      setDocumentos(res.data.documentos || []);
    } catch (err) {
      console.error('Error al cargar documentos');
    } finally {
      setCargando(false);
    }
  };

  const subirDocumento = async (e) => {
    e.preventDefault();
    if (!archivo || !titulo.trim()) return;
    setSubiendo(true);
    try {
      const formData = new FormData();
      formData.append('archivo', archivo);
      formData.append('titulo', titulo);
      await api.post(`/documentos/usuario/${usuario.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setTitulo('');
      setArchivo(null);
      await cargarDocumentos();
      toast.success("Documento subido correctamente");
    } catch (err) {
      toast.error('Error al subir el documento');
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-[#2222FF] text-white px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">⚽ Club Deportivo</h1>
        <button
          onClick={() => navigate('/jugador/dashboard')}
          className="bg-white text-[#2222FF] text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          ← Volver
        </button>
      </nav>

      <section className="p-8 max-w-2xl mx-auto">
        <header className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Mis Documentos</h2>
          <p className="text-gray-500 mt-1">Sube tu DNI y reconocimiento médico</p>
        </header>

        <article className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="font-semibold text-gray-700 mb-4">Subir documento</h3>
          <form onSubmit={subirDocumento} className="flex flex-col gap-4">
            <label className="text-sm font-medium text-gray-700">
              Tipo de documento
              <select
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-[#2222FF]"
              >
                <option value="">Selecciona un tipo</option>
                <option value={`DNI Frontal - ${perfil?.nombre} ${perfil?.apellidos}`}>DNI Frontal</option>
                <option value={`DNI Trasero - ${perfil?.nombre} ${perfil?.apellidos}`}>DNI Trasero</option>
                <option value={`Reconocimiento Médico - ${perfil?.nombre} ${perfil?.apellidos}`}>Reconocimiento Médico</option>
              </select>
            </label>
            <label className="text-sm font-medium text-gray-700">
              Archivo (imagen o PDF)
              <section className="mt-1">
                <label className="w-full flex items-center gap-3 border border-gray-300 rounded-lg px-4 py-2.5 cursor-pointer hover:border-[#2222FF] transition-colors">
                  <span className="text-[#2222FF] text-sm font-semibold whitespace-nowrap">Seleccionar archivo</span>
                  <span className="text-sm text-gray-500 truncate">
                    {archivo ? archivo.name : 'Ningún archivo seleccionado'}
                  </span>
                  <input
                    type="file"
                    accept="image/*,.pdf"
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
              {subiendo ? 'Subiendo...' : 'Subir documento'}
            </button>
          </form>
        </article>

        <article className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-700 mb-4">Mis documentos</h3>
          {cargando && <Spinner />}
          {!cargando && documentos.length === 0 && (
            <p className="text-gray-400 text-sm">No has subido ningún documento todavía</p>
          )}
          {documentos.map(d => (
            <section key={d.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <section className="flex items-center gap-3">
                <span className="text-2xl">📄</span>
                <div>
                  <p className="font-medium text-gray-800 text-sm">{d.titulo}</p>
                  <p className="text-gray-400 text-xs">{d.fecha_subida?.split('T')[0]}</p>
                </div>
              </section>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                d.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-700' :
                d.estado === 'aprobado' ? 'bg-green-100 text-green-700' :
                'bg-red-100 text-red-700'
              }`}>
                {d.estado}
              </span>
            </section>
          ))}
        </article>
      </section>
    </main>
  );
}
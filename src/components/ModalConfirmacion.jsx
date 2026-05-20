export default function ModalConfirmacion({ mensaje, onConfirmar, onCancelar }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <article className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm mx-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2">¿Estás seguro?</h3>
        <p className="text-gray-500 text-sm mb-6">{mensaje}</p>
        <footer className="flex gap-3">
          <button
            onClick={onConfirmar}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-lg transition-colors"
          >
            Eliminar
          </button>
          <button
            onClick={onCancelar}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-lg transition-colors"
          >
            Cancelar
          </button>
        </footer>
      </article>
    </div>
  );
}
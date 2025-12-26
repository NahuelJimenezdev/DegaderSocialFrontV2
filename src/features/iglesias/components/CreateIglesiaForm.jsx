import { Plus } from 'lucide-react';

/**
 * Formulario para crear una nueva iglesia
 */
const CreateIglesiaForm = ({
    mostrarForm,
    setMostrarForm,
    formIglesia,
    setFormIglesia,
    onSubmit
}) => {
    if (!mostrarForm) return null;

    return (
        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 mb-6">
            <h4 className="font-semibold mb-4 text-gray-900 dark:text-white">Nueva Iglesia</h4>
            <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                    type="text"
                    placeholder="Nombre de la Iglesia"
                    className="px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={formIglesia.nombre}
                    onChange={e => setFormIglesia({ ...formIglesia, nombre: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Denominación"
                    className="px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={formIglesia.denominacion}
                    onChange={e => setFormIglesia({ ...formIglesia, denominacion: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="País"
                    className="px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={formIglesia.pais}
                    onChange={e => setFormIglesia({ ...formIglesia, pais: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Ciudad"
                    className="px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={formIglesia.ciudad}
                    onChange={e => setFormIglesia({ ...formIglesia, ciudad: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Dirección"
                    className="px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white col-span-2"
                    value={formIglesia.direccion}
                    onChange={e => setFormIglesia({ ...formIglesia, direccion: e.target.value })}
                    required
                />
                <div className="col-span-2 flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={() => setMostrarForm(false)}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                        Crear Iglesia
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateIglesiaForm;

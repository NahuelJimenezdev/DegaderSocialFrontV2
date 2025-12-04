import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import folderService from '../../../api/folderService';

export const useCarpetas = () => {
  const { user } = useAuth();
  // Estado principal
  const [carpetas, setCarpetas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtros y Búsqueda
  const [busqueda, setBusqueda] = useState('');
  const [vistaActual, setVistaActual] = useState('grid');
  const [filtros, setFiltros] = useState({
    tipo: '', // personal, grupal, institucional
    area: '',
    cargo: '',
    pais: '',
    provincia: '',
    ciudad: '',
    compartidas: false,
    misCarpetas: false
  });

  // Estado de UI
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalCompartirAbierto, setModalCompartirAbierto] = useState(false);
  const [carpetaEditar, setCarpetaEditar] = useState(null);
  const [carpetaSeleccionada, setCarpetaSeleccionada] = useState(null); // Para compartir/ver detalle
  const [menuAbierto, setMenuAbierto] = useState(null);

  // Jerarquía Institucional
  const [jerarquia, setJerarquia] = useState({
    areas: [],
    cargos: [],
    niveles: []
  });

  // Cargar jerarquía al montar
  useEffect(() => {
    const cargarJerarquia = async () => {
      try {
        const response = await folderService.getHierarchy();
        if (response && response.data) {
          setJerarquia(response.data);
        }
      } catch (error) {
        console.error('Error al cargar jerarquía:', error);
      }
    };
    cargarJerarquia();
  }, []);

  // Cargar carpetas cuando cambian los filtros
  useEffect(() => {
    cargarCarpetas();
  }, [filtros]);

  const cargarCarpetas = useCallback(async () => {
    try {
      setLoading(true);
      // Limpiar filtros vacíos
      const params = Object.fromEntries(
        Object.entries(filtros).filter(([_, v]) => v !== '' && v !== false && v !== null)
      );

      const response = await folderService.getAllFolders(params);

      if (response && response.data && response.data.carpetas) {
        setCarpetas(response.data.carpetas);
      } else if (Array.isArray(response)) {
        setCarpetas(response);
      } else {
        setCarpetas([]);
      }
    } catch (error) {
      console.error('Error al cargar carpetas:', error);
      setCarpetas([]);
    } finally {
      setLoading(false);
    }
  }, [filtros]);

  // Handlers de Acciones
  const handleCrearCarpeta = async (formData) => {
    try {
      await folderService.createFolder(formData);
      setModalAbierto(false);
      cargarCarpetas();
      return { success: true };
    } catch (error) {
      console.error('Error al crear carpeta:', error);
      return { success: false, error: error.response?.data?.message || 'Error al crear la carpeta' };
    }
  };

  const handleEditarCarpeta = async (formData) => {
    try {
      await folderService.updateFolder(carpetaEditar._id, formData);
      setModalAbierto(false);
      setCarpetaEditar(null);
      cargarCarpetas();
      return { success: true };
    } catch (error) {
      console.error('Error al editar carpeta:', error);
      return { success: false, error: error.response?.data?.message || 'Error al editar la carpeta' };
    }
  };

  const handleEliminarCarpeta = async (id) => {
    const carpeta = carpetas.find(c => c._id === id);
    if (!carpeta) return;

    // Verificar si es propietario
    // El propietario puede venir poblado (objeto) o como ID string
    const propietarioId = carpeta.propietario?._id || carpeta.propietario;
    const isOwner = propietarioId && user?._id && propietarioId.toString() === user._id.toString();

    const mensaje = isOwner
      ? '¿Estás seguro de que deseas eliminar esta carpeta? Esta acción no se puede deshacer.'
      : '¿Estás seguro de que deseas salir de esta carpeta compartida? Dejarás de tener acceso a ella.';

    if (window.confirm(mensaje)) {
      try {
        if (isOwner) {
          await folderService.deleteFolder(id);
        } else {
          await folderService.leaveFolder(id);
        }
        cargarCarpetas();
      } catch (error) {
        console.error('Error al eliminar/salir carpeta:', error);
        alert(error.response?.data?.message || 'Error al procesar la solicitud');
      }
    }
  };

  const handleCompartirCarpeta = async (id, data) => {
    try {
      await folderService.shareFolder(id, data);
      // Si estamos en detalle, recargar carpeta? (se maneja en el componente detalle)
      // Si estamos en lista, no cambia mucho visualmente
      return { success: true };
    } catch (error) {
      console.error('Error al compartir carpeta:', error);
      return { success: false, error: error.response?.data?.message || 'Error al compartir' };
    }
  };

  const handleCompartirMasivo = async (id, data) => {
    try {
      await folderService.shareFolderBulk(id, data);
      setModalCompartirAbierto(false);
      return { success: true };
    } catch (error) {
      console.error('Error al compartir masivamente:', error);
      return { success: false, error: error.response?.data?.message || 'Error al compartir' };
    }
  };

  const handleSubirArchivo = async (folderId, file) => {
    try {
      const response = await folderService.uploadFile(folderId, file);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al subir archivo:', error);
      return { success: false, error: error.response?.data?.message || 'Error al subir archivo' };
    }
  };

  const handleEliminarArchivo = async (folderId, fileId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este archivo?')) {
      try {
        await folderService.deleteFile(folderId, fileId);
        return { success: true };
      } catch (error) {
        console.error('Error al eliminar archivo:', error);
        return { success: false, error: error.response?.data?.message || 'Error al eliminar archivo' };
      }
    }
    return { success: false, cancelled: true };
  };

  // UI Helpers
  const abrirModalEditar = (carpeta) => {
    setCarpetaEditar(carpeta);
    setModalAbierto(true);
  };

  const abrirModalCrear = () => {
    setCarpetaEditar(null);
    setModalAbierto(true);
  };

  const abrirModalCompartir = (carpeta) => {
    setCarpetaSeleccionada(carpeta);
    setModalCompartirAbierto(true);
  };

  const actualizarFiltro = (key, value) => {
    setFiltros(prev => ({ ...prev, [key]: value }));
  };

  // Filtrado local por búsqueda (nombre/descripción)
  const carpetasFiltradas = carpetas.filter(carpeta =>
    carpeta.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    carpeta.descripcion.toLowerCase().includes(busqueda.toLowerCase())
  );

  return {
    // Estado
    carpetas,
    loading,
    filtros,
    busqueda,
    vistaActual,
    modalAbierto,
    modalCompartirAbierto,
    carpetaEditar,
    carpetaSeleccionada,
    menuAbierto,
    carpetasFiltradas,
    jerarquia,

    // Setters
    setBusqueda,
    setVistaActual,
    setModalAbierto,
    setModalCompartirAbierto,
    setMenuAbierto,
    setCarpetaSeleccionada,
    actualizarFiltro,

    // Handlers
    handleCrearCarpeta,
    handleEditarCarpeta,
    handleEliminarCarpeta,
    handleCompartirCarpeta,
    handleCompartirMasivo,
    handleSubirArchivo,
    handleEliminarArchivo,
    abrirModalEditar,
    abrirModalCrear,
    abrirModalCompartir,
    cargarCarpetas,
  };
};

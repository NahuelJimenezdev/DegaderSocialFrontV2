import { useState, useEffect } from 'react';
import folderService from '../../../api/folderService';

export const useCarpetas = () => {
  const [carpetas, setCarpetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tipoFiltro, setTipoFiltro] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [vistaActual, setVistaActual] = useState('grid');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [carpetaEditar, setCarpetaEditar] = useState(null);
  const [menuAbierto, setMenuAbierto] = useState(null);

  useEffect(() => {
    cargarCarpetas();
  }, [tipoFiltro]);

  const cargarCarpetas = async () => {
    try {
      setLoading(true);
      const response = await folderService.getAllFolders(tipoFiltro);
      console.log('Respuesta del servidor:', response);

      if (response && response.data && response.data.carpetas) {
        setCarpetas(response.data.carpetas);
      } else if (Array.isArray(response)) {
        setCarpetas(response);
      } else {
        console.warn('Estructura de respuesta inesperada:', response);
        setCarpetas([]);
      }
    } catch (error) {
      console.error('Error al cargar carpetas:', error);
      console.error('Detalles del error:', error.response?.data || error.message);
      setCarpetas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCrearCarpeta = async (formData) => {
    try {
      await folderService.createFolder(formData);
      setModalAbierto(false);
      cargarCarpetas();
    } catch (error) {
      console.error('Error al crear carpeta:', error);
      alert('Error al crear la carpeta');
    }
  };

  const handleEditarCarpeta = async (formData) => {
    try {
      await folderService.updateFolder(carpetaEditar._id, formData);
      setModalAbierto(false);
      setCarpetaEditar(null);
      cargarCarpetas();
    } catch (error) {
      console.error('Error al editar carpeta:', error);
      alert('Error al editar la carpeta');
    }
  };

  const handleEliminarCarpeta = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta carpeta?')) {
      try {
        await folderService.deleteFolder(id);
        cargarCarpetas();
      } catch (error) {
        console.error('Error al eliminar carpeta:', error);
        alert('Error al eliminar la carpeta');
      }
    }
  };

  const abrirModalEditar = (carpeta) => {
    setCarpetaEditar(carpeta);
    setModalAbierto(true);
  };

  const abrirModalCrear = () => {
    setCarpetaEditar(null);
    setModalAbierto(true);
  };

  const carpetasFiltradas = carpetas.filter(carpeta =>
    carpeta.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    carpeta.descripcion.toLowerCase().includes(busqueda.toLowerCase())
  );

  return {
    // Estado
    carpetas,
    loading,
    tipoFiltro,
    busqueda,
    vistaActual,
    modalAbierto,
    carpetaEditar,
    menuAbierto,
    carpetasFiltradas,

    // Setters
    setTipoFiltro,
    setBusqueda,
    setVistaActual,
    setModalAbierto,
    setMenuAbierto,

    // Handlers
    handleCrearCarpeta,
    handleEditarCarpeta,
    handleEliminarCarpeta,
    abrirModalEditar,
    abrirModalCrear,
    cargarCarpetas,
  };
};

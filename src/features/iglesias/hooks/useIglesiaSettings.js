import { useState } from 'react';
import { logger } from '../../../shared/utils/logger';
import iglesiaService from '../../../api/iglesiaService';

/**
 * Custom hook para manejar la configuración de iglesia
 * @param {Object} iglesiaData - Datos de la iglesia
 * @param {Function} refetch - Función para recargar datos
 * @returns {Object} Estado y funciones para configuración
 */
export const useIglesiaSettings = (iglesiaData, refetch) => {
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('general');
    const [alertConfig, setAlertConfig] = useState({
        isOpen: false,
        variant: 'info',
        message: ''
    });

    // Form data
    const [formData, setFormData] = useState({
        nombre: iglesiaData?.nombre || '',
        descripcion: iglesiaData?.descripcion || '',
        mision: iglesiaData?.mision || '',
        vision: iglesiaData?.vision || '',
        valores: iglesiaData?.valores || '',
        infoPastor: {
            mensaje: iglesiaData?.infoPastor?.mensaje || ''
        },
        ubicacion: {
            direccion: iglesiaData?.ubicacion?.direccion || '',
            ciudad: iglesiaData?.ubicacion?.ciudad || '',
            pais: iglesiaData?.ubicacion?.pais || '',
            coordenadas: iglesiaData?.ubicacion?.coordenadas || { lat: 0, lng: 0 }
        },
        contacto: {
            telefono: iglesiaData?.contacto?.telefono || '',
            email: iglesiaData?.contacto?.email || '',
            sitioWeb: iglesiaData?.contacto?.sitioWeb || ''
        },
        horarios: iglesiaData?.horarios || []
    });

    // Image states
    const [logoPreview, setLogoPreview] = useState(null);
    const [bannerPreview, setBannerPreview] = useState(null);
    const [logoFile, setLogoFile] = useState(null);
    const [bannerFile, setBannerFile] = useState(null);

    // Galeria states
    const [galeriaFiles, setGaleriaFiles] = useState([]);
    const [galeriaPreviews, setGaleriaPreviews] = useState([]);
    const [existingGaleria, setExistingGaleria] = useState(iglesiaData?.galeria || []);

    // Horario state
    const [newHorario, setNewHorario] = useState({ dia: '', hora: '', tipo: '' });

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: { ...prev[parent], [child]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    // Handle logo change
    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle banner change
    const handleBannerChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBannerFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setBannerPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle galeria change
    const handleGaleriaChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setGaleriaFiles(prev => [...prev, ...files]);

            files.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setGaleriaPreviews(prev => [...prev, reader.result]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    // Handle remove image from galeria
    const handleRemoveGaleriaImage = (index, isExisting = false) => {
        if (isExisting) {
            setExistingGaleria(prev => prev.filter((_, i) => i !== index));
        } else {
            setGaleriaFiles(prev => prev.filter((_, i) => i !== index));
            setGaleriaPreviews(prev => prev.filter((_, i) => i !== index));
        }
    };

    // Handle add horario
    const handleAddHorario = () => {
        if (newHorario.dia && newHorario.hora && newHorario.tipo) {
            setFormData(prev => ({
                ...prev,
                horarios: [...prev.horarios, newHorario]
            }));
            setNewHorario({ dia: '', hora: '', tipo: '' });
        }
    };

    // Handle remove horario
    const handleRemoveHorario = (index) => {
        setFormData(prev => ({
            ...prev,
            horarios: prev.horarios.filter((_, i) => i !== index)
        }));
    };

    // Handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            logger.log('🚀 Starting handleSubmit');
            const uploadData = new FormData();

            if (logoFile) {
                logger.log('📎 Appending logo file:', logoFile.name);
                uploadData.append('logo', logoFile);
            }
            if (bannerFile) {
                logger.log('📎 Appending banner file:', bannerFile.name);
                uploadData.append('portada', bannerFile);
            }

            // Agregar archivos de galería
            if (galeriaFiles.length > 0) {
                logger.log(`📎 Appending ${galeriaFiles.length} galeria files`);
                galeriaFiles.forEach(file => {
                    logger.log('  - Adding file:', file.name);
                    uploadData.append('galeria', file);
                });
            }

            // Agregar los demás datos del formulario
            Object.keys(formData).forEach(key => {
                if (typeof formData[key] === 'object' && !Array.isArray(formData[key])) {
                    const jsonValue = JSON.stringify(formData[key]);
                    logger.log(`📝 Appending object field ${key}:`, jsonValue);
                    uploadData.append(key, jsonValue);
                } else if (Array.isArray(formData[key])) {
                    const jsonValue = JSON.stringify(formData[key]);
                    logger.log(`📝 Appending array field ${key}:`, jsonValue);
                    uploadData.append(key, jsonValue);
                } else {
                    logger.log(`📝 Appending field ${key}:`, formData[key]);
                    uploadData.append(key, formData[key]);
                }
            });

            // Enviar la galería existente (URLs que permanecen)
            const galeriaJson = JSON.stringify(existingGaleria);
            logger.log('📝 Appending field galeria (existing):', galeriaJson);
            uploadData.append('galeria', galeriaJson);

            logger.log('📤 Sending updateIglesia request...');
            const response = await iglesiaService.updateIglesia(iglesiaData._id, uploadData);
            logger.log('✅ Update response:', response);

            await refetch();

            // Limpiar previews y archivos temporales
            setLogoPreview(null);
            setBannerPreview(null);
            setLogoFile(null);
            setBannerFile(null);
            setGaleriaFiles([]);
            setGaleriaPreviews([]);
            if (response.data) {
                setExistingGaleria(response.data.galeria || []);
            }

            setAlertConfig({ isOpen: true, variant: 'success', message: 'Cambios guardados exitosamente' });
        } catch (error) {
            logger.error('❌ Error al guardar:', error);
            setAlertConfig({ isOpen: true, variant: 'error', message: 'Error al guardar los cambios' });
        } finally {
            setLoading(false);
        }
    };

    return {
        // Estado
        loading,
        activeTab,
        formData,
        logoPreview,
        bannerPreview,
        galeriaPreviews,
        existingGaleria,
        newHorario,
        alertConfig,

        // Setters
        setActiveTab,
        setFormData,
        setNewHorario,
        setAlertConfig,

        // Funciones
        handleInputChange,
        handleLogoChange,
        handleBannerChange,
        handleGaleriaChange,
        handleRemoveGaleriaImage,
        handleAddHorario,
        handleRemoveHorario,
        handleSubmit
    };
};

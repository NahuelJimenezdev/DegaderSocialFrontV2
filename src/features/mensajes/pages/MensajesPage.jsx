import React, { useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ChatListSidebar from '../components/ChatList/ChatListSidebar';
import ChatWindow from '../components/ChatWindow/ChatWindow';
import { useChatController } from '../hooks/useChatController';
import { AlertDialog } from '../../../shared/components/AlertDialog';
import { ChatProvider } from '../context/ChatContext';

const MensajesPage = () => {
  const {
    conversaciones,
    conversacionActual,
    mensajes,
    nuevoMensaje,
    setNuevoMensaje,
    mostrarBuscador,
    setMostrarBuscador,
    cargando,
    cargandoConversaciones,
    busquedaGlobal,
    resultadosBusqueda,
    cargandoBusqueda,
    menuAbierto,
    setMenuAbierto,
    tabActiva,
    setTabActiva,
    pendingCount,
    filtroActivo,
    setFiltroActivo,
    mostrarEmojiPicker,
    setMostrarEmojiPicker,
    archivoSeleccionado,
    previsualizacionArchivo,
    mensajesEndRef,
    fileInputRef,
    handleBusquedaGlobal,
    seleccionarUsuarioBusqueda,
    handleSeleccionarConversacion,
    handleAceptarSolicitud,
    handleRechazarSolicitud,
    handleDestacarChat,
    handleEliminarChat,
    handleArchivarChat,
    handleVaciarConversacion,
    handleFileSelect,
    handleCancelarArchivo,
    handleEmojiSelect,
    handleEnviarMensaje,
    getOtroParticipante,
    getUnreadCount,
    formatearTiempo,
    userId,
    navigate,
    alertConfig,
    setAlertConfig,
    handleCerrarChat, // Para botón atrás móvil
  } = useChatController();

  // Memoizar handlers y helpers para evitar re-renders
  const handlers = useMemo(() => ({
    handleSeleccionarConversacion,
    handleAceptarSolicitud,
    handleRechazarSolicitud,
    handleDestacarChat,
    handleEliminarChat,
    handleArchivarChat,
    handleVaciarConversacion
  }), [
    handleSeleccionarConversacion,
    handleAceptarSolicitud,
    handleRechazarSolicitud,
    handleDestacarChat,
    handleEliminarChat,
    handleArchivarChat,
    handleVaciarConversacion
  ]);

  const helpers = useMemo(() => ({
    getOtroParticipante,
    getUnreadCount,
    formatearTiempo
  }), [getOtroParticipante, getUnreadCount, formatearTiempo]);

  // Leer parámetro tab de la URL
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'pending') {
      setTabActiva('pending');
      // Limpiar el parámetro de la URL después de usarlo
      setSearchParams({});
    }
  }, [searchParams, setTabActiva, setSearchParams]);

  return (
    <ChatProvider
      conversacionActual={conversacionActual}
      userId={userId}
      tabActiva={tabActiva}
      menuAbierto={menuAbierto}
      setMenuAbierto={setMenuAbierto}
      handlers={handlers}
      helpers={helpers}
    >
      <div className="page-container">
        <div className="flex h-screen overflow-hidden dark:bg-gray-900">
          <div className="container mx-auto h-full max-w-7xl">
            <div className="flex h-full border-l border-r border-gray-200 dark:border-gray-700">
              <ChatListSidebar
                conversaciones={conversaciones}
                cargandoConversaciones={cargandoConversaciones}
                tabActiva={tabActiva}
                setTabActiva={setTabActiva}
                pendingCount={pendingCount}
                mostrarBuscador={mostrarBuscador}
                setMostrarBuscador={setMostrarBuscador}
                busquedaGlobal={busquedaGlobal}
                handleBusquedaGlobal={handleBusquedaGlobal}
                resultadosBusqueda={resultadosBusqueda}
                cargandoBusqueda={cargandoBusqueda}
                seleccionarUsuarioBusqueda={seleccionarUsuarioBusqueda}
                filtroActivo={filtroActivo}
                setFiltroActivo={setFiltroActivo}
              />

              <ChatWindow
                conversacionActual={conversacionActual}
                cargando={cargando}
                mensajes={mensajes}
                userId={userId}
                navigate={navigate}
                mensajesEndRef={mensajesEndRef}
                nuevoMensaje={nuevoMensaje}
                setNuevoMensaje={setNuevoMensaje}
                archivoSeleccionado={archivoSeleccionado}
                previsualizacionArchivo={previsualizacionArchivo}
                handleFileSelect={handleFileSelect}
                handleCancelarArchivo={handleCancelarArchivo}
                fileInputRef={fileInputRef}
                mostrarEmojiPicker={mostrarEmojiPicker}
                setMostrarEmojiPicker={setMostrarEmojiPicker}
                handleEmojiSelect={handleEmojiSelect}
                handleEnviarMensaje={handleEnviarMensaje}
                getOtroParticipante={getOtroParticipante}
                handleCerrarChat={handleCerrarChat}
              />
            </div>

            {/* AlertDialog Component */}
            <AlertDialog
              isOpen={alertConfig.isOpen}
              onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
              variant={alertConfig.variant}
              message={alertConfig.message}
            />
          </div>
        </div>
      </div>
    </ChatProvider>
  );
};

export default MensajesPage;

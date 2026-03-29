import React, { useState, useEffect, useRef } from 'react';
import userService from '../../../api/userService';
import friendshipService from '../../../api/friendshipService';
import { getUserAvatar } from '../../../shared/utils/avatarUtils';
import IOSAlert from '../../../shared/components/IOSAlert';
import './UserCarousel.css';

// Caché global a nivel de módulo para evitar peticiones redundantes simultáneas
let sharedRecsPromise = null;
let lastFetchTime = 0;
const CACHE_TTL = 30000; // 30 segundos de caché en memoria para re-montajes

const UserCarousel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectingId, setConnectingId] = useState(null);
  const [fadingId, setFadingId] = useState(null);
  
  // Estado para el modal iOS
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    variant: 'info'
  });

  // Número de tarjetas visibles a la vez
  const [visibleCardsCount, setVisibleCardsCount] = useState(3);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);

      if (width < 768) {
        setVisibleCardsCount(1);
      } else if (width < 1100) {
        setVisibleCardsCount(2);
      } else if (width < 1550) {
        setVisibleCardsCount(3); // Portátiles (Standard & Pro)
      } else if (width < 1850) {
        setVisibleCardsCount(4); // Monitores Desktop
      } else {
        setVisibleCardsCount(5); // Ultra-wide
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Estado para controlar el índice del primer usuario visible
  const [currentStartIndex, setCurrentStartIndex] = useState(0);

  // Carga inicial de datos
  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const now = Date.now();
      let fetchPromise = sharedRecsPromise;

      // Si no hay petición en vuelo o ya expiró el caché, pedir una nueva
      if (!fetchPromise || now - lastFetchTime > CACHE_TTL) {
        fetchPromise = userService.getRecommendations(20).then(res => {
          if (res.success) return res.data;
          throw new Error('No se pudieron cargar las recomendaciones');
        });
        sharedRecsPromise = fetchPromise;
        lastFetchTime = now;
      }
      
      const data = await fetchPromise;
      setUsers(data);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  // Calcula el número de páginas necesarias
  const totalPages = Math.ceil(users.length / visibleCardsCount);

  // Función para ir a la página siguiente
const scrollRef = useRef(null);
const handleNextPage = () => {
  if (scrollRef.current) {
    const firstCard = scrollRef.current.querySelector('.user-card');
    if (firstCard) {
      const cardWidth = firstCard.offsetWidth;
      const gap = 20; // Debe coincidir con el gap de tu CSS
      // Scrolleamos exactamente una tarjeta + el espacio
      scrollRef.current.scrollBy({ left: cardWidth + gap, behavior: 'smooth' });
    }
  }
};

const handlePrevPage = () => {
  if (scrollRef.current) {
    const firstCard = scrollRef.current.querySelector('.user-card');
    if (firstCard) {
      const cardWidth = firstCard.offsetWidth;
      const gap = 20; // Sincronizado con handleNextPage
      // Scrolleamos hacia atrás una tarjeta + el espacio
      scrollRef.current.scrollBy({ left: -(cardWidth + gap), behavior: 'smooth' });
    }
  }
};

  // Usuarios a mostrar (en mobile todos para scroll nativo, en desktop paginados)
  const displayUsers = users;

  // Helper para obtener la bandera del país (más robusto)
  const getCountryFlag = (countryName) => {
    if (!countryName) return '🏳️';
    
    // Normalizar: quitar espacios, tildes y a minúsculas para comparar
    const normalized = countryName.toLowerCase().trim()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    const flagsMap = {
      'espana': '🇪🇸',
      'argentina': '🇦🇷',
      'brasil': '🇧🇷',
      'estados unidos': '🇺🇸',
      'usa': '🇺🇸',
      'colombia': '🇨🇴',
      'mexico': '🇲🇽',
      'chile': '🇨🇱',
      'peru': '🇵🇪',
      'ecuador': '🇪🇨',
      'venezuela': '🇻🇪',
      'uruguay': '🇺🇾',
      'paraguay': '🇵🇾',
      'bolivia': '🇧🇴',
      'panama': '🇵🇦'
    };
    
    return flagsMap[normalized] || '🏳️';
  };

  // Manejar conexión
  const handleConnect = async (userId) => {
    if (connectingId) return;
    setConnectingId(userId);
    try {
        const res = await friendshipService.sendFriendRequest(userId);
        if (res.success) {
            // Mostrar éxito en modal iOS
            setAlertConfig({
                isOpen: true,
                title: '¡Solicitud Enviada!',
                message: 'La solicitud de amistad se ha enviado correctamente.',
                variant: 'success'
            });

            // Iniciar desvanecimiento
            setFadingId(userId);
            
            // Esperar a que termine la animación antes de quitarlo del array
            setTimeout(() => {
                setUsers(prev => prev.filter(u => u._id !== userId));
                setFadingId(null);
                
                // Si la página se queda vacía y hay más, ajustar el índice
                if (users.length === 1 && currentStartIndex > 0) {
                    setCurrentStartIndex(prev => Math.max(0, prev - visibleCardsCount));
                }
            }, 500); // 500ms coincide con la duración de la animación CSS
        } else {
            setAlertConfig({
                isOpen: true,
                title: 'Error',
                message: res.message || 'No se pudo enviar la solicitud.',
                variant: 'error'
            });
        }
    } catch (err) {
        console.error('Error connecting:', err);
        setAlertConfig({
            isOpen: true,
            title: 'Error de Conexión',
            message: 'Ocurrió un problema al enviar la solicitud.',
            variant: 'error'
        });
    } finally {
        setConnectingId(null);
    }
  };

  if (loading) {
    return (
      <div className="user-carousel-container loading-state">
        <h2 className="carousel-title">Sugerencias para ti</h2>
        <div className="carousel-wrapper">
          <div className="user-cards-container">
            {[1, 2, 3].map((i) => (
              <div key={i} className="user-card skeleton">
                <div className="skeleton-avatar"></div>
                <div className="skeleton-info">
                  <div className="skeleton-line name"></div>
                  <div className="skeleton-line country"></div>
                  <div className="skeleton-line role"></div>
                </div>
                <div className="skeleton-button"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error && !loading) {
    return (
      <div className="user-carousel-container">
        <h2 className="carousel-title">Sugerencias para ti</h2>
        <div className="empty-state">
          <p>Ocurrió un problema al cargar las sugerencias.</p>
          <button 
            onClick={loadRecommendations}
            className="connect-button"
            style={{ marginTop: '15px' }}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (users.length === 0 && !loading) {
    return (
      <div className="user-carousel-container">
        <h2 className="carousel-title">Sugerencias para ti</h2>
        <div className="empty-state">
          <p>No hay más recomendaciones por ahora. ¡Vuelve más tarde!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-carousel-container">
      <h2 className="carousel-title">Sugerencias para ti</h2>

      <div className="carousel-wrapper">
        {users.length > visibleCardsCount && !isMobile && (
          <button className="nav-button prev-button" onClick={handlePrevPage}>
            &lt;
          </button>
        )}

        <div className="user-cards-container" ref={scrollRef}>
          {displayUsers.map((user) => (
            <div key={user._id} className={`user-card ${fadingId === user._id ? 'fade-out' : ''}`}
            // Esto permite que el botón de "Next" sepa a dónde scrollear
            style={{ scrollSnapAlign: 'start' }}>
              <div className="avatar-wrapper">
                <img 
                  src={getUserAvatar(user)} 
                  alt={user.name} 
                  className="user-avatar" 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/avatars/default-avatar.png';
                  }}
                />
              </div>
              <div className="user-info">
                <h3 className="user-name">
                  {user.name}
                </h3>
                <div className="user-details">
                  <p className="user-position">
                    {user.fundacion?.cargo || user.role || 'Miembro'}
                  </p>
                  <div className="location-row">
                    <span className="country-flag">{getCountryFlag(user.country)}</span>
                    <p className="user-location">
                      {user.personal?.ubicacion?.ciudad && user.personal?.ubicacion?.estado 
                        ? `${user.personal.ubicacion.ciudad} / ${user.personal.ubicacion.estado}`
                        : user.fundacion?.territorio?.nombre 
                          ? `${user.fundacion.territorio.nombre} / ${user.country}` 
                          : (user.country || 'No especificado')}
                    </p>
                  </div>
                </div>
              </div>
              <button 
                className={`connect-button ${connectingId === user._id ? 'loading' : ''}`}
                onClick={() => handleConnect(user._id)}
                disabled={connectingId === user._id}
              >
                {connectingId === user._id ? 'Enviando...' : 'Conectar'}
              </button>
            </div>
          ))}
        </div>

        {users.length > visibleCardsCount && !isMobile && (
          <button className="nav-button next-button" onClick={handleNextPage}>
            &gt;
          </button>
        )}
      </div>

      {totalPages > 1 && !isMobile && (
        <div className="pagination-dots">
          {Array.from({ length: totalPages }).map((_, pageIndex) => (
            <span
              key={pageIndex}
              className={`pagination-dot ${pageIndex === 0 ? 'long-dot' : ''} ${
                pageIndex === Math.floor(currentStartIndex / visibleCardsCount) ? 'active-dot' : ''
              }`}
            ></span>
          ))}
        </div>
      )}
      {/* Modal de feedback estilo iOS */}
      <IOSAlert 
        isOpen={alertConfig.isOpen}
        title={alertConfig.title}
        message={alertConfig.message}
        mainActionText="Entendido"
        onJoin={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}
        onCancel={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}
        showCancelButton={false}
        icon={alertConfig.variant === 'success' ? 'check_circle' : 'error'}
      />
    </div>
  );
};

export default UserCarousel;

import { useState, useRef, useEffect, useCallback } from 'react';
import { logger } from '../../../shared/utils/logger';
import { useNavigate } from 'react-router-dom';
import { Search, X, User, Loader } from 'lucide-react';
import { getUserAvatar, handleImageError } from '../../../shared/utils/avatarUtils';
import { API_BASE_URL } from '../../../shared/config/env';
import styles from '../styles/SearchBar.module.css';

const SearchBar = () => {
  const [termino, setTermino] = useState('');
  const [resultados, setResultados] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [error, setError] = useState(null);
  const searchRef = useRef(null);
  const timeoutRef = useRef(null);
  const navigate = useNavigate();

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setMostrarResultados(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Función de búsqueda
  const buscar = useCallback(async (query) => {
    if (!query || query.length < 2) {
      setResultados(null);
      setMostrarResultados(false);
      return;
    }
    setCargando(true);
    setError(null);
    try {
      const token = localStorage.getItem('token'); // ← CORREGIDO: usar 'token' en lugar de 'authToken'
      if (!token) {
        setError('No autenticado. Inicia sesión primero.');
        return;
      }
      const response = await fetch(
        `${API_BASE_URL}/api/buscar?q=${encodeURIComponent(query)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
      const data = await response.json();
      if (data.exito) {
        setResultados(data);
        setMostrarResultados(true);
      } else {
        setError(data.mensaje || 'Error en la búsqueda');
        setMostrarResultados(false);
      }
    } catch (error) {
      setError(error.message || 'Error de conexión');
      setResultados(null);
    } finally {
      setCargando(false);
    }
  }, []);

  // Handle input change con debounce
  const handleChange = (e) => {
    const value = e.target.value;
    setTermino(value);
    setError(null);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (value.length >= 2) {
      setMostrarResultados(true);
      timeoutRef.current = setTimeout(() => buscar(value), 300);
    } else {
      setResultados(null);
      setMostrarResultados(false);
    }
  };

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (termino.trim()) {
      navigate(`/search?q=${encodeURIComponent(termino)}`);
      setMostrarResultados(false);
    }
  };

  // Limpiar búsqueda
  const limpiarBusqueda = () => {
    setTermino('');
    setResultados(null);
    setError(null);
    setMostrarResultados(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  // Handle focus
  const handleFocus = () => {
    if (termino.length >= 2 && resultados) {
      setMostrarResultados(true);
    }
  };

  // Navegar a perfil
  const navegarAPerfil = (usuarioId) => {
    navigate(`/perfil/${usuarioId}`);
    limpiarBusqueda();
    setMostrarResultados(false);
  };

  return (
    <div className={styles.searchBarWrap} ref={searchRef}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputWrap}>
          <Search className={styles.searchIcon} size={18} />
          <input
            type="text"
            className={styles.input}
            placeholder="Buscar personas..."
            value={termino}
            onChange={handleChange}
            onFocus={handleFocus}
          />
          {termino && (
            <button type="button" onClick={limpiarBusqueda} className={styles.clearBtn}>
              <X size={16} />
            </button>
          )}
        </div>
      </form>
      {mostrarResultados && (
        <div className={styles.dropdown}>
          {cargando && (
            <div className={styles.loading}>
              <Loader size={20} className={styles.spin} /> Buscando...
            </div>
          )}
          {error && (
            <div className={styles.error}>{error}</div>
          )}
          {!cargando && !error && resultados && resultados.resultados?.usuarios?.length > 0 && (
            <div>
              {resultados.resultados.usuarios.map(usuario => {
                const avatarUrl = getUserAvatar(usuario);
                const fullName = `${usuario?.nombres?.primero || ''} ${usuario?.apellidos?.primero || ''}`.trim() || 'Usuario';
                logger.log('🔍 Search Result User:', {
                  nombre: fullName,
                  fotoPerfil: usuario?.social?.fotoPerfil,
                  avatarUrl: avatarUrl,
                  usuario: usuario
                });
                return (
                  <div
                    key={usuario._id}
                    className={styles.resultItem}
                    onClick={() => navegarAPerfil(usuario._id)}
                  >
                    <img
                      src={avatarUrl}
                      alt={`${fullName} avatar`}
                      className={styles.avatar}
                      onError={(e) => {
                        logger.error('❌ Avatar load error for:', fullName, 'URL:', e.target.src);
                        // Generar un SVG de fallback local
                        const fallbackSvg = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128"><rect width="128" height="128" fill="#6b7280"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="system-ui" font-size="48" fill="white" font-weight="600">?</text></svg>`)))}`;
                        e.target.src = fallbackSvg;
                        e.target.onerror = null;
                      }}
                    />
                    <div className={styles.resultInfo}>
                      <div className={styles.resultName}>
                        {usuario?.nombres?.primero} {usuario?.apellidos?.primero}
                      </div>
                      <div className={styles.resultSub}>
                        {usuario?.seguridad?.rolSistema || 'usuario'} · {usuario?.personal?.ubicacion?.ciudad || 'Sin ubicación'}
                      </div>
                    </div>
                    <User size={16} className={styles.resultIcon} />
                  </div>
                );
              })}
            </div>
          )}
          {!cargando && !error && resultados && resultados.resultados?.usuarios?.length === 0 && (
            <div className={styles.noResults}>No se encontraron resultados</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;




# 📋 Guía Completa: Implementación de Perfil Visitante con Socket.IO

**Fecha:** 6 de Noviembre, 2025
**Estado:** 📝 EN PROGRESO
**Prioridad:** 🔴 ALTA

---

## ✅ Análisis Completado

He analizado completamente el proyecto funcional y aquí está la estructura necesaria:

### Archivos Analizados del Proyecto Funcional:
1. ✅ `PerfilVisitantePage.jsx` - Página principal
2. ✅ `ProfileHeader.jsx` - Componente de encabezado
3. ✅ `useAmistad.js` - Hook para manejo de amistades
4. ✅ `AmistadButton.jsx` - Botón con dropdown de acciones

---

## 📁 Estructura a Crear en V2

```
src/
├── features/
│   ├── perfilVisitante/
│   │   ├── pages/
│   │   │   └── PerfilVisitantePage.jsx        [CREAR]
│   │   ├── components/
│   │   │   ├── ProfileHeader.jsx              [CREAR]
│   │   │   └── ProfileActions.jsx             [CREAR]
│   │   └── hooks/
│   │       └── usePostsVisitante.js           [CREAR]
│   │
│   └── amistades/
│       ├── hooks/
│       │   └── useAmistad.js                   [CREAR]
│       ├── components/
│       │   └── AmistadButton.jsx               [CREAR]
│       └── services/
│           └── amistadService.js               [CREAR]
```

---

## 🔧 1. Crear Hook useAmistad

**Archivo:** `src/features/amistades/hooks/useAmistad.js`

```javascript
import { useState, useEffect } from 'react';
import { getSocket } from '../../../shared/lib/socket';
import { useAuth } from '../../../context/AuthContext';
import amistadService from '../services/amistadService';

export function useAmistad(usuarioId) {
  const [estado, setEstado] = useState('default');
  const socket = getSocket();
  const { user } = useAuth();

  // Consultar estado inicial
  useEffect(() => {
    if (!usuarioId) return;

    amistadService.getEstado(usuarioId)
      .then(res => setEstado(res.estado || 'default'))
      .catch(() => setEstado('default'));
  }, [usuarioId]);

  // Socket.IO - Escuchar actualizaciones en tiempo real
  useEffect(() => {
    if (!socket) return;

    const handleAmistadActualizada = (data) => {
      console.log('📨 [Amistad] Actualización recibida:', data);
      if (data.usuarioId && String(data.usuarioId) === String(usuarioId)) {
        setEstado(data.nuevoEstado);
      }
    };

    socket.on('amistad:actualizada', handleAmistadActualizada);

    return () => {
      socket.off('amistad:actualizada', handleAmistadActualizada);
    };
  }, [socket, usuarioId]);

  // Acciones
  const agregarAmigo = async () => {
    const userId = user?._id || user?.id;

    if (!userId || !usuarioId) {
      console.warn('[Amistad] Usuario no autenticado');
      return;
    }

    if (String(userId) === String(usuarioId)) {
      alert('No puedes enviarte una solicitud a ti mismo.');
      return;
    }

    const res = await amistadService.enviarSolicitud(usuarioId);
    if (res.success) {
      setEstado('enviada');
    } else {
      alert(res.message || 'Error al enviar solicitud');
    }
  };

  const aceptarAmigo = async () => {
    const res = await amistadService.aceptarSolicitud(usuarioId);
    if (res.success) setEstado('aceptado');
  };

  const cancelarAmigo = async () => {
    const res = await amistadService.cancelarSolicitud(usuarioId);
    if (res.success) setEstado('default');
  };

  const rechazarAmigo = async () => {
    const res = await amistadService.rechazarSolicitud(usuarioId);
    if (res.success) setEstado('default');
  };

  return { estado, agregarAmigo, aceptarAmigo, cancelarAmigo, rechazarAmigo };
}
```

---

## 🔧 2. Crear Servicio de Amistad

**Archivo:** `src/features/amistades/services/amistadService.js`

```javascript
import api from '../../../api/config';

const amistadService = {
  // Obtener estado de amistad con un usuario
  getEstado: async (usuarioId) => {
    const response = await api.get(`/amistades/estado/${usuarioId}`);
    return response.data;
  },

  // Enviar solicitud de amistad
  enviarSolicitud: async (usuarioId) => {
    const response = await api.post('/amistades/solicitar', { usuarioId });
    return response.data;
  },

  // Aceptar solicitud
  aceptarSolicitud: async (usuarioId) => {
    const response = await api.post('/amistades/aceptar', { usuarioId });
    return response.data;
  },

  // Cancelar solicitud enviada
  cancelarSolicitud: async (usuarioId) => {
    const response = await api.post('/amistades/cancelar', { usuarioId });
    return response.data;
  },

  // Rechazar solicitud recibida
  rechazarSolicitud: async (usuarioId) => {
    const response = await api.post('/amistades/rechazar', { usuarioId });
    return response.data;
  }
};

export default amistadService;
```

---

## 🔧 3. Crear Componente AmistadButton

**Archivo:** `src/features/amistades/components/AmistadButton.jsx`

```javascript
import { useState } from 'react';
import { User } from 'lucide-react';

const estados = {
  default: { color: '#10b981', texto: 'Agregar a amigos' },
  enviada: { color: '#f59e0b', texto: 'Solicitud pendiente' },
  recibida: { color: '#3b82f6', texto: 'Responder solicitud' },
  aceptado: { color: '#6366f1', texto: 'Amigos' },
  rechazado: { color: '#ef4444', texto: 'Solicitud rechazada' },
};

const AmistadButton = ({ estado = 'default', onAccion }) => {
  const [dropdown, setDropdown] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <button
        style={{
          background: estados[estado].color,
          color: '#fff',
          borderRadius: 20,
          padding: '8px 16px',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontWeight: 600,
          cursor: 'pointer'
        }}
        onClick={() => setDropdown((v) => !v)}
      >
        <User size={18} />
        {estados[estado].texto}
      </button>

      {dropdown && (
        <div
          style={{
            position: 'absolute',
            top: '110%',
            right: 0,
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: 10,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            zIndex: 1000,
            minWidth: 180
          }}
        >
          {estado === 'default' && (
            <button
              style={{ width: '100%', padding: '12px', background: 'none', border: 'none', color: '#10b981', cursor: 'pointer', textAlign: 'left', fontWeight: 500 }}
              onClick={() => { onAccion('agregar'); setDropdown(false); }}
            >
              Agregar a amigos
            </button>
          )}

          {estado === 'enviada' && (
            <button
              style={{ width: '100%', padding: '12px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', textAlign: 'left', fontWeight: 500 }}
              onClick={() => { onAccion('cancelar'); setDropdown(false); }}
            >
              Cancelar solicitud
            </button>
          )}

          {estado === 'recibida' && (
            <>
              <button
                style={{ width: '100%', padding: '12px', background: 'none', border: 'none', color: '#10b981', cursor: 'pointer', textAlign: 'left', fontWeight: 500 }}
                onClick={() => { onAccion('aceptar'); setDropdown(false); }}
              >
                Aceptar solicitud
              </button>
              <button
                style={{ width: '100%', padding: '12px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', textAlign: 'left', fontWeight: 500 }}
                onClick={() => { onAccion('rechazar'); setDropdown(false); }}
              >
                Rechazar solicitud
              </button>
            </>
          )}

          {estado === 'aceptado' && (
            <button
              style={{ width: '100%', padding: '12px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', textAlign: 'left', fontWeight: 500 }}
              onClick={() => { onAccion('eliminar'); setDropdown(false); }}
            >
              Eliminar amistad
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AmistadButton;
```

---

## 🔧 4. Crear ProfileHeader Component

**Archivo:** `src/features/perfilVisitante/components/ProfileHeader.jsx`

```javascript
import { MessageSquare } from 'lucide-react';
import AmistadButton from '../../amistades/components/AmistadButton';
import { getAvatarUrl } from '../../../shared/utils/avatarUtils';

const ProfileHeader = ({ usuario, estadoAmistad, onAccionAmistad }) => {
  const fotoPerfil = getAvatarUrl(usuario?.avatar);
  const bannerUrl = usuario?.banner || '/avatars/default-banner.svg';

  return (
    <div className="relative">
      {/* Banner */}
      <div
        className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600"
        style={{ backgroundImage: `url(${bannerUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      />

      {/* Avatar y Info */}
      <div className="px-6 pb-6">
        <div className="flex items-end justify-between -mt-16">
          <div className="flex items-end gap-4">
            <img
              src={fotoPerfil}
              alt={`${usuario?.nombre} ${usuario?.apellido}`}
              className="w-32 h-32 rounded-full border-4 border-white object-cover"
            />
            <div className="pb-2">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {usuario?.nombre} {usuario?.apellido}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {usuario?.rol} · {usuario?.ciudad || 'Sin ubicación'}
              </p>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-2 pb-2">
            <AmistadButton estado={estadoAmistad} onAccion={onAccionAmistad} />
            <button
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
              onClick={() => onAccionAmistad('mensaje')}
            >
              <MessageSquare size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
```

---

## 🔧 5. Crear PerfilVisitantePage

**Archivo:** `src/features/perfilVisitante/pages/PerfilVisitantePage.jsx`

```javascript
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAmistad } from '../../amistades/hooks/useAmistad';
import api from '../../../api/config';
import ProfileHeader from '../components/ProfileHeader';

const PerfilVisitantePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { estado, agregarAmigo, aceptarAmigo, cancelarAmigo, rechazarAmigo } = useAmistad(id);

  useEffect(() => {
    setLoading(true);
    api.get(`/usuarios/${id}`)
      .then(res => setUsuario(res.data.data || res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAccionAmistad = (accion) => {
    if (accion === 'agregar') agregarAmigo();
    if (accion === 'aceptar') aceptarAmigo();
    if (accion === 'cancelar') cancelarAmigo();
    if (accion === 'rechazar') rechazarAmigo();
    if (accion === 'eliminar') cancelarAmigo(); // Mismo endpoint
    if (accion === 'mensaje') navigate(`/mensajes/user:${id}`);
  };

  if (loading) return <div className="p-6">Cargando...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;
  if (!usuario) return <div className="p-6">Usuario no encontrado</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
        <ProfileHeader
          usuario={usuario}
          estadoAmistad={estado}
          onAccionAmistad={handleAccionAmistad}
        />

        {/* Biografía */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-2">Biografía</h3>
          <p className="text-gray-600 dark:text-gray-400">
            {usuario.biografia || 'Este usuario aún no tiene biografía.'}
          </p>
        </div>

        {/* Publicaciones (solo si son amigos) */}
        {estado === 'aceptado' ? (
          <div className="px-6 py-4">
            <h3 className="text-lg font-semibold mb-4">Publicaciones</h3>
            <p className="text-gray-500">Cargando publicaciones...</p>
          </div>
        ) : (
          <div className="px-6 py-4 text-center text-gray-500">
            Solo los amigos pueden ver las publicaciones de este usuario.
          </div>
        )}
      </div>
    </div>
  );
};

export default PerfilVisitantePage;
```

---

## 🔧 6. Configurar Rutas

**Modificar:** `src/routes/routes.jsx`

```javascript
import PerfilVisitantePage from '../features/perfilVisitante/pages/PerfilVisitantePage';

// Dentro de las rutas:
{
  path: '/perfil/:id',
  element: <PerfilVisitantePage />
}
```

---

## 🔧 7. Actualizar SearchBar para Navegación

**Modificar:** `src/features/buscador/components/SearchBar.jsx` (línea ~113)

```javascript
const navegarAPerfil = (usuarioId) => {
  navigate(`/perfil/${usuarioId}`); // ← Asegurar que usa esta ruta
  limpiarBusqueda();
  setMostrarResultados(false);
};
```

---

## 🔌 8. Backend: Emitir Notificaciones Socket.IO

**Modificar:** `src/routes/friendship.routes.js` (Backend V2)

Agregar emit de Socket.IO en cada acción:

```javascript
// Después de crear/aceptar/cancelar solicitud:

// Emitir notificación al destinatario
global.emitNotification(destinatarioId, {
  _id: notificationId,
  tipo: 'solicitud_amistad',
  remitente: {
    _id: req.user._id,
    nombre: req.user.nombre,
    apellido: req.user.apellido,
    avatar: req.user.avatar
  },
  mensaje: 'Te envió una solicitud de amistad',
  createdAt: new Date()
});

// Emitir actualización de estado a ambos usuarios
global.emitNotification(req.user._id, {
  tipo: 'amistad:actualizada',
  usuarioId: destinatarioId,
  nuevoEstado: 'enviada'
});

global.emitNotification(destinatarioId, {
  tipo: 'amistad:actualizada',
  usuarioId: req.user._id,
  nuevoEstado: 'recibida'
});
```

---

## ✅ Checklist de Implementación

### Frontend:
- [ ] Crear carpeta `src/features/perfilVisitante`
- [ ] Crear carpeta `src/features/amistades`
- [ ] Implementar `useAmistad.js`
- [ ] Implementar `amistadService.js`
- [ ] Crear `AmistadButton.jsx`
- [ ] Crear `ProfileHeader.jsx`
- [ ] Crear `PerfilVisitantePage.jsx`
- [ ] Agregar ruta `/perfil/:id` en routes.jsx
- [ ] Verificar navegación desde SearchBar

### Backend:
- [ ] Verificar rutas de amistades existen
- [ ] Agregar `global.emitNotification` en endpoints de amistad
- [ ] Probar endpoints con Postman
- [ ] Verificar Socket.IO está corriendo

### Testing:
- [ ] Buscar usuario y navegar a perfil
- [ ] Enviar solicitud de amistad
- [ ] Ver notificación en tiempo real
- [ ] Aceptar/rechazar solicitud
- [ ] Cancelar solicitud enviada
- [ ] Eliminar amistad

---

## 🚀 Orden de Implementación Recomendado

1. **Crear servicios y hooks** (useAmistad, amistadService)
2. **Crear componentes UI** (AmistadButton, ProfileHeader)
3. **Crear página** (PerfilVisitantePage)
4. **Configurar rutas**
5. **Integrar Socket.IO en backend**
6. **Probar flujo completo**

---

**Estado:** Pendiente de implementación
**Próximo paso:** Crear archivos según esta guía

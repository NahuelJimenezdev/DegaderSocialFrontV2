# Guía de Integración Backend-Frontend - Degader Social

## 📋 Resumen

Esta guía documenta la integración completa entre el backend (Node.js + Express + MongoDB) y el frontend (React + Vite) de Degader Social.

## 🏗️ Arquitectura

### Backend (DegaderSocialBackV2)
- **Framework**: Express.js 5.1.0
- **Base de datos**: MongoDB con Mongoose
- **Autenticación**: JWT con tokens de 7 días
- **Seguridad**: Argon2 para hash de contraseñas
- **Puerto**: 3000 (por defecto)

### Frontend (DegaderSocialFrontV2)
- **Framework**: React 19.1.1
- **Build tool**: Vite 7.1.7
- **Enrutamiento**: React Router DOM 7.9.4
- **Estilos**: Tailwind CSS + Bootstrap
- **HTTP Client**: Axios

## 📁 Estructura del Proyecto Frontend

```
src/
├── api/                          # Servicios de API
│   ├── config.js                 # Configuración de Axios
│   ├── authService.js            # Servicio de autenticación
│   ├── userService.js            # Servicio de usuarios
│   ├── postService.js            # Servicio de publicaciones
│   ├── friendshipService.js      # Servicio de amistades
│   ├── groupService.js           # Servicio de grupos
│   ├── notificationService.js    # Servicio de notificaciones
│   ├── conversationService.js    # Servicio de conversaciones
│   └── index.js                  # Exportaciones centralizadas
├── context/
│   └── AuthContext.jsx           # Contexto de autenticación
├── features/
│   └── auth/
│       ├── pages/
│       │   ├── Login.jsx         # Página de login
│       │   └── Register.jsx      # Página de registro
│       └── components/
│           └── ProtectedRoute.jsx # Componente de rutas protegidas
└── ...
```

## 🔧 Configuración Inicial

### 1. Variables de Entorno

Crear archivo `.env` en la raíz del frontend:

```env
VITE_API_URL=http://localhost:3000/api
VITE_ENV=development
```

### 2. Instalación de Dependencias

```bash
# Frontend
cd DegaderSocialFrontV2
npm install

# Backend (si aún no está configurado)
cd ../DegaderSocialBackV2
npm install
```

### 3. Configuración del Backend

Crear archivo `.env` en la raíz del backend:

```env
MONGO_ACCESS=mongodb://localhost:27017/degader_social
JWT_SECRET=tu_secreto_jwt_muy_seguro
PORT=3000
NODE_ENV=development
```

## 🚀 Iniciar los Proyectos

### Opción 1: Iniciar por separado

**Terminal 1 - Backend:**
```bash
cd DegaderSocialBackV2
npm run dev  # Inicia con nodemon en puerto 3000
```

**Terminal 2 - Frontend:**
```bash
cd DegaderSocialFrontV2
npm run dev  # Inicia Vite en puerto 5173 (por defecto)
```

### Opción 2: Script concurrente (opcional)

Puedes configurar `npm-run-all` o `concurrently` en el frontend para iniciar ambos:

```bash
npm install --save-dev concurrently
```

Agregar en `package.json` del frontend:
```json
{
  "scripts": {
    "dev:both": "concurrently \"npm run dev\" \"cd ../DegaderSocialBackV2 && npm run dev\""
  }
}
```

## 🔐 Sistema de Autenticación

### AuthContext

El contexto de autenticación (`src/context/AuthContext.jsx`) proporciona:

```javascript
const {
  user,           // Usuario actual
  loading,        // Estado de carga
  error,          // Errores de autenticación
  login,          // Función de login
  register,       // Función de registro
  logout,         // Función de logout
  updateUser,     // Actualizar datos del usuario
  isAuthenticated // Booleano de autenticación
} = useAuth();
```

### Uso del AuthContext

```javascript
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, logout } = useAuth();

  return (
    <div>
      <p>Hola, {user?.nombre}</p>
      <button onClick={logout}>Cerrar Sesión</button>
    </div>
  );
}
```

### Rutas Protegidas

Todas las rutas principales están protegidas con `ProtectedRoute`:

```javascript
// Si el usuario no está autenticado, redirige a /login
<ProtectedRoute>
  <AppLayout />
</ProtectedRoute>
```

## 📡 Servicios de API

### Importación

```javascript
// Importar servicios específicos
import { authService, userService, postService } from '../api';

// O importar todos
import * as api from '../api';
```

### authService

```javascript
// Login
const response = await authService.login(email, password);

// Registro
const response = await authService.register({
  nombre: 'Juan',
  apellido: 'Pérez',
  email: 'juan@email.com',
  password: 'password123',
  legajo: '12345',     // Opcional
  area: 'Sistemas',    // Opcional
  cargo: 'Developer'   // Opcional
});

// Obtener perfil actual
const profile = await authService.getProfile();

// Cambiar contraseña
await authService.changePassword(currentPassword, newPassword);

// Logout
authService.logout();
```

### userService

```javascript
// Buscar usuarios
const users = await userService.searchUsers('Juan');

// Obtener usuario por ID
const user = await userService.getUserById(userId);

// Actualizar perfil
await userService.updateProfile({
  nombre: 'Juan',
  apellido: 'Pérez'
});

// Subir avatar
await userService.uploadAvatar(file);
```

### postService

```javascript
// Crear publicación
await postService.createPost({
  contenido: 'Mi primera publicación',
  privacidad: 'publico',
  imagen: imageFile  // Opcional
});

// Obtener feed
const feed = await postService.getFeed(page, limit);

// Dar like
await postService.toggleLike(postId);

// Comentar
await postService.addComment(postId, 'Gran publicación!');

// Compartir
await postService.sharePost(postId, 'Compartiendo esto');
```

### friendshipService

```javascript
// Enviar solicitud de amistad
await friendshipService.sendFriendRequest(userId);

// Obtener amigos
const friends = await friendshipService.getFriends();

// Obtener solicitudes pendientes
const pending = await friendshipService.getPendingRequests();

// Aceptar solicitud
await friendshipService.acceptFriendRequest(requestId);

// Rechazar solicitud
await friendshipService.rejectFriendRequest(requestId);
```

### groupService

```javascript
// Obtener grupos
const groups = await groupService.getAllGroups({
  tipo: 'publico',      // Opcional
  categoria: 'Deportes' // Opcional
});

// Crear grupo
await groupService.createGroup({
  nombre: 'Mi Grupo',
  descripcion: 'Descripción del grupo',
  tipo: 'publico',
  categoria: 'Deportes'
});

// Unirse a grupo
await groupService.joinGroup(groupId);

// Salir de grupo
await groupService.leaveGroup(groupId);
```

### notificationService

```javascript
// Obtener notificaciones
const notifications = await notificationService.getAllNotifications();

// Obtener no leídas
const unread = await notificationService.getUnreadNotifications();

// Contar no leídas
const { count } = await notificationService.getUnreadCount();

// Marcar como leída
await notificationService.markAsRead(notificationId);

// Marcar todas como leídas
await notificationService.markAllAsRead();
```

### conversationService

```javascript
// Obtener conversaciones
const conversations = await conversationService.getAllConversations();

// Obtener conversación por ID
const conversation = await conversationService.getConversationById(id);

// Crear o obtener conversación con usuario
const conv = await conversationService.getOrCreateConversation(userId);

// Enviar mensaje
await conversationService.sendMessage(conversationId, 'Hola!');

// Marcar como leída
await conversationService.markAsRead(conversationId);
```

## 🔄 Interceptores de Axios

### Request Interceptor
Automáticamente agrega el token JWT a todas las peticiones:

```javascript
config.headers.Authorization = `Bearer ${token}`;
```

### Response Interceptor
Maneja errores globalmente:
- **401**: Redirige a login (token inválido/expirado)
- **403**: Error de permisos
- **404**: Recurso no encontrado
- **500**: Error del servidor

## 🎨 Componentes de Autenticación

### Login (`/login`)
- Validación de campos
- Manejo de errores
- Redirección automática después de login exitoso
- Link a registro

### Register (`/register`)
- Validación completa de formulario
- Campos institucionales opcionales (legajo, área, cargo)
- Confirmación de contraseña
- Link a login

### ProtectedRoute
- Verifica autenticación antes de renderizar
- Muestra loader durante verificación
- Redirige a login si no está autenticado

## 🔒 Almacenamiento Local

El sistema almacena en `localStorage`:
- `token`: JWT token de autenticación
- `user`: Datos del usuario en formato JSON

```javascript
// Obtener token
const token = localStorage.getItem('token');

// Obtener usuario
const user = JSON.parse(localStorage.getItem('user'));
```

## 🛣️ Rutas Disponibles

### Rutas Públicas
- `/login` - Página de inicio de sesión
- `/register` - Página de registro

### Rutas Protegidas (requieren autenticación)
- `/` - Home
- `/amigos` - Página de amigos
- `/Mis_grupos` - Lista de grupos
- `/Mis_grupos/:id` - Detalle de grupo
- `/Mi_iglesia` - Página de iglesia
- `/Mis_carpetas` - Carpetas
- `/Mis_carpetas/:id` - Detalle de carpeta

## 📊 Endpoints del Backend

### Autenticación (`/api/auth`)
- `POST /register` - Registro de usuario
- `POST /login` - Login
- `GET /profile` - Obtener perfil (protegido)
- `PUT /change-password` - Cambiar contraseña (protegido)

### Usuarios (`/api/usuarios`)
- `GET /` - Listar usuarios
- `GET /search` - Buscar usuarios
- `GET /:id` - Obtener usuario por ID
- `PUT /profile` - Actualizar perfil
- `PUT /avatar` - Subir avatar
- `DELETE /deactivate` - Desactivar cuenta

### Publicaciones (`/api/publicaciones`)
- `POST /` - Crear publicación
- `GET /feed` - Obtener feed
- `GET /user/:userId` - Publicaciones de usuario
- `POST /:id/like` - Dar/quitar like
- `POST /:id/comment` - Comentar
- `POST /:id/share` - Compartir

### Amistades (`/api/amistades`)
- `POST /request` - Enviar solicitud
- `POST /:id/accept` - Aceptar solicitud
- `POST /:id/reject` - Rechazar solicitud
- `GET /friends` - Listar amigos
- `GET /pending` - Solicitudes pendientes
- `DELETE /:friendId` - Eliminar amigo

### Grupos (`/api/grupos`)
- `GET /` - Listar grupos
- `GET /:id` - Detalle de grupo
- `POST /` - Crear grupo
- `POST /:id/join` - Unirse
- `POST /:id/leave` - Salir

### Notificaciones (`/api/notificaciones`)
- `GET /` - Listar notificaciones
- `GET /unread` - No leídas
- `GET /unread-count` - Contar no leídas
- `PUT /:id/read` - Marcar como leída

### Conversaciones (`/api/conversaciones`)
- `GET /` - Listar conversaciones
- `GET /:id` - Detalle de conversación
- `POST /:id/message` - Enviar mensaje
- `PUT /:id/read` - Marcar como leída

## 🐛 Manejo de Errores

Todos los servicios lanzan errores que puedes capturar:

```javascript
try {
  await postService.createPost(data);
} catch (error) {
  if (error.response) {
    // Error del servidor
    console.error(error.response.data.message);
  } else if (error.request) {
    // Sin respuesta del servidor
    console.error('No se pudo conectar con el servidor');
  } else {
    // Otro tipo de error
    console.error(error.message);
  }
}
```

## 📝 Ejemplo de Integración Completa

```javascript
import { useState, useEffect } from 'react';
import { postService } from '../api';
import { useAuth } from '../context/AuthContext';

function Feed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeed();
  }, []);

  const loadFeed = async () => {
    try {
      setLoading(true);
      const response = await postService.getFeed(1, 10);
      setPosts(response.posts);
    } catch (error) {
      console.error('Error cargando feed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      await postService.toggleLike(postId);
      // Recargar feed o actualizar estado local
      loadFeed();
    } catch (error) {
      console.error('Error al dar like:', error);
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      <h2>Hola, {user.nombre}!</h2>
      {posts.map(post => (
        <div key={post._id}>
          <p>{post.contenido}</p>
          <button onClick={() => handleLike(post._id)}>
            👍 {post.likes?.length || 0}
          </button>
        </div>
      ))}
    </div>
  );
}
```

## 🔍 Próximos Pasos

Para completar la integración, considera:

1. **Actualizar componentes existentes** para usar datos reales del backend
2. **Implementar Socket.io** para chat en tiempo real
3. **Agregar manejo de errores** más robusto en componentes
4. **Implementar paginación** en listas largas
5. **Agregar estados de carga** en todas las acciones
6. **Implementar caché** para mejorar rendimiento
7. **Agregar tests** para servicios y componentes

## 📞 Soporte

Si encuentras problemas:
1. Verifica que el backend esté corriendo en el puerto 3000
2. Revisa la consola del navegador para errores
3. Verifica las variables de entorno
4. Asegúrate de que MongoDB esté corriendo
5. Revisa los logs del servidor backend

## 📄 Licencia

Este proyecto es parte de Degader Social V2.

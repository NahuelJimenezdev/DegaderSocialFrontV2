# 🐛 Bug Fix: Error 401 en Búsqueda de Usuarios

**Fecha:** 6 de Noviembre, 2025
**Estado:** ✅ RESUELTO

---

## 🔍 Problema

Al intentar buscar usuarios en el SearchBar, se recibía un error **401 Unauthorized**:

```
GET http://localhost:3001/api/buscar?q=danie 401 (Unauthorized)
```

A pesar de:
- ✅ Usuario autenticado correctamente
- ✅ Backend funcionando
- ✅ Endpoint `/api/buscar` configurado
- ✅ Middleware de autenticación correcto

---

## 🎯 Causa Raíz

**Inconsistencia en la clave de localStorage para el token JWT**

### SearchBar.jsx (INCORRECTO)
```javascript
const token = localStorage.getItem('authToken'); // ❌ Busca 'authToken'
```

### authService.js (CORRECTO)
```javascript
localStorage.setItem('token', response.data.data.token); // ✅ Guarda como 'token'
```

**Resultado:** El SearchBar buscaba un token que no existía, por lo que siempre enviaba la petición sin el header `Authorization`, causando el error 401.

---

## ✅ Solución Aplicada

**Archivo modificado:** `src/features/buscador/components/SearchBar.jsx`

**Línea 41:**
```javascript
// ANTES
const token = localStorage.getItem('authToken');

// DESPUÉS
const token = localStorage.getItem('token');
```

---

## 📊 Comparación: Funcional vs V2

| Aspecto | Backend Funcional | Backend V2 | Frontend V2 (ANTES) | Frontend V2 (AHORA) |
|---------|------------------|------------|---------------------|---------------------|
| **Token key** | `authToken` | `token` | `authToken` ❌ | `token` ✅ |
| **Endpoint** | `/api/buscar` | `/api/buscar` | `/api/buscar` | `/api/buscar` |
| **Middleware** | `verifyToken` | `authenticate` | N/A | N/A |

---

## 🔐 Cómo Funciona Ahora

### 1. **Login/Register**
```javascript
// authService.js
localStorage.setItem('token', response.data.data.token);
localStorage.setItem('user', JSON.stringify(response.data.data.user));
```

### 2. **SearchBar busca usuarios**
```javascript
// SearchBar.jsx
const token = localStorage.getItem('token'); // ✅ Ahora coincide
```

### 3. **Request HTTP**
```javascript
fetch('http://localhost:3001/api/buscar?q=danie', {
  headers: {
    Authorization: `Bearer ${token}`,  // ✅ Token válido
    'Content-Type': 'application/json'
  }
})
```

### 4. **Backend valida token**
```javascript
// auth.middleware.js
const token = authHeader.substring(7); // Remover 'Bearer '
const decoded = jwt.verify(token, process.env.JWT_SECRET); // ✅ Válido
const user = await User.findById(decoded.userId); // ✅ Usuario encontrado
req.user = user; // ✅ Usuario agregado al request
```

### 5. **Búsqueda ejecutada**
```javascript
// search.routes.js
const usuarios = await Usuario.find({
  $or: [
    { nombre: { $regex: q, $options: 'i' } },
    { apellido: { $regex: q, $options: 'i' } },
    { email: { $regex: q, $options: 'i' } }
  ]
}).limit(10);
```

---

## 🧪 Verificación

### ✅ Antes de la corrección:
```javascript
localStorage.getItem('token')      // → "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
localStorage.getItem('authToken')  // → null ❌
```

### ✅ Después de la corrección:
```javascript
localStorage.getItem('token')      // → "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." ✅
// SearchBar usa la clave correcta
```

---

## 🎯 Lecciones Aprendidas

### 1. **Estandarización de Claves**
Mantener consistencia en las claves de localStorage a lo largo de toda la aplicación:

**Recomendación:**
```javascript
// constants.js
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme'
};

// Uso
localStorage.setItem(STORAGE_KEYS.TOKEN, token);
localStorage.getItem(STORAGE_KEYS.TOKEN);
```

### 2. **Debugging de Autenticación**
Pasos para diagnosticar errores 401:
1. ✅ Verificar que el token exista: `localStorage.getItem('token')`
2. ✅ Verificar que el token se envíe: Revisar headers en DevTools → Network
3. ✅ Verificar que el token sea válido: Decodificar en jwt.io
4. ✅ Verificar que el middleware funcione: Logs del backend

### 3. **Diferencias entre Proyectos**
Al migrar código entre proyectos, verificar:
- Nombres de variables
- Claves de localStorage
- Estructuras de respuesta del backend
- Nombres de campos en modelos

---

## 📝 Archivos Afectados

### Modificados:
- ✅ `src/features/buscador/components/SearchBar.jsx` (línea 41)

### Revisados (sin cambios):
- ✅ `src/api/authService.js` (correcto)
- ✅ `src/context/AuthContext.jsx` (correcto)
- ✅ `src/middleware/auth.middleware.js` (correcto - backend)
- ✅ `src/routes/search.routes.js` (correcto - backend)

---

## ✅ Estado Final

- ✅ **SearchBar funciona correctamente**
- ✅ **Token se lee correctamente**
- ✅ **Búsqueda de usuarios operativa**
- ✅ **Error 401 resuelto**
- ✅ **Consistencia en localStorage**

---

## 🚀 Para Probar

1. **Iniciar sesión** en la aplicación
2. **Abrir DevTools** → Console
3. **Verificar token:**
   ```javascript
   localStorage.getItem('token')
   // Debe devolver un string largo (JWT)
   ```
4. **Buscar un usuario** en el SearchBar (mínimo 2 caracteres)
5. **Ver resultados** en el dropdown
6. **No debería aparecer error 401** en la consola

---

**Problema resuelto por:** Claude Code
**Tiempo de resolución:** Identificado y corregido
**Impacto:** Funcionalidad de búsqueda completamente restaurada

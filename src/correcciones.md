# Correcciones de Compatibilidad con UserV2

Este documento detalla las correcciones necesarias en el frontend para asegurar la compatibilidad con el nuevo modelo de usuario (`UserV2`) del backend.

## 1. Mensajes (MensajesPage.jsx)
- **Ubicación:** `src/features/mensajes/pages/MensajesPage.jsx`
- **Problema:** Se accede a propiedades antiguas del usuario (`nombre`, `apellido`, `avatar`) al renderizar la lista de conversaciones y el header del chat.
- **Corrección:** Actualizar los accesos para usar la nueva estructura anidada:
    - `otro.nombre` -> `otro.nombres?.primero`
    - `otro.apellido` -> `otro.apellidos?.primero`
    - `otro.avatar` -> `otro.social?.fotoPerfil`
    - **Nota:** Asegurarse de usar el helper `getAvatarUrl` para el avatar.

## 2. Tarjeta de Amigo (FriendCard.jsx)
- **Ubicación:** `src/features/amigos/components/FriendCard.jsx`
- **Problema:** El componente está diseñado para recibir props planas (`name`, `avatar`) que no coinciden con la estructura del objeto de usuario real. Actualmente funciona porque `FriendsList` le pasa datos falsos (mock).
- **Corrección:**
    - Modificar el componente para aceptar un prop `user` (objeto completo).
    - Renderizar nombre: `${user.nombres?.primero} ${user.apellidos?.primero}`.
    - Renderizar avatar: `user.social?.fotoPerfil`.

## 3. Lista de Amigos (FriendsList.jsx)
- **Ubicación:** `src/features/amigos/components/FriendsList.jsx`
- **Problema:** Utiliza un array de datos falsos (`mockFriends`) hardcodeado.
- **Corrección:**
    - Implementar la llamada a la API para obtener la lista real de amigos del usuario.
    - Mapear la respuesta de la API (que vendrá con estructura `UserV2`) al componente `FriendCard`.

## 4. Sidebar de Correo (MailSidebar.jsx)
- **Ubicación:** `src/features/mail/components/MailSidebar.jsx`
- **Problema:** La imagen de perfil (avatar) tiene una URL hardcodeada de Google.
- **Corrección:**
    - Importar el hook `useAuth`.
    - Obtener el usuario actual.
    - Usar `user.social?.fotoPerfil` para el background image del avatar.

## 5. Página de Iglesia (IglesiaPage.jsx)
- **Ubicación:** `src/features/iglesias/pages/IglesiaPage.jsx`
- **Problema:** La sección "Directorio de Miembros" y la información del usuario institucional son datos estáticos (mock).
- **Corrección:**
    - Conectar con el endpoint de miembros de la iglesia (si existe) o usar los datos del usuario real para la sección de información institucional.
    - Renderizar los nombres y cargos dinámicamente.

## 6. Grupos (GruposPages.jsx)
- **Ubicación:** `src/features/grupos/pages/GruposPages.jsx`
- **Observación:** Parece manejar la lógica de miembros correctamente usando `member.usuario?._id || ...`, pero se debe verificar que al mostrar información de miembros (si se implementa en el futuro) se use la estructura nueva. Actualmente solo muestra conteos.

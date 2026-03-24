// Scripts del Service Worker de Firebase para notificaciones en segundo plano
importScripts('https://www.gstatic.com/firebasejs/9.1.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.1.1/firebase-messaging-compat.js');

// ⚠️ NOTA: El usuario DEBE actualizar estos valores con su config real
// si no se inyectan dinámicamente durante el build.
// Configuración de Firebase (Extraída de .env de producción)
firebase.initializeApp({
  apiKey: "AIzaSyDv8GgqpaFJEGt-O-jPBzRhJdzt8MpkofE",
  authDomain: "degader-social.firebaseapp.com",
  projectId: "degader-social",
  storageBucket: "degader-social.firebasestorage.app",
  messagingSenderId: "680531037245",
  appId: "1:680531037245:web:a6b8d931bcb267476eee54"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('📬 [SW] Mensaje en segundo plano recibido:', payload);
    
    // Extraer datos
    const notificationTitle = payload.notification?.title || 'Nuevo mensaje';
    const notificationOptions = {
        body: payload.notification?.body || 'Presiona para ver el contenido',
        icon: '/favicon-96x96.png',
        badge: '/favicon-96x96.png',
        data: payload.data,
        tag: payload.data?.notificationId || 'chat-msg', // Agrupar notificaciones
        renotify: true
    };

    console.log('🔔 [SW] Mostrando notificación:', notificationTitle);
    return self.registration.showNotification(notificationTitle, notificationOptions);
});

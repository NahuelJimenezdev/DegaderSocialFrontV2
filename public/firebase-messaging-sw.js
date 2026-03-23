// Scripts del Service Worker de Firebase para notificaciones en segundo plano
importScripts('https://www.gstatic.com/firebasejs/9.1.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.1.1/firebase-messaging-compat.js');

// ⚠️ NOTA: El usuario DEBE actualizar estos valores con su config real
// si no se inyectan dinámicamente durante el build.
firebase.initializeApp({
    apiKey: "__VITE_FIREBASE_API_KEY__",
    authDomain: "__VITE_FIREBASE_AUTH_DOMAIN__",
    projectId: "__VITE_FIREBASE_PROJECT_ID__",
    storageBucket: "__VITE_FIREBASE_STORAGE_BUCKET__",
    messagingSenderId: "__VITE_FIREBASE_MESSAGING_SENDER_ID__",
    appId: "__VITE_FIREBASE_APP_ID__"
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

// Scripts del Service Worker de Firebase para notificaciones en segundo plano
importScripts('https://www.gstatic.com/firebasejs/9.1.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.1.1/firebase-messaging-compat.js');

// ⚠️ NOTA: El usuario DEBE actualizar estos valores con su config real
// si no se inyectan dinámicamente durante el build.
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
    console.log('[firebase-messaging-sw.js] Mensaje en segundo plano recibido:', payload);
    
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/favicon-96x96.png', // Ruta absoluta al favicon
        data: payload.data
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

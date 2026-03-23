// Configuración de Firebase para Push Notifications (Frontend)
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import api from '../../api/config';

// ⚠️ NOTA: Estos valores deben venir de variables de entorno (VITE_...)
// Si no están configurados, el sistema fallará silenciosamente o registrará advertencia.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

console.log('🔰 [FIREBASE_CONFIG] Checking keys presence:');
console.log('   - project_id:', firebaseConfig.projectId);
console.log('   - sender_id:', firebaseConfig.messagingSenderId);
console.log('   - vapid_key:', VAPID_KEY ? `PRESENT (Length: ${VAPID_KEY.length})` : 'MISSING');

let messaging = null;

try {
  console.log('📡 [FIREBASE_INIT] Intentando inicializar con apiKey:', firebaseConfig.apiKey ? 'PRESENTE' : 'AUSENTE');
  if (firebaseConfig.apiKey) {
    const app = initializeApp(firebaseConfig);
    messaging = getMessaging(app);
    console.log('✅ [FIREBASE_INIT] Messaging inicializado correctamente');
  } else {
    console.error('❌ [FIREBASE_INIT] No se pudo inicializar: VITE_FIREBASE_API_KEY es nulo o indefinido');
  }
} catch (error) {
  console.error('❌ Error al inicializar Firebase:', error);
}

// Generar o recuperar un ID único persistente para este dispositivo físico
const getDeviceId = () => {
  let deviceId = localStorage.getItem('fcm_device_id');
  if (!deviceId) {
    deviceId = crypto.randomUUID?.() || Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem('fcm_device_id', deviceId);
  }
  return deviceId;
};

// Detectar si la app corre en modo PWA (standalone)
const isStandalone = () => {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone || document.referrer.includes('android-app://');
};

export const requestFirebaseToken = async (userId) => {
  console.log('🔔 [FCM] Intentando obtener token para usuario:', userId);
  if (!messaging) {
    console.warn('⚠️ [FCM] Messaging no inicializado, cancelando solicitud.');
    return null;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('⚠️ Permiso de notificación denegado');
      return null;
    }

    const token = await getToken(messaging, { vapidKey: VAPID_KEY });
    if (token) {
      console.log('🔥 FCM Token obtenido:', token);
      
      const deviceId = getDeviceId();
      const isPWA = isStandalone();

      // Registrar el token en el backend con metadata de deduplicación
      await api.post('/notificaciones/register-token', {
        token,
        deviceId,
        isPWA,
        platform: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? 'android' : 'web'
      });
      
      return token;
    }
  } catch (error) {
    console.error('❌ Error al obtener token FCM:', error);
    if (error.code === 'messaging/token-subscribe-failed') {
      console.error('🛡️ Tip: Verifica que tu VAPID_KEY sea correcta y que el Service Worker esté sincronizado.');
    }
  }
  return null;
};

export const onMessageListener = (callback) => {
  if (!messaging) return () => {};
  return onMessage(messaging, callback);
};

export default messaging;

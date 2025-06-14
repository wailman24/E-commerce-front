importScripts("https://www.gstatic.com/firebasejs/10.11.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.11.0/firebase-messaging-compat.js");

// Initialize Firebase in the Service Worker
firebase.initializeApp({
  apiKey: "AIzaSyCZ3x5w7egYzw-glf9Rte1mJduC9nfk2uE",
  authDomain: "e-commerce-wail.firebaseapp.com",
  projectId: "e-commerce-wail",
  storageBucket: "e-commerce-wail.firebasestorage.app",
  messagingSenderId: "269077068091",
  appId: "1:269077068091:web:ac2c8ef7d2888ccdbcdf1e",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("[firebase-messaging-sw.js] Received background message ", payload);
  const { title, body } = payload.notification;

  self.registration.showNotification(title, {
    body,
    //icon: "/logo192.png", // Or your app logo
  });
});

importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

const firebaseConfig = {
    apiKey: "AIzaSyCgMTIxR4XvDbsbcnI-PSujI_F2FGgjBNQ",
    authDomain: "pgt-capton2.firebaseapp.com",
    projectId: "pgt-capton2",
    storageBucket: "pgt-capton2.appspot.com",
    messagingSenderId: "670609171389",
    appId: "1:670609171389:web:a75d0682ff10681980a8d4"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getStorage } from "firebase/storage";
// const firebaseConfig = {
//     apiKey: "AIzaSyCgMTIxR4XvDbsbcnI-PSujI_F2FGgjBNQ",
//     authDomain: "pgt-capton2.firebaseapp.com",
//     projectId: "pgt-capton2",
//     storageBucket: "pgt-capton2.appspot.com",
    
//     messagingSenderId: "670609171389",
//     appId: "1:670609171389:web:a75d0682ff10681980a8d4"
// };

const firebaseConfig = {
    apiKey: "AIzaSyDvPZ-ME9NtX5STf9re9HV9cybfSYrpFp4",
    authDomain: "hint-20c72.firebaseapp.com",
    projectId: "hint-20c72",
    storageBucket: "hint-20c72.appspot.com",
    messagingSenderId: "492885275134",
    appId: "1:492885275134:web:373b00370c9754af1410af",
    measurementId: "G-ZQG00BZJSW"
  };

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
export const requestPermission = () => {
    Notification.requestPermission()?.then(permission => {
        if (permission === "granted") {
            return getToken(messaging, {
                vapidKey:
                    "BEPxT7Jx0dplDmfyXeBOMsaD8NLUmC-pcxQ_PJGgLjLhTLF0g6AqC3DgLT8IU8Fj8sjRQQtbylyRLyv-p-XSpGs",
            })
                ?.then(currentToken => {
                    if (currentToken) {
                        console.log('Client Token: ', currentToken);
                    }
                    else {
                        console.log("Không tạo được token");
                    }
                })
                ?.catch(err => {
                    console.log("Error tạo Token", err);
                });
        } else {
            console.log("Quyền gửi thông báo bị từ chối");
        }
    });
}
// requestPermission();
export const onMessageListener = () => {
    new Promise(resolve => onMessage(messaging, payload => {
        resolve(payload);
    }))
}
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);


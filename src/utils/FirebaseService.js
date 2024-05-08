import { FieldValue, addDoc, collection,  getDocs, query, serverTimestamp, where, writeBatch } from "firebase/firestore";
import { auth, db, storage } from "../firebase.jsx";
import { v4 } from "uuid";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";


export function uploadFirebase(file) {
    return new Promise((resolve, reject) => {
        if (!file) {
            console.log('No file selected.');
            reject(new Error('No file selected.'));
            return;
        }

        const uniqueFileName = `${v4()}_${file.name}`;
        const imageRef = ref(storage, `avatar/${uniqueFileName}`);

        uploadBytes(imageRef, file).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((downloadURL) => {
                resolve(downloadURL);
            }).catch((error) => {
                console.error('Error getting download URL:', error);
                reject(error);
            });
        }).catch((error) => {
            console.error('Error uploading file:', error);
            reject(error);
        });
    });
}

export const createNotification = async (data) => {
    // type :
    // 1 : BS có yêu cầu booking mới 
    // 2 : BS chấp nhận yêu cầu booking
    // 3 : Bạn đã chấp nhận yêu cầu booking
    // 4 : doctor từ chối yêu cầu booking
    // 5 : hoàn thành  lượt khám
    // 5 : trưởng khoa chấp nhận yêu cầu tạo ca
    // 6 : trưởng khoa từ chối yêu cầu tạo ca
    const {
        fromId = 0,
        toId = 0,
        type = 0,
        fullName = '',
        body = '',
        action_id = 0,
    } = data
    let titleNoti = ''
    let path = ''
    switch (type) {
        case 1:
            titleNoti = 'Bạn có lượt khám mới, vui lòng xác nhận!'
            path = '/appointments'
            break;
        case 2:
            titleNoti = 'Bác sĩ ' + fullName + ' đã xác nhận lượt khám của bạn!'
            path = '/appointments'
            break;
        case 3:
            titleNoti = 'Bạn vừa xác nhận lượt khám của bệnh nhân ' + fullName + ' thành công!'
            path = '/appointments'
            break;
        case 4:
            titleNoti = 'Bác sĩ ' + fullName + ' đã từ chối lượt khám của bạn!'
            path = '/appointments'
            break;
        case 5:
            titleNoti = 'Bạn vừa từ chối lượt khám của bệnh nhân ' + fullName + '!'
            path = '/appointments'
            break;
        case 6:
            titleNoti = 'Bác sĩ ' + fullName + ' đã xác thực hoàn thành lượt khám, vui lòng đánh giá về chất lương dịch vụ cũng như chất lượng bác sĩ!'
            path = '/appointments'
            break;
        case 7:
            titleNoti = 'Bạn vừa xác nhận hoàn thành lượt khám của bệnh nhân ' + fullName + '!'
            path = '/appointments'
            break;
        case 8:
            titleNoti = 'Hoàn thành lượt khám, vui lòng đánh giá cho bác sĩ!'
            path = '/appointments'
            break;

        default:
            break;
    }
    try {
        await addDoc(collection(db, "notifications"), {
            fromId,
            toId,
            type,
            title: titleNoti,
            path,
            body,
            action_id,
            createdAt: serverTimestamp(),
            read: false,
            id: v4().slice(0, 9),
        });
    } catch (e) {
        console.error("Lỗi khi tạo thông báo: ", e);
    }
};


export const updateReadNotification = async (id) => {
    const notificationsQuery = query(
        collection(db, "notifications"),
        where("toId", "==", id),
        where("read", "==", false)
    );
    try {
        const querySnapshot = await getDocs(notificationsQuery);
        const batch = writeBatch(db);

        querySnapshot.forEach((doc) => {
            batch.update(doc.ref, { read: true });
        });
        await batch.commit();
    } catch (e) {
    }
}
/////////////////////////

// đăng post 
/////////////////////////
/////////////////////////
export function createPost(data) {
    const { userId, fullName, imageUrl, } = data

    return db.collection("posts").add({
        userId: userId,
        userName: fullName,
        imageUrl: imageUrl,
        likes: 0,
        commentsCount: 0,
        createdAt: serverTimestamp(),

    });
}
export function likePost(postId, userId) {
    return db.collection("posts").doc(postId).collection("likes").doc(userId).set({
        likedAt: new Date()
    });
}
export function addComment(postId, userId, content) {
    return db.collection("posts").doc(postId).collection("  ").add({
        userId: userId,
        content: content,
        createdAt: serverTimestamp(),
    }).then(() => {
        return db.collection("posts").doc(postId).update({
            commentsCount: FieldValue.increment(1)
        });
    });
}

export function getPost(postId) {
    return db.collection("posts").doc(postId).get();
}

export function getComments(postId) {
    return db.collection("posts").doc(postId).collection("comments").orderBy("createdAt", "desc").get();
}

export function unlikePost(postId, userId) {
    return db.collection("posts").doc(postId).collection("likes").doc(userId).delete();
}

export function getAllPosts(limit, lastPost) {
    let query = db.collection("posts").orderBy("createdAt", "desc");

    if (lastPost) {
        query = query.startAfter(lastPost.data().createdAt);
    }

    if (limit) {
        query = query.limit(limit);
    }

    return query.get();
}

/////////////////////////
/////////////////////////

export const validatePhoneNumberOtp = async () => {
    if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(
            "recaptcha-container",
            {
                size: "invisible",
                callback: (response) => {
                    // onSignUpPhoneNumberOtp();
                },
                "expired-callback": () => { },
            },
            auth
        );
    }
}

export const onSignUpPhoneNumberOtp = async (phone) => {
    // validatePhoneNumberOtp();
    const appVerifier = window.recaptchaVerifier;
    const formatPh = '+' + phone;
    signInWithPhoneNumber(auth, formatPh, appVerifier)
        .then((confirmationResult) => {
            console.log("🚀 ~ .then ~ confirmationResult:", confirmationResult)
            window.confirmationResult = confirmationResult;
        })
        .catch((error) => {
            console.log(error);
        });
}
// export const sendMessage = async (firstUserId, secondUserId, firstName, secondName, firstAvatar, secondAvatar, message, userId) => {
//     const chatId = `${firstUserId}_${secondUserId}`;
//     const chatId2 = `${secondUserId}_${firstUserId}`;

//     // Check if the chat already exists
//     const chatQuery = query(collection(db, "chats"), where("chatId", "==", chatId));
//     const chatQuery2 = query(collection(db, "chats"), where("chatId", "==", chatId2));
//     const chatQuerySnapshot = await getDocs(chatQuery);
//     const chatQuerySnapshot2 = await getDocs(chatQuery2);

//     if (!chatQuerySnapshot.empty || !chatQuerySnapshot2.empty) {
//         await sendNewMessageToExistingUser(chatId, firstUserId, secondUserId, message, userId);
//     }
//     else {
//         await sendNewMessageToNewUser(firstUserId, secondUserId, firstName, secondName, firstAvatar, secondAvatar, message, userId);
//     }
// };


// export const sendNewMessageToNewUser = async (firstUserId, secondUserId, firstName, secondName, firstAvatar, secondAvatar, message, userId) => {
//     // Create a new chat document in the "chat" collection
//     await addDoc(collection(db, "chats"), {
//         chatId: `${firstUserId}_${secondUserId}`,
//         firstUserId: Number(firstUserId),
//         secondUserId: Number(secondUserId),
//         firstName: firstName,
//         secondName: secondName,
//         firstAvatar: firstAvatar,
//         secondAvatar: secondAvatar,
//         createdAt: serverTimestamp(),
//         updatedAt: serverTimestamp(),
//         lastMessage: message,
//         read: false,
//         userSendId: userId,
//     });

//     // Send a new message to the newly created chat
//     await addDoc(collection(db, "messages"), {
//         chatId: `${firstUserId}_${secondUserId}`, // This should be the document ID, not the document reference
//         senderId: firstUserId,
//         message: message,
//         createdAt: serverTimestamp(),
//         updatedAt: serverTimestamp(),
//         read: false,
//     });
// };

// export const sendNewMessageToExistingUser = async (chatId, userId, recipientUserId, message, userSendId) => {

//     const chatQuery = query(collection(db, "chats"), where("chatId", "==", chatId));
//     const chatQuerySnapshot = await getDocs(chatQuery);

//     chatQuerySnapshot.forEach(async (doc) => {
//         const existingChatDocRef = doc.ref;
//         // Update the specific chat with the provided chatId
//         await updateDoc(existingChatDocRef, {
//             read: false,
//             lastMessage: message,
//             updatedAt: serverTimestamp(),
//             userSendId: userSendId,
//         });
//     });

//     await addDoc(collection(db, "messages"), {
//         chatId: chatId,
//         senderId: userId,
//         message: message,
//         createdAt: serverTimestamp(),
//         updatedAt: serverTimestamp(),
//         read: false,
//     });
// };

// export const getMessagesForChat = (chatId, callback) => {
//     // Check if chatId is defined before creating the query
//     if (chatId) {
//         const q = query(
//             collection(db, "messages"),
//             where("chatId", "==", chatId)
//         );

//         const unsubscribe = onSnapshot(q, (querySnapshot) => {
//             const messages = [];
//             querySnapshot.forEach((doc) => {
//                 messages.push({ id: doc.id, ...doc.data() });
//             });

//             // Sort messages by createdAt in descending order
//             messages.sort((a, b) => a.createdAt - b.createdAt);

//             callback(messages);
//         });

//         return unsubscribe; // Return the unsubscribe function
//     } else {
//         return () => { }; // Return a dummy unsubscribe function if chatId is undefined
//     }
// };      

import { addDoc, collection, getDocs, onSnapshot, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { db } from "../firebase";

export const createNotification = async (
    toUserId,
    type,
    action_id,
    title,
    body,
    user_id,
    hint_id,
) => {
    // type :
    // 1 : có yêu cầu booking mới 
    // 2 : hint chấp nhận / từ chối yêu cầu booking
    // 3 : admin  chấp nhận yêu cầu pgt
    // 4 : admin  từ chối  yêu cầu pgt
    // 5 : hoàn thành  yêu cầu pgt
    // 6 : user thanh toán thành công  yêu cầu pgt
    try {
        await addDoc(collection(db, "notifications"), {
            toUserId: toUserId,
            title: title,
            body: body,
            createdAt: serverTimestamp(),
            type: type,
            action_id: action_id,
            read: false,
            hint_id: hint_id ?? 0,
            user_id: user_id ?? 0,
        });
    } catch (e) {
        console.error("Lỗi khi tạo thông báo: ", e);
    }
};

export const sendMessage = async (firstUserId, secondUserId, firstName, secondName, firstAvatar, secondAvatar, message, userId) => {
    const chatId = `${firstUserId}_${secondUserId}`;
    const chatId2 = `${secondUserId}_${firstUserId}`;

    // Check if the chat already exists
    const chatQuery = query(collection(db, "chats"), where("chatId", "==", chatId));
    const chatQuery2 = query(collection(db, "chats"), where("chatId", "==", chatId2));
    const chatQuerySnapshot = await getDocs(chatQuery);
    const chatQuerySnapshot2 = await getDocs(chatQuery2);

    if (!chatQuerySnapshot.empty || !chatQuerySnapshot2.empty) {
        await sendNewMessageToExistingUser(chatId, firstUserId, secondUserId, message, userId);
    }
    else {
        await sendNewMessageToNewUser(firstUserId, secondUserId, firstName, secondName, firstAvatar, secondAvatar, message, userId);
    }
};


export const sendNewMessageToNewUser = async (firstUserId, secondUserId, firstName, secondName, firstAvatar, secondAvatar, message, userId) => {
    // Create a new chat document in the "chat" collection
    await addDoc(collection(db, "chats"), {
        chatId: `${firstUserId}_${secondUserId}`,
        firstUserId: Number(firstUserId),
        secondUserId: Number(secondUserId),
        firstName: firstName,
        secondName: secondName,
        firstAvatar: firstAvatar,
        secondAvatar: secondAvatar,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastMessage: message,
        read: false,
        userSendId: userId,
    });

    // Send a new message to the newly created chat
    await addDoc(collection(db, "messages"), {
        chatId: `${firstUserId}_${secondUserId}`, // This should be the document ID, not the document reference
        senderId: firstUserId,
        message: message,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        read: false,
    });
};

export const sendNewMessageToExistingUser = async (chatId, userId, recipientUserId, message, userSendId) => {

    const chatQuery = query(collection(db, "chats"), where("chatId", "==", chatId));
    const chatQuerySnapshot = await getDocs(chatQuery);

    chatQuerySnapshot.forEach(async (doc) => {
        const existingChatDocRef = doc.ref;
        // Update the specific chat with the provided chatId
        await updateDoc(existingChatDocRef, {
            read: false,
            lastMessage: message,
            updatedAt: serverTimestamp(),
            userSendId: userSendId,
        });
    });

    await addDoc(collection(db, "messages"), {
        chatId: chatId,
        senderId: userId,
        message: message,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        read: false,
    });
};

export const getMessagesForChat = (chatId, callback) => {
    // Check if chatId is defined before creating the query
    if (chatId) {
        const q = query(
            collection(db, "messages"),
            where("chatId", "==", chatId)
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const messages = [];
            querySnapshot.forEach((doc) => {
                messages.push({ id: doc.id, ...doc.data() });
            });

            // Sort messages by createdAt in descending order
            messages.sort((a, b) => a.createdAt - b.createdAt);

            callback(messages);
        });

        return unsubscribe; // Return the unsubscribe function
    } else {
        return () => { }; // Return a dummy unsubscribe function if chatId is undefined
    }
};      
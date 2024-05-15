import { addDoc, collection, getDocs, query, serverTimestamp, where, writeBatch } from "firebase/firestore";
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
                reject(error);
            });
        }).catch((error) => {
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
export const addComment = async (data) => {
    const { postId, desId, userId, userName, content, avatar } = data;
    try {
        const commentsRef = collection(db, "comments");
        const timestamp = serverTimestamp();
        let newData = {
            userId: userId,
            userName: userName,
            content: content,
            avatar: avatar,
            createdAt: timestamp
        }
        if (postId) {
            newData.postId = parseInt(postId)
        }
        if (desId) {
            newData.desId = parseInt(desId)
        }
        await addDoc(commentsRef, newData);
    } catch (error) {
        throw error; // Ném ra lỗi để có thể xử lý ở nơi gọi hàm nếu cần
    }
};

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
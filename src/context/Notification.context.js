import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { AuthContext } from './auth.context';
export const NotificationContext = createContext();
export const NotificationProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);

    const compareTimestamps = (a, b) => b.createdAt?.toDate().getTime() - a.createdAt?.toDate().getTime();
    // Hàm để bắt đầu lắng nghe thay đổi đối với collection 'notifications'
    const startNotificationListener = useCallback(() => {
        // Đảm bảo người dùng đã đăng nhập và có đối tượng user
        if (user) {
            // const notificationsQuery = query(
            //     collection(db, "notifications"),
            //     where("toUserId", "==", parseInt(user.id)),
            //     // orderBy("createdAt", "desc") // Sắp xếp từ mới đến cũ
            // );
            // // Lắng nghe thay đổi và cập nhật state
            // return onSnapshot(notificationsQuery, (querySnapshot) => {
            //     const updatedNotifications = querySnapshot.docs.map(doc => ({
            //         ...doc.data(),
            //         id: doc.id
            //     }));
            //     const sortedNotifications = updatedNotifications.sort(compareTimestamps);
            //     setNotifications(sortedNotifications);
            // });
        } else {
            setNotifications([]);
            return undefined;
        }
    }, [user]);

    // Gọi hàm lắng nghe khi user hoặc auth.currentUser thay đổi
    useEffect(() => {
        const unsubscribe = startNotificationListener();
        // Dọn dẹp listener khi component unmount hoặc query thay đổi
        return () => unsubscribe && unsubscribe();
    }, [startNotificationListener]);

    const value = {
        notifications,
    };
    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};

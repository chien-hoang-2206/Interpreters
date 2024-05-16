// import React, { createContext, useEffect, useState, useContext, useCallback } from "react";
// import { AuthContext } from "./auth.context";
// import { collection, getDocs, onSnapshot, orderBy, query, where } from "firebase/firestore";
// import { db } from "../firebase";

// export const MessageContext = createContext();

// export const MessageProvider = ({ children }) => {
//   const { user } = useContext(AuthContext);
//   const [messengerList, setMessengerList] = useState([]);
//   const [refreshMessengerList, setRefreshMessengerList] = useState(false);
//   const userId = Number(user?.id);

//   const startMessengerListListener = useCallback(() => {
//     if (user) {
//       const messagesRef = collection(db, "chats");

//       const firstUserMessagesQuery = query(
//         messagesRef,
//         where("firstUserId", "==", userId)
//       );

//       const secondUserMessagesQuery = query(
//         messagesRef,
//         where("secondUserId", "==", userId)
//       );

//       Promise.all([
//         getDocs(firstUserMessagesQuery),
//         getDocs(secondUserMessagesQuery),
//       ]).then(([firstUserMessages, secondUserMessages]) => {
//         const combinedMessages = [];

//         firstUserMessages.forEach((doc) => {
//           combinedMessages.push({ ...doc.data(), id: doc.id });
//         });

//         secondUserMessages.forEach((doc) => {
//           combinedMessages.push({ ...doc.data(), id: doc.id });
//         });


//         const sortedMessages = combinedMessages.sort((a, b) => b?.updatedAt?.seconds - a?.updatedAt?.seconds);
//         setMessengerList(sortedMessages);
//       });

//     } else {
//       setMessengerList([]);
//       return undefined;
//     }
//   }, [userId, refreshMessengerList]);

//   const reloadMessengerList = () => {
//     // Set the state to trigger the useEffect and reload the list
//     setRefreshMessengerList((prev) => !prev);
//   };

//   useEffect(() => {
//     const unsubscribe = startMessengerListListener();

//     // Set up interval to call reloadMessengerList every 5 seconds
//     const intervalId = setInterval(() => {
//       reloadMessengerList();
//     }, 100000);

//     // Clean up the interval when the component is unmounted
//     return () => {
//       clearInterval(intervalId);
//       unsubscribe && unsubscribe();
//     };
//   }, [startMessengerListListener, reloadMessengerList]);
//   const value = {
//     messengerList,
//     reloadMessengerList,
//   };

//   return (
//     <MessageContext.Provider value={value} >
//       {children}
//     </MessageContext.Provider>
//   );
// };


import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { collection, doc, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { createContext } from 'react';
import { AuthContext } from './auth.context';
import { db } from '../firebase';

export const MessageContext = createContext();


export const MessageProvider = ({ children }) => {
  const [messengerList, setMessengerList] = useState([]);
  const unsubscribeRef = useRef(null); // Store unsubscribe function for cleanup
  const { user } = useContext(AuthContext);
  const userId = Number(user?.id);

  const startMessengerListListener = useCallback(async () => {
    if (user) {
      const messagesRef = collection(db, "chats");

      const firstUserMessagesQuery = query(
        messagesRef,
        where("firstUserId", "==", userId)
      );

      const secondUserMessagesQuery = query(
        messagesRef,
        where("secondUserId", "==", userId)
      );

      const [firstUserMessages, secondUserMessages] = await Promise.all([
        getDocs(firstUserMessagesQuery),
        getDocs(secondUserMessagesQuery),
      ]);

      const combinedMessages = [];
      firstUserMessages.forEach((doc) => {
        combinedMessages.push({ ...doc.data(), id: doc.id });
      });
      secondUserMessages.forEach((doc) => {
        combinedMessages.push({ ...doc.data(), id: doc.id });
      });

      const sortedMessages = combinedMessages.sort((a, b) => b?.updatedAt?.seconds - a?.updatedAt?.seconds);
      setMessengerList(sortedMessages);
    } else {
      setMessengerList([]);
    }
  }, [userId]);

  useEffect(() => {
    const unsubscribe = onSnapshot(query(collection(db, "chats")), // Listen for all changes
      (snapshot) => {
        const newMessages = [];
        snapshot.docChanges().forEach((change) => {
          const message = { ...change.doc.data(), id: change.doc.id };
          // Filter messages based on user ID if needed (optional)
          if (change.doc.data().firstUserId === userId || change.doc.data().secondUserId === userId) {
            newMessages.push(message);
          }
        });
        const sortedMessages = newMessages.sort((a, b) => b?.updatedAt?.seconds - a?.updatedAt?.seconds);
        setMessengerList(sortedMessages);
      },
      (error) => {
        console.error('Error fetching messages:', error);
      }
    );

    // Store unsubscribe for cleanup
    unsubscribeRef.current = unsubscribe;

    return () => {
      // Unsubscribe on unmount
      unsubscribeRef.current && unsubscribeRef.current();
    };
  }, [db]); // Only re-run on DB instance change (unlikely in most cases)

  const reloadMessengerList = async () => {
    await startMessengerListListener(); // Call listener to refresh data
  };

  const value = {
    messengerList,
    reloadMessengerList,
  };

  return (
    <MessageContext.Provider value={value}>
      {children}
    </MessageContext.Provider>
  );
};

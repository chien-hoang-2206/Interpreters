import { Row } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from './ChatBox.module.scss';
import { Input } from 'antd';
import { Spin } from 'antd';
import { getMessagesForChat, sendNewMessageToExistingUser, sendNewMessageToNewUser } from '../../services/ChatService';
const { Search } = Input;

const ChatBox = (props) => {
    const { chatInfo, userId, isNewChat = false, id } = props;
    const [messageList, setMessageList] = useState([]);
    const [messageInput, setMessageInput] = useState("");
    const [userNameMes, setUseNameMes] = useState("");
    const [userAvatarMes, setUseAvatarMes] = useState("");
    const [loading, setLoading] = useState(true); // Set initial loading state

    useEffect(() => {
        if (id) {
            setLoading(true);
            const updateMessages = (newMessages) => {
                setMessageList(newMessages);
                setLoading(false);
            };
            const unsubscribe = getMessagesForChat(id, updateMessages);
            return () => {
                unsubscribe(); // Unsubscribe when the component is unmounted or when id changes
            };
        }
        else{
            setLoading(false);
            setMessageList([])
        }
    }, [id]);

    useEffect(() => {
        const userName = userId === chatInfo?.firstUserId ? chatInfo?.secondName : chatInfo?.firstName;
        const userAvatar = userId === chatInfo?.firstUserId ? chatInfo?.secondAvatar : chatInfo?.firstAvatar;
        setUseAvatarMes(userAvatar);
        setUseNameMes(userName);
    }, [chatInfo]);

    function handleSendMessage() {
        if (messageInput && isNewChat) {
            sendNewMessageToNewUser(
                chatInfo?.firstUserId,
                chatInfo?.secondUserId,
                chatInfo?.firstName,
                chatInfo?.secondName,
                chatInfo?.firstAvatar,
                chatInfo?.secondAvatar,
                messageInput,
                userId
            );
        } else {
            sendNewMessageToExistingUser(chatInfo?.chatId,  userId, chatInfo?.secondUserId, messageInput,userId);
        }
        setMessageInput("");
    }

    return (
        <>
            {(!loading || !userAvatarMes) ? (
                <>
                    <Row className={styles.header}>
                        <span className={styles.userName}>{userNameMes ?? ''}</span>
                    </Row>

                    <div className={styles.mainMessage} >
                        <div className={styles.messageBox}>
                            <div className={`${styles.welcomeMes}`}>
                                <div className={`${styles.textMes} ${styles.Kol}`}>
                                    {userAvatarMes && 
                                        <img src={userAvatarMes ?? ''} alt='imageAlt' />
                                    }
                                    <span>Chào mừng bạn đến với cuộc trò chuyện.</span>
                                </div>
                            </div>
                            {messageList?.map((mes) => (
                                <div key={mes?.id} className={`${styles.alignMessage} ${styles[mes?.senderId !== userId ? 'mesReciver' : '']} `}  >
                                    <div className={`${styles.messageItem} ${styles[mes?.senderId !== userId ? 'Kol' : '']} `} >
                                        <span>{mes?.message}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Row className={styles.sendBox}>
                            <Search onChange={(e) => setMessageInput(e.target.value)}
                                onSearch={() => handleSendMessage()} placeholder="Nhập tin nhắn"
                                enterButton="Gửi"
                                disabled={!userAvatarMes ? true : false }
                                value={messageInput}
                            // loading={sending}
                            />
                        </Row>
                    </div>

                </>
            ) : (
                <>
                    <Row className={styles.header}>
                        <span className={styles.userName}>Mesage</span>
                    </Row>
                    <div className={styles.loadingContainer}>
                        <Spin size='large' />
                    </div>
                </>

            )}
        </>
    );
};

export default ChatBox;
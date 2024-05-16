
import { ExclamationCircleFilled, ExclamationCircleOutlined, SettingOutlined } from '@ant-design/icons';
import React, { useContext, useEffect, useRef, useState } from 'react';
import styles from './DropDownBookingRequest.module.scss'
import useOnClickOutside from '../../../hook/use-onclick-outside';
import { Button, Modal, message } from 'antd';
import BookingFactories from '../../../services/BookingFactories';
import { toast } from 'react-toastify';
import { createNotification, sendMessage } from '../../../services/ChatService';
import { AuthContext } from '../../../context/auth.context';
import PaymentFactories from '../../../services/PaymentFactories';
import HintFactories from '../../../services/HintFatories';
import { useTranslation } from 'react-i18next';
const { confirm } = Modal;
const destroyAll = () => {
    Modal.destroyAll();
};


const DropDownBookingRequest = ({ status, booking, icon, options, id, onFetchData = () => { }, type = 'user' }) => {
    const { user, setUser } = useContext(AuthContext);

    const [isOpen, setIsOpen] = useState(false);
    const handleOpen = () => {
        setIsOpen(!isOpen)
    }
    const dropRef = useRef();

    const [userBookingAvatar, setUserBookingAvatar] = useState();
    useEffect(() => {
        async function fetchdata() {
            const resp = await HintFactories.getHINTDetail(booking?.user_id);
            setUserBookingAvatar(resp[0]?.avatar);
        }
        if (booking?.user_id) {
            fetchdata();
        }
    }, [booking?.user_id])
    const fetchDataUpdateBooking = async (id, type) => {
        try {
            const user_id = booking?.user_id
            const response = await BookingFactories.updateBooking(id, type);
            if (response?.status === 200) {
                toast.success('Cập nhật yêu cầu booking thành công.')
                if (type === 2) {
                    createNotification(
                        user_id,
                        2,
                        id,
                        "Interpreters đã chấp nhận yêu cầu booking của bạn", "Liên hệ với Interpreters để biết thêm chi tiết.",
                        booking?.user_id,
                        booking?.pgt_id,
                    );

                    sendMessage(
                        user?.id,
                        parseInt(user_id),
                        user?.userName,
                        booking?.user_name,
                        user?.avatar,
                        userBookingAvatar,
                        'Xin chào bạn! Cảm ơn bạn đã sử dụng dịch vụ của mình. Nếu bạn có bất kỳ câu hỏi hoặc yêu cầu gì, đừng ngần ngại nói cho tôi biết. Mình luôn sẵn sàng hỗ trợ bạn một cách tốt nhất.',
                        booking?.user_id,
                        booking?.pgt_id,
                        user?.id
                    );
                }
                else if (type === 3) {
                    createNotification(
                        user_id, 2, id,
                        "Interpreters đã từ chối yêu cầu booking của bạn", "Liên hệ với Interpreters để biết thêm chi tiết.",
                        booking?.user_id,
                        booking?.pgt_id,
                    );
                    const resp = await PaymentFactories.updateMoneyToAccId(10, user_id, booking?.price);
                }
                else if (type === 4) {
                    createNotification(user_id, 5, id, "Lượt booking đã hoàn thành", "Vui lòng đánh giá cho Interpreters.");
                }
                onFetchData();
            }
        } catch (error) {
            toast.error('Hệ thống lỗi, vui lòng thử lại sau.')
            // Handle errors here
        }
    };

    const handleClickOutside = (event) => {
        setIsOpen(false);
    };


    useOnClickOutside(dropRef, handleClickOutside);
    const { t } = useTranslation()
    const showConfirmDone = () => {
        confirm({
            icon: <ExclamationCircleOutlined />,
            content: <div >{t('confirm_success')}</div>,
            onOk() {
                fetchDataUpdateBooking(id, 4)
                onFetchData();
            },
            onCancel() {
            },
        });
    };

    const showConfirm = () => {
        confirm({
            icon: <ExclamationCircleOutlined />,
            content: <div >{t('confirm_accept')}</div>,
            onOk() {
                fetchDataUpdateBooking(id, 2)
                onFetchData();
            },
            onCancel() {
            },
        });
    };

    const showConfirmDenied = () => {
        confirm({
            icon: <ExclamationCircleOutlined />,
            content: <div>{t('confirm_denied')}</div>,
            onOk() {
                fetchDataUpdateBooking(id, 3)
                onFetchData();
            },
            onCancel() {
            },
        });
    };

    return (
        <div onClick={handleOpen}>
            <SettingOutlined style={{ fontSize: '25px' }} onClick={handleOpen} />
            {isOpen &&
                <div className={styles.selectOptions} ref={dropRef} >
                    {status === 1 &&
                        <>
                            <div className={styles.option} onClick={showConfirm}>Chấp nhận</div>
                            <div className={styles.option} onClick={showConfirmDenied} >Không chấp nhận</div>
                        </>
                    }
                    {status === 2 && <>
                        <div className={styles.option} onClick={showConfirmDone}>Hoàn thành</div>
                    </>}
                </div>
            }
        </div>
    );
};

export default DropDownBookingRequest;
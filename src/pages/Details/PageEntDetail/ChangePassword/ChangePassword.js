import React, { useState } from 'react';
import styles from './ChangePassword.module.scss'
import { Button, Input, Row, Space, message } from 'antd';
import { toast } from 'react-toastify';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import Title from 'antd/es/typography/Title';
const ChangePassword = () => {
    const [profile, setProfile] = useState({});
    const [loading, setLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [passwordVisible, setPasswordVisible] = React.useState(true);


    const validateFormData = (formData) => {
        let res = true;
        let errMsg = "";
        if (!formData.pass) {
            errMsg = "Vui lòng nhập tên của bạn!";
        } else if (!formData.confirmpass) {
            errMsg = "Vui lòng nhập họ của bạn!";
        } else if (!formData.newPass) {
            errMsg = "Vui lòng nhập địa chỉ cụ thể!";
        }
        if (errMsg) {
            messageApi.open({
                type: 'warning',
                content: errMsg,
            });
            res = false;
        }
        return res;
    };

    function onUpdate(event) {
        if (!validateFormData(profile)) return;
        setLoading(true);
        // updateEntProfile(profile).then(
        //     (res) => {
        //         console.log(res);
        //     }
        //     // messageApi.open({
        //     //     type: 'success',
        //     //     content: "Cập nhật thành công!",
        //     // })
        // )
        toast.success('🦄 Lưu dữ liệu thành công!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }

    return (
        <main className={styles["main-details"]} >
            <div
                className={`${styles["container"]} `}
            >
                <div className={styles.formInfo}>
                    <Space direction="vertical"  >
                        <Title level={1}>Cập nhật mật khẩu</Title>
                        <Input.Password placeholder="Mật khẩu cũ"
                            className={styles.inputPass}
                        />
                        <Input.Password
                            placeholder="Nhập mật khẩu mới"
                            className={styles.inputPass}
                            visible
                            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        />
                        <Input.Password
                            placeholder="Nhập lại mật khẩu mới"
                            className={styles.inputPass}
                            visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }}
                        />
                        <Button type="primary" style={{ marginTop: 20, width: '100%' }} onClick={() => { }}>
                            Đổi mật khẩu
                        </Button>
                    </Space>
                </div>
            </div>
        </main>
    );
};

export default ChangePassword;
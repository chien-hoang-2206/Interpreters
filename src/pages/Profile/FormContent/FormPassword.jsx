import { useState } from "react";
import { Col, Input, Row } from "antd";

import classes from "./Form.module.css";
import Message from "../../../components/UI/Message/Message";
import AccountFactories from "../../../services/AccountFactories";
import { ToastNoti, ToastNotiError } from "../../../utils/Utils";
import { Button } from "@nextui-org/react";
export default function FormPassword(props) {
  const user = JSON.parse(localStorage.getItem("user"));
  const [showMessage, setShowMessage] = useState({
    status: false,
    type: "",
    content: "",
  });

  const changeMessage = () => {
    setShowMessage({
      status: false,
      type: "",
      content: "",
    });
  };

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const submitHandler = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      ToastNotiError('Nhập tất cả dữ liệu.');
      return;
    }
    if (newPassword !== confirmPassword) {
      ToastNotiError('Nhập lại mật khẩu không đúng.');
      return;
    }
    try {
      try {
        const data = {
          password: oldPassword,
          new_password: newPassword,
        }
        const response = await AccountFactories.requestUpdate(user?.id, data);
        if (response?.status === 200) {
          ToastNoti();
          setNewPassword()
          setOldPassword()
          setConfirmPassword()
        }
        else if (response?.status === 210) {
          ToastNotiError(response?.message);
        }
      } catch (error) {
        ToastNotiError(error?.response?.data.message);
      }
    } catch (error) {
    }
  };
  return (
    <Row>
      <Col span={16}>
        <Message
          status={showMessage.status}
          type={showMessage.type}
          content={showMessage.content}
          changeMessage={changeMessage}
        />
        <h1>Tài khoản và mật khẩu</h1>
        <form className={classes.form} onSubmit={submitHandler}>
          <Row className={classes.form_control}>
            <Col span={7}>Email:</Col>
            <Col span={17}>
              <input
                placeholder="Email"
                className={classes.input_profile}
                name="email"
                type="email"
                defaultValue={user?.email}
                disabled
              />
            </Col>
          </Row>

          <Row className={classes.form_control}>
            <Col span={7}>Mật khẩu hiện tại:</Col>
            <Col span={17}>
              <Input.Password
                placeholder="Mật khẩu cũ"
                value={oldPassword}
                type="password"
                onChange={e => setOldPassword(e.target.value)}
                style={{ marginBottom: 16 }}
              />
            </Col>
          </Row>

          <Row className={classes.form_control}>
            <Col span={7}>Mật khẩu mới:</Col>
            <Col span={17}>

              <Input.Password
                placeholder="Mật khẩu mới"
                value={newPassword}
                type="password"
                onChange={e => setNewPassword(e.target.value)}
                style={{ marginBottom: 16 }}
              />

            </Col>
          </Row>

          <Row className={classes.form_control}>
            <Col span={7}>Nhập lại mật khẩu:</Col>
            <Col span={17}>
              <Input.Password
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu mới"
                value={confirmPassword}
                name="resetPassword"
                type="password"
                style={{ marginBottom: 16 }}
              />
            </Col>
          </Row>


          <Row>
            <Col offset={4}></Col>
            <Col span={16}>
              <Button onClick={submitHandler}>  Cập nhật</Button>
            </Col>
          </Row>
        </form>
      </Col>
    </Row>
  );
}

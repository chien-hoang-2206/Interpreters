import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { EyeTwoTone, EyeInvisibleOutlined } from "@ant-design/icons";
import logo from "../../assets/logo/LogoPage.png";
import ButtonFull from "../../components/UI/Button/ButtonFull";
import Message from "../../components/UI/Message/Message";
import { AuthContext } from "../../context/auth.context";
import "./style.css";
import AccountFactories from "../../services/AccountFactories";
import { sendEmailVerification, signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import { Input, Modal } from "antd";
import { useTranslation } from "react-i18next";
import Register from "../Register/Register";


const Login = (props) => {
  const { user, setUser, signinWithGoogle } = useContext(AuthContext)
  const navigate = useNavigate();
  const [open, setIsOpen] = useState(true)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setIsOpen(props.isModalOpen)
  }, [props.isModalOpen])
  const handleCancel = () => {
    props.onClose();
  };

  const [disableButtonSend, setDisableButtonSend] = useState()
  const [userFireBase, setUserFirebase] = useState()
  const { t } = useTranslation()
  const [userInput, setUserInput] = useState({
    email: "",
    password: "",
  });

  const [check, setCheck] = useState({
    status: false,
    type: "",
    content: "",
  });

  useEffect(() => {
    document.title = `HINT | ${t('login')}`
    return () => {
      document.title = 'HINT';
    };
  }, [])
  const changeMessage = () => {
    setCheck({
      status: false,
      type: "",
      content: "",
    });
  };

  const inputChangeHandler = (event) => {
    setUserInput((prevState) => {
      return {
        ...prevState,
        [event.target.name]: event.target.value,
      };
    });
  };

  function checkUserValidation() {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!userInput.email || !emailRegex.test(userInput.email)) {
      setCheck({
        status: true,
        type: "error",
        content: t('Validate_email')
      });
      return false;
    }
    else if (!userInput.email) {
      setCheck({
        status: true,
        type: "error",
        content: t('Validate_email'),
      });
      return false;
    }
    // else if (userInput?.email?.length < 15 ) {
    //   setCheck({
    //     status: true,
    //     type: "error",
    //     content: `Email không hợp lệ`,
    //   });
    //   return false;
    // }
    else if (userInput.email.indexOf('@') < 0 || userInput.email.indexOf('.com') < 0) {
      setCheck({
        status: true,
        type: "error",
        content: t('Validate_email'),
      });
      return false;
    }
    else if (!userInput.password) {
      setCheck({
        status: true,
        type: "error",
        content: t('Validate_pass1'),
      });
      return false;
    }
    return true;
  }

  const onSubmitLogin = async (event) => {
    setLoading(true)
    event?.preventDefault();
    if (checkUserValidation()) {
      const response = await AccountFactories.requestLogin(userInput);
      if (response?.error) {
        setCheck({
          status: true,
          type: "error",
          content: response?.error,
        });
        setLoading(false)
      }
      else if (response?.user?.role_id !== 3) {
        setProfileForUser(response?.user);
        // signInWithEmailAndPassword(auth, userInput.email, userInput.password)
        //   .then((userCredential) => {
        //     const userFireBase = userCredential.user;
        //     setUserFirebase(userFireBase);
        //     // setEmailVerified(userFireBase?.emailVerified)
        //     // if (userFireBase?.emailVerified) {
        //     if (true) {
        //       setProfileForUser(response?.user);
        //     }
        //   })
        //   .catch((error) => {
        //     // Lỗi trong quá trình đăng nhập
        //     const errorCode = error.code;
        //     const errorMessage = error.message;
        //     // Hiển thị thông báo lỗi
        //     // setCheck({
        //     //   status: true,
        //     //   type: "error",
        //     //   content: errorMessage,
        //     // });
        //   });
        setLoading(false)
        handleCancel()
      }
      else if (response?.user?.role_id === 3) {
        setProfileForUser(response?.user)
        handleCancel()
        setLoading(false)
      }

    }

  };

  const setProfileForUser = (userDb, userFireBase = {}) => {
    let user = {
      id: userDb?.id,
      email: userDb?.email,
      userName: userDb?.user_name,
      firstName: userDb?.first_name,
      lastName: userDb?.last_name,
      avatar: userDb?.avatar,
      role_id: userDb?.role_id,
      role: userDb?.role_name,
      status: userDb?.status,
      ...userFireBase,
    };

    setUser(user)
    localStorage.setItem("user", JSON.stringify({ ...user }))
    window.dispatchEvent(new Event('storage'))
    setCheck({
      status: true,
      type: "success",
      content: `Đăng nhập thành công`,
    });

    setTimeout(() => {
      if (user?.role_id === 3) {
        return navigate("../admin");
      } else return navigate("..");
    }, 500)
  };

  const forgotPasswordHandler = () => {
    navigate("../forgot_password");
  };

  const comeRegisterHandler = () => {
    navigate("../register");
  };

  const handleReSeneEmail = async (e) => {
    e.preventDefault();
    const resp = await sendEmailVerification(userFireBase);
    toast.success('Đã gửi lại email xác thực.')
    setDisableButtonSend(true);
    setTimeout(() => {
      onSubmitLogin();
    }, 30000);
  };
  const [isOpenRes, setIsOpenRes] = useState(false);
  const registerHandler = () => {
    setIsOpenRes(true)
  };
  return (
    <div>
      <Message
        status={check.status}
        type={check.type}
        content={check.content}
        changeMessage={changeMessage}
      />
      <Modal
        title={t('login')}
        open={open}
        onCancel={handleCancel}
        footer={[
          <></>
        ]}
      >
        <form onSubmit={onSubmitLogin} className="login-form">
          <div className="login-form__control">
            <input
              className="input-login"
              type="email"
              name="email"
              onChange={inputChangeHandler}
              placeholder="Nhập email"
            ></input>
          </div>
          <Input.Password
            name="password"
            onChange={inputChangeHandler}
            placeholder="Nhập mật khẩu"
            className="input-login"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
          <div className="login-form__control">
            <label
              className="line-forgot-password"
              onClick={forgotPasswordHandler}
            >
              Quên mật khẩu?
            </label>
          </div>
          <div className="login-form__control">
            <ButtonFull type="submit" disabled={loading}>{t('login')}</ButtonFull>
          </div>
        </form>
        <div className="login-form__control">
          <button onClick={registerHandler} className="register-line">
            Bạn chưa có tài khoản ?
          </button>
        </div>
        {isOpenRes &&
          <Register isModalOpen={isOpenRes} onClose={() => setIsOpenRes(false)} />
        }
      </Modal>
    </div>
  );
};

export default Login;

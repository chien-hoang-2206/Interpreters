import React, { useState, useEffect, useContext } from "react";
import {
  UserOutlined,
  CheckCircleTwoTone,
  ProfileOutlined,
  WifiOutlined,
  RightSquareOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { Link } from "react-router-dom";
import AccountFactories from "../../services/AccountFactories";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/auth.context";

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const NavBar = (props) => {
  const { user, setUser } = useContext(AuthContext);
  const [isOnline, setIsOnline] = useState();
  const fetchDataUpdate = async (data) => {
    try {
      await AccountFactories.requestUpdate(user?.id, data);
      if (user) {
        user.status = data?.status;
        localStorage.setItem("user", JSON.stringify(user));
        const storedUser = localStorage.getItem("user");
        setUser(JSON.parse(storedUser));
      } else {
        console.error("User not found in localStorage");
      }
    } catch (error) {
      console.log(error);
      toast.error('Hệ thống lỗi.')
    }
  };

  function handleChangeStatusOn() {
    setIsOnline(true);
    const data = { status: 1 }
    fetchDataUpdate(data)
  }
  function handleChangeStatusOff() {
    console.log('tam ngi');
    setIsOnline(false);
    const data = { status: 2 }
    fetchDataUpdate(data)
  }

  useEffect(() => {
    if (user?.status === 1) {
      setIsOnline(true)
    }
    else {
      setIsOnline(false);
    }
  }, [user])

  let items2 = [
    getItem(
      <>
        <Link style={{}} to={`../user-home`}>
          Trang cá nhân
        </Link>
      </>, '1',
      <ProfileOutlined />
    ),
    getItem(
      <>
        <Link style={{}} to="/setting/1" >
          Quản lý tài khoản
        </Link>
      </>, '2',
      <UserOutlined />
    ),
  ];
  if (user?.role_id === 1) {
    items2 = items2.concat(
      getItem(
        <>
          <Link style={{}} to={'/register-hint'}>
            Đăng ký làm Interpreters
          </Link>
        </>, '2',
        <RightSquareOutlined />
      )
    );
    items2 = items2.concat(
      getItem(
        <>
          <Link style={{}} onClick={props.logOutHandler}>
            Đăng xuất
          </Link>
        </>, '2',
        <RightSquareOutlined />
      )
    );
  }
  else if (user?.role_id === 4) {
    items2 = items2.concat(
      getItem(
        <>
          <Link style={{}} onClick={props.logOutHandler}>
            Đăng xuất
          </Link>
        </>, '2',
        <RightSquareOutlined />
      )
    );
  }
  else {
    items2 = items2.concat(
      getItem('Thay đổi trạng thái', '3', <WifiOutlined />, [
        getItem(
          <div className="dropdownProfile" onClick={handleChangeStatusOn}>
            <span> Đang làm việc</span>
            {isOnline &&
              <CheckCircleTwoTone />
            }
          </div>, '4',),
        getItem(
          <div className="dropdownProfile" onClick={handleChangeStatusOff}>
            <span> Đang tạm nghỉ</span>
            {!isOnline &&
              <CheckCircleTwoTone />
            }
          </div>, '5',),
      ]),
      getItem(
        <>
          <Link style={{}} to='/setting/1'>
            Quản lý booking
          </Link>
        </>, '2',
        <RightSquareOutlined />
      )
    );
    items2 = items2.concat(
      getItem(
        <>
          <Link style={{}} onClick={props.logOutHandler}>
            Đăng xuất
          </Link>
        </>, '2',
        <RightSquareOutlined />
      )
    );
  }
  return (
    <div dropRef>
      {props?.isOpen &&
        <div >
          <Menu
            style={{
              width: 256,
              position: 'absolute',
              top: 60,
              right: 20,
              boxShadow: '0 1px 3.125rem 0 rgb(0 0 0 / 20%)',
              animation: 'Notification_FadeIn__k62HB ease 0.4s',
              cursor: 'default',
              borderRadius: 10,
            }}
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            items={items2}
            onClick={props.onchangeOpen}
          />
        </div>
      }
    </div>
  );
};

export default NavBar;

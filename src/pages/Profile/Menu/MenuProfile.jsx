import React from "react";
import {
  UserOutlined,
  SettingOutlined,
  ClockCircleOutlined,
  HistoryOutlined,
  PicRightOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";

import classes from "./MenuProfile.module.css";
import { useNavigate } from "react-router-dom";

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

const MenuProfile = (props) => {
  const navigate = useNavigate();
  const onClick = (e) => {
    navigate(`/setting/${e.key}`);
  };
  let item = [
    getItem("Thông tin cá nhân", "1", <UserOutlined />),
    getItem("Cài đặt tài khoản", "2", <SettingOutlined />, [
      getItem("Email", "sub1"),
      getItem("Tài khoản và mật khẩu", "sub2"),
    ]),
    getItem("Ví & Lịch sử thanh toán", "4", <HistoryOutlined />),
    getItem("Lịch sử booking", "3", <ClockCircleOutlined />),
  ];
  if (props?.user?.role_id === 2) {
    item = item.concat(
      getItem("Yêu cầu booking", "5", <PicRightOutlined />),
    )
  }
  return (
    <Menu
      className={classes.menu}
      onSelect={onClick}
      defaultSelectedKeys={"1"}
      mode="inline"
      items={item}
    />
  );
};

export default MenuProfile;

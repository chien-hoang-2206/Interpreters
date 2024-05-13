import React, { useEffect, useState } from "react";
import { Col, Row } from "antd";
import MenuProfile from "./Menu/MenuProfile";
import SubContext from "./SubContext/SubContext";
import { useLocation } from "react-router-dom";

const Profile = () => {
  const [changeContent, setChangeContent] = useState({});
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  useEffect(() => {
    setChangeContent(id)
  }, [id])
  return (
    <>
      <div style={{ width: '100%', backgroundColor: "#fff" }}>
        <Row
          style={{ height: 'calc(100vh - 58px)', overflow: 'hidden' }}
        >
          <Col span={4} style={{ height: '100%' }}>
            <MenuProfile
              changeContent={changeContent}
              user={user}
            />
          </Col>
          <Col span={20}>
            <SubContext user={user} changeContent={changeContent} />
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Profile;

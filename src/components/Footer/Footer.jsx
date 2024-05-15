import { Col, Row } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import fb from "../../assets/icon/icon-facebook.png";
import yt from "../../assets/icon/icon-youtube.png";
import isg from "../../assets/icon/icon-intagram.png";
import logo from "../../assets/logo/LogoPage.png";

import classes from "./Footer.module.css";

const Footer = () => {
  return (
    <div className={classes.footer}>
      <Row>
        <Col span={6}>
          <Link to={"../"} className={classes["logo-wrap"]}>
            <img className={classes.logo}
              src={logo}
            />
            <p className={classes["logo-text"]}>Hint</p>
          </Link>
          <p className={classes.address}>
            254 Nguyễn Văn Linh, P.Nam Dương,
            <br /> Q.Hải Châu, TP.Đà Nẵng
          </p>
        </Col>
        <Col span={6}>
          <h3 className={classes.header}>Về Hint</h3>
          <p className={classes.content}>
            Câu chuyện về Hint <br /> Công việc
          </p>
        </Col>
        <Col span={6}>
          <h3 className={classes.header}>Giải pháp</h3>
          <p className={classes.content}>
            Hint Professional
            <br /> Hint Review
            <br />
            LitaCommerce
          </p>
        </Col>
        <Col span={6}>
          <h3 className={classes.header}>Tài nguyên</h3>
          <p className={classes.content}>
            Trung tâm hỗ trợ
            <br /> Nhận tư vấn
            <br />
            Blog
            <br />
            Chính sách bảo mật
          </p>
        </Col>
      </Row>
      <hr width="90%" align="left" />
      <Row className={classes["footer-info"]}>
        <Row span={8}>
          <img src={fb}></img>
          <img src={yt}></img>
          <img src={isg}></img>
        </Row>
        <Col span={8}>
          <p className="font-bold text-xl">Hotline: 9001212</p>
        </Col>
        <Col span={8}>
          <p className="font-bold text-xl">Email: Lita@gmail.com</p>
        </Col>
      </Row>
    </div>
  );
};

export default Footer;

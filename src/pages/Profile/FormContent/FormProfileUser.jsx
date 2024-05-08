import { useEffect, useLayoutEffect, useState } from "react";
import { Col, Input, Row, Select } from "antd";

import classes from "./Form.module.css";
import Message from "../../../components/UI/Message/Message";
import Constants from "../../../utils/constants";
import CategoriesFactories from "../../../services/CategoriesFatories";
import AccountFactories from "../../../services/AccountFactories";
import { ToastNoti, ToastNotiError } from "../../../utils/Utils";
import HintFactories from "../../../services/HintFatories";
import axios from "axios";

export default function FormProfileUser(props) {
  const [user] = useState(JSON.parse(localStorage.getItem("user")));
  const [profile, setProfile] = useState();
  const [showMessage, setShowMessage] = useState({
    status: false,
    type: "",
    content: "",
  });

  useEffect(() => {
    // const fetchData = async () => {
    //   const response = await PgtFactories.getPGTDetail(user?.id);
    //   setProfile(response[0]);
    // };
    // fetchData();
  }, []);

  const changeMessage = () => {
    setShowMessage({
      status: false,
      type: "",
      content: "",
    });
  };
  const createErrorMessage = (msg) => {
    setShowMessage({ status: true, type: "error", content: msg });
  };

  const validatePhoneNumber = (number) => {
    const pattern = /^(0\d{9})$/;
    return pattern.test(number);

  };

  const validateFormData = (formData) => {
    let res = true;
    let errMsg = "";
    if (!formData.last_name) {
      errMsg = "Vui lòng nhập tên của bạn!";
    }
    else if (!formData.first_name) {
      errMsg = "Vui lòng nhập họ của bạn!";
    } 
    else if (!formData.phone ) {
      errMsg = "Vui lòng nhập số điện thoại của bạn!";
    }
    else if (!formData.province) {
      errMsg = "Vui lòng chọn tỉnh/thành phố địa chỉ!";
    }
    else if (!formData.district) {
      errMsg = "Vui lòng chọn quận/huyên!";
    }
    else if (!formData.ward) {
      errMsg = "Vui lòng chọn phường/xã!";
    }
    else if (!formData.listGame && user?.role_id === 2) {
      errMsg = "Vui lòng chọn lĩnh vực hoạt động!";
    }
    else if (!validatePhoneNumber(formData?.phone)) {
      errMsg = "Số điện thoại không hợp lệ!";}
    if (errMsg) {
      createErrorMessage(errMsg);
      res = false;
    }
    return res;
  };


  const submitHandler = async (event) => {
    event.preventDefault();
    if (!validateFormData(profile)) return;
    try {
      const data = {
        first_name: profile?.first_name,
        last_name: profile?.last_name,
        user_name: profile?.user_name,
        email: profile?.email,
        gender: profile?.gender,
        address: profile?.address,
        phone: profile?.phone,
        flag: profile?.flag,
        province: profile?.province,
        district: profile?.district,
        ward: profile?.ward,
        listgame: profile?.listgame,
      }
      // const response = await AccountFactories.requestUpdate(user?.id, data);
      // if (response?.status === 210) {
      //   ToastNotiError(response?.message);
      // }
      // else if (response) {
      //   ToastNoti();
      // }
    } catch (error) {
      console.log(error);
      ToastNotiError();
    }
  };

  const inputChangeHandler = (event, name) => {
    setProfile((prevState) => {
      return {
        ...prevState,
        [name]: event.target.value,
      };
    });
  };

  const onChangeCityHandler = (value) => {
    setSelectedProvince(value);
    setProfile((prevState) => {
      return {
        ...prevState,
        districts: null,
        province: value,
      };
    });
  };

  const onChangeDistricts = (value) => {
    setSelectedDistrict(value);
    setWards([]);
    setProfile((prevState) => {
      return {
        ...prevState,
        district: value,
      };
    });
  };

  const onChangeWard = (value) => {
    setSelectedWard(value);
    setProfile((prevState) => {
      return {
        ...prevState,
        ward: value,
      };
    });
  };

  const onChangeSelectHandler = (value, name) => {
    setProfile((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const [fields, setFields] = useState()
  // useLayoutEffect(() => {
  //   const fetchData = async () => {
  //     const response = await CategoriesFactories.getListCategories();
  //     setFields(response);
  //   };
  //   fetchData();

  // }, []);
  const optionCategory = fields?.map((field) => {
    return {
      value: field.id,
      label: field.name,
    };
  });


  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState();
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [SelectedWard, setSelectedWard] = useState("");

  useEffect(() => {
    if (profile?.ward) {
      setSelectedProvince(profile.province);
      setSelectedDistrict(profile.district);
      setSelectedWard(profile.ward);
    }
  }, [profile?.ward])

  // Gọi API để lấy danh sách tỉnh
  useEffect(() => {
    axios
      .get("https://provinces.open-api.vn/api/p/")
      .then((response) => {
        const newList = response?.data?.map((item) => ({
          label: item.name,
          value: item.code,
        }))
        setProvinces(newList);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);


  // Gọi API để lấy danh sách quận dựa trên tỉnh đã chọn
  useEffect(() => {
    if (selectedProvince) {
      axios
        .get(`https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`)
        .then((response) => {
          const newList = response?.data?.districts.map((item) => ({
            label: item.name,
            value: item.code,
          }))
          setDistricts(newList);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      setDistricts([]);
    }
  }, [selectedProvince]);


  // Gọi API để lấy danh sách huyện dựa trên quận đã chọn
  useEffect(() => {
    if (selectedDistrict) {
      axios
        .get(`https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`)
        .then((response) => {
          const newList = response?.data?.wards.map((item) => ({
            label: item.name,
            value: item.code,
          }))
          setWards(newList);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      setWards([]);
    }
  }, [selectedDistrict]);


  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <Row>
        <Col span={16}>
          <Message
            status={showMessage.status}
            type={showMessage.type}
            content={showMessage.content}
            changeMessage={changeMessage}
          />
          <h1>Thông tin cá nhân</h1>
          <Row className={classes.form_control}>
            <Col span={7}><p>Tên *</p> </Col>
            <Col span={17}>
              <input
                className={classes.input_profile}
                placeholder="Nhập tên"
                onChange={(e) => inputChangeHandler(e, 'last_name')}
                value={profile?.last_name}
                name="last_name"
              />
            </Col>
          </Row>

          <Row className={classes.form_control}>
            <Col span={7}>Họ *</Col>
            <Col span={17}>
              <input
                placeholder="Nhập họ"
                className={classes.input_profile}
                value={profile?.first_name}
                name="first_name"
                onChange={(e) => inputChangeHandler(e, 'first_name')}
              />
            </Col>
          </Row>
          <div className={classes.form_control}>
            <Col span={7}>Giới tính</Col>
            <Col span={17}>
              <Select
                placeholder="Giới tính"
                defaultValue={'Nữ'}
                style={{ width: "66.5%" }}
                value={profile?.gender}
                onChange={(value) => onChangeSelectHandler(value, 'gender')}
                options={Constants.optionSex}
              />
            </Col>
          </div>
          <Row className={classes.form_control}>
            <Col span={7}>Số điện thoại *</Col>
            <Col span={17}>
              <Input
                placeholder="Số điện thoại"
                className={classes.input_profile}
                onChange={(e) => inputChangeHandler(e, 'phone')}
                value={profile?.phone}
                name="phone"
              />
            </Col>
          </Row>

          {user?.role === 2 &&
            <Row className={classes.form_control}>
              <Col span={7}>Lĩnh vực *</Col>
              <Col span={17}>
                <Select
                  mode="multiple"
                  style={{ width: "66.5%" }}
                  placeholder="Chọn lĩnh Vực"
                  options={optionCategory}
                />
              </Col>
            </Row>
          }

          <Row className={classes.form_control}>
            <Col span={7}>Tỉnh/Thành phố *</Col>
            <Col span={17}>
              <Row>
                <Select
                  style={{
                    width: "66.5%",
                  }}
                  options={provinces ?? []}
                  onChange={onChangeCityHandler}
                  value={profile?.province}
                />
              </Row>
            </Col>
          </Row>
          <Row className={classes.form_control}>
            <Col span={7}>Quận/Huyện *</Col>
            <Col span={17}>
              <Row>
                <Select
                  style={{
                    width: "66.5%",
                  }}
                  options={districts ?? []}
                  onChange={onChangeDistricts}
                  value={profile?.district}
                />
              </Row>
            </Col>
          </Row>
          <Row className={classes.form_control}>
            <Col span={7}>Phường/Xã *</Col>
            <Col span={17}>
              <Row>
                <Select
                  style={{
                    width: "66.5%",
                  }}
                  options={wards ?? []}
                  onChange={onChangeWard}
                  value={profile?.ward}
                />
              </Row>
            </Col>
          </Row>

          <Row className={classes.form_control}>
            <Col span={7}>Địa chỉ cụ thể:</Col>
            <Col span={17}>
              <input
                placeholder="Địa chỉ cụ thể"
                className={classes.input_profile}
                onChange={(e) => inputChangeHandler(e, 'address')}
                value={profile?.address}
                name="address"
              />
            </Col>
          </Row>
          <Row>
            <Col offset={4}></Col>
            <Col span={16}>
              <button className={classes.btnSubmit} type="submit">
                Cập nhật
              </button>
            </Col>
          </Row>
        </Col>
      </Row>
    </form>
  );
}

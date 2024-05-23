import { Col, Row, Select } from "antd";
import { useEffect, useLayoutEffect, useState } from "react";
import classes from "./Form.module.css";
import Message from "../../../components/UI/Message/Message";
import HintFactories from "../../../services/HintFatories";
import { ToastNoti, ToastNotiError } from "../../../utils/Utils";
import Constants from "../../../utils/constants";
import CategoriesFactories from "../../../services/CategoryFactories";
import AccountFactories from "../../../services/AccountFactories";
import { getDistricts, getProvinces, getWards } from "../../../utils/Location/location";

export default function FormProfileHint(props) {
  const [user] = useState(JSON.parse(localStorage.getItem("user")));
  const [profile, setProfile] = useState();
  const [fields, setFields] = useState([]);
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


  useEffect(() => {
    const fetchData = async () => {
      const response = await HintFactories.getHINTDetail(user?.id);
      setProfile(response[0]);
    };
    fetchData();
  }, [user?.id]);

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

  useEffect(() => {
    if (profile?.listgame) {
      setProfile((prevState) => {
        return {
          ...prevState,
          listGame: profile.listgame?.map((item) => item?.id)
        };
      });
    }
  }, [profile?.id])
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
  const onChangeFieldsHandler = (value) => {
    setProfile((prevState) => {
      return {
        ...prevState,
        listGame: value
      };
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
    else if (!formData.phone) {
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
      errMsg = "Số điện thoại không hợp lệ!";
    }
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
        listgame: profile?.listGame,
        facebook: profile?.facebook,
        youtube: profile?.youtube,
        tiktok: profile?.tiktok,
        instagram: profile?.instagram,
      }
      const response = await AccountFactories.requestUpdate(user?.id, data);
      if (response?.status === 210) {
        ToastNotiError(response?.message);
      }
      else if (response) {
        ToastNoti();
      }
    } catch (error) {
      console.log(error);
      ToastNotiError();
    }
  };

  useLayoutEffect(() => {
    const fetchData = async () => {
      const response = await CategoriesFactories.getListCategories();
      setFields(response);
    };
    fetchData();
  }, []);

  const optionCategory = fields?.map((field) => {
    return {
      value: field.id,
      label: field.name,
    };
  });



  const [provinces, setProvincesList] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState();
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [SelectedWard, setSelectedWard] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const provinces = await getProvinces();
        setProvincesList(provinces);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    }
    fetchData();
  }, []);
  useEffect(() => {
    async function fetchDataDistrict() {
      try {
        const districtList = await getDistricts(selectedProvince);
        setDistricts(districtList);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    }
    fetchDataDistrict();
  }, [selectedProvince]);

  useEffect(() => {
    async function fetchDataDistrict() {
      try {
        const list = await getWards(selectedDistrict);
        setWards(list);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    }
    fetchDataDistrict();
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
            <Col span={6}>Tên *</Col>
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
            <Col span={6}>Họ *</Col>
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

          <Row className={classes.form_control}>
            <Col span={6}>Giới tính:</Col>
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
          </Row>

          <Row className={classes.form_control}>
            <Col span={6}>Số điện thoại *</Col>
            <Col span={17}>
              <input
                placeholder="Số điện thoại"
                className={classes.input_profile}
                onChange={(e) => inputChangeHandler(e, 'phone')}
                value={profile?.phone}
                name="phone"
              />
            </Col>
          </Row>

          <Row className={classes.form_control}>
            <Col span={6}>Tỉnh/Thành phố *</Col>
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
            <Col span={6}>Quận/Huyện *</Col>
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
            <Col span={6}>Phường/Xã *</Col>
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
            <Col span={6}>Địa chỉ cụ thể</Col>
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

          <Row className={classes.form_control}>
            <Col span={6}>Lĩnh vực *</Col>
            <Col span={17}>
              <Select
                mode="multiple"
                style={{
                  width: "66.5%",
                }}
                placeholder="Chọn lĩnh Vực"
                onChange={onChangeFieldsHandler}
                value={profile?.listGame}
                options={optionCategory}
              />
            </Col>
          </Row>

          {/* <Row className={classes.form_control}>
            <Col span={6}>Facebook url </Col>
            <Col span={18}>
              <input
                placeholder="Link trang Facebook cá nhân"
                onChange={(e) => inputChangeHandler(e, 'facebook')}
                value={profile?.facebook}
                className={classes.input_profile}
                defaultValue={profile?.facebook}
                name="facebookUrl"
                type="url"
              />
            </Col>
          </Row>

          <Row className={classes.form_control}>
            <Col span={6}>Youtube url </Col>
            <Col span={18}>
              <input
                placeholder="Link kênh Youtube cá nhân"
                onChange={(e) => inputChangeHandler(e, 'youtube')}
                value={profile?.youtube}
                className={classes.input_profile}
                defaultValue={profile?.youtube}
                name="youtube"
                type="url"
              />
            </Col>
          </Row>


          <Row className={classes.form_control}>
            <Col span={6}>TikTok url </Col>
            <Col span={18}>
              <input
                placeholder="Link trang TikTok cá nhân"
                onChange={(e) => inputChangeHandler(e, 'tiktok')}
                value={profile?.tiktok}
                className={classes.input_profile}
                defaultValue={profile?.tiktok}
                name="tiktok"
                type="url"
              />
            </Col>
          </Row> */}

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

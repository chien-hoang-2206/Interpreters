import React, { useEffect, useState } from 'react';
import classes from './UpdateProfile.module.scss'
import { Button, Col, Image, Input, Row, Select, Space, message } from 'antd';
import { toast } from 'react-toastify';
import Constants from '../../../../utils/constants';
import Title from 'antd/es/typography/Title';
import Temp from '../../../../utils/temp';
const UpdateProfile = (id, type) => {
    const [messageApi, contextHolder] = message.useMessage();

    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState({});

    useEffect(() => {
        if (id) {
            setProfile(Temp.KOLDEtail)
        }
    }, [id])

    const optionCategory = Constants.optionsCategory.map((field) => {
        return {
            value: field.id,
            label: field.name,
        };
    });

    const inputChangeHandler = (event) => {
        setProfile((prevState) => {
            return {
                ...prevState,
                [event.target.name]: event.target.value,
            };
        });
    };

    const onChangeCityHandler = (value) => {
        setProfile((prevState) => {
            return {
                ...prevState,
                cityId: value,
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

    const validateFormData = (formData) => {
        let res = true;
        let errMsg = "";
        if (!formData.firstName) {
            errMsg = "Vui lòng nhập tên của bạn!";
        } else if (!formData.lastName) {
            errMsg = "Vui lòng nhập họ của bạn!";
        } else if (!formData.email) {
            errMsg = "Vui lòng nhập tên doanh nghiệp!";
        } else if (!formData.phone) {
            errMsg = "Vui lòng nhập số điện thoại của bạn!";
        } else if (!formData.status) {
            errMsg = "Vui lòng trạng thái tài khoản";
        } else if (!formData.cityId) {
            errMsg = "Vui lòng chọn tỉnh/thành phố địa chỉ!";
        } else if (formData.listGame?.lenght == 0) {
            errMsg = "Vui lòng chọn lĩnh vực hoạt động!";
        } else if (!formData.addressDetails) {
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
        <main className={classes["main-details"]} >
            <div className={`${classes["container"]} `} >
                <Title level={1}>Chỉnh sửa thông tin</Title>
                <Row>
                    <Col span={4}>
                        <Image style={{ borderRadius: 10 }} width={160} height={160} src={profile?.avatar} />
                    </Col>
                    <Col span={20}>
                        <Row>
                            <Col span={12}  >
                                <div className={classes.formInfo}>
                                    <Row>
                                        <span>Họ:</span>
                                    </Row>
                                    <Row>
                                        <input
                                            placeholder="Họ của bạn"
                                            className={classes['modal-update-col-input']}
                                            value={profile?.firstname}
                                            name="firstname"
                                            onChange={inputChangeHandler}
                                        />
                                    </Row>
                                </div>

                                <div className={classes.formInfo}>
                                    <Row>
                                        <span>Tên tài khoản:</span>
                                    </Row>
                                    <Row>
                                        <input
                                            placeholder="Tên tài khoản"
                                            className={classes['modal-update-col-input']}
                                            value={profile?.username}
                                            name="username"
                                            onChange={inputChangeHandler}
                                        />
                                    </Row>
                                </div>

                                <div className={classes.formInfo}>
                                    <Row>
                                        <span>Giới tính:</span>
                                    </Row>
                                    <Row>
                                        <Select
                                            placeholder="Giới tính"
                                            defaultValue={'Nữ'}
                                            style={{
                                                width: "100%",
                                            }}
                                            onChange={(value) => onChangeSelectHandler(value, 'gender')}
                                            options={Constants.optionSex}
                                        />
                                    </Row>
                                </div>

                                <div className={classes.formInfo}>
                                    <Row>
                                        <span>Số điện thoại:</span>
                                    </Row>
                                    <Row>
                                        <input
                                            placeholder="Số điện thoại"
                                            className={classes['modal-update-col-input']}
                                            onChange={inputChangeHandler}
                                            value={profile?.phone}
                                            name="phone"
                                        />
                                    </Row>
                                </div>

                                <div className={classes.formInfo}>
                                    <Row >
                                        <span>Tỉnh/Thành phố:</span>
                                    </Row>
                                    <Row>
                                        <Select
                                            style={{
                                                width: "100%",
                                            }}
                                            defaultValue={profile?.cityId}
                                            options={Constants.vietnamProvinces}
                                            onChange={onChangeCityHandler}
                                            value={profile?.cityId}
                                        />
                                    </Row>
                                </div>

                                {type === 'Interpreters' && <>

                                </>}
                            </Col>
                            <Col span={12}>
                                <div className={classes.formInfo}>
                                    <Row>
                                        <span>Tên:</span>
                                    </Row>
                                    <Row>
                                        <input
                                            placeholder="Tên của bạn"
                                            className={classes['modal-update-col-input']}
                                            value={profile?.lastname}
                                            name="lastname"
                                            onChange={inputChangeHandler}
                                        />
                                    </Row>
                                </div>
                                <div className={classes.formInfo}>
                                    <Row>
                                        <span>Email:</span>
                                    </Row>
                                    <Row>
                                        <input
                                            placeholder="Email"
                                            className={classes['modal-update-col-input']}
                                            value={profile?.email}
                                            name="email"
                                            onChange={inputChangeHandler}
                                        />
                                    </Row>
                                </div>

                                <div className={classes.formInfo}>
                                    <Row>
                                        <span>Địa chỉ cụ thể:</span>
                                    </Row>
                                    <Row>
                                        <input
                                            placeholder="Địa chỉ cụ thể"
                                            className={classes['modal-update-col-input']}
                                            value={profile?.address}
                                            name="addressDetails"
                                            onChange={inputChangeHandler}
                                        />
                                    </Row>
                                </div>

                                {type == 'Interpreters' && <div className={classes.formInfo}>
                                    <Row>
                                        <span>Lĩnh vực:</span>
                                    </Row>
                                    <Row>
                                        <Select
                                            mode="multiple"
                                            style={{
                                                width: "100%",
                                            }}
                                            placeholder="Chọn lĩnh Vực"
                                            onChange={onChangeFieldsHandler}
                                            defaultValue={profile?.listgame.map((item) => item.id)}
                                            options={optionCategory}
                                        />
                                    </Row>
                                </div>}


                            </Col>
                        </Row>

                    </Col>
                </Row>

                <div className={classes["footer"]} >
                    <div className={classes["footer-btn"]} >
                        <Button style={{ width: 130 }} key="back" onClick={() => { }}>
                            Hủy bỏ
                        </Button>,
                        <Button style={{ width: 130 }} key="submit" type="primary" onClick={onUpdate}>
                            Cập nhật
                        </Button>,
                    </div>
                </div>
            </div>
        </main>
    )
};

export default UpdateProfile;
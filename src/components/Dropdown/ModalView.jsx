import React from 'react'
import { Modal, Image, Row, Col, Button } from "antd";
import classes from './Dropdown.module.scss'
import AvatarGroup from '../image-group/AvatarGroup';
import StarRating from '../start-rating/StarRating';

const InfoItem = ({ label, content }) => {
    return (
        <div className={classes.infoContainer}>
            <p className={classes.label}>{label}</p>
            <p className={classes.content}>{content}</p>
        </div>
    );
};


const ModalView = (props) => {
    return (
        <Modal
            width={1000}
            style={{
                top: '10vh',
            }}
            title="Thông tin chi tiết"
            open={props.openView}
            onCancel={props.onCloseViewHandler}
            footer={[
                <Button key="back" onClick={props?.onCloseViewHandler}>
                    Hủy bỏ
                </Button>,
                <Button key="submit" type="primary" onClick={props.onClickUpdate}>
                    Cập nhật
                </Button>,
            ]}
        >
            <div className={classes['admin-modal-view']}>
                <Row>
                    <Col span={5}>
                        <Image style={{ borderRadius: 10 }} width={160} height={160} src={props.data.image} />
                    </Col>
                    <Col span={19}>
                        <Row>
                            <Col span={12}>
                                <InfoItem label="Tên tài khoản" content={props.data?.user_name} />
                                <InfoItem label="Email" content={props.data?.email} />
                                <InfoItem label="Khu vực" content={'Đà Nẵng'} />

                                {props?.type === 'Interpreters' ?
                                    <>
                                        <InfoItem label="Lĩnh vực" content={<>
                                            <span>
                                                <AvatarGroup list={props.data?.listgame} maxCount={6} />
                                            </span>
                                        </>} />

                                        <InfoItem label="Thời gian thuê" content={props.data?.timeOrder} />
                                        <InfoItem label="Tỷ lệ hoàn thành" content={props.data?.rateDone} />
                                    </>
                                    :
                                    <>
                                        <InfoItem label="Trạng thái" content={props.data?.flag  === 1 ? 'Đang hoạt động' : 'Đang khóa'} />
                                    </>
                                }
                            </Col>
                            <Col span={12}>
                                <InfoItem label="Họ và tên" content={`${props.data?.first_name ?? ''} ${props.data?.last_name ?? ''}`} />
                                <InfoItem label="Số điện thoại" content={props.data?.phone} />
                                <InfoItem label="Địa chỉ cụ thể" content={props.data?.address} />
                                {props?.type === 'Interpreters' ?
                                    <>
                                        <InfoItem label="Đánh giá" content={<StarRating starCount={props.data?.star}/>}/>
                                        <InfoItem label="Số người theo dõi" content={props.data?.follow} />
                                        <InfoItem label="Trạng thái" content={props.data?.flag === 1 ? 'Đang hoạt động' : 'Đang khóa'} />
                                    </>
                                    :
                                    <>
                                    </>
                                }
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        </Modal >
    )
}

export default ModalView
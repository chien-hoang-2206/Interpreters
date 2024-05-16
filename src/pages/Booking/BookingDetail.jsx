import React, { useEffect, useState } from "react";
import classes from "./Booking.module.css";
import { Modal, Form, Input, Button, Rate } from "antd";
import TextArea from "antd/es/input/TextArea";
import { ToastNoti, ToastNotiError, convertStringToNumber, getDate, getTime } from '../../utils/Utils';
import { toast } from "react-toastify";
import BookingFactories from "../../services/BookingFactories";
import { createNotification, sendMessage, sendNewMessageToExistingUser, sendNewMessageToNewUser } from "../../services/ChatService";
import PaymentFactories from "../../services/PaymentFactories";
import HintFactories from "../../services/HintFatories";
import { useTranslation } from "react-i18next";

const BookingDetail = (props) => {
  const { bookingId, isHaveComment } = props;
  const [booking, setBooking] = useState();
  const user = JSON.parse(localStorage.getItem("user"))
  const [userBookingAvatar, setUserBookingAvatar] = useState();

  useEffect(() => {
    async function fetchdata() {
      const resp = await HintFactories.getHINTDetail(booking?.user_id);
      setUserBookingAvatar(resp[0]?.avatar);
    }
    if (booking?.user_id) {
      fetchdata();
    }
  }, [booking?.user_id])


  const fetchData = async (bookingId) => {
    try {
      const response = await BookingFactories.getBookingDetail(bookingId);
      if (response?.status === 200) {
        setBooking(response?.data);
      }
    } catch (error) {
      // Handle errors here
    }
  };

  useEffect(() => {
    if (bookingId) {
      fetchData(bookingId);
    }
  }, [bookingId]);

  const onCloseModal = () => {
    props.onCancelOpenHandler();
  };


  const onAcceptSubmit = async () => {
    try {
      const response = await BookingFactories.updateBooking(bookingId, 2);
      if (response?.status === 200) {
        toast.success('Chấp nhận yêu cầu booking thành công.')
        createNotification(booking?.user_id,
          2,
          booking?.id,
          "Interpreters đã chấp nhận yêu cầu booking của bạn", "Liên hệ với Interpreters để biết thêm chi tiết.",
          booking?.user_id,
          booking?.pgt_id,
        );
        sendMessage(
          user?.id,
          parseInt(booking?.user_id),
          user?.userName,
          booking?.user_name,
          user?.avatar,
          userBookingAvatar,
          'Xin chào bạn! Cảm ơn bạn đã sử dụng dịch vụ của mình. Nếu bạn có bất kỳ câu hỏi hoặc yêu cầu gì, đừng ngần ngại nói cho tôi biết. Mình luôn sẵn sàng hỗ trợ bạn một cách tốt nhất.',
          user?.id
        )
        onCloseModal();
      }
    } catch (error) {
      toast.error('Hệ thống lỗi, vui lòng thử lại sau.')
    }
  };

  const deniedBooking = async () => {
    try {
      const response = await BookingFactories.updateBooking(bookingId, 3);
      if (response?.status === 200) {
        toast.success('Đã từ chối yêu cầu booking.')
        createNotification(booking?.user_id, 2, booking?.id,
          "Interpreters đã từ chối yêu cầu booking của bạn", "Liên hệ với Interpreters để biết thêm chi tiết.",
          booking?.user_id,
          booking?.pgt_id);
      }
      await PaymentFactories.updateMoneyToAccId(10, booking?.user_id, booking?.price);
      onCloseModal();
    } catch (error) {
      toast.error('Hệ thống lỗi, vui lòng thử lại sau.')
    }
  }
  const dateBooking = (getDate(booking?.date))
  const [valueRate, setValueRate] = useState();
  const [valueComment, setValueComment] = useState();
  const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];
  const { t } = useTranslation()
  async function submitComment() {
    try {
      const response = await BookingFactories.updateBooking(bookingId, 5, valueRate, valueComment, booking?.pgt_id, booking?.price, user.userName);
      if (response?.status === 200) {
        ToastNoti(t('thanks_comment'));
        setBooking(response?.data);
      }
      else {
        ToastNotiError();
      }
    } catch (error) {
      ToastNotiError();
    }
    onCloseModal();
  }
  return (
    <Modal
      width={600}
      open={props.open}
      title={t('booking_info')}
      destroyOnClose={true}
      onCancel={onCloseModal}
      footer=""
    >

      <div className={classes["modal-booking-create"]}>
        <Form
          name="basic"
          labelAlign='left'
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 19 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          autoComplete="off"
          onFinish={onAcceptSubmit}
        >
          <Form.Item label={t('per_booking')}> <span style={{ float: 'right' }}> {booking?.user_name}  </span> </Form.Item>
          <Form.Item label={t('status')}      >
            {booking?.status === 1 && <span style={{ color: 'green', float: 'right' }} >{t('pending')}</span>}
            {booking?.status === 2 && <span style={{ color: 'blue', float: 'right' }} > {user?.id === booking?.user_id ? 'Interpreters' : 'Bạn'} {t('accept_bk')}</span>}
            {booking?.status === 3 && <span style={{ float: 'right', color: 'red' }} > {user?.id === booking?.user_id ? 'Interpreters' : 'Bạn'} {t('denided_bk')}</span>}
            {(booking?.status === 4 || booking?.status === 5) && <span style={{ float: 'right', color: 'green' }} > {t('success')}</span>}
          </Form.Item>
          <Form.Item label={t('date')}>
            <Input
              style={{ width: '100%', textAlign: 'right', }}
              value={dateBooking}
            />
          </Form.Item>

          <Form.Item label={t('time')} >
            <Input
              style={{ width: '100%', textAlign: 'right', }}
              value={booking?.time}
            />
          </Form.Item>
          <Form.Item label={t('total_money_booking')}>
            <Input
              style={{ width: '100%', textAlign: 'right', }}
              value={convertStringToNumber(booking?.price)}
            />
          </Form.Item>


          {isHaveComment ? <>
            <Form.Item label="Đánh giá">
              <span style={{ float: 'right' }}>
                <Rate tooltips={desc} onChange={setValueRate} value={(booking?.status !== 4 && booking?.rate) ? booking?.rate : valueRate} />
                {/* {valueRate ? <span className="ant-rate-text">{desc[valueRate - 1]}</span> : ''} */}
              </span>
            </Form.Item>
            <Form.Item label={t('review')}>
              <TextArea
                rows={2}
                placeholder={t('enter_commnet')}
                value={booking?.comment ? booking?.comment : valueComment}
                onChange={(e) => setValueComment(e.target.value)}
              />
              <div style={{ display: 'flex', gap: 20, float: 'right', marginTop: 20 }}>
                {booking?.status === 4 &&
                  <Button onClick={(e) => submitComment()} type="primary" >
                    {t('cf_success')}
                  </Button>
                }
              </div>
            </Form.Item>
          </>
            : <>
              <Form.Item
                label={t('note')}
              >
                <TextArea
                  rows={2}
                  disabled
                  placeholder=""
                  value={booking?.note}
                />
                {booking?.status === 1 &&
                  <div style={{ display: 'flex', gap: 20, float: 'right', marginTop: 20 }}>
                    <Button type="link" htmlType="button" onClick={deniedBooking}>
                      {t('denided_rq')}
                    </Button>
                    <Button type="primary" htmlType="submit">
                      {t('accept')}
                    </Button>
                  </div>}
              </Form.Item>
            </>}
        </Form>
      </div>
    </Modal >
  );
};

export default BookingDetail;

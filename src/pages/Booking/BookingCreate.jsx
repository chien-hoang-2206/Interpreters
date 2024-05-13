import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./Booking.module.css";
import { Modal, Form, Radio, DatePicker } from "antd";
import { ToastNoti, ToastNotiError, convertStringToNumber } from './../../utils/Utils';
import { toast } from "react-toastify";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import BookingFactories from "../../services/BookingFactories";
import moment from "moment";
import dayjs, { Dayjs } from "dayjs";
import { createNotification } from "../../services/ChatService";
import { Button, Input } from "@nextui-org/react";
import { useTranslation } from "react-i18next";
import TextArea from "antd/es/input/TextArea";

const BookingCreate = (props) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const hint = props.data;
  const onCloseModal = () => {
    props.onCancelOpenHandler();
  };
  const { t } = useTranslation()
  const [form] = Form.useForm();
  const watchtypeTravel = Form.useWatch('typeTravel', form);
  const watchtNumberPerson = Form.useWatch('numberPerson', form);
  const watchtDateBooking = Form.useWatch('dateBooking', form);
  const watchtTimeBooking = Form.useWatch('timeBooking', form);
  const watchtCost = Form.useWatch('Cost', form);
  const watchtPrice = Form.useWatch('price', form);


  useEffect(() => {
    if (parseInt(watchtypeTravel) == 1 && watchtNumberPerson < 1) {
      form.setFieldValue('numberPerson', 2)
    }
  }, [watchtNumberPerson, watchtypeTravel]);

  useEffect(() => {
    if (parseInt(watchtypeTravel) == 1 && watchtNumberPerson && watchtDateBooking) {
      const basePrice = parseInt(watchtTimeBooking) == 7 ? hint?.price?.group_price_day : hint?.price?.group_price_session
      const newValue = watchtNumberPerson * basePrice
      form.setFieldValue('Cost', parseInt(newValue))
      form.setFieldValue('price', parseInt(basePrice))
    }
    else if (parseInt(watchtypeTravel) == 2) {
      const basePrice = parseInt(watchtTimeBooking) == 7 ? hint?.price?.personal_price_day : hint?.price?.personal_price_session
      const newValue = 1 * basePrice
      form.setFieldValue('price', parseInt(basePrice))
      form.setFieldValue('Cost', parseInt(newValue))
    }
  }, [watchtypeTravel, watchtNumberPerson, watchtTimeBooking, watchtDateBooking]);


  const [errorMessage, setErrorMessage] = useState('');
  const [errorDate, setErrorDate] = useState(false);

  // const checkDateBooking = (value) => {
  //   setErrorDate(false);
  //   const now = new Date();
  //   const bookingDate = new Date(dateBooking);

  //   if (bookingDate) {
  //     const timeDiff = bookingDate - now;
  //     const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
  //     if (daysDiff >= 15) {
  //       setErrorDate(true)
  //       // return Promise.reject(new Error('Ngày đặt phải nằm trong 15 ngày kể từ ngày hiện tại'));

  //     } else if (daysDiff < -1) {
  //       setErrorDate(true)
  //       return Promise.reject(new Error('Không thể chọn ngày trong quá khứ'));
  //     }
  //     else {
  //       return Promise.resolve();
  //     }
  //   }
  //   else {
  //     return Promise.reject(new Error('Bắt buộc chọn ngày'));
  //   }
  // };


  const requestBooking = async (data) => {
    try {
      const response = await BookingFactories.requestBooking(data);
      if (response.status === 200) {
        // createNotification(data?.hint_id, 1,
        //   response?.data[0].id, "Bạn có yêu cầu booking mới",
        //   "Vui lòng xác nhận yêu cầu booking trong vòng 5 phút.",
        //   data?.userId,
        //   hint?.id
        // );
        toast.success('Tạo lượt booking thành công, Interpreters sẽ phàn hồi lại trong 5 phút.',
        );
        props.onCancelOpenHandler();
      }
      else if (response.status === 201) {
        ToastNotiError(response?.message);
        setErrorMessage(response?.messsageError);
      }
      else if (response.status === 220) {
        toast.error(response?.message);
        navigator('/setting/4')
      }
      else {
        // toast.error('Hệ thống lỗi, vui lòng thử lại sau')
      }
    } catch (error) {
      toast.error('Hệ thống lỗi, vui lòng thử lại sau')
    }
  };
  const navigator = useNavigate();
  const onSubmit = (data) => {
    let newData = {
      userId: user.id,
      hintId: hint.id,
      date: data.dateBooking,
      category: data.category ?? 2,
      cost: data.Cost,
      quantity: parseInt(watchtNumberPerson) ?? 1,
      price: watchtPrice ? watchtPrice : data.Cost,
      destination_id: parseInt(hint.destination_id),
      destination: hint.destination,
      note: data.note,
      typeTravel: parseInt(data.typeTravel) == 1 ? t('travelGroup') : t('travelOlone'),
    }
    if (parseInt(data.timeBooking) == 3) {
      newData.time = t('hire_morning')
    }
    if (parseInt(data.timeBooking) == 4) {
      newData.time = t('hire_afternoon')
    }
    if (parseInt(data.timeBooking) == 7) {
      newData.time = t('hire_day')
    }
    if (user?.id === hint?.id) {
      ToastNotiError('Không thể tự tạo booking cho bản thân')
      return;
    }
    else {
      requestBooking(newData);
    }
  };


  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < dayjs().endOf('day');
  };
  return (
    <Modal
      open={props.open}
      title="Tạo lượt thuê"
      width={800}
      destroyOnClose={true}
      onCancel={onCloseModal}
      footer=""
    >

      <div className={classes["modal-booking-create"]}>
        <Form
          labelAlign='left'
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 17 }}
          form={form}
          initialValues={{ remember: true }}
          autoComplete="off"
          onFinish={onSubmit}
        >
          <Form.Item label="Phiên dịch viên" >{hint.firstName} {hint?.user_name}</Form.Item>
          <Form.Item label="Địa điểm du lịch" >{hint.destination}</Form.Item>


          <Form.Item label="Dạng" name='typeTravel'>
            <Radio.Group
              defaultValue={2}
            >
              <Radio value={1}>Du lịch theo nhóm</Radio>
              <Radio value={2}>Du lịch cá nhân</Radio>
            </Radio.Group>
          </Form.Item>


          {parseInt(watchtypeTravel) == 1 &&
            <Form.Item
              label="Số người" name='numberPerson'
              rules={[
                { required: true, message: 'Bắt buộc chọn số lượng người' },
                // { validator: checkDateBooking },
              ]}
            >
              <Input
                style={{ width: '100%', textAlign: 'right', }}
                type="number"
                value={parseInt(watchtTimeBooking) === 2 && 1}
                min={2}
              />
            </Form.Item>
          }
          <Form.Item label="Thời gian thuê" name='timeBooking'>
            <Radio.Group
              defaultValue={3}
            // onChange={(value) => setTypeTime(value?.target?.value)}
            // value={}
            >
              <Radio value={3}>Thuê buổi sáng </Radio>
              <Radio value={4}>Thuê buổi chiều </Radio>
              <Radio value={7}>Thuê cả ngày</Radio>
            </Radio.Group>
          </Form.Item>


          <Form.Item label="Ngày" name='dateBooking'
            rules={[
              { required: true, message: 'Bắt buộc chọn ngày' },
              // { validator: checkDateBooking },
            ]}
          >
            <DatePicker
              placeholder="Chọn ngày"
              mode='date'
              disabledDate={disabledDate}
              style={{ width: '100%' }} />
          </Form.Item>


          {/* <Form.Item label="Thời gian" name="timefrom"
          // rules={[{ required: true, message: 'Bắt buộc chọn giờ' }]}
          >
            <Space.Compact block >
              <TimePicker.RangePicker
                format='HH:mm'
                placeholder={['Bắt đầu', 'Kết thúc']}
                disabled
                onChange={(e) => setRangeTimeBooking(e)}
                value={rangeTimeBooking}
              />
            </Space.Compact>
            {errorMessage !== '' && <span style={{ color: 'red' }}> {errorMessage}</span>}
          </Form.Item> */}


          <Form.Item
            label="Ghi chú"
            name="note"
          >
            <TextArea
              rows={2}
              radius="sm"
              placeholder="Nhập lời nhắn"
            />
          </Form.Item>
          {parseInt(watchtypeTravel) == 1 &&
            <Form.Item label="Đơn giá cho một người" name='price'>
              <div className="text-bold text-right text-2xl text-blue-400">{convertStringToNumber(watchtPrice)}</div>
            </Form.Item>
          }

          <Form.Item label="Tổng tiền" name='Cost'>

            <div className="text-bold text-right text-2xl text-blue-400">{convertStringToNumber(watchtCost)}</div>
            <div style={{ display: 'flex', gap: 20, float: 'right', marginTop: 20 }}>
              <Button variant='light' htmlType="button" onClick={onCloseModal}>
                {t('cancel')}
              </Button>
              <Button
                color="primary"
                type="submit"
              // disabled={((errorMessage || errorDate) ? true : false)}
              >
                {t('create_booking')}
              </Button>
            </div>
          </Form.Item>


        </Form>
      </div>
    </Modal >
  );
};

export default BookingCreate;

import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./Booking.module.css";
import { Modal, DatePicker, Form, Select, Input, TimePicker, Space, Button, Radio } from "antd";
import TextArea from "antd/es/input/TextArea";
import { ToastNotiError, convertStringToNumber } from './../../utils/Utils';
import { toast } from "react-toastify";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import BookingFactories from "../../services/BookingFactories";
import moment from "moment";
import dayjs, { Dayjs } from "dayjs";
import { createNotification } from "../../services/ChatService";

const BookingCreate = (props) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const pgt = props.kol;
  const onCloseModal = () => {
    props.onCancelOpenHandler();
  };

  const [errorMessage, setErrorMessage] = useState('');
  const [errorDate, setErrorDate] = useState(false);
  const [typeBooking, setTypeBooking] = useState();
  const [typeTime, setTypeTime] = useState();
  const [timeBooking, setTimeBooking] = useState(1);
  const [dateBooking, setDateBooking] = useState();
  const [rangeTimeBooking, setRangeTimeBooking] = useState();
  console.log("🚀 ~ BookingCreate ~ rangeTimeBooking:", rangeTimeBooking)

  const [note, setNote] = useState();
  const [priceTotalShow, setPriceShow] = useState(convertStringToNumber(parseInt(pgt?.price)));
  const [priceTotal, setPrice] = useState();
  useEffect(() => {
    const newTime = dayjs().startOf('day').add(7, 'hour');
    const newTimeTo = dayjs().startOf('day').add(22, 'hour');
    console.log("🚀 ~ useEffect ~ newTime :", newTime)
    if (typeTime === 1) {
      const rangeTimeBooking = [
        newTime,
        newTimeTo
      ]
      setRangeTimeBooking(rangeTimeBooking)
    }
  }, [typeTime])
  useEffect(() => { setDateBooking(dayjs()) }, [])
  useEffect(() => {
    setPriceShow(convertStringToNumber(parseInt(pgt?.price) * timeBooking))
    setPrice(pgt?.price * timeBooking)
  }, [pgt?.price, timeBooking])

  const checkDateBooking = (value) => {
    setErrorDate(false);
    const now = new Date();
    const bookingDate = new Date(dateBooking);

    if (bookingDate) {
      const timeDiff = bookingDate - now;
      const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
      if (daysDiff >= 15) {
        setErrorDate(true)
        return Promise.reject(new Error('Ngày đặt phải nằm trong 15 ngày kể từ ngày hiện tại'));

      } else if (daysDiff < -1) {
        setErrorDate(true)
        return Promise.reject(new Error('Không thể chọn ngày trong quá khứ'));
      }
      else {
        return Promise.resolve();
      }
    }
    else {
      return Promise.reject(new Error('Bắt buộc chọn ngày'));
    }
  };

  async function checkTimePgt() {
    const data = {
      pgtId: pgt?.id,
      date: dateBooking,
      timeStart: rangeTimeBooking[0]?.$d,
      timeEnd: rangeTimeBooking[1]?.$d,
    }
    const response = await BookingFactories.checkrequestTimeBooking(data);
    if (response.status === 200) {
    }
    else if (response.status === 201) {
      setErrorMessage(response?.messsageError);
    }
  }

  useEffect(() => {
    if (rangeTimeBooking) {
      checkTimePgt();
      const newTime = rangeTimeBooking[1]?.$H - rangeTimeBooking[0]?.$H;
      const startTime = rangeTimeBooking[0]?.$d;
      const timeCurrent = new Date();
      if (startTime < timeCurrent) {
        setErrorMessage('Thời gian bắt đầu phải là thời gian trong tương lai.');
      }
      else
        if (newTime === 0) {
          setErrorMessage('Vui lòng chọn thời gian thuê lớn hơn 1 giờ.')
        }
        else {
          setTimeBooking(newTime);
          setErrorMessage('')
        }
    }
  }, [rangeTimeBooking])


  const requestBooking = async (data) => {
    try {
      // const response = await BookingFactories.requestBooking(data);
      // if (response.status === 200) {
      //   createNotification(data?.pgtId, 1,
      //     response?.data[0].id, "Bạn có yêu cầu booking mới",
      //     "Vui lòng xác nhận yêu cầu booking trong vòng 5 phút.",
      //     data?.userId,
      //     data?.pgtId
      //   );
      //   toast.success('Tạo lượt booking thành công, Interpreters sẽ phàn hồi lại trong 5 phút.',
      //   );
      //   props.onCancelOpenHandler();
      // }
      // else if (response.status === 201) {
      //   toast.error(response?.messsage);
      //   setErrorMessage(response?.messsageError);
      // }
      // else if (response.status === 220) {
      //   toast.error(response?.message);
      //   navigator('/setting/4')
      // }
      // else {
      //   // toast.error('Hệ thống lỗi, vui lòng thử lại sau')
      // }
    } catch (error) {
      // toast.error('Hệ thống lỗi, vui lòng thử lại sau')
    }
  };
  const navigator = useNavigate();
  const onSubmit = (value) => {
    console.log("🚀 ~ onSubmit ~ value:", value)
    if (user?.id === pgt?.id) {
      ToastNotiError('Không thể tự tạo booking cho bản thân')
      return;
    }
    else {
      const data = {
        userId: user?.id,
        pgtId: pgt?.id,
        price: parseInt(priceTotal),
        date: dateBooking,
        timeStart: rangeTimeBooking[0]?.$d,
        timeEnd: rangeTimeBooking[1]?.$d,
        note: note,
      }
      requestBooking(data);
    }
  };


  return (
    <Modal
      width={600}
      open={props.open}
      title="Tạo lượt thuê"
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
          onFinish={onSubmit}
        >
          <Form.Item label="Tên" >{pgt.firstName} {pgt?.user_name}</Form.Item>
          <Form.Item label="Dạng" name='typeTravel'>
            <Radio.Group onChange={(value) => setTypeBooking(value?.target?.value)} value={typeBooking}>
              <Radio value={1}>Du lịch theo nhóm</Radio>
              <Radio value={2}>Du lịch cá nhân</Radio>
            </Radio.Group>
          </Form.Item>


          <Form.Item label="Số người" name='numberPerson'>
            <Input
              style={{ width: '100%', textAlign: 'right', }}
              type="number"
              min={parseInt(typeBooking) === 1 ? 2 : 1}
              max={parseInt(typeBooking) === 2 && 1}
            />
          </Form.Item>

          <Form.Item label="Ngày" name='dateBooking'
            rules={[
              { required: true, message: 'Bắt buộc chọn ngày' },
              { validator: checkDateBooking },]}
          >
            <DatePicker
              placeholder="Chọn ngày"
              mode='date'
              onChange={(e) => setDateBooking(e)}
              value={dateBooking}
              style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="Dạng Thuê" name='typeTravel'>
            <Radio.Group onChange={(value) => setTypeTime(value?.target?.value)} value={typeTime}>
              <Radio value={1}>Thuê theo ngày</Radio>
              <Radio value={2}>Thuê theo giờ</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="Thời gian" name="timefrom"
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
          </Form.Item>

          <Form.Item label="Tổng tiền">
            <Input
              style={{ width: '100%', textAlign: 'right', }}
              value={priceTotalShow}
            />
          </Form.Item>
          <Form.Item
            label="Ghi chú"
            name="mota"
          >
            <TextArea
              rows={2}
              placeholder="Nhập lời nhắn"
              onChange={(e) => setNote(e.target.value)}
              value={note}
            />
            <div style={{ display: 'flex', gap: 20, float: 'right', marginTop: 20 }}>
              <Button type="link" htmlType="button" onClick={onCloseModal}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" disabled={((errorMessage || errorDate) ? true : false)}>
                Submit
              </Button>
            </div>
          </Form.Item>

        </Form>
      </div>
    </Modal >
  );
};

export default BookingCreate;

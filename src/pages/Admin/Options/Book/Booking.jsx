import React, { useEffect, useState } from "react";
import { Table, Input, Select, DatePicker, Space, Button, Modal } from "antd";
import "./Booking.css";
import Constants from "../../../../utils/constants";
import BookingFactories from "../../../../services/BookingFactories";
import { ToastNoti, ToastNotiError, convertStringToNumber, getDate, getTime } from "../../../../utils/Utils";

const Booking = () => {
  const [bookingList, setBookingList] = useState([]);
  const [namePgt, setNamePgt] = useState("");
  const [dateCreate,setDateCreate] = useState();
  const [DateBooking,setDateBooking] = useState();

  const fetchDataBookingList = async (name,dateCreate,dateBooking) => {
    // try {
    //   const response = await BookingFactories.getListBooking(name,dateCreate,dateBooking);
    //   setBookingList(response?.data);
    // } catch (error) {
    //   ToastNotiError();
    // }
  };

  useEffect(() => {
    fetchDataBookingList();
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.keyCode === 13) {
      fetchDataBookingList(namePgt);
    }
  };
  
  function handleReset() {
    setNamePgt("");
    setDateCreate();
    setDateBooking();
    fetchDataBookingList()
  }
  function handleSearch() {
    fetchDataBookingList(namePgt,dateCreate?.$d,DateBooking?.$d)
  }

  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      width: 50,
      align: 'center',
      render: (id, record, index) => { ++index; return index; },
      showSorterTooltip: false,
    },
    {
      title: "Người thuê",
      width: 200,
      dataIndex: "user_name",
      render: (text) => (
        <div className="text-data">
          {text}
        </div>
      ),
    },
    {
      title: "Tên Interpreters",
      dataIndex: "pgt_name",
      width: 140,
      align: 'left',
      render: (text) => <div className="text-data">{text}</div>,
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      width: 160,
      render: (text, data) => <div>{getDate(data?.date, 1)}</div>,
    },
    {
      title: "Ngày booking",
      key: "date",
      dataIndex: "date",
      align: "left",
      width: 200,
      render: (text, data) => <div>{getDate(data?.date, 1)}</div>,
    },
    {
      title: "Thời gian",
      key: "time_from",
      dataIndex: "time_from",
      align: "left",
      width: 200,
      render: (text, data) => <div><span style={{ width: 160 }}>{getTime(data?.time_from)}</span> - {getTime(data.time_to)}</div>,
    },
    {
      title: "Tình trạng",
      key: "status",
      align: "left",
      width: 250, 
      filters:Constants.optionsFilterStatusBooking,
      onFilter: (value, record) => record.status === value,
      render: (value, data) => (
        <Select
          style={{ width: '100%' }}
          onChange={(e) => handleChangeStatusBooking(data?.id, e)}
          options={Constants.optionsStatusBooking} value={data?.status}
        />
      )
    },
    {
      title: "Tổng sô tiền",
      dataIndex: "price",
      key: "price",
      align: 'right',
      width: 200,
      render: (text) => <div className="text-data">{convertStringToNumber(text)}</div>,
    },
    {
      title: "Tác vụ",
      key: "action",
      width: 90,
      align: 'center',
      render: (_, record) =>
        <Space size="middle">
          <Button onClick={(e) => showModal(record?.id)} size='small' type="primary" danger>
            Xóa
          </Button>
        </Space>
    },
  ];

  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(false);
  const showModal = (id) => {
    setDeleteId(id)
    setOpen(true);
  };
  const hideModal = () => {
    setDeleteId();
    setOpen(false);
  };

  const fetchDataUpdateBooking = async (id, type) => {
    try {
      // const response = await BookingFactories.updateBooking(id, type);
      // if (response?.status === 200) {
      //   ToastNoti()
      //   fetchDataBookingList();
      // }
    } catch (error) {
      console.log("🚀 ~ file: Booking.jsx:123 ~ fetchDataUpdateBooking ~ error:", error)
      ToastNotiError()
    }
  };

  async function handleClickDelete() {
    try {
      // const response = await BookingFactories.deleteBookingId(deleteId);
      // if (response?.status === 200) {
      //   ToastNoti()
      //   fetchDataBookingList();
      //   hideModal();
      // }
    } catch (error) {
      hideModal();
      console.log("🚀 ~ file: Booking.jsx:123 ~ fetchDataUpdateBooking ~ error:", error)
      ToastNotiError()
    }
  }

  function handleChangeStatusBooking(id, value) {
    console.log(id);
    fetchDataUpdateBooking(id, value)
  }

  const handleOnChangeDateCreate = (e) => {
    setDateCreate(e);
  };

  const handleOnChangeDateBooking = (e) => {
    setDateBooking(e);
  };

  const handleOnChangeInput = (e) => {
    setNamePgt(e.target.value);
  };

  return (
    <div className="booking-container" style={{ height: '100vh', overflow: 'scroll' }}>
      <div className="booking-title"><span>Booking</span></div>
      <div className="booking-search">
        <Input
          placeholder="Tìm kiếm theo mã, tên người thuê, ..."
          size="middle "
          value={namePgt}
          onKeyDown={(e) => handleKeyDown(e)}
          onChange={(e) => handleOnChangeInput(e)} />
        <DatePicker
          placeholder='Chọn ngày tạo'
          style={{ minWidth: 180 }}
          value={dateCreate ?? ''}
          onChange={(e) => handleOnChangeDateCreate(e)}
        />
        <DatePicker
          style={{ minWidth: 180 }}
          value={DateBooking ?? ''}
          onChange={(e) => handleOnChangeDateBooking(e)}
          placeholder='Chọn ngày booking'
        />
        <Button
          type='default'
          onClick={handleReset}>
            Mặc định
          </Button>
        <Button
          type='primary'
          onClick={handleSearch}>
            Tìm kiếm
          </Button>
      </div>

      <Modal
        title="Xác nhận"
        open={open}
        onOk={handleClickDelete}
        onCancel={hideModal}
        okText="Xác nhận"
        cancelText="Hủy bỏ"
      >
        Bạn chắc chắn muốn xóa lượt booking này ?
      </Modal>

      <div className="booking-table">
        <Table
          columns={columns}
          dataSource={bookingList}
        // dataSource={booking
        //   .filter((item) => {
        //     return monthSelect + statusBooking === ""
        //       ? item
        //       : (item.thoigianbook.slice(3, 5) + item.status).includes(
        //         monthSelect + statusBooking
        //       );
        //   })
        //   .filter((item) => {
        //     return nameKOL.toLowerCase() === ""
        //       ? item
        //       : item.tenKOL.toLowerCase().includes(nameKOL.toLowerCase());
        //   })}
        // pagination={{
        //   defaultPageSize: 10,
        //   showSizeChanger: false,
        //   pageSizeOptions: ["10", "20", "30"],
        // }}
        />
      </div>

    </div>
  );
};

export default Booking;

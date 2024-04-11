import React, { useEffect, useState } from "react";
import { Table, Input, Select, DatePicker, Avatar, Badge } from "antd";
import "./Booking.css";
import Constants from "../../../../utils/constants";
import DropDownBookingRequest from "../../../../components/Dropdown/DropDownBookingRequest/DropDownBookingRequest";
import Temp from "../../../../utils/temp";
import BookingFactories from "../../../../services/BookingFactories";
import { convertStringToNumber, getDate, getTime } from "../../../../utils/Utils";

const RequestBooking = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [bookingList, setBookingList] = useState([]);
  const [monthSelect, setMonthSelect] = useState("");
  const [nameKOL, setNameKOL] = useState("");
  const fetchData = async () => {
    try {
      // const response = await BookingFactories.getListRequestBookingForPGT(user?.id);
      setBookingList(Temp.bookingRequest);
    } catch (error) {
      // Handle errors here
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?.id]);

  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      width: 50,
      fixed: 'left',
      align: 'center',
      render: (id, record, index) => { ++index; return index; },
      showSorterTooltip: false,
    },
    {
      title: "Người thuê",
      width: 150,
      dataIndex: "user_name",
      render: (text) => (
        <div className="text-data">
          {text}
        </div>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "booking_date",
      width: 150,
      render: (text) => <div className="text-data">{text}</div>,
    },
    {
      title: "Ngày booking",
      dataIndex: "booking_date",
      width: 140,
      render: (text) => <div className="text-data">{text}</div>,
    },
    {
      title: "Thời Gian",
      dataIndex: "timestamp",
      width: 200,
      render: (text, data) => <div className="text-data">{data?.timestamp} - {data?.timeEnd}</div>,
    },
    {
      title: "Số tiền",
      dataIndex: "money",
      align: 'right',
      width: 140,
      render: (text) => <div className="text-data">{text}</div>,
    },
    {
      title: "Lĩnh Vực",
      dataIndex: "categoryName",
      align: 'center',
      width: 120,
      render: (text, data) => (
        <Avatar alt={text} src={data?.categoryImage} width={20} height={20} />
      ),
    },
    {
      title: "Tình trạng",
      key: "status",
      align: "left",
      width: 150,
      render: (text, data) =>
        (data.status === '4' || data.status === '5') ? (
          <Badge status="success" text="Hoàn thành" />
        ) : data.status === '3' ? (
          <Badge status="error" text="Interpreters Đã từ chối" />
        ) : data.status === '2' ? (
          <Badge status="processing" text="Interpreters Đã xác nhận" />
        ) : data.status === '1' ? (
          <Badge status="warning" text="Chờ xác nhận" />
        ) : null,
    },
    {
      title: "Tổng sô tiền",
      dataIndex: "price",
      key: "price",
      align: 'right',
      width: 140,
      render: (text) => <div className="text-data">{convertStringToNumber(text)}</div>,
    },
    {
      title: "Tác vụ",
      key: "action",
      width: 90,
      align: 'center',
      render: (_, data) => (
        <DropDownBookingRequest booking={data} status={data?.status} id={data?.id} onFetchData={fetchData} />
      )
    },
  ];

  const handleOnChangeDate = (e) => {
    console.log(e);
  };

  const handleOnChangeMonth = (e) => {
    setMonthSelect(e.target.value);
  };
  const handleOnChangeInput = (e) => {
    setNameKOL(e.target.value);
  };

  return (
    <div className="booking-container">
      <div className="booking-title"><span>Booking</span></div>
      <div className="booking-search">
        <Input
          placeholder="Tìm kiếm theo mã, tên người thuê, ..."
          size="middle "
          onChange={(e) => handleOnChangeInput(e)} />
        <DatePicker
          placeholder='Chọn ngày'
          onChange={(e) => handleOnChangeDate(e?.$d)}
        />
      </div>

      <div className="booking-table">
        <Table
          columns={columns}
          pagination={{
            defaultPageSize: 8,
            showSizeChanger: false,
            pageSizeOptions: ["10", "20", "30"]
          }}
          dataSource={bookingList ?? []}
          scroll={{
            y: 570
          }}
        />
      </div>

    </div>
  );
};

export default RequestBooking;

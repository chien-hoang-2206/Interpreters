import React, { useEffect, useState } from "react";
import { Table, Radio, Input, Select, DatePicker, Avatar } from "antd";
import "./RequireBooking.css";
import Search from "antd/es/input/Search";
import DropdownOperation from "../../../../components/Dropdown/DropdownOperation";
import Constants from "../../../../utils/constants";
import Temp from "../../../../utils/temp";
import DropDownBookingRequest from "../../../../components/Dropdown/DropDownBookingRequest/DropDownBookingRequest";

const RequireBooking = () => {
  const [booking, setBooking] = useState([]);
  const [statusBooking, setStatusBooking] = useState("dabook");
  const [monthSelect, setMonthSelect] = useState("");
  const [nameKOL, setNameKOL] = useState("");

  useEffect(() => {
    const getData = async () => {
      // const listBooking = await BookingData;
      setBooking(Temp.bookingList);
    };
    getData();
  }, []);
  const columns = [
    {
      title: "Mã",
      dataIndex: "code",
      width: 50,
      render: (text) => (
        <div className="text-data">
          {text}
        </div>
      ),
    },
    {
      title: "Người thuê",
      width: 150,
      dataIndex: "username",
      render: (text) => (
        <div className="text-data">
          {text}
        </div>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createAt",
      width: 150,
      render: (text) => <div className="text-data">{text}</div>,
    },
    {
      title: "Ngày booking",
      dataIndex: "date",
      width: 140,
      render: (text) => <div className="text-data">{text}</div>,
    },
    {
      title: "Thời Gian",
      dataIndex: "time",
      width: 200,
      render: (text, data) => <div className="text-data">{data?.timeStart} - {data?.timeEnd}</div>,
    },
    {
      title: "Số tiền",
      dataIndex: "price",
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
      title: "Tác vụ",
      key: "action",
      width: 90,
      align: 'center',
      render: (_, record) => <DropDownBookingRequest record={record} />
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

  const optionCategory = Constants.optionsCategory.map((field) => {
    return {
      value: field.id,
      label: field.name,
    };
  });

  const optionStatus = [
    {
      label: 'Đã chấp nhận',
      value: 1,
    },
    {
      label: 'Chưa chấp nhận',
      value: 2,
    }
  ]

  return (
    <div className="booking-container">
      <div className="booking-title"><span>Yêu cầu booking</span></div>
      <div className="booking-search">
        <Input
          placeholder="Tìm kiếm theo mã, tên người thuê, ..."
          size="middle"
          onChange={(e) => handleOnChangeInput(e)} />
        <Select
          placeholder='Chọn lĩnh vực'
          onChange={(e) => handleOnChangeMonth(e)}
          options={optionCategory}
        />
        <Select
          placeholder='Chọn trạng thái'
          onChange={(e) => handleOnChangeMonth(e)}
          options={optionStatus}
        />
        <DatePicker
          placeholder='Chọn ngày'
          onChange={(e) => handleOnChangeDate(e?.$d)}
        />

      </div>

      <div className="booking-table">
        <Table
          columns={columns}
          dataSource={booking}
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

export default RequireBooking;

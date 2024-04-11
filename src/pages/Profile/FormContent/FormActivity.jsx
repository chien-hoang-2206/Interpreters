import { Avatar, Badge, Button, DatePicker, Select, Table } from "antd";
import { useEffect, useState } from "react";
import Constants from "../../../utils/constants";
import BookingFactories from "../../../services/BookingFactories";
import { getDate, getTime } from "../../../utils/Utils";
import PaymentFactories from "../../../services/PaymentFactories";
import { WalletTwoTone } from "@ant-design/icons";
import Temp from "../../../utils/temp";
export default function FormActivity() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [dateTable, setDataTable] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await BookingFactories.getListBookingForUser(user?.id);
        const response = Temp.bookingRequest
        setDataTable(response);
      } catch (error) {
        // Handle errors here
      }
    };
    fetchData();
  }, [user?.id]);

  const columns = [
    {
      title: "Mã",
      dataIndex: "id",
      key: "id",
      width: 80,
      align: "left",
    },
    {
      title: "Phiên dịch viên",
      dataIndex: "hint_name",
      width: 140,
      align: 'left',
      render: (text) => <div className="text-data">{text}</div>,
    },
    {
      title: "Địa điểm",
      dataIndex: "destination",
      width: 300,
      align: 'left',
      render: (text) => <div className="text-data">{text}</div>,
    },
    {
      title: "Ngày tạo",
      dataIndex: "booking_date",
      key: "created_at",
      width: 160,
      render: (text, data) => <div>{getDate(text, 1)}</div>,
    },
    {
      title: "Ngày booking",
      key: "date",
      dataIndex: "booking_date",
      align: "left",
      width: 200,
      render: (text, data) => <div>{getDate(text, 1)}</div>,
    },
    {
      title: "Thời gian",
      key: "time_from",
      dataIndex: "timestamp",
      align: "left",
      width: 200,
      // render: (text, data) => <div><span style={{ width: 160 }}>{getTime(data?.time_from)}</span> - {getTime(data.time_to)}</div>,
      render: (text, data) => <div><span style={{ width: 160 }}>{text}</span></div>,
    },
    {
      title: "Tình trạng",
      key: "status",
      align: "left",
      width: 200,
      render: (text, data) =>
        data.status === 5 ? (
          <Badge status="success" text="Interpreters và User xác nhận hoàn thành" />
        )
          : data.status === '4' ? (
            <Badge status="success" text="Interpreters xác nhận hoàn thành" />
          ) : data.status === '3' ? (
            <Badge status="error" text="Interpreters Đã từ chối" />
          ) : data.status === '2' ? (
            <Badge status="processing" text="Interpreters Đã xác nhận" />
          ) : data.status === '1' ? (
            <Badge status="warning" text="Chờ xác nhận" />
          ) : null,
    },
  ];

  const handleOnChangeDate = (e) => {
    console.log(e);
  };


  return (
    <div className="booking-container">
      {/* <h1 style={{ marginLeft: 30 }}>Lịch sử booking</h1> */}
      <div className="booking-title"><span>Lịch sử booking</span></div>

      <div className="booking-search" style={{ justifyContent: 'flex-end' }} >
        <DatePicker
          placeholder='Chọn ngày'
          onChange={(e) => handleOnChangeDate(e?.$d)}
        />
      </div>
      <Table columns={columns} dataSource={dateTable ?? []} pagination={{
        defaultPageSize: 8,
        showSizeChanger: false,
        pageSizeOptions: ["10", "20", "30"]

      }}
        scroll={{
          y: 380
        }}
      />
    </div>
  );
}

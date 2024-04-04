import React, { useEffect, useState } from "react";
import { Table, Input, Button } from "antd";
import "./Booking.css";
import AvatarGroup from "../../../../components/image-group/AvatarGroup";
import { ToastNoti, ToastNotiError, convertStringToNumber } from "../../../../utils/Utils";
import AccountFactories from "../../../../services/AccountFactories";
import { createNotification } from "../../../../services/ChatService";
const RequestPGT = ({onReload= ()=> {}}) => {
  const [dataList, setDataList] = useState([]);
  const [namePgt, setNamePgt] = useState("");
  const [typeSearch, setTypeSearch] = useState("");

  const fetchApiList = async (value) => {
    try {
      const response = await AccountFactories.getListAccount(value, 30);
      if (response && response.data) {
        setDataList(response.data);
      } else {
        ToastNotiError()
      }
    } catch (error) {
      ToastNotiError()
    }
  };

  useEffect(() => {
    fetchApiList();
  }, []);

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
      title: 'Tên tài khoản',
      width: 140,
      dataIndex: 'user_name',
      key: 'name',
      fixed: 'left',
    },
    {
      title: 'Giớt tính',
      dataIndex: 'gender',
      key: 'gender',
      width: 110,
      filters: [
        {
          text: 'Nam',
          value: 1,
        },
        {
          text: 'Nữ',
          value: 2,
        },
        {
          text: 'Khác',
          value: 3,
        },
      ],
      onFilter: (value, record) => record.gender === value,
      render: (data) => <div>
        {
          (data === 1 ? 'Nam' : (data === 2 ? 'Nữ' : 'Khác'))
        }
      </div>,
    },
    {
      title: 'Tuổi',
      dataIndex: 'age',
      key: 'age',
      width: 70,
      align: 'center',
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: 'SĐT',
      dataIndex: 'phone',
      width: 130,
      key: 'phone',
    },
    {
      title: "Giá thuê",
      dataIndex: "price",
      key: "price",
      width: 140,
      render: (text) => <div className="text-data">{convertStringToNumber(text)}</div>,
    },
    {
      title: "Lĩnh Vực",
      dataIndex: "listgame",
      key: "listgame",
      align: 'center',
      width: 250,
      render: (text, data) => (
        <AvatarGroup list={data?.listgame ?? []} maxCount={6} />
      ),
    },
    {
      title: "Tác vụ",
      key: "action",
      render: (_, record) => (
        <div className="btn-action-group" >
          <Button  style={{ marginRight: 10 }}
            type='primary'
            onClick={() => onAcceptRequest(record?.id)}
          >
            Chấp nhận
          </Button>
          <Button
            danger
            style={{
              background: 'transparent'
            }}
            onClick={() => onDeleteRequest(record?.id)}
          >
            Từ chối
          </Button>
        </div>
      ),
    },
  ];

  const onDeleteRequest = async (id) => {
      try {
        const resp = AccountFactories.updateStatusRequestPgt(id,10);
        if (resp){
          ToastNoti();
          createNotification(id, 4, 0, "Đăng ký làm Interpreters thất bại", "Admin đã từ chối yêu cầu đăng ký làm Interpreters của bạn.");
          onReload()
          fetchApiList();
        }
      } catch (error) {
        ToastNotiError();
        fetchApiList();
      }
  };
  const onAcceptRequest = async (id) => {
    try {
      const resp = AccountFactories.updateStatusRequestPgt(id,20);
      if (resp){
        ToastNoti();
        fetchApiList();
        onReload()
        createNotification(id, 3, 0, "Đăng ký làm Interpreters thành công", "Admin đã chấp nhận yêu cầu đăng ký làm Interpreters của bạn, vui lòng đăng nhập lại.");
      }
    } catch (error) {
      ToastNotiError();
      fetchApiList();
    }
  };
  
  const handleOnChangeInput = e => {
    setNamePgt(e.target.value);
  };

  function handleReset() {
    setNamePgt();
    setTypeSearch(true);
    fetchApiList()
  }
  function handleSearch() {
    fetchApiList(namePgt, typeSearch)
  }
  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.keyCode === 13) {
      fetchApiList(namePgt);
    }
  };
  return (
    <div className="booking-container">
      <div className="booking-title"><span>Yêu cầu làm Interpreters</span></div>
      <div className="booking-search">
        <Input
          placeholder="Tìm kiếm theo mã, tên người thuê, ..."
          size="middle "
          value={namePgt}
          onKeyDown={(e) => handleKeyDown(e)}
          onChange={(e) => handleOnChangeInput(e)} />
        <Button
          type='default'
          onClick={handleReset}
        >
          Mặc định
        </Button>
        <Button
          type='primary'
          onClick={handleSearch}
        >
          Tìm kiếm
        </Button>
      </div>
      <div className="booking-table">
        <Table
          columns={columns}
          dataSource={dataList}
        />
      </div>

    </div>
  );
};

export default RequestPGT;

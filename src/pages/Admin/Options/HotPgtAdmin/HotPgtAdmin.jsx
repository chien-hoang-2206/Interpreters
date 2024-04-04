import React, { useEffect, useState } from "react";
import { Button, Input, Select, Table } from "antd";
import "./HotPgt.css";
import PgtFactories from "../../../../services/PgtFatories";
import StarRating from "../../../../components/start-rating/StarRating";
import { ToastNoti, ToastNotiError, convertStringToNumber, partStringToNumber as parseStringToNumber } from "../../../../utils/Utils";
import AccountFactories from "../../../../services/AccountFactories";

const HotPgtAdmin = () => {
  const [namePgt, setNamePgt] = useState("");
  const [typeSearch, setTypeSearch] = useState(10);
  const [hotPgts, setHotPgtList] = useState([]);

  const fetchData = async (name, type) => {
    try {
      const response = await PgtFactories.getListPGT(type, name);
      setHotPgtList(response);
    } catch (error) {
      ToastNotiError();
    }
  };
  useEffect(() => {
    fetchData();
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
      title: "Tên Interpreters",
      width: 200,
      dataIndex: "username",
      render: (text) => (
        <div className="">
          {text}
        </div>
      ),
    },
    // {
    //   title: "Lượt theo dõi",
    //   dataIndex: "follower",
    //   align: 'right',
    //   key: "follower",
    //   render: text =>
    //     <div>
    //       {parseStringToNumber(text)}
    //     </div>
    // },
    {
      title: "Lượt booking",
      align: 'right',
      dataIndex: "booking",
      key: "booking",
      render: text =>
        <div>
          {parseStringToNumber(text)}
        </div>
    },
    {
      title: "Đánh giá",
      align: 'right',
      dataIndex: "star",
      key: "star",
      render: (star) => <StarRating starCount={star} />
    },
    {
      title: "Tổng doanh thu",
      dataIndex: "money",
      key: "money",
      align: 'right',
      render: text =>
        <div>
          {convertStringToNumber(text)}
        </div>
    },
    {
      title: "Tác vụ",
      key: "action",
      width: 300,
      render: (_, record) =>
        <div className="action-btn" >
          <Button
            type='primary'
            onClick={() => record?.hot_pgt ? handleDeleteHotPgt(record) : handleAddHotPgt(record)}
          >
            {record?.hot_pgt ? 'Xóa nổi bật' : 'Thêm nổi bật'}
          </Button>
        </div>
    }
  ];

  const handleOnChangeInput = e => {
    setNamePgt(e.target.value);
  };
  const handleAddHotPgt = async value => {
    const data = {
      hot_pgt: true
    }
    try {
      const response = await AccountFactories.requestUpdate(value?.id, data);
      if (response.status === 200) {
        ToastNoti();
        fetchData(null, typeSearch);
      } else {
        ToastNotiError();
      }
    } catch (error) {
      console.log(error);
      ToastNotiError();
    }
  };
  const handleDeleteHotPgt = async value => {
    const data = {
      hot_pgt: false
    }
    try {
      const response = await AccountFactories.requestUpdate(value?.id, data);
      if (response.status === 200) {
        ToastNoti();
        fetchData(null, typeSearch);
      } else {
        ToastNotiError();
      }
    } catch (error) {
      console.log(error);
      ToastNotiError();
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.keyCode === 13) {
      fetchData(namePgt);
    }
  };

  function handleReset() {
    setNamePgt();
    setTypeSearch(10);
    fetchData()
  }
  function handleSearch() {
    fetchData(namePgt, typeSearch)
  }
  return (
    <div className="booking-container" style={{ height: '100vh', overflow: 'scroll' }}>
      <div className="booking-title"><span>Nổi Bật</span></div>
      <div className="booking-search">
        <Input
          placeholder="Tìm kiếm theo mã, tên người thuê, ..."
          size="middle "
          value={namePgt}
          onKeyDown={(e) => handleKeyDown(e)}
          onChange={(e) => handleOnChangeInput(e)} />
        <Select
          placeholder='Chọn trạng thái'
          options={[
            {
              value: 10,
              label: 'Nổi bật'
            },
            {
              value: 0,
              label: 'Chưa nổi bật'
            },
          ]}
          value={typeSearch}
          onChange={(e) => setTypeSearch(e)}
          style={{ minWidth: 180 }}
        />
        <Button
          type='default'
          style={{
            backgroundColor: 'transparent'
          }}
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
          dataSource={hotPgts ?? []}
          pagination={{
            defaultPageSize: 8,
            showSizeChanger: false,
            pageSizeOptions: ["10", "20", "30"]
          }}
        />
      </div>
    </div>
  );
};

export default HotPgtAdmin;

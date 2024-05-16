import React, { useEffect, useState } from "react";
import { Input, Select, Table } from "antd";
import "./styles.css";
import HintFactories from "../../../../services/HintFatories";
import StarRating from "../../../../components/start-rating/StarRating";
import { ToastNoti, ToastNotiError, convertStringToNumber, partStringToNumber as parseStringToNumber } from "../../../../utils/Utils";
import AccountFactories from "../../../../services/AccountFactories";
import { useTranslation } from "react-i18next";
import { Button } from "@nextui-org/react";

const HotHintAdmin = () => {
  const [namePgt, setNamePgt] = useState("");
  const [typeSearch, setTypeSearch] = useState(10);
  const [hotHints, setHotHintsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation()
  const fetchData = async (name, type) => {
    try {
      setLoading(true)
      const response = await HintFactories.getListHINT(type, name);
      setHotHintsList(response);
      setLoading(false)
    } catch (error) {
      setLoading(false)
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
          {parseStringToNumber(text ?? 10)}
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
          {convertStringToNumber(text ? text : 3200000)}
        </div>
    },
    {
      title: t('action'),
      key: "action",
      width: 300,
      render: (_, record) =>
        <div className="action-btn" >
          <Button
            type='primary'
            onClick={() => record?.hot_hint ? handleDeleteHotPgt(record) : handleAddHotPgt(record)}
          >
            {record?.hot_hint ? 'Xóa nổi bật' : 'Thêm nổi bật'}
          </Button>
        </div>
    }
  ];

  const handleOnChangeInput = e => {
    setNamePgt(e.target.value);
  };
  const handleAddHotPgt = async value => {
    const data = {
      hot_hint: true
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
      hot_hint: false
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
          className="h-full"
          value={typeSearch}
          onChange={(e) => setTypeSearch(e)}
          style={{ minWidth: 180 }}
        />
        <Button
          color='default'
          onClick={handleReset}
        >
          {t('default')}
        </Button>
        <Button
          color='primary'
          onClick={handleSearch}
        >
          {t('search')}
        </Button>
      </div>
      <div className="booking-table">
        <Table
          columns={columns}
          dataSource={hotHints ?? []}
          scroll={
            {
              y: 440
            }
          }
          loading={loading}
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

export default HotHintAdmin;

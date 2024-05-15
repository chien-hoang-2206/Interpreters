import React, { useEffect, useState } from "react";
import { Table, Select } from "antd";
import classes from "./AccountInterpreters.module.css";
import Constants from "../../../../utils/constants";
import AvatarGroup from "../../../../components/image-group/AvatarGroup";
import Search from "antd/es/input/Search";
import DropdownOperation from "../../../../components/Dropdown/DropdownOperation";
import AccountFactories from "../../../../services/AccountFactories";
import { toast } from "react-toastify";
import CategoriesFactories from "../../../../services/CategoryFactories";
import { useTranslation } from "react-i18next";

const AccountInterpreters = () => {
  const [pgtList, setPgtList] = useState([]);
  const [valueSearch, setValueSearch] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation()


  const fetchApiList = async (value) => {
    try {
      setLoading(true)
      const response = await AccountFactories.getListAccount(value, 20);
      if (response && response.data) {
        setPgtList(response.data);
      } else {
        toast.error('Hệ thống lỗi')
        console.error("API response does not contain expected data:", response);
      }
      setLoading(false)

    } catch (error) {
      setLoading(false)
      toast.error('Hệ thống lỗi')
    }
  };

  useEffect(() => {
    fetchApiList();
  }, []);
  function handleReload() {
    fetchApiList();
  }
  const [categoriesList, setCategoryList] = useState()
  useEffect(() => {
    const fetchData = async () => {
      const response = await CategoriesFactories.getListCategories();
      const convertList = response?.map(item => ({
        value: item?.id,
        text: item?.name,
      }))
      setCategoryList(convertList);
    };
    fetchData();
  }, []);


  function handleSearch() {
    fetchApiList(valueSearch)
  }
  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.keyCode === 13) {
      fetchApiList(valueSearch);
    }
  };

  const onChangeSelectHandler = (value, id) => {
    console.log(value, id)
  };

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
      title: 'Tên tài khoản',
      width: 140,
      dataIndex: 'user_name',
      key: 'name',
      fixed: 'left',
    },
    {
      title: 'Email',
      width: 140,
      dataIndex: 'email',
      key: 'email',
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
      render: (text) =>
        <div>
          {text ?? 19}
        </div>,
    },
    {
      title: 'SĐT',
      dataIndex: 'phone',
      width: 130,
      key: 'phone',
    },

    {
      title: 'Lĩnh vực',
      dataIndex: 'listgame',
      key: 'listgame',
      width: 150,
      filters: categoriesList ?? [],
      onFilter: (value, record) => {
        return record.listgame.some((item) => item.id === value);
      },
      render: (data) => <AvatarGroup list={data} maxCount={4} />
    },
    // {
    //   title: 'Tỷ lệ',
    //   width: 160,
    //   dataIndex: 'rate',
    //   key: '7',
    //   // defaultSortOrder: 'descend',
    //   sorter: (a, b) => a.rateDone - b.rateDone,
    // },
    // {
    //   title: 'Đánh giá',
    //   dataIndex: 'star',
    //   width: 140,
    //   key: '7',
    //   defaultSortOrder: 'descend',
    //   sorter: (a, b) => a.star - b.star,
    //   render: (star) => <StarRating starCount={star} />
    // },
    {
      title: 'Trạng thái',
      dataIndex: 'flag',
      key: 'flag',
      width: 200,
      filters: [
        {
          text: 'Đang hoạt động',
          value: 1,
        },
        {
          text: 'Khóa tài khoản',
          value: 2,
        },
      ],
      onFilter: (value, record) => record.flag === value,
      render: (_, data) =>
        <Select
          style={{
            width: "100%",
          }}
          onChange={(value) => onChangeSelectHandler(value, data?.id)}
          value={data?.flag}
          options={Constants.optionStatusAccount}
        />
    },
    {
      title: 'Tác vụ',
      key: 'operation',
      width: 130,
      align: 'center',
      render: (_, record) => (
        <DropdownOperation record={record} type={'Interpreters'} updateSuccess={handleReload} />
      )
    },
  ];


  return (
    <>
      <div className={classes["admin-user-container"]}>
        <div className={classes["header"]}>
          <div className={classes["titleTable"]}>
            <span> Danh sách người dùng</span>
          </div>
          <div className={classes["searchInput"]}>
            <Search
              allowClear
              enterButton="Search"
              onChange={(e) => setValueSearch(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e)}
              placeholder="Tìm kiếm với tên,...."
              onSearch={handleSearch} />
          </div>
        </div>
        <div className={classes["rowContent"]}>
          <Table
            columns={columns}
            dataSource={pgtList ?? []}
            loading={loading}
          // scroll={{
          //   y: 'calc(100vh - 220px)'
          // }}
          />
        </div>
      </div>
    </>
  );
};

export default AccountInterpreters;

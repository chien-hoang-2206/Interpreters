import React, { useEffect, useMemo, useState } from "react";
import { Table, Input, Select } from "antd";
import classes from "./AccountUser.module.css";
import Constants from "../../../../utils/constants";
import DropdownOperation from "../../../../components/Dropdown/DropdownOperation";
import AccountFactories from "../../../../services/AccountFactories";


const AccountUser = () => {
  const { Search } = Input;
  const [userList, setUserList] = useState([]);

  const fetchApiList = async (value) => {
    try {
      const response = await AccountFactories.getListAccount(value);
      if (response && response.data) {
        setUserList(response.data);
      } else {
        console.error("API response does not contain expected data:", response);
      }
    } catch (error) {
      console.error("Error while fetching API:", error);
    }
  };
  function handleSearch() {
    fetchApiList(valueSearch)
  }
  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.keyCode === 13) {
      fetchApiList(valueSearch);
    }
  };

  useEffect(() => {
    fetchApiList();
  }, []);

  function handleReload () {
    fetchApiList();
  }
  const [valueSearch, setValueSearch] = useState();
  
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
        <DropdownOperation record={record} updateSuccess={handleReload} />
      )
    },
  ];

  const onChangeSelectHandler = (value, id) => {
    console.log(value, id)
  };

  const onChange = (pagination, filters, sorter, extra) => {
  };

  return (
    <div className={classes["admin-user-container"]}>
      <div className={classes["header"]}>
        <div className={classes["titleTable"]}>
          <span>Danh sách người dùng</span>
        </div>
        <div className={classes["searchInput"]}>
          <Search
            allowClear
            enterButton="Search"
            onChange={(e) => setValueSearch(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e)}
            allowClear
            placeholder="Tìm kiếm với tên,...."
            onSearch={handleSearch} />
        </div>
      </div>

      <div className={[classes.tableContent]}>
        <Table
          columns={columns}
          dataSource={userList ?? []}
          onChange={onChange}
          scroll={{
            y: 'calc(100vh - 215px)'
          }}
        />
      </div>

    </div>
  );
};

export default AccountUser;

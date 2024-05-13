import React, { useState, useEffect, useLayoutEffect } from "react";

import styles from "../content.module.scss";
import styled from "styled-components";
import { Button, Input, Select } from 'antd';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons'
import HintFactories from "../../../services/HintFatories";
import CategoriesFactories from "../../../services/CategoryFactories";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import CardInterpreters from "../../card/CardInterpreters/CardInterpreters";

const Title = styled.h2`
  color: #f0564a;
`;

const ModalSearch = () => {
  const [pgtList, setPgtList] = useState([]);
  const [searchName, setSearchName] = useState();
  const [categoriesList, setCategoryList] = useState()
  const [searchCategory, setSearchCategory] = useState();
  const [categoriesOptions, setCategoryOptions] = useState()

  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get("keyword");
  const category = searchParams.get("category");

  useEffect(() => {
    const optionCategory = categoriesList?.map((field) => {
      return {
        value: field.id,
        label: field.name,
      };
    });
    setCategoryOptions(optionCategory);
  }, [categoriesList])


  const fetchData = async (keyword, category) => {
    try {
      const response = await HintFactories.getListPGT(20, keyword, category);
      console.log("🚀 ~ fetchData ~ response:", response)
      setPgtList(response);
    } catch (error) {
      toast.error('Có lỗi xảy ra.')
    }
  };

  useEffect(() => {
    fetchData(keyword, category);
    if (keyword) {
      setSearchName(keyword)
    }
    if (category) {
      setSearchCategory(parseInt(category))
    }
  }, [keyword, category])


  useEffect(() => {
    const fetchData = async () => {
      const response = await CategoriesFactories.getListCategories();
      setCategoryList(response);
    };
    fetchData();
  }, []);

  const onChangeFieldHandler = (value) => {
    setSearchCategory(parseInt(value));
  };

  const onChangeNameHandler = (event) => {
    setSearchName(event.target.value);
  };

  useEffect(() => {
    if (searchCategory) {
      onSearchHandler()
    }
  }, [searchCategory])

  const onSearchHandler = () => {
    if (searchCategory) {
      navigate(`/hint?category=${searchCategory}`)
    }
    if (searchName) {
      navigate(`/hint?keyword=${searchName}`)
    }
    if (searchName && searchCategory) {
      navigate(`/hint?keyword=${searchName}&category=${searchCategory}`)
    }
  }

  const onResetHandler = () => {
    setSearchCategory(null)
    setSearchName("")
    navigate({
      pathname: location.pathname,
      search: '',
    }, { replace: true });
  }

  return (
    <div style={{ width: '98%' }}>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between', width: '100%' }}>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-start', height: 30, width: '60%' }} >
          <Input
            type="text"
            value={searchName}
            style={{ width: 300 }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                onSearchHandler();
              }
            }}
            placeholder='Nhập tên cần tìm'
            onChange={onChangeNameHandler}
          />
          <Select
            style={{ width: 350 }}
            options={categoriesOptions}
            value={searchCategory}
            onChange={onChangeFieldHandler}
            placeholder='Chọn lĩnh vực'
          />
        </div>
        <div style={{ marginLeft: 10, display: 'flex', gap: 8, justifyContent: 'flex-end', height: 30, width: '30%' }} >
          <Button
            type='default'
            style={{
              backgroundColor: 'transparent'
            }}
            onClick={onResetHandler}
          >
            Thiết lập lại
          </Button>
          <Button
            type='default'
            style={{
              color: '#fff'
            }}
            onClick={onSearchHandler}
          >
            Tìm kiếm
          </Button>
        </div>
      </div>

      <div className={styles['search-result']}>
        <Title>{`Kết quả tìm kiếm (${pgtList?.length})`}</Title>
        {pgtList?.length === 0 && <span>Không có kết quả tìm kiếm</span>}
        {pgtList?.length > 0 &&
          <>
            <div className={styles['boxContent']}>
              <div className={styles['search-content']}>
                {pgtList?.map((pgt, i) => (
                  <CardInterpreters key={i} data={pgt} />
                ))}
              </div>
            </div>
          </>
        }
      </div>
    </div>
  );
};

export default ModalSearch;

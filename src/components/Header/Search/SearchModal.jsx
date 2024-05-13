import React, { useState, useEffect, useLayoutEffect, startTransition, useDeferredValue } from 'react'
import { Input, Avatar } from 'antd';
import classes from './SearchModal.module.css'
import { Link, useLocation, useNavigate } from "react-router-dom";
import HintFactories from '../../../services/HintFatories';
import { useTranslation } from 'react-i18next';

const { Search } = Input;

const SearchModal = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState()
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get("keyword");

  useEffect(() => {
    if (keyword) {
      setValue(keyword)
    }
  }, [keyword])

  const onChangeInputHandler = (e) => {
    const value = e.target.value.trim();
    setValue(value);
  }

  const onSearch = () => {
    navigate(`/hint?keyword=${value}`)
    setValue('')
  }

  let x = window.innerWidth;
  const [windowChange, setWindowChange] = useState({
    widthSearch: 300,
    leftSearch: '150px'
  });

  useLayoutEffect(() => {
    window.addEventListener("resize", function () {
      x = window.innerWidth;
      setTimeout(() => {
        if (x > 1100 && x <= 1359) {
          setWindowChange({
            widthSearch: 300,
            leftSearch: '150px',
          })
        }
        if (x > 800 && x <= 1099) {
          setWindowChange({
            widthSearch: 250,
            leftSearch: '150px',
          })
        }
      }, 500)
    });
  }, [x])

  const { t } = useTranslation()
  return (
    <div className={classes['search-modal']} style={{ left: windowChange.leftSearch, }}  >
      <Search
        size="medium"
        placeholder={t('searcH_imt')}
        onSearch={onSearch}
        onChange={onChangeInputHandler}
        style={{ width: windowChange.widthSearch, }}
      />
    </div >
  )
}

export default SearchModal


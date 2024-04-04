import React, { useContext, useEffect, useState } from "react";
import styles from './content.module.scss';
import ModalSearch from "./search-pgt/ModalSearch";
import Banner from "../Banner/Banner";
import BannerFactories from "../../services/BannerFactories";
import { ToastNotiError } from "../../utils/Utils";

const ContentSearch = (props) => {
  const { serchValue, categoryId } = props;

  const [data, setData] = useState([]);
  const fetchApiList = async (value) => {
    try {
      const response = await BannerFactories.getListBanner();
      if (response?.status === 200) {
          setData(response.data);
      } else {
          ToastNotiError()
          console.error("API response does not contain expected data:", response);
      }
    } catch (error) {
      ToastNotiError()
    }
  };

  useEffect(() => {
    fetchApiList(serchValue);
  }, [serchValue]);

  return (
    <div className={styles.container}>
      <div className={styles.boxContainer} >
        <Banner data={data} />
      </div>
      <div className={styles.boxContainer}>
        <ModalSearch categoryId={categoryId} searchValue={serchValue} />
      </div>
    </div>
  );
};

export default ContentSearch;

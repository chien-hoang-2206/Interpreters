import React, { useEffect, useState } from "react";
import styles from './content.module.scss';
import Banner from "../Banner/Banner";
import { ToastNotiError } from "../../utils/Utils";
import b5 from '../../assets/banner/b5.jpg'
import HotInterpreters from "./hot-interpreters/HotInterpreters";
import TopInterpreters from "./top-interpreters/TopInterpreters";
import { useTranslation } from 'react-i18next';
import BannerFactories from "../../services/BannerFactories";

const ContentHome = (props) => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const id = props?.id
  const fetchApiList = async () => {
    try {
      const response = await BannerFactories.getListBanner();
      if (response?.status === 200) {
        setData(response.data);
      } else {
        ToastNotiError()
        console.error("API response does not contain expected data:", response);
      }
      // const resp = [
      //   // {
      //   //   url: b1
      //   // },
      //   {
      //     url: b5
      //   },
      // ]
      // setData(resp);
    } catch (error) {
      ToastNotiError()
    }
  };

  useEffect(() => {
    fetchApiList();
  }, []);

  return (
    <>
      <div className={`styles.container w-full py-5 xl:w-[1120px]`}>
        <div className='w-full py-5 xl:w-[1120px] ' >
          <Banner data={data} />
        </div>
        <div className={styles.boxContainer} >
          <TopInterpreters />
          <HotInterpreters serchValue={props.serchValue} id={id}/>
          {/* <OutStandingPGT /> */}
        </div>
      </div>
    </>
  );
};

export default ContentHome;

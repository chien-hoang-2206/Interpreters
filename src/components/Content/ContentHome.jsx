import React, { useEffect, useState } from "react";
import styles from './content.module.scss';
import Banner from "../Banner/Banner";
import { ToastNotiError, getDate } from "../../utils/Utils";
import b5 from '../../assets/banner/b5.jpg'
import HotInterpreters from "./hot-interpreters/HotInterpreters";
import TopInterpreters from "./top-interpreters/TopInterpreters";
import { useTranslation } from 'react-i18next';
import BannerFactories from "../../services/BannerFactories";
import DestinationFactories from "../../services/DestinationFatories";
import { useNavigate } from "react-router-dom";
import { Button, Card, CardFooter, Image, Skeleton } from "@nextui-org/react";
const ContentHome = (props) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [TouristDes, setTouristDes] = useState([])
  const navigate = useNavigate()
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



  const fetchData = async (Keyword) => {
    setLoading(true)
    const response = await DestinationFactories.getListDestination({});
    setTouristDes(response);
    setLoading(false)
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className={`styles.container w-full py-5 xl:w-[1120px]`}>
        <div className='w-full py-5 xl:w-[1120px] ' >
          <Banner data={data} />
        </div>
        
        <div className='w-full py-5 xl:w-[1120px]' >
          <span className="text-2xl font-bold ">{t('des_popular')}</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 overflow-auto p-2">




            {TouristDes?.slice(0, 5)?.map(item => (
              <Card
                isFooterBlurred
                key={item.id}
                onPress={() => navigate(`/destination/${item.id}`)}
                radius="lg"
              >
                <Image
                  alt="Woman listing to music"
                  className="object-cover w-[600px] h-52"
                  src={item.image}
                />
                <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_1px)] shadow-small ml-1 z-10">
                  <p className="text-tiny text-white/80">{item.name}</p>
                  <Button onClick={() => navigate(`/destination/${item.id}`)} className="text-tiny text-white bg-black/20" variant="flat" color="default" radius="lg" size="sm">
                    Chi tiết
                  </Button>
                </CardFooter>
              </Card>
            ))}


            {/* {TouristDes?.map(item => (
              <Card
                hoverable
                key={item.id}
                style={{
                  width: 240,
                }}
                onClick={()=> navigate(`/destination/${item.id}`)}
                cover={<img className="object-fill w-32 h-32"  alt="example" src={item.image} />}
              >
                <Meta title={item.name} description={`Giờ mở cửa: ${getDate(item?.time_start, 6)} - ${getDate(item?.time_end, 6)}`} />
              </Card>
            ))} */}
          </div>
          <div className="w-full flex justify-center">
            <Button variant="bordered" color='warning' onClick={() => navigate('/destination')} >{t('view_all')}</Button >
          </div>
        </div>

        <div className={styles.boxContainer} >
          <TopInterpreters />
          <HotInterpreters serchValue={props.serchValue} id={id} />
          {/* <OutStandingPGT /> */}
        </div>
      </div>
    </>
  );
};

export default ContentHome;

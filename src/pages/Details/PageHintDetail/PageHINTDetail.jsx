import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/auth.context";
import styles from './HomeDetails.module.scss'
import { CollapseContext } from "../../../context/collapse.context";
import CardType from "../../../components/catgegory/CardType";
import Feedback from "../../../components/Feedback/Feedback";
import { Carousel, Pagination } from 'antd';
import HintFactories from "../../../services/HintFatories";
import { toast } from "react-toastify";
import { convertStringToNumber, getDate } from "../../../utils/Utils";
import { Avatar, Button, Image, Spinner } from "@nextui-org/react";
import BoxCustom from "../../../components/Box/BoxCustom";
import { useTranslation } from "react-i18next";
import { StarFilled } from "@ant-design/icons";
import BookingCreate from "../../Booking/BookingCreate";

const PageInterpreterDetail = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [hintInfo, setHintInfo] = useState();
  const navigate = useNavigate();
  const { t } = useTranslation()
  const [open, setOpen] = useState(false);
  const [statusHint, setStatusHint] = useState("");
  const { isCollapse } = useContext(CollapseContext);
  const [dataFeedback, setDataFeedback] = useState();
  const [rate, setRate] = useState();
  const [loading, setLoading] = useState();


  async function fetchFeedbackData(id) {
    try {
      const resp = await HintFactories.getHINTFeedbackList(id);
      if (resp.status === 200) {
        setDataFeedback(resp.data);
        setRate(resp.rate)
      }
    } catch (error) {

    }
  }

  useEffect(() => {
    if (id) {
      fetchFeedbackData(id);
    }
  }, [id])


  useEffect(() => {
    window.scroll(0, 0)
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await HintFactories.getHINTDetail(id);
        setHintInfo(response[0]);
        setStatusHint(response[0].status);
        setLoading(false)

      } catch (error) {
        toast.error('Hệ thống lỗi, vui lòng thử lại sau')
        setLoading(false)
        // Handle errors here
      }
    };
    fetchData();
    document.title = `Thồng tin Interpreters`;
  }, []);

  const checkStatus = (bookings, user, kol) => {
    if (!user) {
      setStatusHint("GUEST");
    } else if (kol.userId === user.id) {
      setStatusHint("ME");
    } else if (
      bookings.findIndex(
        (booking) => booking.user.id === user.id && booking.status === "PENDING"
      ) !== -1
    ) {
      setStatusHint("PENDING");
    } else if (
      bookings.findIndex(
        (booking) =>
          booking.user.id === user.id && booking.status === "ACCEPTED"
      ) !== -1
    ) {
      setStatusHint("ACCEPTED");
    } else setStatusHint("BOOK");
  };



  const bookingHandler = () => {
    if (!user) {
      navigate('/login');
    }
    setOpen(true);
  };

  const handleClickChat = () => {
    navigate(`/chat`, {
      state: {
        chatId: id,
        toUserAvatar: hintInfo?.avatar,
        toUserName: hintInfo?.user_name,
      }
    })
  };

  const onChange = (key) => {
    console.log(key);
  };

  const onRedirect = () => {
    const booking = hintInfo.bookings.find(
      (booking) => booking.status === statusHint && booking.user.id === user.id
    );
    if (booking) {
      navigate(`/bookings/${booking.id}`);
    }
  };


  const renderFeedBack = () => {
    return (
      <>
        {dataFeedback?.map((item, index) => (
          <Feedback
            key={index}
            avatar={item?.avatar}
            userName={item?.user_name}
            comment={item?.comment}
            star={item?.rate}
            timeRental={1}
            date={getDate(item?.date)}
          />
        ))}

        <div className={styles.boxPagination} >
          <Pagination
            defaultCurrent={1}
            total={dataFeedback?.length}
          />
        </div>
      </>
    )
  };



  return (
    <>
      {open === true &&
        <BookingCreate
          data={hintInfo ?? ''}
          onCancelOpenHandler={() => setOpen()}
          open={open}
        />
      }
      <div className="py-10 w-full flex flex-col justify-center items-center">
        <div className="w-full flex flex-col justify-center items-center min-h-[500px]">
          {loading ? <Spinner /> :
            <div className="flex flex-row justify-between items-start gap-5">
              <div className="w-[220] flex flex-col justify-start gap-5 items-center">
                <BoxCustom
                  alignTitle='center'
                  description={
                    <>
                      <div className='flex flex-col w-[300px]'>
                        <div className="flex px-4 py-2 w-full flex-col gap-4 justify-center items-center">

                          <div className="flex-shrink-0">
                            <Avatar
                              src={hintInfo?.avatar}
                              alt=""
                              style={{
                                width: '250px',
                                height: '300px',
                              }}
                              className="object-cover w-full h-full rounded-lg"
                            />
                          </div>
                          <div className="flex flex-col flex-start w-full gap-2">
                            <span className='font-bold '>
                              Họ và Tên: {hintInfo?.first_name} {hintInfo?.last_name}
                            </span>
                            <span className='font-bold  '>
                              {t('gender')}: {hintInfo?.gender === 1 ? t('female') : t('male')}
                            </span>
                            <span className='font-bold  '>
                              Tuổi: {hintInfo?.age}
                            </span>
                            <span className='font-bold text-2xl text-center flex flex-col gap-2 text-blue2'>
                              <Button color='success' style={{ color: 'white' }} disabled>
                                {statusHint === 1 ? t('working') : t('pendding')}
                              </Button>

                              {statusHint === 1 &&
                                <Button onClick={() => bookingHandler()} className="bg-gradient-to-tr from-pink-300 to-blue-700 text-white shadow-lg">
                                  {t('booking')}
                                </Button>
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                    </>}
                />


                <BoxCustom
                  title='Giá dịch vụ'
                  description={
                    <>
                      <div className='mt-[0px] flex flex-col w-[300px]'>
                        <div className="flex w-full flex-col gap-4 justify-center items-center">
                          <div className="flex flex-col flex-start w-full gap-2">
                            <ul className='font-bold ' >
                              {t('for_per')}
                              <li className='ml-2 text-gray-500 flex justify-between'>
                                <span>
                                  {t('for_mor')}:
                                </span>
                                <span className=" font-medium  text-yellow-400">
                                  {convertStringToNumber(hintInfo?.price?.personal_price_session)}
                                </span>
                              </li>
                              <li className='text-gray-500  ml-2  flex justify-between'>
                                <span>
                                {t('for_day')}:
                                </span>
                                <span className=" font-medium  text-yellow-400">
                                  {convertStringToNumber(hintInfo?.price?.personal_price_day)}
                                </span>
                              </li>
                            </ul>

                            <ul className='font-bold ' >
                            {t('for_group')}
                              <li className='text-gray-500 ml-2  flex justify-between'>
                                <span>
                                {t('for_mor')}:
                                </span>
                                <span className=" font-medium  text-yellow-400">
                                  {convertStringToNumber(hintInfo?.price?.group_price_session)}/{t('personal')}
                                </span>
                              </li>
                              <li className='text-gray-500  ml-2 flex justify-between'>
                                <span>
                                {t('for_day')}:
                                </span>
                                <span className=" font-medium ml-2 text-yellow-400">
                                  {convertStringToNumber(hintInfo?.price?.group_price_day)}/{t('personal')}
                                </span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </>}
                />


              </div>

              <div className="w-[800px] flex flex-col gap-14 justify-center items-center">

                <div className="flex flex-col justify-start w-full gap-5 ">
                  <div className="flex flex-col justify-start w-full ">
                    <BoxCustom
                      alignTitle='center'
                      title={t('overview')}
                      description={
                        <div className="flex flex-row justify-around w-full p-5 pt-0" >
                          <div className="flex flex-col gap-1 w-44"  >
                            <span className="font-bold text-xl text-[#354052]">{t('count_booking')}</span>
                            <span className='font=bold text-xl'>{dataFeedback?.length ?? 0}</span>
                          </div>
                          <div className="flex flex-col gap-1 w-60"  >
                            <span className="font-bold text-xl text-[#354052]">{t('rate_booking')}</span>
                            <span className='font=bold text-xl'>{parseInt(rate ?? 100) ?? ''}%</span>
                          </div>
                          <div className="flex flex-col gap-1 w-44"  >
                            <span className="font-bold text-xl text-[#354052]">{t('cmt_booking')}</span>
                            <span className='font=bold text-xl mr-1'>{hintInfo?.star ?? 0}
                              <StarFilled className='text-yellow-500 ml-1' />
                            </span>
                          </div>
                        </div>
                      }
                    />
                  </div>



                  <div>
                    {/* <span className="text-3xl text-blue font-bold"> Các dịch vụ</span> */}
                    <div className="flex flex-col justify-start w-full">
                      <BoxCustom
                        title={t('lan_booking')}
                        description={
                          <div className="flex flex-wrap gap-12 p-5 pt-0 justify-center items-center bg-[#fff]">
                            {hintInfo?.listgame?.map((item, index) => (
                              <CardType
                                key={index}
                                image={item.image}
                                id={item.id}
                                name={item.name}
                                background={item.image}
                              />
                            ))}
                          </div>
                        }
                      />
                    </div>
                  </div>

                  <div>
                    {/* <span className="text-3xl mb-3 text-blue font-bold"> Giới thiệu</span> */}
                    <BoxCustom
                      title={t('intro')}
                      alignTitle='center'
                      description={
                        <div className="whitespace-pre-line min-h-32" >
                          {hintInfo?.introduction}
                        </div>
                      }
                    />
                  </div>

                  <div className="carousel-custom ">
                    <BoxCustom
                      title={t('photo_working')}
                      description={
                        <div className="flex flex-wrap gap-12 p-5 pt-0 justify-center items-center bg-[#fff]">
                          <Carousel
                            arrows={true}
                            style={{ width: 730 }}
                          >
                            {hintInfo?.listImage?.map((item, index) => (
                              <>
                                <Image
                                  key={index}
                                  src={item?.link ?? ''}
                                  style={{ width: 730, objectFit: 'fill' }}
                                />
                              </>
                            ))
                            }
                          </Carousel>
                        </div>
                      }
                    />
                  </div>

                  <div className="w-full">
                    <BoxCustom
                      alignTitle='center'
                      title={t('review')} 
                      description={
                        <>
                          {dataFeedback?.map((item, index) => (
                            <Feedback
                              key={index}
                              avatar={item?.avatar}
                              userName={item?.user_name}
                              comment={item?.comment}
                              star={item?.rate}
                              timeRental={1}
                              date={getDate(item?.date)}
                            />
                          ))}

                          <div className={styles.boxPagination} >
                            <Pagination
                              defaultCurrent={1}
                              total={dataFeedback?.length}
                            />
                          </div>
                        </>
                      }
                    />
                  </div>

                </div>
              </div>
            </div>
          }
        </div>
      </div >
    </>
  );
};
export default PageInterpreterDetail;

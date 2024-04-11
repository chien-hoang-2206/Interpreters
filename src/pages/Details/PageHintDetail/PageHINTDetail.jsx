import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import IntroduceHint from "./IntroduceKOL/IntroduceKOL";
import { AuthContext } from "../../../context/auth.context";
import styles from './HomeDetails.module.scss'
import { CollapseContext } from "../../../context/collapse.context";
import CardType from "../../../components/catgegory/CardType";
import Feedback from "../../../components/Feedback/Feedback";
import { Button, Pagination, Tabs } from 'antd';
import AvatarCustom from "../../../components/Avatar/Avatar";
import StarRating from "../../../components/start-rating/StarRating";
import BookingCreate from "../../Booking/BookingCreate";
import PgtFactories from "../../../services/PgtFatories";
import { toast } from "react-toastify";
import { convertStringToNumber, getDate } from "../../../utils/Utils";
import Temp from "../../../utils/temp";

const PageInterpreterDetail = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [pgtInfo, setPgtInfo] = useState();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [statusPGT, setStatus] = useState("");
  const { isCollapse } = useContext(CollapseContext);
  const [dataFeedback, setDataFeedback] = useState();
  const [rate, setRate] = useState();

  async function fetchFeedbackData(id) {
    try {
      // const resp = await PgtFactories.getPGTFeedbackList(id);
      const resp = {
        status: 200,
        data: Temp.feedbackData
      }
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

  const onCancelOpenHandler = () => {
    setOpen(false);
  };

  useEffect(() => {
    window.scroll(0, 0)
    const fetchData = async () => {
      try {
        const response = await PgtFactories.getPGTDetail(id);
        setPgtInfo(response[0]);
        setStatus(response[0].status);
      } catch (error) {
        toast.error('Hệ thống lỗi, vui lòng thử lại sau')
        // Handle errors here
      }
    };
    fetchData();
    document.title = `Thồng tin Interpreters`;
  }, []);

  const checkStatus = (bookings, user, kol) => {
    if (!user) {
      setStatus("GUEST");
    } else if (kol.userId === user.id) {
      setStatus("ME");
    } else if (
      bookings.findIndex(
        (booking) => booking.user.id === user.id && booking.status === "PENDING"
      ) !== -1
    ) {
      setStatus("PENDING");
    } else if (
      bookings.findIndex(
        (booking) =>
          booking.user.id === user.id && booking.status === "ACCEPTED"
      ) !== -1
    ) {
      setStatus("ACCEPTED");
    } else setStatus("BOOK");
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
        toUserAvatar: pgtInfo?.avatar,
        toUserName: pgtInfo?.user_name,
      }
    })
  };

  const onChange = (key) => {
    console.log(key);
  };

  const onRedirect = () => {
    const booking = pgtInfo.bookings.find(
      (booking) => booking.status === statusPGT && booking.user.id === user.id
    );
    if (booking) {
      navigate(`/bookings/${booking.id}`);
    }
  };

  const renderCategopryGame = () => {
    return (
      <>
        {pgtInfo?.listgame?.map((item, index) => (
          <CardType
            key={index}
            id={item.id}
            name={item.name}
            background={item.image}
          />
        ))}
      </>
    )
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

  const items = [
    {
      key: '1',
      label: 'Giới thiệu',
      children: <IntroduceHint introduction={pgtInfo?.introduction} />,
    },
    {
      key: '2',
      label: 'Đánh giá',
      children: renderFeedBack(),
    },
    {
      key: '3',
      label: 'Khoảnh khắc',
      children: renderFeedBack(),
    },
  ];


  return (
    <>
      <main className={styles["main-details"]} >
        {open === true &&
          <BookingCreate
            kol={pgtInfo ?? ''}
            onCancelOpenHandler={onCancelOpenHandler}
            open={open}
          />
        }
        <div
          className={`${styles["container"]} ${styles[isCollapse ? "isCollapse" : '']}  `}
        >

          <div className={styles.profile}>
            <div className={styles.stickyProfile}>
              <div className={styles.profileContainer}>
                <AvatarCustom
                  avatar={pgtInfo?.avatar ?? ''}
                  photoList={pgtInfo?.listImage ?? ''}
                />
              </div>

              <div className={styles.statusInfo}>
                <div className={`${styles.boxStatus}   ${styles[statusPGT === 2 ? 'Pause' : '']}`}>
                  <div className={`${styles.textStatus}   ${styles[statusPGT === 2 ? 'Pause' : '']}`}>
                    {statusPGT === 1 ? 'Đang làm việc' : 'Đang tạm nghỉ'}
                  </div>
                </div>
                {/* <span className={styles.dateFrom}>Ngay tham gia: 22/06/2023</span> */}
              </div>
            </div>

            <div className={styles.contact}>
              <div className={styles.stickyBox}>
                <div className={styles.boxContainer}>
                  <p>{convertStringToNumber(pgtInfo?.price)}/h</p>
                  <div className={styles['rateting-style']}>
                    <StarRating starCount={pgtInfo?.star} />
                    <span>{pgtInfo?.countComment} Đánh giá</span>
                  </div>
                  <div className={styles['text-center']}>
                    <Button type="primary" size={'large'} onClick={bookingHandler} block>
                      Thuê
                    </Button>
                    {/* <Button type="primary" size={'large'} onClick={handleClickChat} block  >
                      Chat
                    </Button> */}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.info}>
            <div className={styles.profileInfo}>
              <div className={styles.title}>
                <span className={` ${styles.userName}  `} >{pgtInfo?.user_name}  </span>
                <buton className={` ${styles.buttonFollow}  `} >Theo dõi </buton>
              </div>

              <div className={styles.properties}>
                {/* <div className={styles.boxPropertie}>
                  <span className={styles.namePropertie}>
                    SỐ NGƯỜI THEO DÕI
                  </span>
                  <span className={styles.number}>
                    {pgtInfo?.follower}
                  </span>
                </div> */}

                <div className={styles.boxPropertie}>
                  <span className={styles.namePropertie}>
                    LƯỢT THUÊ
                  </span>
                  <span className={styles.number}>
                    {dataFeedback?.length}
                  </span>
                </div>

                <div className={styles.boxPropertie}>
                  <span className={styles.namePropertie}>
                    TỶ LỆ HOÀN THÀNH
                  </span>
                  <span className={styles.number}>
                    {parseInt(rate ?? 100) ?? ''}%
                  </span>
                </div>
              </div>
            </div>
            <div className={styles.category}>
              {renderCategopryGame()}
            </div>

            <div className={styles.infomation}>
              <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
            </div>

          </div>



        </div>
        {/* <BackTop /> */}
      </main >
    </>
  );
};
export default PageInterpreterDetail;

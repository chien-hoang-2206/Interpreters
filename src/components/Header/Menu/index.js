import { Modal, Tabs, Tooltip } from "antd";
import no1_top_frame from '../../../assets/images/no1_top_frame.png'
import React, { useContext, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import './styleModal.scss'
import { ToastNotiError } from "../../../utils/Utils";
import BookingFactories from '../../../services/BookingFactories';
import { MessageContext } from "../../../context/Message.context";

const ItemTrend = (props) => {
  return (
    <li style={{ borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'aliceblue', padding: 5 }} >
      <div className="pull-left">
        <div className="rank-stt"> {props?.stt} </div>
        <div className="avt-rank">
          <img src={props?.avatar} />
        </div>
        <div className="name-player">
          {props?.userName}
        </div>
      </div>
      <div className="pull-right">
        <span> {(props?.time)} giờ </span>
      </div>
    </li>
  );
};

const MenuGuest = (props) => {
  // const { icons } = props

  let icons = []
  const [user, setUser] = useState();
  const [isShowModal, setIsShowModal] = useState();
  const [countMes, setCountMes] = useState();
  const { messengerList } = useContext(MessageContext);
  const countMesRef = useRef(countMes);

  // useEffect(() => {
  //   if (messengerList) {
  //     const unreadMessages = messengerList.filter(message => {
  //       return ( parseInt(message?.userSendId) !== parseInt(user?.id) &&  message.read === false)
  //     })
  //     const numUnreadMessages = unreadMessages.length;
  //     // if (countMesRef.current === 0 && numUnreadMessages > 0) {
  //     //   ToastInfo(unreadMessages[unreadMessages.length - 1].lastMessage unreadMessages[unreadMessages.length - 1].lastMessage)
  //     // }
  //     setCountMes(numUnreadMessages);
  //     countMesRef.current = numUnreadMessages;
  //   }
  // }, [messengerList]);

  // useEffect(() => {
  //   setUser(JSON.parse(localStorage.getItem("user")));
  // }, []);
  function showModelTrenđ() {
    setIsShowModal(true);
  }

  const navigator = useNavigate();
  function handleClickMessenger() {
    navigator('/chat')
  }


  const [data, setData] = useState();
  const fetchDataTop = async (year, month) => {
    try {
      const response = await BookingFactories.getBookingTopPgt(year, month);
      if (response?.status === 200) {
        const responseData = response?.data
        const labels = responseData.map(item => `${item.user_name}`);
        const totalTime = responseData.map(item => parseInt(item.total_duration_minutes, 10));
        const barData3 = {
          labels: labels,
          datasets: [
            {
              label: "Top Interpreters",
              backgroundColor: "rgb(255, 99, 132)",
              data: totalTime
            }
          ]
        };
        setData(response?.data);
      }
    } catch (error) {
      ToastNotiError();
    }
  };

  // useEffect(() => {
  //   fetchDataTop(2023, 11);
  // }, []);


  const item =
    [
      {
        // label: 'Tháng này',
        label: '',
        key: 3,
        children:
          <div className="tab-content">
            <div className="top-info-section">
              {data?.length > 0 &&
                <>
                  <div className="top-1-frame">
                    <img className="imgTop1" src={data[0].avatar} />
                    <img className="imgTop1Frame" src={no1_top_frame} />
                  </div>
                  <span className="moneyTop1">{parseInt(data[0]?.total_duration_minutes, 10)} giờ </span>
                </>
              }
            </div>
            <div className="rank-list">
              {data?.map((item) => (
                <ItemTrend
                  key={item?.stt}
                  stt={item?.stt}
                  avatar={item?.avatar}
                  userName={item?.user_name}
                  time={parseInt(item?.total_duration_minutes, 10)}
                />
              ))
              }
            </div>
          </div >
      }
    ]

  return (
    <>
      <Modal
        centered
        open={isShowModal}
        onOk={() => setIsShowModal(false)}
        onCancel={() => setIsShowModal(false)}
        width={800}
        footer={[]}
      >
        <>
          <h1 className="titleModal">BẢNG XẾP HẠNG Interpreters</h1>
          <Tabs
            defaultActiveKey="1"
            centered
            items={item}
          />
        </>
      </Modal>
      <ul className="room-guest">

        <li className="icon-room-guest">
          <Tooltip title="Trang chủ" >
            <NavLink
              to="/home"
              className={({ isActive }) => (isActive ? "active" : undefined)}
            >
              <img src={icons[0]} alt="" />
            </NavLink>
          </Tooltip>

        </li>
        <li className="icon-room-guest">
          <Tooltip title="Bảng xếp hạng" >
            <NavLink
              onClick={() => showModelTrenđ()}
              className={({ isActive }) => (isActive ? "active" : undefined)}
            >
              <img src={icons[1]} alt="" />
            </NavLink>
          </Tooltip>
        </li>
        {user && (
          <li className="icon-room-guest">
            <Tooltip title="Nhắn tin" >
              <button
                // to="/chat"
                onClick={() => handleClickMessenger()}
                className={({ isActive }) => (isActive ? "active" : undefined)}
              >
                <img src={icons[2]} alt="" />
                {countMes > 0 && (
                  <span className={"noti-badge-mes"}>{countMes}</span>
                )}
              </button>
            </Tooltip>
          </li>
        )}

      </ul>
    </>

  );
};

export default MenuGuest;

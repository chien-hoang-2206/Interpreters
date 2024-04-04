import { BellOutlined } from "@ant-design/icons";
import classes from "./Notification.module.css";
import { useEffect, useRef, useState } from "react";
import NotiItem from "./NotiItem";
import { useContext } from "react";
import { NotificationContext } from '../../context/Notification.context';
import { db } from "../../firebase";
import { collection, getDocs, query, where, writeBatch } from "firebase/firestore";
import useOnClickOutside from "../../hook/use-onclick-outside";
import BookingDetail from "../../pages/Booking/BookingDetail";

export default function Notification(props) {
  const { notifications } = useContext(NotificationContext);
  const user = JSON.parse(localStorage.getItem("user"));
  const [isActive, setIsActive] = useState(false);
  const [detailBookingId, setDetailBookingId] = useState();
  const dropRef = useRef();
  const [open, setOpen] = useState(false);
  const [isHaveComment, setIsHaveComment] = useState(false);

  const handleClickOutside = (event) => {
    setIsActive(false);
    updateAllNotificationsToRead(user?.id)
  };
  useOnClickOutside(dropRef, handleClickOutside);
  const handlerActive = () => {
    updateAllNotificationsToRead(user?.id)
    setIsActive(!isActive);
  };

  const updateAllNotificationsToRead = async (userId) => {
    const notificationsQuery = query(
      collection(db, "notifications"),
      where("toUserId", "==", parseInt(userId)), // Use the passed userId parameter
      where("read", "==", false)
    );

    try {
      const querySnapshot = await getDocs(notificationsQuery);
      const batch = writeBatch(db);

      querySnapshot.forEach((doc) => {
        batch.update(doc.ref, { read: true });
      });
      await batch.commit();
    } catch (e) {
    }
  };

  const onCancelOpenHandler = () => {
    setOpen(false);
  };
  return (
    <div className={classes.notiContainer} ref={dropRef} >
      <div
        className={classes["noti-button"]}
        onClick={handlerActive}
      >
        <BellOutlined className={classes["icon-noti"]} />
      </div>
      <div className={`${classes["noti-list"]}`} style={{ display: isActive ? '' : 'none' }}>
        <h4>Thông báo</h4>
        <div className={classes["noti-main"]} >
          {notifications?.length === 0 && (<>   <p className={classes["noti-mgs"]}>Không có thông báo</p>   </>)}
          {notifications?.length > 0 && (<>
            {notifications?.map((noti, index) => (
              <NotiItem key={index} noti={noti} onClickBookingId={(e, type) => {
                setIsHaveComment(false);
                setDetailBookingId(e)
                setOpen(true)
                setIsActive(false);
                if (type){
                  setIsHaveComment(true);
                }
                
              }} />
            ))}
          </>)}
        </div>
      </div>
      <BookingDetail
        bookingId={detailBookingId}
        onCancelOpenHandler={onCancelOpenHandler}
        isHaveComment={isHaveComment}
        open={open}
      />
    </div>
  );
}

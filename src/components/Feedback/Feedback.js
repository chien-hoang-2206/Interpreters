import React from 'react';
import styles from './Feedback.module.scss'
import AvaratDefault from '../../assets/images/defaultAvatar.jpg'
import StarRating from '../start-rating/StarRating';


const Feedback = ({ avatar, userName, comment, star, date, timeRental }) => {
    return (
        <div className={styles.container}>
            <div className={styles.avatar}>
                <div className={styles.boxAvatar}>
                    <img className={styles.avatarLink} src={avatar ?? AvaratDefault}  alt='AvaratDefault'/>
                </div>
            </div>

            <div className={styles.comment}>
                <div className={styles.row1}>
                    <span className={styles.textUsername}>
                        {userName}
                    </span>
                    <span className={styles.star}>
                        <StarRating starCount={star} />
                    </span>
                </div>
                <div className={styles.row2}>
                    <div className={styles.textDate}>
                        {date}
                    </div>
                    <div className={styles.textTimeRental}>
                        (Thuê {timeRental}h)
                    </div>
                </div>
                <div className={styles.row3}>
                    <span>
                        {comment}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Feedback;
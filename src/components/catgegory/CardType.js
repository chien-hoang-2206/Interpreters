import React from 'react';
import styles from './CardType.module.scss'
import { useNavigate } from 'react-router-dom';
const CardType = ({ id, name = 'game', background }) => {
    const navigator = useNavigate()
    function RedirectToCategory(id) {
        navigator(`/field/${id}`);
    }

    let backgroundT = '#E5BA73'
    switch (parseInt(id)) {
        case 1:
            backgroundT = '#E5BA73'
            break;
        case 2:
            backgroundT = '#90D26D'
            break;
        case 3:
            backgroundT = '#008DDA'
            break;

        default:
            break;
    }
    return (
        <div onClick={() => RedirectToCategory(id)} className={styles.cardType} style={{
            background: backgroundT,
            //  background: `url(${backgroundT}) center center no-repeat` 
        }}>
            <p className={styles}>
                {name}
            </p>
        </div>
    );
};

export default CardType;
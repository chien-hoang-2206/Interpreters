import React, { useEffect, useState } from 'react';
import styles from './HotInterpreters.module.scss';
import AVT from '../../../assets/images/KOL.jpg'
import CardInterpreters from '../../card/CardInterpreters/CardInterpreters';
import HintFactories from '../../../services/HintFatories';
import { useTranslation } from 'react-i18next';
import { Card, CardBody, CardFooter, Image } from '@nextui-org/react';
import { StarFilled } from '@ant-design/icons';

const HotInterpreters = ({ id, serchValue }) => {
    const [dataList, setDataList] = useState([]);
    const { t } = useTranslation()
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await HintFactories.getListPGT(10, serchValue, id);
                setDataList(response);
            } catch (error) {
                // Handle errors here
            }
        };
        fetchData();
    }, [serchValue, id]);

    return (
        <div className={styles.container}>
            <span className={styles.title}>{t('hot_Interpreters')}</span>

            <div className={styles["boxContent"]}>
                <div className={styles["content"]}>
                    {dataList?.map((item, i) => {
                        return (
                            <CardInterpreters key={i} data={item} />
                        );
                    })}
                </div>
            </div>
            {/* <div className={styles["cont ent-pagination"]}> */}
            {/* <Pagination /> */}
            {/* </div> */}
        </div>
    );
};


const Chanel = ({ item }) => {
    return (
        <div className='imageBorder'>
            <img className='imageChannel' src={item?.image} alt='chanel' />
        </div>
    )
}

export default HotInterpreters;

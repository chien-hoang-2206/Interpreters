import React, { useEffect, useState } from 'react';
import styles from './HotInterpreters.module.scss';
import AVT from '../../../assets/images/KOL.jpg'
import CardInterpreters from '../../card/CardInterpreters/CardInterpreters';
import PgtFactories from '../../../services/PgtFatories';
import { useTranslation } from 'react-i18next';

const HotInterpreters = ({ id, serchValue }) => {
    const [dataList, setDataList] = useState([]);
    const { t } = useTranslation()
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await PgtFactories.getListPGT(10, serchValue, id);
                setDataList(response);
            } catch (error) {
                // Handle errors here
            }
        };
        fetchData();
    }, [serchValue,id]);

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

export default HotInterpreters;

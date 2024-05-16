import React, { useEffect, useState } from 'react';
import styles from './styles.module.scss'
import CardTopInterpreters from '../../card/CardTopInterpreters/CardTopInterpreters';
import { useTranslation } from 'react-i18next';
import { ToastNotiError } from '../../../utils/Utils';
import BookingFactories from '../../../services/BookingFactories';
const TopInterpreters = () => {
    const { t } = useTranslation();
    const [DataList, setDataList] = useState();
   
    const fetchApiList = async () => {
        try {
            const year = (new Date()).getFullYear();
            const month = (new Date()).getMonth() + 1;
            const response = await BookingFactories.getBookingTopPgt(year, month );
            if (response?.status === 200) {
                setDataList(response.data);
            } else {
                console.error("API response does not contain expected data:", response);
            }
        } catch (error) {
            ToastNotiError()
        }
    };

    useEffect(() => {
        fetchApiList();
    }, []);
    return (
        <div className={styles.container}>
            <span className={styles.title}>{t('top_Interpreters_for_u')}</span>

            <div className={styles["boxContent"]}>
                <div className={'w-[1146px] my-4 h-[180px] px-[22px] box-border flex flex-row overflow-hidden gap-7 justify-between'}>
                    {DataList?.map((item, i) => {
                        return (
                            <CardTopInterpreters key={i} data={item} />
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

export default TopInterpreters;
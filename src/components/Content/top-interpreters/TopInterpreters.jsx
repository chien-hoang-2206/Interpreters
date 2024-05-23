import React, { useEffect, useState } from 'react';
import styles from './styles.module.scss'
import CardTopInterpreters from '../../card/CardTopInterpreters/CardTopInterpreters';
import { useTranslation } from 'react-i18next';
import { ToastNotiError } from '../../../utils/Utils';
import BookingFactories from '../../../services/BookingFactories';
import { Skeleton } from '@nextui-org/react';
const TopInterpreters = () => {
    const { t } = useTranslation();
    const [DataList, setDataList] = useState([]);

    const fetchApiList = async () => {
        try {
            const year = (new Date()).getFullYear();
            const month = (new Date()).getMonth() + 1;
            const response = await BookingFactories.getBookingTopHINT(year, month);
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
                    {DataList?.length === 0 &&
                        <>
                            <div className="max-w-[500px] w-full flex items-center gap-3">
                                <div>
                                    <Skeleton className="flex rounded-full w-12 h-12" />
                                </div>
                                <div className="w-full flex flex-col gap-2">
                                    <Skeleton className="h-3 w-3/5 rounded-lg" />
                                    <Skeleton className="h-3 w-4/5 rounded-lg" />
                                </div>
                            </div>
                            <div className="max-w-[500px] w-full flex items-center gap-3">
                                <div>
                                    <Skeleton className="flex rounded-full w-12 h-12" />
                                </div>
                                <div className="w-full flex flex-col gap-2">
                                    <Skeleton className="h-3 w-3/5 rounded-lg" />
                                    <Skeleton className="h-3 w-4/5 rounded-lg" />
                                </div>
                            </div>
                        </>
                    }
                </div>


            </div>
            {/* <div className={styles["cont ent-pagination"]}> */}
            {/* <Pagination /> */}
            {/* </div> */}
        </div>
    );
};

export default TopInterpreters;
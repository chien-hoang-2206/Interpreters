import React, { useEffect, useState } from 'react';
import styles from './HotInterpreters.module.scss';
import CardInterpreters from '../../card/CardInterpreters/CardInterpreters';
import HintFactories from '../../../services/HintFatories';
import { useTranslation } from 'react-i18next';
import { Card, Skeleton } from '@nextui-org/react';
const CarLoading = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

const HotInterpreters = ({ id, serchValue }) => {
    const [dataList, setDataList] = useState([]);
    const { t } = useTranslation()
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await HintFactories.getListHINT(10, serchValue, id);
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
                    {dataList?.length == 0 &&
                        CarLoading?.map((i, index) => (
                            <Card key={index} className="w-[200px] space-y-5 p-4" radius="lg">
                                <Skeleton className="rounded-lg">
                                    <div className="h-24 rounded-lg bg-default-300"></div>
                                </Skeleton>
                                <div className="space-y-3">
                                    <Skeleton className="w-3/5 rounded-lg">
                                        <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
                                    </Skeleton>
                                    <Skeleton className="w-4/5 rounded-lg">
                                        <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
                                    </Skeleton>
                                    <Skeleton className="w-2/5 rounded-lg">
                                        <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
                                    </Skeleton>
                                </div>
                            </Card>
                        ))
                    }
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

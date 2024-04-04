import React from 'react';
import styles from './styles.module.scss'
import CardTopInterpreters from '../../card/CardTopInterpreters/CardTopInterpreters';
import { useTranslation } from 'react-i18next';
const TopInterpreters = () => {
    const { t } = useTranslation();

    let dataList = [
        {
            avatar: 'https://data-resize.lita.cool/user/9179039/album/photo_20240103_120441_638_R94053.jpg.resize/299*',
            username: 'Quin quin',
            star: 4,
            comment: 200,
            booking: 1222,
        },
        {
            avatar: 'https://data-resize.lita.cool/user/9179039/album/photo_20240103_120441_638_R94053.jpg.resize/299*',
            username: 'Quin quin',
            star: 4,
            comment: 200,
            booking: 1222,
        },
        {
            avatar: 'https://data-resize.lita.cool/user/9179039/album/photo_20240103_120441_638_R94053.jpg.resize/299*',
            username: 'Quin quin',
            star: 4,
            comment: 200,
            booking: 1222,
        },
    ]
    return (
        <div className={styles.container}>
            <span className={styles.title}>{t('top_Interpreters_for_u')}</span>

            <div className={styles["boxContent"]}>
                <div className={'w-[1146px] my-4 h-[180px] px-[22px] box-border flex flex-row overflow-hidden gap-7 justify-between'}>
                    {dataList?.map((item, i) => {
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
import React, { useEffect, useLayoutEffect, useState } from 'react';
import styles from './OutStandingPgt.module.scss'
import CardInterpreters from '../../card/CardInterpreters/CardInterpreters';
import PgtFactories from '../../../services/PgtFatories';
const OutStandingPGT = () => {
    const [pgtList, setPgtList] = useState([]);
    useLayoutEffect(() => {
        const fetchData = async () => {
            // const response = await PgtFactories.getListPGT(20);
            // setPgtList(response);
        };
        fetchData();
    }, []);

    return (
        
        <div className={styles.container}>
            <span className={styles.title}>OutStandingKol</span>
            <div className={styles["boxContent"]}>
                <div className={styles["content"]}>
                    {pgtList?.map((pgt, i) => {
                        return (
                            <CardInterpreters key={i} pgt={pgt} />
                        )
                    })}
                </div>
            </div>
            <div className={styles["content-pagination"]}>
                {/* <Pagination /> */}
            </div>
        </div>
    );
};

export default OutStandingPGT;
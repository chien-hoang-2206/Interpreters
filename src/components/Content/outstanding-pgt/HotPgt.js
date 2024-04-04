import React from 'react';
import PageHOT from '../PagePagination/PageHOT';
import { Pagination } from 'react-bootstrap';
import  styles from './HotKol.module.scss'
const HotHOL = () => {
    return (
        <>
            <h2>Hot Interpreters</h2>
            <div className={styles["content-page"]}>
                {/* <PageHOT /> */}
                <p>ádasdasdasd</p>
            </div>
            <div className={styles["content-pagination"]}>
                {/* <Pagination /> */}
            </div>
        </>
    );
};

export default HotHOL;
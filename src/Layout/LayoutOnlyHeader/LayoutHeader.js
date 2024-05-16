import React from 'react';
import Header from '../../components/Header';
import styles from './Layout.module.scss';
import Footer from '../../components/Footer/Footer';

const LayoutHeader = ({ children, isHaveFooter = true }) => {
    return (
        <>
            <Header />
            <div className={styles.mainContainer}>
                {children}
            </div>
            {isHaveFooter &&
                <Footer />
            }
        </>
    );
};

export default LayoutHeader;
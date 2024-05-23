import React, { useContext } from 'react';
import SideBar from '../../components/SideBar';
import Header from '../../components/Header';
import { CollapseContext } from '../../context/collapse.context';
import styles from './Layout.module.scss';
import Footer from '../../components/Footer/Footer';

const LayoutSideBar = ({ children }) => {
    const { isCollapse } = useContext(CollapseContext);

    return (
        <div>
            <Header />
            <div style={{ display: 'flex' }}>
                <div className={`${styles.container} ${styles[isCollapse ? 'Collapse' : '']}`} >
                    {children}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default LayoutSideBar;
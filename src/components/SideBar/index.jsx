import React, { useState, useEffect, useContext, useLayoutEffect } from 'react'
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styles from './Sidebar.module.scss'
import { CollapseContext } from '../../context/collapse.context';
import CategoriesFactories from '../../services/CategoriesFatories';

const SideBar = ({ onChangeCollapse }) => {
    const [fields, setFields] = useState()
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const category_id = searchParams.get("category");

    // useLayoutEffect(() => {
    //     const fetchData = async () => {
    //         const response = await CategoriesFactories.getListCategories();
    //         setFields(response);
    //     };
    //     fetchData();
    // }, []);

    const { isCollapse, setIsCollapse } = useContext(CollapseContext);
    const navigator = useNavigate();
    function handleClickCollapse(value) {
        setIsCollapse(value)
    }
    function handleClickLink(value) {
        navigator(`/pgt?category=${value}`)
    }

    return (
        <div className={`${styles['container']}`} >
            <div className={`${styles['boxContainer']} ${styles[isCollapse ? 'boxCollapse' : '']} `}            >
                <div className={styles['title']} >
                    <span className={styles['textTitle']}>Danh sách lĩnh Vực </span>
                </div>
                <div className={styles['content']} >
                    {fields?.map((field) => {
                        return (
                            <div className={`${styles["item"]}  ${styles[parseInt(category_id) === parseInt(field?.id) ? "active" : '']} `}
                                onClick={() => handleClickLink(parseInt(field?.id))}
                            >
                                <div className={styles["imageBox"]}>
                                    <img className={styles["imageImport"]} src={field?.image} alt='game' />
                                </div>
                                <div className={styles["linkItem"]} >
                                    <span >{field?.name}</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className={styles["collapse"]} onClick={() => handleClickCollapse(!isCollapse)}>
                <div className={styles["boxCollapse"]} >
                    <i className={`fa-solid fa-angle-left fa-lg ${isCollapse ? 'fa-rotate-180' : ''}  `}></i>
                </div>
            </div>
        </div>
    )

}

export default SideBar;
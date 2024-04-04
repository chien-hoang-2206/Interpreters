import React, { useState, useEffect, useLayoutEffect } from 'react'
import styled from "styled-components";
import { Link } from "react-router-dom";
import styles from '../../../components/Content/content.module.scss'

const IMG = styled.img`
  width: 100%;
  height: 220px;
  box-sizing: border-box;
  border-radius: 10px;
  border: none;
`;

const Name = styled.p`
  margin: 0;
  padding-right: 10px;
  font-weight: 500;
  line-height: 30px;
  box-sizing: border-box;
`;

const DivWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;
`;

const PageField = (props) => {

    useLayoutEffect(() => {
        changeRender()
    }, [props.current]);

    function arrUpperCase(data) {
        const demo = data.replace(/^(.)(.*)$/, function (match, p1, p2) {
            return p1.toUpperCase() + p2;
        })
        return demo;
    };

    const changeRender = () => {
        return props.listOfKol?.slice((props.current - 1) * 10, (((props.current - 1) * 10) + 10));
    }

    return (
        <DivWrap key={"outstandingKol"}>
            {changeRender()?.map((kol) => {
                const firstName = arrUpperCase(kol.firstName);
                return (
                    <div key={kol?.id} className={styles["item-kol-detail"]}>
                        <IMG src={`http://localhost:8080/api/images/${kol?.avatar}`} />
                        <div className={styles['kol-detail']}>
                            <div className={styles['kol-name']}>
                                <Name>{firstName}</Name>
                                <Name>{kol.lastName}</Name>
                            </div>
                            <div className={styles['kol-info']} >
                                <Name>{firstName} {kol.lastName}</Name>
                                <p>{kol.postPrice} / Bài viết</p>
                                <p>{kol.videoPrice} / Video</p>
                                <div className={styles['wrap-kol-link']}>
                                    <Link to={`/kols/${kol.id}`} className={styles['kol-link']}>Xem thêm</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </DivWrap>
    )
}

export default PageField
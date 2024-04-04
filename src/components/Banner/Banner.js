import React, { useState, useEffect } from 'react';
import './Banner.scss'; // Bạn cần tạo một file CSS với các style cần thiết

const Banner = (props) => {
    const { data } = props;
    const [listImage, setListImage] = useState();
    const [currentIndex, setCurrentIndex] = useState(0);
    useEffect(() => {
        setListImage(data);
    }, [data])
    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % listImage?.length);
        }, 5000); // Chuyển sang ảnh tiếp theo sau mỗi 3 giây
        return () => clearInterval(intervalId);
    }, [listImage]);
    const translateX = currentIndex * -100; // Tính toán vị trí dịch chuyển
    return (
        <div className="banner-container shadow-lg">
            <div
                className="banner-slide"
                style={{ transform: `translateX(${translateX}%)` }}
            >
                {listImage?.map((item, index) => (
                    <img
                        alt='baner'
                        src={item?.url} key={index} className="slide-image"
                    />
                ))}
            </div>
        </div>
    );
};
export default Banner;

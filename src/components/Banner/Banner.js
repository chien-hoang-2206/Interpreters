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
            <button
                className="banner-slide border-none"
                style={{ transform: `translateX(${translateX}%)` }}
                onClick={() => window.open('https://www.traveloka.com/vi-vn?id=4169304973752027478&adloc=vi-vn&kw=4169304973752027478_traveloka&gmt=e&gn=g&gd=c&gdm=&gcid=696138950322&gdp=&gdt=&gap=&pc=1&cp=4169304973752027478_VN_TV_SM_AU_DE_Google_RSA_BRAND_4169304973752027478_&aid=151380478725&wid=kwd-51659214310&fid=&gid=9047170&kid=_k_CjwKCAjwouexBhAuEiwAtW_ZxxE-A1katPPs72ytcN44WO4NctzgkXs9_cBQGGBaHopI_K3aKCZmuxoCfugQAvD_BwE_k_&utm_id=35voupAr&ad_id=696138950322&target_id=kwd-51659214310&click_id=CjwKCAjwouexBhAuEiwAtW_ZxxE-A1katPPs72ytcN44WO4NctzgkXs9_cBQGGBaHopI_K3aKCZmuxoCfugQAvD_BwE&group_id=151380478725&contexts=%7B%22accessCode%22:%225026VNSEM2994%22%7D&gad_source=1&gclid=CjwKCAjwouexBhAuEiwAtW_ZxxE-A1katPPs72ytcN44WO4NctzgkXs9_cBQGGBaHopI_K3aKCZmuxoCfugQAvD_BwE')}
            >
                {listImage?.map((item, index) => (
                    <img
                        alt='baner'
                        src={item?.url} key={index} className="slide-image"
                    />
                ))}
            </button>
        </div>
    );
};
export default Banner;

import { Avatar } from 'antd';
import React, { useState } from 'react';
import ImgCard from '../../../assets/images/img-card.png'
import StarRating from '../../start-rating/StarRating';
import { useNavigate } from 'react-router-dom';
const CardTopInterpreters = ({data}) => {
    const [isScale, setIsScale] = useState()
    const navigator = useNavigate()
    function handleClickCard(){
        navigator(`/pgt/${data?.id}`);
    }

    return (
        <div className='min-w-[49%] select-none text-stone-50 group w-[542px] h-[180px] rounded-xl bg-[#3d9ae7] p-4 box-border flex flex-row relative  z-0'
            onMouseEnter={() => setIsScale(true)}
            onMouseLeave={() => setIsScale(false)}
            onClick={()=>handleClickCard()}
        >
            <div className="flex">
                <img
                    src='https://data.lita.cool/user/12007327/album/photo_20240211_003028_735_R16510.jpg?t=1707582628735*'
                    style={{
                        width: 140,
                        height: 130,
                        borderRadius: '50%',
                        objectFit: 'fill',
                        userSelect: 'none',
                        transform: isScale ? 'scale(1.1)' : 'scale(1)',
                        transition: 'transform 0.3s ease',
                    }}
                    alt='anh'
                />
            </div>
            <div className="flex w-full ml-2">
                <div className="flex flex-col justify-between pl-2 w-full">
                    <div className="flex flex-row justify-between">
                        <span className="text-xl text">{'Nguyễn Hoàng Nam'}</span>
                        <StarRating starCount={5} />
                    </div>
                    <span className="text-sm font-medium text-left font-medium text-[#dbdff2]">{'Hello! I am a passionate tour guide dedicated to creating memorable experiences and sharing fascinating insights about our destinations'}</span>
                    <span className="text-sm text">{'Kinh nghiệm: 5 năm'}</span>
                    <span className="text-sm  font-bold ">{'Tần suất: 3 lượt / tuần'}</span>
                </div>
            </div>
            <img className='absolute top-[-10px] left-48 select-none' src={ImgCard} />
        </div>
    );
};

export default CardTopInterpreters;
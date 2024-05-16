import React, { useState } from 'react';
import ImgCard from '../../../assets/images/img-card.png'
import StarRating from '../../start-rating/StarRating';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
const CardTopInterpreters = ({ data }) => {
    const [isScale, setIsScale] = useState()
    const navigator = useNavigate()
    function handleClickCard() {
        navigator(`/hint/${data?.id}`);
    }
    const { t } = useTranslation()

    return (
        <div className='min-w-[49%] select-none text-stone-50 group w-[542px] h-[180px] rounded-xl bg-[#3d9ae7] p-4 box-border flex flex-row relative  z-0'
            onMouseEnter={() => setIsScale(true)}
            onMouseLeave={() => setIsScale(false)}
            onClick={() => handleClickCard()}
        >
            <div className="flex">
                <img
                    src={data?.avatar}
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
                        <span className="text-xl text">{data?.user_name}</span>
                        <StarRating starCount={data?.star} />
                    </div>
                    <span className="text-sm font-medium text-left font-medium text-[#dbdff2]">
                        {data?.introduction}
                    </span>
                    <span className="text-sm  font-bold ">{`${t('frequency')}: ${data?.total_bookings} ${t('per_month')}`}</span>
                </div>
            </div>
            <img className='absolute top-[-10px] left-48 select-none' src={ImgCard} />
        </div>
    );
};

export default CardTopInterpreters;
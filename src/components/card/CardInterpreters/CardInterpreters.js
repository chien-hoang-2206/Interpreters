import React from 'react';
import './style.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { StarFilled } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
const Chanel = ({ item }) => {
    return (
        <div className='imageBorder'>
            <img className='imageChannel' src={item?.image} alt='chanel' />
        </div>
    )
}


const CardInterpreters = (props) => {
    const data = props.data;
    const navigate = useNavigate();
    const handleClickCard = () => {
        navigate(`/hint/${data?.id}`);
    };
    const { t } = useTranslation()

    return (
        <div className="card" onClick={handleClickCard}>
            <div className="card__view">
                <div className="card__view__data">
                    <img className='card_imgage' alt='card__view__data' src={data?.avatar} />
                </div>
            </div>
            <div className="card__content  w-full">
                <div className='flex flex-row mt-3 justify-between w-full'>
                    <span className="channel__video__name  w-3/5">{data?.username}</span>
                    <div className="flex flex-row gap-1 mt-2 w-2/5 float-right justify-end  ">
                        {data?.listcategories?.slice(0, 4).map((item, index) => (
                            <Chanel item={item} key={index} />
                        ))}
                    </div>
                </div>
                <div className='flex flex-row gap-1 mb-4 justify-between'>
                    <span className="text-sm font-bold channel__text_short">{`${t('booking_item')}: ${data?.booking_count ?? 0}`}</span>
                    <span className="channel__text_short">
                        <StarFilled className='text-yellow-500' />
                        {(data?.average_rating ? Number(data?.average_rating).toFixed(1) : 0)}{`(${data?.comment})`}</span>
                </div>
                {/* <div className="channel__data">
                    <div className="channel__data__text">
                        <div className="channel__subdata">

                        </div>
                        <p className="channel__star">{data?.star} <span className='channel__cmt'>({data?.comment})</span></p>
                    </div>
                </div> */}
            </div>
        </div>
    );
};

export default CardInterpreters;
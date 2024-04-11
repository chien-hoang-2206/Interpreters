import React from 'react';
import './style.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { StarFilled } from '@ant-design/icons';
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
    return (
        <div className="card" onClick={handleClickCard}>
            <div className="card__view">
                <div className="card__view__data">
                    <img className='card_imgage' alt='card__view__data' src={data?.avatar} />
                </div>
            </div>
            <div className="card__content">
                <span className="channel__video__name">{data?.username}</span>
                <div className='flex flex-row gap-1 justify-between'>
                    <span className="text-sm font-bold channel__text_short">{`Lượt thuê ${data?.booking ?? 0}`}</span>
                    <span className="channel__text_short">
                        <StarFilled className='text-yellow-500' />
                        {data?.star}</span>
                </div>
                <div className="channel__data">
                    <div className="channel__data__text">
                        <div className="channel__subdata">
                            <div className="channel__views">
                                {data?.listgame?.slice(0, 4).map((item, index) => (
                                    <Chanel item={item} key={index} />
                                ))}
                            </div>
                        </div>
                        {/* <FontAwesomeIcon icon="fa-sharp" /> */}
                        <p className="channel__star">{data?.star} <span className='channel__cmt'>({data?.comment})</span></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardInterpreters;
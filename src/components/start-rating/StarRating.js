

import React from 'react';
import { FaStar } from 'react-icons/fa';

const StarRating = ({ starCount = 1 , align='right' }) => {
    const stars = Array.from({ length: starCount }, (_, index) => (
        <FaStar key={index} className="star-icon" style={{ color: '#ff9948' }} />
    ));
    return (
        <div className={`flex flex-row items-end justify-end `}>
            {stars}
        </div>
    );
};

export default StarRating;
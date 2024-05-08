import React from 'react';
import styles from './CardType.module.scss'
import { useNavigate } from 'react-router-dom';
import { Button, Image } from '@nextui-org/react';
const CardType = ({ id, name = 'game', image, background }) => {
    const navigator = useNavigate()
    function RedirectToCategory(id) {
        navigator(`/field/${id}`);
    }

    let backgroundT = '#E5BA73'
    switch (parseInt(id)) {
        case 1:
            backgroundT = '#E5BA73'
            break;
        case 2:
            backgroundT = '#90D26D'
            break;
        case 3:
            backgroundT = '#008DDA'
            break;

        default:
            break;
    }
    return (
        <Button onClick={() => RedirectToCategory(id)} style={{ background: '#fff !important'}} className=' rounded-lg flex flex-col w-[130px] h-[165px] bg-[#fff]'>
            <Image width={120} height={145} src={image} />
            <span className='font=bold text-xl '> {name.slice(16)}</span>
        </Button>

    );
};

export default CardType;
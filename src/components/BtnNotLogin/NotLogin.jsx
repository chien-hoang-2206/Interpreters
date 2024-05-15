import React from 'react'
import { useTranslation } from 'react-i18next'


const NotLogin = (props) => {
    const {t}= useTranslation()
    return (
        <div className='flex flex-row gap-3'>
            <button className='mx-24px  px-16px box-border h-8  bg-[#FF4DC4] px-2 rounded-md text-center align-middle text-14px font-bold text-white hover:scale-105 transition' onClick={props.loginHandler}>
                {t('login')}
            </button>
            <button className='mx-24px px-16px box-border h-8 rounded-8px bg-[#7733FF] px-2 rounded-md text-center flex flex-row align-middle items-center text-14px font-bold text-white hover:scale-105 transition' onClick={props.registerHandler}>
                {t('register')}
            </button>
        </div>

    )
}

export default NotLogin
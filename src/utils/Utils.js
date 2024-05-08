import moment from 'moment'

import regex from './regex'
// import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
// import { db } from '../firebase'
import { toast } from 'react-toastify'

export const convertStringToNumber = (value, delimiter = '.') => {
    if (value || value === 0) {
        return `${value.toString().replace(regex.formatMoney, delimiter)} đ`
    }
    return '0 đ'
}

export const partStringToNumber = (value, delimiter = '.') => {
    if (value || value === 0) {
        return `${value.toString().replace(regex.formatMoney, delimiter)}`
    }
    return '0'
}


export const ToastInfo = (mes = 'Thông báo mới') => {
    toast.info(mes, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
    });
}

export const ToastNoti = (mes = 'Lưu dữ liệu thành công') => {
    toast.success(mes, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
    });
}
export const ToastNotiError = (mes = 'Hệ thống lỗi') => {
    toast.error(mes, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
    });
}

export const getDate = (timestamp, type = 3) => {
    if (timestamp == null) {
        return null;
    }
    let result = null;
    switch (type) {
        case 1:
            result = moment(timestamp).format('DD/MM/YYYY');
            break;
        case 2:
            result = moment(timestamp).format('DD.MM.yyyy - HH:mm');
            break;
        case 3:
            result = moment(timestamp).format('yyyy-MM-DD');
            break;
        case 4:
            result = moment(timestamp).format('HH:mm:ss - DD.MM.yyyy');
            break;
        case 5:
            result = moment(timestamp).format('DD.MM.yyyy - HH:mm');
            break;
        case 6:
            result = moment(timestamp).format('HH:mm');
            break;
        case 7:
            result = moment(timestamp).format('HH:mm  DD.MM.yyyy');
            break;
        case 8:
            result = moment(timestamp).format('MM/DD/YYYY');
            break;
        case 9:
            result = moment(timestamp).format('YYYY');
            break;
        case 10:
            result = moment(timestamp).format('MM');
            break;
        case 11:
            result = moment(timestamp).format('MM/YYYY');
            break;
        default:
            break;
    }
    return result;
}

export const getTime = (inputTime) => {
    if (inputTime || inputTime === '0:00') {
        return moment(inputTime, 'HH:mm:ssZ').format('H:mm');
    }
    return '0'
}

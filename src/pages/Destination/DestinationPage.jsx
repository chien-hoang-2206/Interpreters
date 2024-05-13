import { CameraOutlined } from '@ant-design/icons';
import { Avatar, Button, Spinner } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import BoxCustom from '../../components/Box/BoxCustom';
import { convertStringToNumber, getDate } from '../../utils/Utils';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import DestinationFactories from '../../services/DestinationFatories';
import { useTranslation } from 'react-i18next';
import GoogleMapCustom from '../../components/google-map/GoogleMap';


const PreviewContent = ({ content, title }) => {
    return (
        <div className="p-4 rounded">
            <span className="text-2xl font-bold my-5">{title}</span>
            <div className='preview-content text-justify mt-5' dangerouslySetInnerHTML={{ __html: content }} />
        </div>
    );
};


const DestinationPage = () => {
    const [loading, setLoading] = useState();
    const [data, setData] = useState();
    console.log("🚀 ~ DestinationPage ~ data:", data)
    const { t } = useTranslation()
    const { id } = useParams()
    useEffect(() => {
        window.scroll(0, 0)
        const fetchData = async () => {
            try {
                setLoading(true)
                const response = await DestinationFactories.getListDestinationDetail(id);
                setData(response[0]);
                setLoading(false)

            } catch (error) {
                toast.error('Hệ thống lỗi, vui lòng thử lại sau')
                setLoading(false)
                // Handle errors here
            }
        };
        fetchData();
    }, []);


    return (
        <div className="py-10 w-full flex flex-col justify-center items-center">
            <div className="w-full flex flex-col justify-center items-center min-h-[500px]">
                {loading ? <Spinner /> :
                    <div className="flex flex-row justify-between items-start gap-5">

                        <div className="w-[1000px] flex flex-col gap-14 justify-center items-center">

                            <div className="flex flex-col justify-start w-full gap-5 ">
                                <div className="flex flex-col justify-start w-full ">
                                    <BoxCustom
                                        alignTitle='center'
                                        description={
                                            <div className="flex flex-col gap-6 justify-around w-full " >
                                                <span className='text-3xl text-blue-500 font-bold'>{data?.name}</span>
                                                <div className='preview-content text-justify mt-5' dangerouslySetInnerHTML={{ __html: data?.experience }} />
                                            </div>
                                        }
                                    />
                                </div>

                            </div>
                        </div>


                        <div className="w-[220] flex flex-col justify-start gap-5 items-center">
                            {/* <BoxCustom
                                alignTitle='center'
                                description={
                                    <>
                                        <div className='flex flex-col w-[300px]'>
                                            <div className="flex px-4 py-2 w-full flex-col gap-4 justify-center items-center">
                                                <div className="flex flex-col flex-start w-full gap-2">
                                                    <span className='font-bold '>
                                                        Họ và Tên: {data?.first_name} {data?.last_name}
                                                    </span>
                                                    <span className='font-bold  '>
                                                        {t('gender')}: {data?.gender === 1 ? t('female') : t('male')}
                                                    </span>
                                                    <span className='font-bold  '>
                                                        Tuổi: {data?.age}
                                                    </span>
                                                    <span className='font-bold text-2xl text-center flex flex-col gap-2 text-blue2'>
                                                        <Button color='success' style={{ color: 'white' }} disabled>
                                                        </Button>
                                                        <Button className="bg-gradient-to-tr from-pink-300 to-blue-700 text-white shadow-lg">
                                                            Đặt lịch
                                                        </Button>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </>}
                            /> */}
                            <div className='bg-white p-3 rounded-lg'>
                                <GoogleMapCustom
                                    // lng={data?.latitude}
                                    // lat={data?.latitude}
                                    lng={22.3035722}
                                    lat={103.7734656}
                                />
                            </div>


                            <BoxCustom
                                description={
                                    <>
                                        <div className='flex flex-col w-[300px] py-2'>
                                            <div className="flex w-full flex-col gap-4 justify-center items-center">
                                                <div className="flex flex-col flex-start w-full gap-2">
                                                    <ul className='font-bold ' >
                                                        <li className='text-gray-500  ml-2  flex justify-between'>
                                                            <span>
                                                                {t('ticket')}:
                                                            </span>
                                                            <span className=" font-medium  text-yellow-400">
                                                                {convertStringToNumber(data?.price)}

                                                            </span>
                                                        </li>
                                                        <li className='text-gray-500  ml-2  flex justify-between'>
                                                            <span>
                                                                {t('time')}:
                                                            </span>
                                                            <span className=" font-medium  text-yellow-400">
                                                                {getDate(data?.time_start, 6)} - {getDate(data?.time_end, 6)}
                                                            </span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </>}
                            />
                        </div>

                    </div>
                }
            </div>
        </div >

    );
};

export default DestinationPage;
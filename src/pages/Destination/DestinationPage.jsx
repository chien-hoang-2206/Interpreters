import { CameraOutlined } from '@ant-design/icons';
import { Avatar, Button, Spinner } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import BoxCustom from '../../components/Box/BoxCustom';
import { convertStringToNumber } from '../../utils/Utils';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import DestinationFactories from '../../services/DestinationFatories';
import { useTranslation } from 'react-i18next';

const DestinationPage = () => {
    const [loading, setLoading] = useState();
    const [data, setData] = useState();
    const { t } = useTranslation()
    const { id } = useParams()
    useEffect(() => {
        window.scroll(0, 0)
        const fetchData = async () => {
            try {
                setLoading(true)
                const response = await DestinationFactories.getListDestinationDetail(id);
                console.log("🚀 ~ fetchData ~ response:", response)
                setData(response);
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
                        <div className="w-[220] flex flex-col justify-start gap-5 items-center">
                            <BoxCustom
                                alignTitle='center'
                                description={
                                    <>
                                        <div className='flex flex-col w-[300px]'>
                                            <div className="flex px-4 py-2 w-full flex-col gap-4 justify-center items-center">

                                                <div className="flex-shrink-0">
                                                    <Avatar
                                                        src={data?.avatar}
                                                        alt=""
                                                        style={{
                                                            width: '250px',
                                                            height: '300px',
                                                        }}
                                                        className="object-cover w-full h-full rounded-lg"
                                                    />
                                                </div>
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
                                                            {/* {statusHint === 1 ? 'Đang làm việc' : 'Đang tạm nghỉ'} */}
                                                        </Button>
                                                        <Button className="bg-gradient-to-tr from-pink-300 to-blue-700 text-white shadow-lg">
                                                            Đặt lịch
                                                        </Button>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </>}
                            />


                            <BoxCustom
                                title='Giá dịch vụ'
                                description={
                                    <>
                                        <div className='mt-[-30px] flex flex-col w-[300px]'>
                                            <div className="flex w-full flex-col gap-4 justify-center items-center">
                                                <div className="flex flex-col flex-start w-full gap-2">
                                                    <ul className='font-bold ' >
                                                        Cá nhân
                                                        <li className='ml-2 text-gray-500 flex justify-between'>
                                                            <span>
                                                                Theo buổi:
                                                            </span>
                                                            <span className=" font-medium  text-yellow-400">
                                                                {convertStringToNumber(data?.price?.personal_price_session)}
                                                            </span>
                                                        </li>
                                                        <li className='text-gray-500  ml-2  flex justify-between'>
                                                            <span>
                                                                Theo ngày:
                                                            </span>
                                                            <span className=" font-medium  text-yellow-400">
                                                                {convertStringToNumber(data?.price?.personal_price_day)}
                                                            </span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </>}
                            />


                        </div>

                        <div className="w-[800px] flex flex-col gap-14 justify-center items-center">

                            <div className="flex flex-col justify-start w-full gap-5 ">
                                <div className="flex flex-col justify-start w-full ">
                                    <BoxCustom
                                        alignTitle='center'
                                        title='Tổng quan'
                                        description={
                                            <div className="flex flex-row justify-around w-full p-5 pt-0" >
                                                <div className="flex flex-col gap-1 w-44"  >
                                                    <span className="font-bold text-xl text-[#354052]">LƯỢT THUÊ</span>
                                                    <span className='font=bold text-xl'>{data?.length ?? 0}</span>
                                                </div>
                                                <div className="flex flex-col gap-1 w-60"  >
                                                    <span className="font-bold text-xl text-[#354052]">TỶ LỆ HOÀN THÀNH</span>
                                                    {/* <span className='font=bold text-xl'>{parseInt(rate ?? 100) ?? ''}%</span> */}
                                                </div>
                                                <div className="flex flex-col gap-1 w-44"  >
                                                    <span className="font-bold text-xl text-[#354052]">ĐÁNH GIÁ</span>
                                                    <span className='font=bold text-xl mr-1'>{data?.star ?? 0}
                                                        {/* <StarFilled className='text-yellow-500 ml-1' /> */}
                                                    </span>
                                                </div>
                                            </div>
                                        }
                                    />
                                </div>


                                <div>
                                    {/* <span className="text-3xl mb-3 text-blue font-bold"> Giới thiệu</span> */}
                                    <BoxCustom
                                        title='Giới thiệu'
                                        alignTitle='center'
                                        description={
                                            <div className="whitespace-pre-line min-h-32" >
                                                {data?.introduction}
                                            </div>
                                        }
                                    />
                                </div>

                                {/* <div className="carousel-custom ">
                                    <BoxCustom
                                        title='Hình ảnh tại nơi làm việc'
                                        description={
                                            <div className="flex flex-wrap gap-12 p-5 pt-0 justify-center items-center bg-[#fff]">
                                                <Carousel
                                                    arrows={true}
                                                    style={{ width: 730 }}
                                                >
                                                    {data?.listImage?.map((item, index) => (
                                                        <>
                                                            <Image
                                                                key={index}
                                                                src={item?.link ?? ''}
                                                                style={{ width: 730, objectFit: 'fill' }}
                                                            />
                                                        </>
                                                    ))
                                                    }
                                                </Carousel>
                                            </div>
                                        }
                                    />
                                </div> */}

                                <div className="w-full">
                                    <BoxCustom
                                        alignTitle='center'
                                        title='Đánh giá'
                                    // description={
                                    //     <>
                                    //         {renderFeedBack}
                                    //     </>
                                    // }
                                    />
                                </div>

                            </div>
                        </div>
                    </div>
                }
            </div>
        </div >

    );
};

export default DestinationPage;
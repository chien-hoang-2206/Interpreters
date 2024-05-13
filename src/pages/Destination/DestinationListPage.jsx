import React, { useEffect, useState } from 'react';
import DestinationFactories from '../../services/DestinationFatories';
import { Button, Card, CardFooter, Image } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import Input from 'antd/es/input/Input';
import { Select } from 'antd';
import Constants from '../../utils/constants';
import { useTranslation } from 'react-i18next';

const DestinationListPage = () => {
    const [TouristDes, setTouristDes] = useState([])
    const [loading, setLoading] = useState(true);
    const [province, setProvince] = useState();
    const { t } = useTranslation()
    const navigate = useNavigate()
    const fetchData = async (Keyword) => {
        setLoading(true)
        const response = await DestinationFactories.getListDestination({
            Province: province,
            Type: 2
        });
        setTouristDes(response);
        setLoading(false)
    };

    useEffect(() => {
        fetchData();
    }, []);


    return (
        <div>
            <div className='w-full py-5 xl:w-[1120px]' >
                <div className='flex flex-row w-full justify-end gap-3 mb-5'>
                    <Select
                        placeholder={t('choose_province')}
                        size="middle "
                        className='w-60 mt-1'
                        options={Constants.vietnamProvinces}
                        onChange={(e) => setProvince(e)} />
                    <Button
                        color="primary"
                        onClick={() => fetchData()}
                    >
                        {t('search')}
                    </Button>
                </div>

                <div className="flex flex-col gap-5 mt-4 xl:w-[1120px] p-2">
                    {TouristDes?.map(i => (
                        <>
                            <span className="text-2xl font-bold ">{Constants.vietnamProvinces?.find(e => e.value == i.province)?.label}</span>
                            <div className="flex flex-row gap-5 mt-4 xl:w-[1120px] scroll-auto p-2">
                                {i?.destinations?.map(item => (
                                    <Card
                                        isFooterBlurred
                                        key={item.id}
                                        onPress={() => navigate(`/destination/${item.id}`)}
                                        radius="lg"
                                    >
                                        <Image
                                            alt="Woman listing to music"
                                            className="object-cover w-[600px] h-52"
                                            src={item.image}
                                        />
                                        <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                                            <p className="text-tiny text-white/80">{item.name}</p>
                                            <Button onClick={() => navigate(`/destination/${item.id}`)} className="text-tiny text-white bg-black/20" variant="flat" color="default" radius="lg" size="sm">
                                                Chi tiết
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        </>
                    ))
                    }
                </div>
            </div>
        </div >
    );
};

export default DestinationListPage;
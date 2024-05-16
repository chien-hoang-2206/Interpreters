import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PostFactories from '../../services/PostFatories';
import { getDate } from '../../utils/Utils';
import { Link } from 'react-router-dom';
import { Button, DatePicker, Input } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';

const ListPostPage = () => {
    const [dataList, setdataList] = useState([]);
    const { t } = useTranslation()
    const [monthSelect, setMonthSelect] = useState("");
    const [keyword, setKeyword] = useState("");
    const fetchData = async () => {
        try {
            const response = await PostFactories.getListPost({
                Keyword: keyword,
                date: monthSelect,
                status: 20,
            });
            setdataList(response.data);
        } catch (error) {
            // Handle errors here
        }
    };
    useEffect(() => {
        fetchData();
    }, [keyword, monthSelect])
    useEffect(() => {
        fetchData();
    }, []);
    const handleOnChangeInput = (e) => {
        setKeyword(e.target.value);
    };
    const handleOnChangeDate = (e) => {
        setMonthSelect(e)
    };
    return (
        <div className="container mx-auto py-8 px-[10%]">
            <h1 className="text-3xl font-bold mb-8">{t('list_post')}</h1>
            <div className='flex flex-row w-full justify-end gap-3 mb-5'>
                <Input
                    placeholder={t('search')}
                    size="middle "
                    value={keyword}
                    addonAfter={
                        <button onClick={() => { setKeyword() }}>
                            <CloseCircleOutlined /></button>
                    }
                    className='w-60'
                    onChange={(e) => handleOnChangeInput(e)} />
                <DatePicker
                    className='w-30'
                    placeholder={t('choose_date')}
                    onChange={(e) => handleOnChangeDate(e)}
                />
                <Button
                    color="primary"
                    onClick={() => fetchData()}
                >
                    {t('search')}
                </Button>
            </div>


            <div className="flex flex-wrap mx-4">
                {dataList?.map(i => (
                    <div key={i.id}
                        className="w-full md:w-1/2 lg:w-1/3 px-4 mb-8">
                        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                            <div className="p-6">
                                <h2 className="text-2xl font-semibold text-gray-800" style={{ maxHeight: '60px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {i.title}
                                </h2>

                                <img src={i?.image} alt="Placeholder image" className=" mt-4 w-full h-48 object-cover" />
                                {/* <p className="mt-2 text-gray-600">Nội dung tóm tắt của bài đăng...</p> */}
                                <p className="mt-1 text-gray-600">{t('date_create')} : {getDate(i.create_at)}</p>
                                <p className="mt-1 text-gray-600">{t('per_create')} : {i.first_name} {i.last_name}</p>
                                <Link to={`/post/${i.id}`} className="block mt-4 text-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">Xem thêm</Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ListPostPage;
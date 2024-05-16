import React, { useEffect, useState } from "react";
import { Table, Input, Select, DatePicker, Avatar, Badge } from "antd";
import { ToastNoti, getDate } from "../../../../utils/Utils";
import { useTranslation } from "react-i18next";
import { Button, Image } from "@nextui-org/react";
import { Link, useNavigate } from "react-router-dom";
import PostFactories from "../../../../services/PostFatories";

const ManagerPostAdmin = () => {
    const [bookingList, setBookingList] = useState([]);
    const { t } = useTranslation()
    const [monthSelect, setMonthSelect] = useState("");
    const [keyword, setKeyword] = useState("");
    const fetchData = async () => {
        try {
            const response = await PostFactories.getListPost({
                Keyword: keyword,
                date: monthSelect,
            });
            setBookingList(response.data);
        } catch (error) {
            // Handle errors here
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const columns = [
        {
            title: '#',
            dataIndex: 'id',
            key: 'id',
            width: 50,
            fixed: 'left',
            align: 'center',
            render: (id, record, index) => { ++index; return index; },
            showSorterTooltip: false,
        },
        {
            title: t('per_create'),
            width: 150,
            dataIndex: "user_name",
            render: (text, data) => (
                <div className="text-data">
                    {data.first_name} {data.last_name}
                </div>
            ),
        },
        {
            title: t('date_created'),
            key: "date",
            dataIndex: "create_at",
            align: "left",
            width: 160,
            render: (text, data) => <div>{getDate(text, 1)}</div>,
        },
        {
            title: t('title'),
            key: "title",
            dataIndex: "title",
            align: "left",
            width: 200,
            render: (text, data) => <div>{(text)}</div>,
        },
        {
            title: t('image'),
            width: 150,
            dataIndex: "image",
            render: (text, data) => (
                <Image src={text} >

                </Image>
            ),
        },
        {
            title: t('status'),
            key: "status",
            align: "left",
            width: 150,
            render: (text, data) =>
                (data.status === 4 || data.status === 5) ? (
                    <Badge status="success" text="Hoàn thành" />
                ) : data.status === 30 ? (
                    <Badge status="error" text="Interpreters Đã từ chối" />
                ) : data.status === 20 ? (
                    <Badge status="processing" text="Admin đã đăng bài" />
                ) : data.status === 10 ? (
                    <Badge status="warning" text="Chờ xác nhận" />
                ) : null,
        },
        {
            title: t('Delete'),
            width: 90,
            align: 'center',
            render: (_, data) => (
                <div className="flex flex-col gap-2">
                    <Button onClick={() => handletoPreview(data.id)} size='small' color="primary" danger>
                        {t('preview')}
                    </Button>
                    <Button
                        color='success'
                        style={{
                            color: '#fff'
                        }}
                        onClick={() => handleChangeStatus(data.id)}
                    >
                       {t('post')}
                    </Button>
                    <Button onClick={() => handleDelete(data.id)} size='small' color="danger" danger>
                        {t('Delete')}
                    </Button>
                </div>
            )
        },
    ];
    const navigate = useNavigate()
    const handletoPreview = async (id) => {
        navigate(`/post/${id}`)
    }
    const handleChangeStatus = async (id) => {
        try {
            const response = await PostFactories.updatePost(id, { status: 20 });
            if (response.status === 200) {
                ToastNoti()
            }
            fetchData()
        } catch (error) {
            // Handle errors here
        }
    }
    const handleOnChangeDate = (e) => {
        setMonthSelect(e)
    };

    const handleDelete = async (e) => {
        try {
            const response = await PostFactories.deletePost(e);
            if (response.status === 200) {
                ToastNoti()
            }
            fetchData()
        } catch (error) {
            // Handle errors here
        }
    };
    const handleOnChangeInput = (e) => {
        setKeyword(e.target.value);
    };
    return (
        <div className="booking-container">
            <div className="uppercase font-bold text-3xl"><span>{t('mn_post')}</span></div>
            <div className="booking-search">
                <Input
                    placeholder={t('search')}
                    size="middle "
                    onChange={(e) => handleOnChangeInput(e)} />
                <DatePicker
                    onChange={(e) => handleOnChangeDate(e?.$d)}
                />
                <Button
                    color="primary"
                    onClick={() => fetchData()}
                >
                    {t('search')}
                </Button>
            </div>

            <div className="booking-table">
                <Table
                    columns={columns}
                    pagination={{
                        defaultPageSize: 8,
                        showSizeChanger: false,
                        pageSizeOptions: ["10", "20", "30"]
                    }}
                    dataSource={bookingList ?? []}
                />
            </div>

        </div>
    );
};

export default ManagerPostAdmin;

import React, { useEffect, useState } from "react";
import { Table, Image, Input, Modal, Typography, Avatar, Form, TimePicker, Select } from "antd";
import classes from './TouristDes.module.css'
import { ToastNoti, ToastNotiError, convertStringToNumber, getDate } from "../../../../utils/Utils";
import DestinationFactories from "../../../../services/DestinationFatories";
import { useTranslation } from "react-i18next";
import Constants from "../../../../utils/constants";
import ReactQuill from "react-quill";
import { uploadFirebase } from "../../../../utils/FirebaseService";
import dayjs from "dayjs";
import { Button } from "@nextui-org/react";

const { Text } = Typography;

const TouristDes = () => {

    const { t } = useTranslation()

    const columns = [
        {
            title: '#',
            dataIndex: 'id',
            key: 'id',
            width: 50,
            align: 'center',
            render: (id, record, index) => { ++index; return index; },
            showSorterTooltip: false,
        },
        {
            title: t('name_dddl'),
            dataIndex: "name",
            key: "name",
            render: (text, data) => <div className="name-title-table">{text}</div>,
        },
        {
            title: t('image_demo'),
            dataIndex: "image",
            width: 120,
            key: "image",
            render: (text, data) => <Image src={text} className="name-title-table" style={{ width: 100, height: 100 }} />,
        },
        {
            title: t('province'),
            width: 120,
            key: "province",
            dataIndex: "province",
            render: (text, data) => <div className="name-title-table">{Constants.vietnamProvinces.find(item => item.value === text).label}</div>,
        },
        {
            title: t('lat'),
            width: 120,
            key: "latitude",
            dataIndex: "latitude",
            render: (text, data) => <div className="name-title-table">{text}</div>,
        },
        {
            title: t('long'),
            width: 120,
            key: "longitude",
            dataIndex: "longitude",
            render: (text, data) => <div className="name-title-table">{text}</div>,
        },
        {
            title: t('ticket'),
            dataIndex: "price",
            key: "price",
            render: (text, data) => <div className="name-title-table">{convertStringToNumber(text)}</div>,
        },
        {
            title: t('time'),
            dataIndex: "name",
            key: "time_start",
            render: (text, data) => <div className="name-title-table">{`${getDate(data?.time_start, 6)} - ${getDate(data?.time_end, 6)}`}</div>,
        },
        // {
        //     title: "Mô tả",
        //     dataIndex: "experience",
        //     key: "experience",
        //     width: 220,
        //     render: (text, data) => <div className="name-title-table">{text}</div>,
        // },
        {
            title: t('action'),
            key: "action",
            render: (_, record) => (
                <div className="btn-action-group" >
                    {/* <Button
                        style={{ marginRight: 10 }}
                        onClick={() => onDeleteFiledHandler(record?.id)}
                    >
                        {t('Delete')}
                    </Button> */}
                    <Button
                        color='success'
                        style={{
                            color: '#fff'
                        }}
                        onClick={() => onUpdatedestination(record)}
                    >
                        {t('update')}
                    </Button>
                </div>
            ),
        },
    ];

    const [TouristDes, setTouristDes] = useState()
    const [inputSearch, setInputSearch] = useState("");
    const [form] = Form.useForm();
    const [openModalAdd, setOpenModalAdd] = useState(false)
    const [destinationAddName, setDestinationAddName] = useState()
    const [destinationUpdateId, setDestinationUpdateId] = useState()
    const [destinationUpdateName, setDestinationUpdateName] = useState()
    const [destinationUpdateImage, setDestinationUpdateImage] = useState()
    const [error, setError] = useState();
    const [showModalUpdate, setShowModalUpdate] = useState();
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState('');
    const [imageLink, setImageLinK] = useState([]);
    const [fileUpload, setFileUpload] = useState();

    const handleChange = (e) => {
        const file = e.target.files[0];
        setFileUpload(e.target.files[0]);
        if (file) {
            const url = URL.createObjectURL(file);
            setFileUpload(file)
            setImageLinK(url);
        }
    };


    const fetchData = async (Keyword) => {
        setLoading(true)
        const response = await DestinationFactories.getListDestination({});
        setTouristDes(response);
        setLoading(false)
    };

    useEffect(() => {
        fetchData();
    }, []);



    const handleKeyDown = (event) => {
        if (event.key === "Enter" || event.keyCode === 13) {
            fetchData(inputSearch);
        }
    };
    function handleReset() {
        setInputSearch();
        fetchData();
    }
    function handleSearch() {
        fetchData(inputSearch);
    }
    const handleOnChangeInput = (event) => {
        setInputSearch(event.target.value);
    }

    const onDeleteFiledHandler = async (id) => {
        try {
            const resp = await DestinationFactories.deleteDestination(id);
            if (resp.status) {
                ToastNoti();
                setImageLinK()
                fetchData();
            }
        } catch (error) {
            ToastNotiError();
        }
    }


    const onUpdatedestination = (data) => {
        setDestinationUpdateName(data?.name)
        setDestinationUpdateId(data?.id)
        setDestinationUpdateImage(data?.image)
        setImageLinK()
        setShowModalUpdate(data);
    }
    const onCloseModalUpdate = (id) => {
        setShowModalUpdate(false);
        setDestinationUpdateId();
        fetchData();
    }
    const onOpenModalAddField = () => {
        setOpenModalAdd(true)
    }

    const onCloseModalAddField = () => {
        setOpenModalAdd(false)
        fetchData();
    }

    const onAddSubmit = async (value) => {
        setError();

        const url = await uploadFirebase(fileUpload);
        const data = {
            name: value?.name,
            image: url,
            latitude: value?.latitude,
            province: value?.province,
            longitude: value?.longitude,
            time_start: value?.time[0],
            time_end: value?.time[1],
            price: value?.price,
            experience: content ? content : ''
        }
        try {
            const resp = await DestinationFactories.createDestination(data);
            if (resp?.status === 200) {
                ToastNoti();
                setImageLinK()
                setFileUpload()
                onCloseModalAddField()
            } else {
                ToastNotiError('resp?.message');
                setFileUpload()
            }
        } catch (error) {
            ToastNotiError();
        }
    }

    const onUpdatedestinationSubmit = async (data) => {
        setLoading(true)
        try {
            let url = showModalUpdate.image
            if (fileUpload) {
                url = await uploadFirebase(fileUpload);
            }
            const newData = {
                name: data?.name,
                image: url,
                latitude: data?.latitude,
                province: data?.province,
                longitude: data?.longitude,
                time_start: data?.time[0],
                time_end: data?.time[1],
                price: data?.price,
                experience: data.experience
            }
            const resp = await DestinationFactories.updateDestination(destinationUpdateId, newData);
            if (resp?.status === 200) {
                ToastNoti();
                setImageLinK()
                onCloseModalUpdate()
                setFileUpload()
            } else {
                setFileUpload()
                ToastNotiError('resp?.message');
            }
        } catch (error) {
            ToastNotiError();
        }
    }


    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "color", "image"],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            ["clean"],
        ],
    };
    const formats = [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "list",
        "bullet",
        "link",
        "indent",
        "image",
        "code-block",
        "color",
    ];


    useEffect(() => {
        if (showModalUpdate) {
            const newtime = [
                dayjs(showModalUpdate?.time_start),
                dayjs(showModalUpdate?.time_end),

            ]
            form.setFieldsValue({
                name: showModalUpdate?.name,
                province: showModalUpdate?.province,
                longitude: showModalUpdate?.longitude,
                latitude: showModalUpdate?.latitude,
                time: newtime,
                time_end: showModalUpdate?.time_end,
                price: showModalUpdate?.price,
                experience: showModalUpdate?.experience,
            });
        }
    }, [showModalUpdate]);
    return (
        <div className="booking-container" style={{ height: '100vh', overflow: 'scroll' }}>
            <div className="booking-title"><span>{t('dddl')}</span></div>
            <div className="booking-search">
                <Input
                    placeholder={t('search')}
                    size="small"
                    value={inputSearch}
                    onKeyDown={(e) => handleKeyDown(e)}
                    onChange={(e) => handleOnChangeInput(e)}
                />
                <Button
                    color='default'
                    onClick={handleReset}
                >
                    {t('default')}
                </Button>
                <Button
                    color='primary'
                    onClick={handleSearch}
                >
                    {t('search')}
                </Button>
                <Button
                    color='primary'
                    onClick={onOpenModalAddField}
                >{t('add_dddl')}</Button>
            </div>
            <div >
                <Table
                    columns={columns}
                    loading={loading}
                    dataSource={TouristDes ?? []}
                    pagination={{
                        defaultPageSize: 10,
                        showSizeChanger: true,
                        pageSizeOptions: ["1", "5", "10", "20"],
                    }}
                />
            </div>
            <Modal
                width={800}
                title={t('add_dddl')}
                open={openModalAdd}
                onCancel={onCloseModalAddField}
                footer={[]}
            >
                <Form
                    name="basic"
                    labelAlign='left'
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 19 }}
                    initialValues={{ remember: true }}
                    onFinish={onAddSubmit}
                >

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div>
                            <Button color="primary" className="p-0 mb-2">
                                <label style={{ padding: '2px 20px' }} htmlFor="uploadInput" className={classes.uploadButton}>
                                    Upload Image
                                </label>
                            </Button>
                            <input
                                id="uploadInput"
                                type="file"
                                accept="image/*"
                                className={classes.uploadInput}
                                style={{ display: 'none' }}
                                onChange={(e) => handleChange(e)}
                            />
                        </div>
                        <Avatar
                            src={imageLink ?? ''}
                            alt="avatar"
                            style={{ width: 200, height: 200 }}
                        />

                        <Form.Item label="Tên điểm du lịch" name='name'>
                            <Input
                                type="text"
                                style={{ width: '100%' }}
                                className={classes['add-modal-input']}
                            />
                        </Form.Item>
                        <Form.Item label={t('province')}
                            rules={[
                                { required: true, message: t('must_choose') },
                            ]}
                            name='province'>
                            <Select
                                type="text"
                                style={{ width: '100%' }}
                                options={Constants.vietnamProvinces}
                            />
                        </Form.Item>
                        <Form.Item label="Nhập kinh độ" name='longitude'>
                            <Input
                                type="text"
                                style={{ width: '100%' }}
                                className={classes['add-modal-input']}
                            />
                        </Form.Item>
                        <Form.Item label="Nhập vĩ độ" name='latitude'>
                            <Input
                                type="text"
                                style={{ width: '100%' }}
                                className={classes['add-modal-input']}
                            />
                        </Form.Item>

                        <Form.Item label="Thời gian hoạt động" name="time"
                        >
                            <TimePicker.RangePicker
                                format='HH:mm'
                                placeholder={['Bắt đầu', 'Kết thúc']}
                            />
                        </Form.Item>

                        <Form.Item label="Nhập vé vào cửa" name='price'>
                            <Input
                                type="number"
                                style={{ width: '100%' }}
                                className={classes['add-modal-input']}
                            />
                        </Form.Item>

                        <Form.Item label="Giới thiệu" name='experience'>
                            {/* <TextArea
                                placeholder='Giới thiệu về địa điểm...'
                                autoSize={{ minRows: 3, maxRows: 20 }}
                            // onChange={(e) => setEditValue(e.target.value)} value={editValue} 
                            /> */}

                            <ReactQuill
                                theme="snow"
                                value={content}
                                onChange={(e) => setContent(e)}
                                modules={modules}
                                formats={formats}
                                placeholder="Giới thiệu về địa điểm..."
                                className="bg-white rounded mt-5"
                            />
                        </Form.Item>

                        <div className="w-full flex justify-end float-right">
                            <Button type='primary'
                                style={{
                                    float: 'right'
                                }}
                                htmlType="submit"
                            >Thêm</Button>
                        </div>
                    </div>
                </Form>
            </Modal >

            <Modal
                width={800}
                title={t('update')}
                open={showModalUpdate}
                onCancel={onCloseModalUpdate}
                footer={[]}
            >
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Form
                        name="basic"
                        labelAlign='left'
                        form={form}
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 19 }}
                        initialValues={{ remember: true }}
                        onFinish={onUpdatedestinationSubmit}
                    >

                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div>
                                <Button color="primary" className="p-0 mb-2">
                                    <label style={{ padding: '2px 20px' }} htmlFor="uploadInput" className={classes.uploadButton}>
                                        Upload Image
                                    </label>
                                </Button>

                                <input
                                    id="uploadInput"
                                    type="file"
                                    accept="image/*"
                                    className={classes.uploadInput}
                                    style={{ display: 'none' }}
                                    onChange={(e) => handleChange(e)}
                                />
                            </div>
                            <Avatar
                                src={imageLink ? imageLink : showModalUpdate?.image ?? ''}
                                alt="avatar"
                                style={{ width: 200, height: 200 }}
                            />

                            <Form.Item label={t('name_dddl')} name='name'>
                                <Input
                                    type="text"
                                    style={{ width: '100%' }}
                                    className={classes['add-modal-input']}
                                />
                            </Form.Item>
                            <Form.Item label={t('province')}
                                rules={[
                                    { required: true, message: t('must_choose') },
                                ]}
                                name='province'>
                                <Select
                                    type="text"
                                    style={{ width: '100%' }}
                                    options={Constants.vietnamProvinces}
                                />
                            </Form.Item>
                            <Form.Item label="Nhập kinh độ" name='longitude'>
                                <Input
                                    type="text"
                                    style={{ width: '100%' }}
                                    className={classes['add-modal-input']}
                                />
                            </Form.Item>
                            <Form.Item label="Nhập vĩ độ" name='latitude'>
                                <Input
                                    type="text"
                                    style={{ width: '100%' }}
                                    className={classes['add-modal-input']}
                                />
                            </Form.Item>

                            <Form.Item label="Thời gian hoạt động" name="time"
                            >
                                <TimePicker.RangePicker
                                    format='HH:mm'
                                    placeholder={['Bắt đầu', 'Kết thúc']}
                                />
                            </Form.Item>

                            <Form.Item label="Nhập vé vào cửa" name='price'>
                                <Input
                                    type="number"
                                    style={{ width: '100%' }}
                                    className={classes['add-modal-input']}
                                />
                            </Form.Item>

                            <Form.Item label="Giới thiệu" name='experience'>
                                {/* <TextArea
                                placeholder='Giới thiệu về địa điểm...'
                                autoSize={{ minRows: 3, maxRows: 20 }}
                            // onChange={(e) => setEditValue(e.target.value)} value={editValue} 
                            /> */}

                                <ReactQuill
                                    theme="snow"
                                    value={content}
                                    onChange={(e) => setContent(e)}
                                    modules={modules}
                                    formats={formats}
                                    placeholder="Giới thiệu về địa điểm..."
                                    className="bg-white rounded mt-5"
                                />
                            </Form.Item>

                            <div className="w-full flex justify-end float-right">
                                <Button
                                    style={{
                                        backgroundColor: 'blue',
                                        width: '100%', float: 'right'
                                    }}
                                    htmlType="submit"
                                    onClick={onUpdatedestinationSubmit}
                                >{t('update')}</Button>
                            </div>
                        </div>
                    </Form>

                </div>
            </Modal >

        </div >
    )
}
export default TouristDes
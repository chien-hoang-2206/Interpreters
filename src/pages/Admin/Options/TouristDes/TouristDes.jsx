import React, { useEffect, useState } from "react";
import { Table, Input, Modal, Typography, Button, Avatar, Form, Space, TimePicker } from "antd";
import classes from './TouristDes.module.css'
import CategoriesFactories from "../../../../services/CategoriesFatories";
import { ToastNoti, ToastNotiError, convertStringToNumber, getDate } from "../../../../utils/Utils";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { storage } from "../../../../firebase";
import { v4 } from 'uuid';
import DestinationFactories from "../../../../services/DestinationFatories";
import TextArea from "antd/es/input/TextArea";

const { Text } = Typography;

const TouristDes = () => {
    const [TouristDes, setTouristDes] = useState()
    const [inputSearch, setInputSearch] = useState("");
    const [openModalAdd, setOpenModalAdd] = useState(false)
    const [destinationAddName, setDestinationAddName] = useState()
    const [destinationUpdateId, setDestinationUpdateId] = useState()

    const [destinationUpdateName, setDestinationUpdateName] = useState()
    const [destinationUpdateImage, setDestinationUpdateImage] = useState()
    const [error, setError] = useState();
    const [showModalUpdate, setShowModalUpdate] = useState();

    const fetchData = async (Keyword) => {
        const response = await DestinationFactories.getListDestination(Keyword);
        setTouristDes(response);
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
            align: 'center',
            render: (id, record, index) => { ++index; return index; },
            showSorterTooltip: false,
        },
        {
            title: "Tên Địa điểm du lịch",
            dataIndex: "name",
            key: "name",
            render: (text, data) => <div className="name-title-table">{text}</div>,
        },
        {
            title: "Giá vé",
            dataIndex: "price",
            key: "price",
            render: (text, data) => <div className="name-title-table">{convertStringToNumber(text)}</div>,
        },
        {
            title: "Thời gian",
            dataIndex: "name",
            key: "time_start",
            render: (text, data) => <div className="name-title-table">{`${getDate(data?.time_start, 6)} - ${getDate(data?.time_end, 6)}`}</div>,
        },
        {
            title: "Tác vụ",
            key: "action",
            render: (_, record) => (
                <div className="btn-action-group" >
                    <Button
                        style={{ marginRight: 10 }}
                        onClick={() => onDeleteFiledHandler(record?.id)}
                    >
                        Xóa
                    </Button>
                    {/* <Button
                        type='default'
                        style={{
                            color: '#fff'
                        }}
                        onClick={() => onUpdatedestination(record)}
                    >
                        Sửa
                    </Button> */}
                </div>
            ),
        },
    ];

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
        setShowModalUpdate(true);
    }
    const onCloseModalUpdate = (id) => {
        setShowModalUpdate(false);
        setDestinationUpdateId();
        fetchData();
    }
    const onOpenModalAddField = () => {
        setOpenModalAdd(true)
        setFileUploadLink();
    }

    const onCloseModalAddField = () => {
        setOpenModalAdd(false)
        setFileUploadLink();
        fetchData();
    }

    const onChangeDataAddField = (event) => {
        setError()
        setDestinationAddName(event.target.value)
    }

    const onChangeDataUpdateField = (event) => {
        setDestinationUpdateName(event.target.value);
    }


    const onAddSubmit = async (value) => {
        setError();
        const data = {
            name: value?.name,
            image: fileUploadLink,
            latitudeL: value?.latitudeL,
            longitude: value?.longitude,
            time_start: value?.time[0],
            time_end: value?.time[1],
            price: value?.price,
            experience: value.experience
        }
        try {
            const resp = await DestinationFactories.createDestination(data);
            if (resp?.status === 200) {
                ToastNoti();
                onCloseModalAddField()
            } else {
                ToastNotiError('resp?.message');
            }
        } catch (error) {
            ToastNotiError();
        }
    }

    const onUpdatedestinationSubmit = async () => {
        if (!destinationUpdateName || destinationUpdateName?.trim() === '') {
            setError("Điền tên Địa điểm du lịch")
        }
        else {
            setError();
            const data = {
                name: destinationUpdateName,
                image: fileUploadLink ? fileUploadLink : destinationUpdateImage,
            }
            try {
                const resp = await CategoriesFactories.updatedestination(destinationUpdateId, data);
                if (resp?.status === 200) {
                    ToastNoti();
                    onCloseModalUpdate()
                } else {
                    ToastNotiError('resp?.message');
                }
            } catch (error) {
                ToastNotiError();
            }
        }
    }

    const [fileUploadLink, setFileUploadLink] = useState();


    function handleChangeImage(file) {
        if (file === null || !file) {
            console.log('No file selected.');
            return;
        }
        const uniqueFileName = `${file.name}_${v4()}`;
        const imageRef = ref(storage, `avatar/${uniqueFileName}`);
        uploadBytes(imageRef, file).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((downloadURL) => {
                setFileUploadLink(downloadURL)
            });
        }).catch((error) => {
            console.error('Error uploading file:', error);
        });
    }
    return (
        <div className="booking-container" style={{ height: '100vh', overflow: 'scroll' }}>
            <div className="booking-title"><span>Địa điểm du lịch</span></div>
            <div className="booking-search">
                <Input
                    placeholder="Tìm kiếm Địa điểm du lịch"
                    size="middle "
                    value={inputSearch}
                    onKeyDown={(e) => handleKeyDown(e)}
                    onChange={(e) => handleOnChangeInput(e)}
                />
                <Button
                    type='default'
                    style={{
                        backgroundColor: 'transparent'
                    }}
                    onClick={handleReset}
                >
                    Mặc định
                </Button>
                <Button
                    type='primary'
                    onClick={handleSearch}
                >
                    Tìm kiếm
                </Button>
                <Button type='primary'
                    style={{
                    }}
                    onClick={onOpenModalAddField} >Thêm Địa điểm du lịch</Button>
            </div>
            <div className="booking-table">
                <Table
                    columns={columns}
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
                title="Thêm Địa điểm du lịch"
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
                            <label style={{ padding: '2px 20px', border: '1px solid #FAF8F1', borderRadius: 5 }} htmlFor="uploadInput" className={classes.uploadButton}>
                                Upload Image
                            </label>
                            <input
                                id="uploadInput"
                                type="file"
                                className={classes.uploadInput}
                                style={{ display: 'none' }}
                                onChange={(e) => handleChangeImage(e.target.files[0])}
                            />
                        </div>
                        <Avatar
                            src={fileUploadLink ?? ''}
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
                        <Form.Item label="Nhập kinh độ" name='longitude'>
                            <Input
                                type="text"
                                style={{ width: '100%' }}
                                className={classes['add-modal-input']}
                            />
                        </Form.Item>
                        <Form.Item label="Nhập vĩ độ" name='latitudeL'>
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
                                type="text"
                                style={{ width: '100%' }}
                                className={classes['add-modal-input']}
                            />
                        </Form.Item>

                        <Form.Item label="Giới thiệu" name='experience'>
                            <TextArea
                                placeholder='Giới thiệu về địa điểm...'
                                autoSize={{ minRows: 3, maxRows: 20 }}
                            // onChange={(e) => setEditValue(e.target.value)} value={editValue} 
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
                title="Sửa thông tin Địa điểm du lịch"
                open={showModalUpdate}
                onCancel={onCloseModalUpdate}
                footer={[]}
            >
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div>
                        <label style={{ padding: '2px 5px', border: '1px solid #FAF8F1', borderRadius: 5 }} htmlFor="uploadInput" className={classes.uploadButton}>
                            Upload Image
                        </label>
                        <input
                            id="uploadInput"
                            type="file"
                            className={classes.uploadInput}
                            style={{ display: 'none' }}
                            onChange={(e) => handleChangeImage(e.target.files[0])}
                        />
                    </div>
                    <Avatar
                        src={fileUploadLink ? fileUploadLink : destinationUpdateImage}
                        alt="avatar"
                        style={{ width: 200, height: 200 }}
                    />

                    {error && <Text type="danger">{error}</Text>}
                    <Button
                        style={{
                            backgroundColor: 'blue',
                            width: '100%', float: 'right'
                        }}
                        htmlType="submit"
                    // onClick={onUpdatedestinationSubmit}
                    >Sửa</Button>
                </div>
            </Modal >

        </div >
    )
}
export default TouristDes
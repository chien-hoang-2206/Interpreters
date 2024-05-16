import React, { useState, useEffect } from 'react';
import './BannerPage.scss'; // Bạn cần tạo một file CSS với các style cần thiết
import Banner from '../../../../components/Banner/Banner';
import { Button, Image, Modal, Space, Spin, Table } from 'antd';
import BannerFactories from '../../../../services/BannerFactories';
import { ToastNoti, ToastNotiError } from '../../../../utils/Utils';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../../../../firebase';
import { v4 } from 'uuid';
import { useTranslation } from 'react-i18next';

const BannerPage = (props) => {
    const [open, setOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(false);
    const [bannerUpdate, setBannerUpdate] = useState(false);
    const { t } = useTranslation()
    const [dataBander, setData] = useState([]);

    const fetchApiList = async () => {

        try {
            const response = await BannerFactories.getListBanner();
            if (response?.status === 200) {
                setData(response.data);
            } else {
                ToastNotiError()
            }
        } catch (error) {
            ToastNotiError()
        }
    };

    useEffect(() => {
        fetchApiList();
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
            title: "Url",
            width: 200,
            dataIndex: "url",
            render: (text) => (
                <span> {text}</span>
            ),
        },
        {
            title: "Preview",
            width: 340,
            dataIndex: "url",
            render: (text) => (
                <Image
                    width={300}
                    height={70}
                    src={text ?? ''}
                >
                </Image>
            ),
        },
        {
            title: t('action'),
            key: "action",
            width: 90,
            align: 'center',
            render: (_, record) =>
                <Space size="middle">
                    <Button onClick={(e) => showModalDelete(record?.id)} size='small' type="primary" danger>
                        Xóa
                    </Button>
                    {/* <>
                        <Button style={{ margin: 'px', float: 'right' }}><div>
                            <label style={{ padding: '2px 5px', borderRadius: 5 }} htmlFor="uploadInput" className={'uploadButton'}>
                                Sửa
                            </label>
                            <input
                                id="uploadInput"
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={(e) => handleChangeImage(e.target.files[0])}
                            />
                        </div>
                        </Button>
                    </> */}
                </Space>
        },
    ]

    const showModalUpdate = (data) => {
        setBannerUpdate(data)
        setOpen(true);
    };
    const showModalDelete = (id) => {
        setDeleteId(id)
        setOpen(true);
    };
    const hideModalDelete = () => {
        setDeleteId();
        setOpen(false);
    };

    async function handleClickDelete() {
        try {
            const response = await BannerFactories.requestDelete(deleteId);
            if (response?.status === 200) {
                ToastNoti()
                fetchApiList();
                setDeleteId();
                hideModalDelete();
            }
        } catch (error) {
            hideModalDelete();
            ToastNotiError()
        }
    }

    const [fileUploadLink, setFileUploadLink] = useState();
    const [loading, setLoading] = useState();

    async function fetchApiUploadBanner(url) {
        try {
            const data = {
                url: url,
            }
            const resp = await BannerFactories.requestAdd(data);
            if (resp?.status === 200) {
                ToastNoti();
                setLoading(false);
                fetchApiList();
            }
        } catch (error) {
            ToastNotiError();
        }
    }

    useEffect(() => {
        if (fileUploadLink && fileUploadLink !== '') {
            fetchApiUploadBanner(fileUploadLink);
        }
    }, [fileUploadLink])

    function handleChangeImage(file, type = 1) {
        setLoading(true);
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
            <div class='previewBanner'>
                <Banner data={dataBander} />
            </div>

            <div className="booking-table">
                {loading ?
                    <Spin tip="Loading" style={{ marginTop: 100 }} spinning={'true'} size="large">
                        <div className="content" />
                    </Spin>
                    :
                    <>
                        <Button style={{ margin: 'px', float: 'right', background: 'transparent' }}><div>
                            <label style={{ padding: '2px 5px', color: '#111', borderRadius: 5 }} htmlFor="uploadInput" className={'uploadButton'}>
                                Upload Image
                            </label>
                            <input
                                id="uploadInput"
                                type="file"
                                style={{ display: 'none' }}
                                onChange={(e) => handleChangeImage(e.target.files[0])}
                            />
                        </div>
                        </Button>
                        <Table
                            columns={columns}
                            dataSource={dataBander}
                        />
                    </>
                }
            </div>
            <Modal
                title="Xác nhận"
                open={open}
                onOk={handleClickDelete}
                onCancel={hideModalDelete}
                okText="Xác nhận"
                cancelText="Hủy bỏ"
            >
                Bạn chắc chắn muốn xóa Banner này ?
            </Modal>
        </div>
    );
};
export default BannerPage;

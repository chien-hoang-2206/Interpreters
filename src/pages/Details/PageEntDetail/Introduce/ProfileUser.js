import React, { useContext, useEffect, useState } from 'react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { CollapseContext } from '../../../../context/collapse.context';
import { AuthContext } from '../../../../context/auth.context';
import Feedback from '../../../../components/Feedback/Feedback';
import { Alert, Avatar, BackTop, Button, Input, InputNumber, Modal, Pagination, Tabs, Upload, message } from 'antd';
// import IntroduceHint from '../../PageHintDetail/IntroduceKOL/IntroduceKOL';
import styles from './Profile.module.scss'
import CardType from '../../../../components/catgegory/CardType';
import StarRating from '../../../../components/start-rating/StarRating';
import { EditFilled, UploadOutlined } from '@ant-design/icons';
import Temp from '../../../../utils/temp';
import useWindowSize from '../../../../hook/use-window-size';
import { ToastNoti, ToastNotiError, convertStringToNumber } from '../../../../utils/Utils';
import HintFactories from '../../../../services/HintFatories';
import { toast } from 'react-toastify';
import AccountFactories from '../../../../services/AccountFactories';
import { getDownloadURL, list, ref, uploadBytes } from "firebase/storage"
import { storage, uploadImage } from '../../../../firebase';
import { v4 } from 'uuid';
import AvatarCustom from '../../../../components/Avatar/Avatar';
import { useDropzone } from 'react-dropzone';
import IntroduceHint from '../../PageHintDetail/IntroduceKOL/IntroduceHint';
import BoxCustom from '../../../../components/Box/BoxCustom';
import { useTranslation } from 'react-i18next';

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
const ProfileUser = () => {
    const { user, setUser } = useContext(AuthContext);
    const [userInfo, setUserInfo] = useState();
    const [items, setItems] = useState();
    const [editPrice, setEditPrice] = useState();
    const [editUserName, setEditUserName] = useState();
    const [userName, setUserName] = useState();
    const [pricePgt, setPricePgt] = useState();

    const [price, setPrice] = useState({
        individual1: 0,
        individual2: 0,
        group2: 0,
        group3: 0,
    })
    const { isCollapse } = useContext(CollapseContext)
    const [dataFeedback, setDataFeedback] = useState();
    const [rate, setRate] = useState();

    async function fetchFeedbackData(id) {
        try {
            const resp = await HintFactories.getHINTFeedbackList(id);
            if (resp.status === 200) {
                setDataFeedback(resp.data);
                setRate(resp.rate)
            }
        } catch (error) {
        }
    }
    useEffect(() => {
        if (user?.id) {
            fetchFeedbackData(user?.id);
        }
    }, [user?.id])
    const fetchData = async () => {
        try {
            const response = await HintFactories.getHINTDetail(user?.id);
            setUserInfo(response[0]);
        } catch (error) {
            toast.error('Hệ thống lỗi, vui lòng thử lại sau')
            // Handle errors here
        }
    };
    useEffect(() => {
        fetchData();
        document.title = `Thồng tin cá nhân`;
    }, []);

    useEffect(() => {
        setPricePgt(userInfo?.price)
    }, [userInfo?.price]);

    function handleChangePrice(field, e) {
        let newPrice = { ...price }
        newPrice[field] = e
        setPrice(newPrice)
    }

    const renderFeedBack = () => {
        const onShowSizeChange = (current, pageSize) => {
            console.log(current, pageSize);
        };
        const handleChange = (e) => {
            console.log(e)
        }
        return (
            <>
                {Temp.FeedBack?.map((item, index) => (
                    <Feedback
                        key={index}
                        avatar={item?.avatar}
                        userName={item?.userName}
                        comment={item?.comment}
                        star={item?.star}
                        date={item?.date}
                        timeRental={item?.timeRental}
                        time={item?.time}
                    />
                ))}

                <div className={styles.boxPagination} >
                    <Pagination
                        showSizeChanger
                        // onShowSizeChange={onShowSizeChange}
                        defaultCurrent={10}
                        onChange={(e) => handleChange(e)}
                        total={100}
                    // responsive
                    />
                </div>
            </>
        )
    };
    const renderCategopryGame = () => {
        return (
            <>
                {Temp.GameList?.map((item, index) => (
                    <CardType
                        key={index}
                        id={item.id}
                        name={item.name}
                        background={item.background}
                    />
                ))}
            </>
        )
    };

    useEffect(() => {
        document.title = `HINT | ${userInfo?.user_name}`;
        return () => {
            document.title = "HINT";
        };
    }, [userInfo?.id]);

    useEffect(() => {
        if (user?.role_id === 2) {
            setItems(
                [
                    {
                        key: '1',
                        label: 'Giới thiệu',
                        children: <IntroduceHint id={user?.id} canEdit introduction={userInfo?.introduction} />,
                    },

                ])
        } else {
            setItems(
                [
                    {
                        key: '1',
                        label: 'Giới thiệu',
                        children: <IntroduceHint id={user?.id} canEdit introduction={userInfo?.introduction} />,
                    }
                ])
        }
    }, [userInfo]);

    const onChange = (key) => {
        console.log(key);
    };

    const fetchDataUpdate = async (data) => {
        try {
            const response = await AccountFactories.requestUpdate(user?.id, data);
            if (response?.status === 200) {
                user.status = data?.status;
                user.avatar = data?.avatar;
                user.price = data?.price;
                localStorage.setItem("user", JSON.stringify(user));
                const storedUser = localStorage.getItem("user");
                setUser(JSON.parse(storedUser));
                toast.success('Cập nhật thông tin thành công')
                setPricePgt(response?.user?.price);
                setFileUploadLink();
                fetchData()
            }
        } catch (error) {
            console.log(error);
            toast.error('Hệ thống lỗi.')
        }
    };

    const onSubmitChangePrice = () => {
        const data = {
            personal_price_session: price.individual1,
            personal_price_day: price.individual2,
            group_price_avge: price?.group1,
            group_price_session: price.group2,
            group_price_day: price.group3,
        }
        fetchDataUpdate(data)
        setEditPrice(!editPrice);
    };

    const onSubmitChangeUserName = () => {
        const data = { user_name: userName }
        fetchDataUpdate(data)
        setEditUserName(!editUserName);
    };
    const handleChagePrice = () => {
        setPrice({
            individual1: userInfo?.price?.personal_price_session,
            individual2: userInfo?.price?.personal_price_day,
            group2: userInfo?.price?.group_price_session,
            group3: userInfo?.price?.group_price_day,
        })
        setEditPrice(true)
    };

    const handleChageUserName = () => {
        setUserName(userInfo?.user_name);
        setEditUserName(!editUserName);
    };

    const { width, height } = useWindowSize();
    const [fileUploadLink, setFileUploadLink] = useState();

    useEffect(() => {
        if (fileUploadLink) {
            updateImageProfileUser(fileUploadLink)
        }
    }, [fileUploadLink])
    function updateImageProfileUser() {
        const data = { avatar: fileUploadLink, }
        fetchDataUpdate(data)
    }
    async function firebaseUpload(file) {
        try {
            const uniqueFileName = `${file.name}_${v4()}`;
            const imageRef = ref(storage, `avatar/${uniqueFileName}`);
            const snapshot = await uploadBytes(imageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);
            return downloadURL;
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error; // Propagate the error for handling in the calling function
        }
    }

    async function handleChangeImage(file) {
        if (file === null || !file) {
            console.log('No file selected.');
            return;
        }
        try {
            const downloadURL = await firebaseUpload(file);
            setFileUploadLink(downloadURL);
        } catch (error) {
            console.error('Error handling image change:', error);
        }
    }

    const [previewOpen, setPreviewOpen] = useState(false);
    const [editListImage, setEditListImage] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState([]);

    const handleSaveImage = async () => {
        const newListImage = fileList?.map((item) => item.url || item?.xhr);
        const UserId = user?.id;
        try {
            const resp = await AccountFactories.requestUpdatePhotoList(UserId, newListImage)
            if (resp.status === 200) {
                ToastNoti();
                setEditListImage(false);
                fetchData();
            }
        } catch (error) {
        }
    }
    const handleEditFieldListImage = () => {
        setEditListImage(!editListImage)
        const listImage = userInfo?.listImage;
        const newList = listImage?.map((item, index) => ({
            uid: `-${index + 1}`,
            status: 'done',
            url: item?.link,
        }))
        setFileList(newList)
    };


    const customUpload = async ({ onError, onSuccess, file }) => {
        try {
            const uniqueFileName = `${file.name}_${v4()}`;
            const imageRef = ref(storage, `avatar/${uniqueFileName}`);
            const snapshot = await uploadBytes(imageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);
            // lưu ảnh vào csdl cho user id gọi api   
            onSuccess(null, downloadURL);
        } catch (e) {
            onError(e);
        }
    }
    const onDrop = async (acceptedFiles) => {
        try {
            for (const file of acceptedFiles) {
                await customUpload({
                    onError: (error) => console.error('Error uploading image:', error),
                    onSuccess: (file, downloadURL) => {
                        setFileList((prevFileList) => [
                            ...prevFileList,
                            {
                                uid: v4(),
                                status: 'done',
                                url: downloadURL,
                            },
                        ]);
                    },
                    file,
                });
            }
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };
    const { t } = useTranslation()
    const handleRemove = (uid) => {
        setFileList((prevImages) => prevImages.filter((image) => image.uid !== uid));
    };


    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
        <>
            <main className={styles["main-details"]} >
                <div
                    style={{ minWidth: (width - 260) }}
                    className={`${styles["container"]} ${styles[isCollapse ? "isCollapse" : '']}  `}
                >
                    <div className={styles.profile}>
                        <div className={styles.stickyProfile}>
                            <div className={styles.profileContainer}>
                                <div className='shadow-lg   before:bg-white/10 border-white/20 border-1  border-solid border-blue-800 '>
                                    <label style={{ padding: '2px 5px', border: '1px solid #FAF8F1', borderRadius: 5 }} htmlFor="uploadInput" className={styles.uploadButton}>
                                        Upload Image
                                    </label>
                                    <input
                                        id="uploadInput"
                                        type="file"
                                        className={styles.uploadInput}
                                        style={{ display: 'none' }}
                                        onChange={(e) => handleChangeImage(e.target.files[0])}
                                    />
                                </div>
                                <Avatar
                                    src={userInfo?.avatar}
                                    alt="avatar"
                                    style={{ width: 200, height: 200 }}
                                    photoList={userInfo?.listImage ?? ''}
                                />
                            </div>
                            {user?.role_id === 2 && (<>
                                <div className={styles.statusInfo}>
                                    <div className={` ${styles.boxStatus} ${user?.status === 1 ? '' : styles.Pause}  `} >
                                        <div className={`${styles.textStatus} ${user?.status === 1 ? '' : styles.Pause}`}>
                                            {(user?.status === 1) ? 'Đang làm việc' : 'Đang tạm nghỉ'}
                                        </div>
                                    </div>
                                </div>
                            </>)}

                            {editListImage ?
                                <>
                                    <div className={styles.dropzone} >

                                        <div className={styles.imageList}  >
                                            {fileList.map((image, index) => (
                                                <div key={index} className={styles.imgContainer} >
                                                    <img
                                                        src={(image.url)}
                                                        alt={`Uploaded ${index + 1}`}
                                                        className={styles.Image}
                                                    />
                                                    <Button onClick={() => handleRemove(image?.uid)}>Xóa</Button>
                                                </div>
                                            ))}
                                        </div>
                                        <div className='flex flex-row justify-evenly'>

                                            <div {...getRootProps()} >
                                                <input {...getInputProps()} />
                                                <Button style={{ background: '#fff', color: 'blue' }}>Thêm ảnh</Button>
                                            </div>
                                            <Button
                                                type='default'
                                                onClick={handleSaveImage}>Lưu</Button>
                                        </div>
                                    </div>
                                </>
                                :
                                <div className={styles.profileContainer}>
                                    <AvatarCustom
                                        isShowAvatar={false}
                                        avatar={userInfo?.avatar ?? ''}
                                        photoList={userInfo?.listImage ?? ''}
                                    />
                                    <Button
                                        type='primary'
                                        onClick={handleEditFieldListImage}>Chỉnh sửa</Button>
                                </div>
                            }
                        </div>
                    </div>

                    <div className={styles.info}>
                        <div className={styles.profileInfo}>
                            <div className={styles.title}>
                                <span className={` ${styles.userName}  `} >
                                    {editUserName ?
                                        <div>
                                            <Input
                                                style={{ width: '100%' }}
                                                value={userName}
                                                onChange={(e) => setUserName(e.target.value)}
                                            />
                                            <div className={styles.editbtn}>
                                                <Button onClick={handleChageUserName} >Hủy</Button>
                                                <Button onClick={onSubmitChangeUserName}>Lưu</Button>
                                            </div>
                                        </div>
                                        :
                                        <>
                                            {userInfo?.user_name}{" "}
                                            <EditFilled width={50} onClick={handleChageUserName} />
                                        </>

                                    }
                                </span>

                            </div>

                            <div className={styles.properties}>
                                {user?.role_id === 2 &&
                                    <>
                                        <div className={styles.boxPropertie}>
                                            <span className={styles.namePropertie}>
                                                ĐÃ ĐƯỢC THUÊ
                                            </span>
                                            <span className={styles.number}>
                                                {dataFeedback?.length} lượt
                                            </span>
                                        </div>

                                        <div className={styles.boxPropertie}>
                                            <span className={styles.namePropertie}>
                                                TỶ LỆ HOÀN THÀNH
                                            </span>
                                            <span className={styles.number}>
                                                {rate?.toFixed(2) ?? 100} %
                                            </span>
                                        </div>
                                    </>}
                            </div>

                        </div>

                        {userInfo?.role === 2 && <div className={styles.category}>
                            {renderCategopryGame()}
                        </div>}

                        <div className={styles.infomation}>
                            <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
                        </div>

                    </div>

                    {user?.role_id === 2 &&
                        <div className={styles.contact}>
                            <div className={styles.stickyBox}>
                                <div className={'w-[420px]'}>
                                    <div className={styles.edit}>
                                        <BoxCustom
                                            title='Giá dịch vụ'
                                            description={
                                                <>
                                                    <div className='mt-[-30px] flex flex-col w-full'>

                                                        <div className="flex w-full flex-col gap-4 justify-center items-center">
                                                            <div className="flex flex-col flex-start w-full gap-2">

                                                                <ul className='font-bold ' >
                                                                    Cá nhân
                                                                    <li className='ml-2 text-gray-500 flex justify-between'>
                                                                        <span>
                                                                            Theo buổi:
                                                                        </span>
                                                                        <span className=" font-medium  text-yellow-400">
                                                                            {editPrice ?
                                                                                <div>
                                                                                    <InputNumber
                                                                                        addonAfter="VND"
                                                                                        style={{ width: '230px' }}
                                                                                        value={price?.individual1}
                                                                                        onChange={(value) => handleChangePrice('individual1', value)}
                                                                                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                                                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                                                                    />

                                                                                </div>
                                                                                :
                                                                                <>
                                                                                    <p>{convertStringToNumber(userInfo?.price?.personal_price_session)}</p>
                                                                                </>
                                                                            }


                                                                        </span>
                                                                    </li>
                                                                    <li className='text-gray-500  ml-2  flex justify-between'>
                                                                        <span>
                                                                            Theo ngày:
                                                                        </span>
                                                                        <span className=" font-medium  text-yellow-400">
                                                                            {editPrice ?
                                                                                <div>
                                                                                    <InputNumber
                                                                                        addonAfter="VND"
                                                                                        style={{ width: '230px' }}
                                                                                        value={price?.individual2}
                                                                                        onChange={(value) => handleChangePrice('individual2', value)}
                                                                                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                                                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                                                                    />

                                                                                </div>
                                                                                :
                                                                                <>
                                                                                    <p>{convertStringToNumber(userInfo?.price?.personal_price_day)}</p>
                                                                                </>
                                                                            }
                                                                        </span>
                                                                    </li>
                                                                </ul>

                                                                <ul className='font-bold ' >
                                                                    Theo nhóm
                                                                    <li className='text-gray-500 ml-2  flex justify-between'>
                                                                        <span>
                                                                            Theo buổi:
                                                                        </span>
                                                                        <span className=" font-medium  text-yellow-400">
                                                                            {editPrice ?
                                                                                <div>
                                                                                    <InputNumber
                                                                                        addonAfter="VND"
                                                                                        style={{ width: '230px' }}
                                                                                        value={price?.group2}
                                                                                        onChange={(value) => handleChangePrice('group2', value)}
                                                                                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                                                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                                                                    />

                                                                                </div>
                                                                                :
                                                                                <>
                                                                                    <p>{convertStringToNumber(userInfo?.price?.group_price_session)}</p>
                                                                                </>
                                                                            }
                                                                        </span>
                                                                    </li>
                                                                    <li className='text-gray-500  ml-2 flex justify-between'>
                                                                        <span>
                                                                            Theo ngày:
                                                                        </span>
                                                                        <span className=" font-medium ml-2 text-yellow-400">
                                                                            {editPrice ?
                                                                                <div>
                                                                                    <InputNumber
                                                                                        addonAfter="VND"
                                                                                        style={{ width: '230px' }}
                                                                                        value={price?.group3}
                                                                                        onChange={(value) => handleChangePrice('group3', value)}
                                                                                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                                                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                                                                    />

                                                                                </div>
                                                                                :
                                                                                <>
                                                                                    <p>{convertStringToNumber(userInfo?.price?.group_price_day)}</p>
                                                                                </>
                                                                            }
                                                                        </span>
                                                                    </li>
                                                                </ul>

                                                                {editPrice ?
                                                                    <div className={'w-full justify-evenly mt-5 flex'}>
                                                                        <Button onClick={handleChagePrice} >Hủy</Button>
                                                                        <Button onClick={onSubmitChangePrice}>Lưu</Button>
                                                                    </div>
                                                                    :
                                                                    <div className='mt-3 w-full'>
                                                                        <Button className='float-right ' onClick={handleChagePrice} >
                                                                            <EditFilled width={50} />
                                                                        </Button>
                                                                    </div>
                                                                }

                                                            </div>
                                                        </div>
                                                    </div>
                                                </>}
                                        />
                                    </div>

                                </div>

                            </div>
                        </div>
                    }
                </div>
            </main >

        </>
    );
};

export default ProfileUser;
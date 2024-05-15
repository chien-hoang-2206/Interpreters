import { CameraOutlined } from '@ant-design/icons';
import { Avatar, Button, Spinner, Textarea } from '@nextui-org/react';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import BoxCustom from '../../components/Box/BoxCustom';
import { compareTimestamps, convertStringToNumber, getDate } from '../../utils/Utils';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import DestinationFactories from '../../services/DestinationFatories';
import { useTranslation } from 'react-i18next';
import GoogleMapCustom from '../../components/google-map/GoogleMap';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { AuthContext } from '../../context/auth.context';
import { db } from '../../firebase';
import { addComment } from '../../utils/FirebaseService';



const DestinationPage = () => {
    const { user } = useContext(AuthContext)
    const [loading, setLoading] = useState();
    const [data, setData] = useState();
    const { t } = useTranslation()
    const { id } = useParams()
    const [comments, setComments] = useState([])
    const [newCmt, setNewCmt] = useState()

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

    async function handleAddComment() {
        if (user) {
            const data = {
                desId: id,
                userId: user.id,
                userName: `${user.userName}`,
                avatar: user?.avatar,
                content: newCmt
            }
            addComment(data,'destinations');
            setNewCmt()
        }
    }

    const fetchDataCmt = useCallback((id) => {
        // Đảm bảo người dùng đã đăng nhập và có đối tượng user
        if (user) {
            const queryFB = query(
                collection(db, "comments"),
                where("desId", "==", parseInt(id)),
            );
            // Lắng nghe thay đổi và cập nhật state
            return onSnapshot(queryFB, (querySnapshot) => {
                const updatedCmts = querySnapshot.docs.map(doc => ({
                    ...doc.data()
                }));
                const newList = updatedCmts.sort(compareTimestamps);
                setComments(newList);
            });
        } else {
            setComments([]);
            return undefined;
        }
    }, [id]);


    useEffect(() => {
        const unsubscribe = fetchDataCmt(id);
        // Dọn dẹp listener khi component unmount hoặc query thay đổi
        return () => unsubscribe && unsubscribe();
    }, [fetchDataCmt]);

    return (
        <div className="py-10 w-full flex flex-col justify-center items-center">
            <div className="w-full flex flex-col justify-center items-center min-h-[500px]">
                {loading ? <Spinner /> :
                    <div className="flex flex-row justify-between items-start gap-5">

                        <div className="w-[750px] flex flex-col gap-14 justify-center items-center">

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
                            {/* <div className='bg-white p-3 rounded-lg'>
                                <GoogleMapCustom
                                    // lng={data?.latitude}
                                    // lat={data?.latitude}
                                    lng={22.3035722}
                                    lat={103.7734656}
                                />
                            </div> */}


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

                            <BoxCustom
                                title={t('comment')}
                                description={
                                    <div className='w-[300px]'>
                                        {user &&
                                            <div className='mt-1'>
                                                <div className='flex flex-row gap-2 mt-1 p-1'>
                                                    <img style={{ borderRadius: 20, width: 30, height: 30 }} className='object-cover' src={user?.avatar} />
                                                    <div className='w-full'>
                                                        <Textarea
                                                            minRows={5}
                                                            radius='md'
                                                            classNames={'mb-3 bg-[transparent]'}
                                                            placeholder={t('add_comment')}
                                                            value={newCmt}
                                                            endContent={
                                                                <div className='flex flex-col items-end justify-end h-full '>
                                                                    <Button className='absolute bottom-2' onClick={() => handleAddComment()}>
                                                                        <i class="fas fa-paper-plane"></i>
                                                                    </Button>
                                                                </div>
                                                            }
                                                            onChange={(e) => setNewCmt(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                        }
                                        {comments?.map((i, dnx) => (
                                            <div key={dnx} className='flex flex-row gap-2 mt-1 p-1'>
                                                <img style={{ borderRadius: 20, width: 30, height: 30 }} className='object-cover' src={i?.avatar} />
                                                <div className='flex flex-col gap-1  border rounded-md bg-gray-100 w-full p-2'>
                                                    <div className='flex flex-row justify-between'>
                                                        <span className='text-left w-full text-sm text-blac font-bold'>{i.userName} </span>
                                                        <span className='text-xs text-right min-w-[100px]'>{getDate(i.createdAt, 12)}</span>
                                                    </div>
                                                    <h3 className="text-sm font-mono  ">{i.content}</h3>
                                                </div>

                                            </div>
                                        ))}
                                    </div>}
                            />

                        </div>

                    </div>
                }
            </div>
        </div >

    );
};

export default DestinationPage;
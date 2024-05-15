import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PostFactories from '../../services/PostFatories';
import { useTranslation } from 'react-i18next';
import { compareTimestamps, getDate } from '../../utils/Utils';
import { Button, Divider, Image, Input, Textarea, avatar, user } from '@nextui-org/react';
import { addComment } from '../../utils/FirebaseService';
import { db } from '../../firebase';
import { AuthContext } from '../../context/auth.context';
import { collection, getDocs, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const DetailPostPage = () => {
    const { id } = useParams();
    const { t } = useTranslation()
    const [data, setData] = useState()
    const { user } = useContext(AuthContext)
    const [newCmt, setNewCmt] = useState()
    const [dataList, setdataList] = useState()
    const [comments, setComments] = useState([])

    async function fetchData(id) {
        try {
            const resp = await PostFactories.getDetailPost(id);
            if (resp.status === 200) {
                setData(resp.data[0]);
            }
        } catch (error) {
        }
    }

    // const fetchDataCmt = async (id) => {
    //     try {
    //         const commentsQuery = query(collection(db, 'comments'), where('postId', '==', parseInt(id)));
    //         // Lắng nghe sự kiện realtime từ Firestore
    //         const unsubscribe = onSnapshot(commentsQuery, (snapshot) => {
    //             const commentsData = snapshot.docs.map(doc => doc.data());
    //             console.log("🚀 ~ unsubscribe ~ commentsData:", commentsData)
    //             if (commentsData) {
    //                 setComments(commentsData);
    //             }
    //         });

    //         // Hủy lắng nghe khi component unmount
    //         return unsubscribe;
    //     } catch (error) {
    //         console.error('Error fetching comments:', error);
    //     }
    // };

    const fetchDataCmt = useCallback((id) => {
        // Đảm bảo người dùng đã đăng nhập và có đối tượng user
        if (user) {
            const queryFB = query(
                collection(db, "comments"),
                where("postId", "==", parseInt(id)),
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


    useEffect(() => {
        if (id) {
            fetchData(id);
        }
        fetchDataList()
        // fetchDataCmt()
    }, [id])



    const fetchDataList = async () => {
        try {
            const response = await PostFactories.getListPost({
                status: 20,
            });
            setdataList(response.data);
        } catch (error) {
            // Handle errors here
        }
    };
    async function handleAddComment() {
        if (user) {
            const data = {
                postId: id,
                userId: user.id,
                userName: `${user.userName}`,
                avatar: user?.avatar,
                content: newCmt
            }
            addComment(data);
            setNewCmt('')
        }
    }
    return (
        <div className="py-10 w-full gap-8 flex flex-row justify-center items-start mx-auto max-w-[80%]">
            <div className='flex flex-col w-[65%]'>
                <span className="text-4xl font-bold my-5">{data?.title}</span>
                <Divider />
                <span className="text-sm font-bold w-full my-2 text-gray-600">{t('date_create')}: {getDate(data?.create_at)}</span>
                <span className="text-sm font-bold w-full text-gray-600 ">{t('per_create')}: {`${data?.first_name} ${(data?.last_name)}`} </span>
                <div className='preview-content text-justify mt-5 text-gray-600' dangerouslySetInnerHTML={{ __html: data?.content }} />
            </div>
            <div className='flex py-10 flex-col w-[25%]'>
                <span className=" mt-10 text-2xl font-bold text-blue-500 uppercase">{t('orther_post')}</span>
                <Divider />
                <div className='flex flex-col gap-5 mt-5'>
                    {dataList?.map(i => (
                        <Link key={i?.id} to={`/post/${i.id}`} className='flex flex-row gap-2 border-b rounded-md mt-3 border-b-gray-600 p-1'>
                            <img style={{ width: 60, height: 60 }} className='object-cover' src={i?.image} />
                            <div className='flex flex-col gap-1'>
                                <h3 className="text-sm font-semibold text-blue-500">{i.title}</h3>
                                <span className='text-right w-full text-sm text-gray-500'>{getDate(i.create_at)}</span>
                            </div>
                        </Link>
                    ))}
                </div>

                <span className=" mt-10 text-2xl font-bold text-blue-500 uppercase">{t('comment')}</span>
                <Divider />
                <div className='flex flex-col gap-5'>
                    {user &&
                        <div className='mt-1'>
                            <div className='flex flex-row gap-2 mt-1 p-1'>
                                <img style={{ borderRadius: 20, width: 30, height: 30 }} className='object-cover' src={user?.avatar} />
                                <div className='w-full'>
                                    <Textarea
                                        className='w-full'
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
                </div>
            </div>
        </div>
    );
};

export default DetailPostPage;
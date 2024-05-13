import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PostFactories from '../../services/PostFatories';
import { useTranslation } from 'react-i18next';
import { getDate } from '../../utils/Utils';
import { Button, Divider, Image, Input, avatar, user } from '@nextui-org/react';
import { addComment } from '../../utils/FirebaseService';
import { db } from '../../firebase';
import { AuthContext } from '../../context/auth.context';
import { collection, getDocs, query } from 'firebase/firestore';


const DetailPostPage = () => {
    const { id } = useParams();
    const { t } = useTranslation()
    const [data, setData] = useState()
    const { user } = useContext(AuthContext)
    const [newCmt, setNewCmt] = useState()
    const [dataList, setdataList] = useState()
    const [comments, setComments] = useState([
        {
            content: 'Bài viết rất hay, cảm ơn bạn',
            create_at: '2024/12/05',
            fullName: 'Mai Hoàng',
            avatar: 'https://huongdanvien.vn/dmdocuments/22/2024/04/Tran-Thi-Lan-Nhi.jpg'
        }
    ])

    async function fetchData(id) {
        try {
            const resp = await PostFactories.getDetailPost(id);
            if (resp.status === 200) {
                setData(resp.data[0]);
            }
        } catch (error) {
        }
    }

    const fetchDataCmt = async () => {
        try {
            const commentsQuery = query(collection(db, 'comments'), where('postId', '==', id));
            const snapshot = await getDocs(commentsQuery);
            const commentsData = snapshot.docs.map(doc => doc.data());
            setComments(commentsData);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    useEffect(() => {
        if (id) {
            fetchData(id);
        }
        fetchDataList()
        fetchDataCmt()
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
                userName: `${user.firstName} ${user.lastName}`,
                content: newCmt
            }
            addComment(data);
        }
    }
    return (
        <div className="py-10 w-full gap-8 flex flex-row justify-center items-start mx-auto max-w-[80%]">
            <div className='flex flex-col w-[65%]'>
                <span className="text-4xl font-bold my-5">{data?.title}</span>
                <span className="text-sm font-bold w-full my-2 text-gray-600">{t('date_create')}: {getDate(data?.create_at)}</span>
                <span className="text-sm font-bold w-full text-gray-600 ">{t('per_create')}: {`${data?.first_name} ${(data?.last_name)}`} </span>
                <div className='preview-content text-justify mt-5 text-gray-600' dangerouslySetInnerHTML={{ __html: data?.content }} />
            </div>
            <div className='flex py-10 flex-col w-[25%]'>
                <span className="text-2xl font">{t('orther_post')}</span>
                <Divider />
                <div className='flex flex-col gap-5'>
                    {dataList?.map(i => (
                        <Link to={`/post/${i.id}`} className='flex flex-row gap-2 border-b rounded-md mt-3 border-b-gray-600 p-1'>
                            <img style={{ width: 60, height: 60 }} className='object-cover' src={i?.image} />
                            <div className='flex flex-col gap-1'>
                                <h3 className="text-sm font-semibold text-blue-500">{i.title}</h3>
                                <span className='text-right w-full text-sm text-gray-500'>{getDate(i.create_at)}</span>
                            </div>
                        </Link>
                    ))}
                </div>

                <span className=" mt-10 text-2xl font">{t('comment')}</span>
                <Divider />
                <div className='flex flex-col gap-5'>
                    {user &&
                        <div>
                            <Input
                                className='mt-2'
                                placeholder={t('add_comment')}
                                // isInvalid={!newCmt}
                                onChange={(e) => setNewCmt(e.target.value)}
                            />
                            <div className=' mt-1 flex flex-row justify-end'>
                                <Button color='primary' onClick={() => handleAddComment()}>
                                    {t('comment')}
                                </Button>
                            </div>
                        </div>
                    }

                    {comments?.map(i => (
                        <Link to={`/post/${i.id}`} className='flex flex-row gap-2 mt-3 p-1'>
                            <img style={{ borderRadius: 20, width: 30, height: 30 }} className='object-cover' src={i?.avatar} />
                            <div className='flex flex-col gap-1  border rounded-md bg-gray-100 w-full p-2'>
                                <span className='text-left w-full text-sm text-gray-500'>{i.fullName} {getDate(i.create_at)}</span>
                                <h3 className="text-sm font-semibold  ">{i.content}</h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DetailPostPage;
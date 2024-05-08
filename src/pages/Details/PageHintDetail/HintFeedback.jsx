import { useEffect, useState } from 'react';
import HintFactories from '../../../services/HintFatories';
import { Avatar } from '@nextui-org/react';
import { getDate } from '../../../utils/Utils';
import { Rate } from 'antd';

const HintFeedback = (props) => {
    const { id } = props
    const [dataList, setDataList] = useState([]);


    async function fetchFeedbackData(id) {
        try {
            const resp = await HintFactories.getPGTFeedbackList(id);
            if (resp.status === 200) {
                setDataList(resp.hintInfo);
                // setRate(resp.rate)
            }
        } catch (error) {

        }
    }

    useEffect(() => {
        if (id) {
            fetchFeedbackData(id);
        }
    }, [id])

    return (
        <div className='flex flex-col min-w-[300]'>
            <div className="flex flex-col gap-2 justify-center items-center py-2">
                {dataList?.map(item => (
                    <div key={item?._id} className="flex flex-col w-full p-2 gap-2 border-b rounded-md border-1 border-spacing-1">
                        <div className="flex flex-row gap-2">
                            <Avatar
                                src={item?.patient_avatar}
                                alt=""
                                isBordered 
                                style={{
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '50%',
                                    objectFit: 'fill'
                                }}
                                className="object-cover w-full h-full rounded-lg"
                            />
                            <div className="flex w-full flex-col justify-start items-center">

                                <div className="flex  w-full flex-row justify-between items-center">
                                    <span className='font-bold text-xl text-blue2'>
                                        <Rate value={item.star} />
                                    </span>
                                    <span className='font-bold  text-xs'>
                                        {getDate(item?.createdAt)}
                                    </span>
                                </div>

                                <span className='font-bold text-sm  text-left w-full '>
                                    {item?.comment}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}

            </div>
        </div>
    );
};

export default HintFeedback;
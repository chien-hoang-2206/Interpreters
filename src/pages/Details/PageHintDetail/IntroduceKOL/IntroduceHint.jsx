import { EditFilled } from '@ant-design/icons';
import { Button, Input } from 'antd';
import React, { useEffect, useState } from 'react'
import AccountFactories from '../../../../services/AccountFactories';
import { toast } from 'react-toastify';
const { TextArea } = Input;
const FormatText = (props) => {
    const formattedText = props.details?.replace(/\\n/g, '\n').split('\n').map((line, index) => {
        return (
            <React.Fragment key={index}>
                {line}
                <br /><br />
            </React.Fragment>
        );
    });
    return <div style={{ marginTop: '20px' }}>{formattedText}</div>;
};
const IntroduceHint = ({ introduction, canEdit = false, id = null }) => {
    const [edit, setEdit] = useState(false);
    const [showIcon, showIconEdit] = useState(true);
    const [editValue, setEditValue] = useState('');
    const [introductionValue, setIntroductionValue] = useState('');

    useEffect(() => {
        setIntroductionValue(introduction);
    }, [introduction])

    function handleClickEdit() {
        setEdit(true);
        showIconEdit(false);
        setEditValue(introductionValue)
    }
    function onSubmitEdit() {
        const data = { introduction: editValue }
        fetchDataUpdate(data);
        setEdit(false);
        showIconEdit(true);
    }

    const fetchDataUpdate = async (data) => {
        try {
            const response = await AccountFactories.requestUpdate(id, data);
            if (response?.status === 200) {
                toast.success('Cập nhật thông tin thành công')
                setIntroductionValue(response?.user?.introduction);
                setEditValue('');
            }
        } catch (error) {
            console.log(error);
            toast.error('Hệ thống lỗi.')
        }
    };

    return (
        <div>
            {(canEdit && showIcon) &&
                <Button onClick={handleClickEdit} style={{ position: 'absolute', top: -10, right: 20, zIndex: 10 }}  >
                    <EditFilled width={20} />
                </Button>
            }
            {edit ? <>
                <TextArea
                    placeholder='Giới thiệu về bản thân ...'
                    autoSize={{ minRows: 3, maxRows: 20 }}
                    onChange={(e) => setEditValue(e.target.value)} value={editValue} />
                <Button onClick={onSubmitEdit}>Lưu</Button>
            </>
                :
                <span style={{ fontSize: '14px', opacity: '0.8', whiteSpace: 'pre-wrap', }}>
                    <FormatText details={introductionValue} />
                </span>
            }
        </div>
    )
}



export default IntroduceHint
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Tooltip } from 'antd';
import React from 'react';

const AvatarGroup = (props) => {
    const { list = [], maxCount = 3 } = props
    return (
        <>
            <Avatar.Group
                maxCount={maxCount}
                maxStyle={{
                    color: '#f56a00',
                    backgroundColor: '#fde3cf',
                }}
            >
                {list?.map((item, index) => (
                    <Tooltip title={item?.name} key={index} placement="top">
                        <Avatar
                            src={item?.image}
                            icon={item?.link}
                        >
                        </Avatar>
                    </Tooltip>
                ))}
            </Avatar.Group >
        </>
    )
}

export default AvatarGroup;
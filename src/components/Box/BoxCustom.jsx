import { Card, CardBody, CardHeader } from '@nextui-org/react';
import { Skeleton } from 'antd';
import PropTypes from 'prop-types';
const BoxCustom = props => {
    const { title, alignTitle, actions, onClick, isCanHover = false, description } = props
    const classNames = `${isCanHover ? 'boxHover' : 'boxNotHover '}`;
    return (
        <div className={classNames}>
            <Card
                onClick={onClick}
                styles={{
                    header: {
                        cursor: 'pointer',
                        backgroundColor: '#00b5f1', color: '#ffffff', textAlign: alignTitle ? alignTitle : 'left',
                        fontWeight: 'bold',
                        fontSize: 20,
                        zIndex: 20,
                        boxShadow: '0px 2px 4px #ccc',
                    },
                    body: {
                        cursor: 'pointer',
                        borderRadius: 0,
                        boxShadow: '0px 2px 4px #ccc',
                    },
                    actions: {
                        zIndex: 20,
                        position: 'relative',
                        boxShadow: '0px 2px 4px #ccc',
                    },
                }}
                type="inner"
                className='w-full'
                actions={actions}
            >
                {title &&
                    <CardHeader className="text-xl text-cyan-600 font-bold">{
                        title
                    }
                    </CardHeader>
                }
                <CardBody>
                    {description}
                </CardBody>
            </Card>
        </div >

    );
};

BoxCustom.propTypes = {
    title: PropTypes.string,
    description: PropTypes.func,
    actions: PropTypes.arrayOf(PropTypes.node),
};

export default BoxCustom;
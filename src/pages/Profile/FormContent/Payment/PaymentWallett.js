import React, { useContext, useEffect, useState } from 'react';
import styles from './Payment.module.scss'
import { Button, Input, InputNumber, Modal, Row, Space, Table, message } from 'antd';
import { toast } from 'react-toastify';
import Title from 'antd/es/typography/Title';
import PaymentFactories from '../../../../services/PaymentFactories';
import { AuthContext } from '../../../../context/auth.context';
import { ToastNotiError, convertStringToNumber, getDate } from '../../../../utils/Utils';
import { MoneyCollectTwoTone, WalletTwoTone } from '@ant-design/icons';
const PaymentWallett = () => {
    const columns = [
        {
            title: "Mã giao dịch",
            dataIndex: "txn_ref",
            width: 100,
            render: (text) => (
                <div className="text-data">
                    {text}
                </div>
            ),
        },
        {
            title: "Ngày giao dịch",
            dataIndex: "date",
            key: "date",
            width: 140,
            render: (text) => <div className="text-data">{getDate(text, 3)}</div>,
        },
        {
            title: "Nội dung",
            dataIndex: "description",
            key: "description",
            width: 140,
            render: (text, data) => <div className="text-data">{text}</div>,
        },
        {
            title: "Số tiền",
            dataIndex: "amount",
            key: "amount",
            align: 'right',
            width: 140,
            render: (text, data) => <div className="text-money" >{convertStringToNumber(text)} </div>,
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            align: 'right',
            width: 140,
            render: (text, data) => <div className="text-money" style={{ color: data?.status === 1 ? 'red' : 'rgb(102, 166, 240)' }}> {data?.status === 2 ? 'Thành công' : 'Thất bại'} </div>,
        },
    ];
    const [historyWallet, setHistoryWallet] = useState([]);
    const [money, setMoney] = useState();
    const { user } = useContext(AuthContext)
    async function fetchDate(id) {
        try {
            const resp = await PaymentFactories.getPaymentListForUser(user?.id);
            if (resp?.status === 200) {
                setHistoryWallet(resp.data);
                setMoney(resp.money);
            }
        } catch (error) {
            ToastNotiError(error);
        }
    }
    useEffect(() => {
        fetchDate(user?.id);
    }, [user?.id]);

    const handleAddMonney = async (value) => {
        try {
            const data = {
                amount: value,
                userId: user?.id,
            }
            const resp = await PaymentFactories.createVnPayPayment(data)
            if (resp.status === 200) {
                window.location.href = resp?.url;
            }
        } catch (error) {
        }
    };
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [value, setValue] = useState();
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        handleAddMonney(value);
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <main className={'booking-container'} >
            <Modal title="Nhập số tiền cần nạp" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <InputNumber
                placeholder="Nhập số tiền"
                addonAfter="VND"
                style={{ width: '100%' }}
                value={value}
                onChange={(value) => setValue(value)}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
              />
            </Modal>
            <div className={styles.formInfo}>
                <Title level={1}>Ví & Lịch sử thanh toán</Title>
                <Space direction="horizontal" className={styles.spaceContent}  >
                    <Space direction="vertical" >
                        <span className={styles.textCoin}                            >
                            Số dư hiện tại
                        </span>
                        <span className={styles.textCoinValue}                            >
                        {money ? convertStringToNumber(money) : '0 VND'}
                        </span>
                    </Space>
                    <Space direction="vertical">

                        <Button style={{ width: 170 }} onClick={showModal} type="primary" icon={<WalletTwoTone width={70} />} size={'large'} >
                            <span>
                                Nạp tiền
                            </span>
                        </Button>
                    </Space>
                </Space>
                <div className="booking-table">
                    <Table
                        columns={columns}
                        dataSource={historyWallet} />
                </div>
            </div>
        </main >
    );
};

export default PaymentWallett;
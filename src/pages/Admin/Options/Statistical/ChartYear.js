import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import BookingFactories from '../../../../services/BookingFactories';
import { ToastNotiError, convertStringToNumber } from '../../../../utils/Utils';
import { Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import { Card, CardBody } from '@nextui-org/react';
Chart.register(...registerables);

const ChartYear = (props) => {
    const { year, month } = props;
    const [barData1, setBarData1] = useState();
    const [barData2, setBarData2] = useState();
    const [barData3, setBarData3] = useState();
    const [total, setTotal] = useState();
    const [loading, setLoading] = useState(true);

    const { t } = useTranslation()
    const fetchDataYear = async (year, month) => {
        try {
            const response = await BookingFactories.getBookingChart(year, month);
            if (response?.status === 200) {
                const responseData = response?.data
                setTotal(response.total[0])
                let labels;
                if (month) {
                    labels = responseData.map(item => `Ngày ${item.day}`);
                } else {
                    labels = responseData.map(item => `Tháng ${item.month}`);
                }
                const bookingData = responseData.map(item => parseInt(item.bookings, 10));
                const totalPriceData = responseData.map(item => parseInt(item.total_price, 10));
                const barData1 = {
                    labels: labels,
                    datasets: [
                        {
                            label: t('quantity_booking_chart'),
                            backgroundColor: "rgb(54, 162, 235)",
                            data: bookingData
                        },
                    ]
                };
                const barData2 = {
                    labels: labels,
                    datasets: [
                        {
                            label: t('total_money'),
                            backgroundColor: "rgb(255, 99, 132)",
                            data: totalPriceData
                        }
                    ]
                };
                setBarData1(barData1);
                setBarData2(barData2);
            }
        } catch (error) {
            ToastNotiError();
        }
    };

    const fetchDataTop = async (year, month) => {
        try {
            const response = await BookingFactories.getBookingTopHINT(year, month);
            if (response?.status === 200) {
                const responseData = response?.data
                const labels = responseData.map(item => `${item.user_name}`);
                const totalBooking = responseData.map(item => parseInt(item.total_bookings));
                const barData3 = {
                    labels: labels,
                    datasets: [
                        {
                            label: t('top_hint'),
                            backgroundColor: "rgb(75, 192, 192)", // Teal
                            data: totalBooking
                        }
                    ]
                };
                setBarData3(barData3);
                setLoading(false);
            }
        } catch (error) {
            ToastNotiError();
            setLoading(false);
        }
    };
    useEffect(() => {
        setLoading(true);
        fetchDataYear(year, month);
        fetchDataTop(year, month);
    }, [year, month]);

    const options1 = {
        scales: {
            y: {
                beginAtZero: true
            }
        },
        tooltips: {
            callbacks: {
                label: function (tooltipItem, data) {
                    let label = data.datasets[tooltipItem.datasetIndex].label || '';
                    if (label) {
                        label += ': ';
                    }
                    label += ' Lần'
                    return label;
                }
            }
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        label += (context.raw);
                        label += ' Lần';
                        return label;
                    }
                }
            }
        }
    };
    const options3 = {
        scales: {
            y: {
                beginAtZero: true
            }
        },
        tooltips: {
            callbacks: {
                label: function (tooltipItem, data) {
                    let label = data.datasets[tooltipItem.datasetIndex].label || '';
                    return label;
                }
            }
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = t('quantity_booking');
                        if (label) {
                            label += ': ';
                        }
                        label += (context.raw);
                        return label;
                    }
                }
            }
        }
    };
    const options2 = {
        scales: {
            y: {
                beginAtZero: true
            }
        },
        tooltips: { // Note that `tooltips` is deprecated in Chart.js 3.x in favor of `tooltip`
            callbacks: {
                label: function (tooltipItem, data) {
                    let label = data.datasets[tooltipItem.datasetIndex].label || '';
                    if (label) {
                        label += ': ';
                    }
                    label += new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                    }).format(tooltipItem.yLabel);
                    return label;
                }
            }
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        label += new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        }).format(context.raw);
                        return label;
                    }
                }
            }
        }
    };
    return (
        <>
            {loading ? <Spin /> :
                <div className='w-full' style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
                    <div className='w-full' style={{ display: 'flex', flexDirection: 'column' }}>
                        {barData1?.labels &&
                            <Bar
                                style={{ height: '40vh' }}
                                data={barData1}
                                options={options1}
                            />
                        }
                        {barData2?.labels &&
                            <Bar
                                style={{ height: '40vh', marginTop: 10 }}
                                data={barData2}
                                options={options2}
                            />
                        }

                    </div>
                    <div className='w-full' style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div className='min-h-[30vh] mt-3 w-full flex gap-5 justify-end'>
                            <Card
                                className='h-32'
                            >
                                <CardBody>
                                    <b className='text-right text-xl'> {t('count_quantity')}</b>
                                    <p className="text-bold text-right text-blue-500 text-5xl">{total?.total}</p>
                                </CardBody>
                            </Card>
                            <Card
                                className='h-32'
                            >
                                <CardBody>
                                    <b className='text-right text-xl'> {t('money')}</b>
                                    <p className="text-bold text-right text-blue-500 text-5xl">{convertStringToNumber(total?.total_price)}</p>
                                </CardBody>
                            </Card>
                        </div>
                        <div>
                            {barData3?.labels &&
                                <div>
                                    <Bar
                                        style={{ height: '40vh' }}
                                        data={barData3}
                                        options={options3}
                                    />
                                </div>
                            }
                        </div>
                    </div>
                </div>
            }

        </>
    );
};

export default ChartYear;
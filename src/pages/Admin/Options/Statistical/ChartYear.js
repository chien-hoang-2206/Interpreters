import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import BookingFactories from '../../../../services/BookingFactories';
import { ToastNotiError } from '../../../../utils/Utils';
import { Spin } from 'antd';
Chart.register(...registerables);

const ChartYear = (props) => {
    const { year, month } = props;
    const [barData1, setBarData1] = useState();
    const [barData2, setBarData2] = useState();
    const [barData3, setBarData3] = useState();
    const [loading, setLoading] = useState(true);
    const fetchDataYear = async (year, month) => {
        try {
            const response = await BookingFactories.getBookingChart(year, month);
            if (response?.status === 200) {
                const responseData = response?.data
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
                            label: "Số lần được booking",
                            backgroundColor: "rgb(54, 162, 235)",
                            data: bookingData
                        },
                    ]
                };
                const barData2 = {
                    labels: labels,
                    datasets: [
                        {
                            label: "Tổng doanh thu (VND)",
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
            const response = await BookingFactories.getBookingTopPgt(year, month);
            if (response?.status === 200) {
                const responseData = response?.data
                const labels = responseData.map(item => `${item.user_name}`);
                const totalTime = responseData.map(item => parseInt(item.total_duration_minutes, 10));
                const barData3 = {
                    labels: labels,
                    datasets: [
                        {
                            label: "Top Interpreters Có số giờ booking cao nhất",
                            backgroundColor: "rgb(75, 192, 192)", // Teal
                            data: totalTime
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
                    if (label) {
                        label += ': ';
                    }
                    label += ' h'
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
                        label += ' h';
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
                <div style={{ display: 'flex', flexDirection: 'row', width: '100%', gap: 40 }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
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
            }

        </>
    );
};

export default ChartYear;
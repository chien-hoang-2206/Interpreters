import React from "react";
import { Bar } from "react-chartjs-2";

const TabBooking = () => {
  const labels = ["January", "February", "March", "April", "May", "June","July"];

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Tổng số lượng lượt thuê",
        backgroundColor: "rgb(54, 162, 235)",
        data: [4000, 2000, 1300, 2900, 2040, 7000,9000]
      }
    ]
  };

  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true
          }
        }
      ]
    }
  };

  return (
    <div>
      <Bar style={{height: '400px',width: '100%'}} data={data} options={options} />
    </div>
  );
};

export default TabBooking;

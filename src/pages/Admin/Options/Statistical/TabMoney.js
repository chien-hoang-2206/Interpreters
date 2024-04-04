import React from "react";
import { Bar } from "react-chartjs-2";

const TabMoney = () => {
  const labels = ["January", "February", "March", "April", "May", "June","July"];

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Thu vào tiền",
        backgroundColor: "rgb(255, 99, 132)",
        data: [12500, 4700, 3200, 5600, 5100, 6100,7000]
      },
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
      <Bar style={{height: '450px' ,width: '100%'}} data={data} options={options} />
    </div>
  );
};

export default TabMoney;

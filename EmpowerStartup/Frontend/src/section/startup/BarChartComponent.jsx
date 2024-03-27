import React from 'react';
import Chart from 'react-apexcharts';

function BarChartComponent({ salesData,type }) {
  console.log("Sales Data:", salesData);
  let xAxisData = [];
  let seriesData = [];

  // Format data for the chart
  salesData?.forEach((dataPoint) => {
    xAxisData.push(dataPoint?._id); // Push date to x-axis data
    seriesData.push(dataPoint?.totalSales); // Push total sales to series data
  });

  const options = {
    chart: {
      id: 'sales-progress-chart',
      toolbar: {
        show: true
      }
    },
    xaxis: {
      categories: xAxisData
    }
  };

  const series = [{
    name: 'Sales Progress',
    data: seriesData
  }]
  return (
    <div className="sales-progress-chart">
      <Chart options={options} series={series} type="line" />
    </div>
  );
}
export default BarChartComponent;

import React from 'react';
import Chart from 'react-apexcharts';

const StartupProgessGraph = ({salesSummary}) => {
  let xAxisData = [];
  let seriesData = [];

  // Format data for the chart
  salesSummary?.forEach((dataPoint) => {
    xAxisData.push(dataPoint?._id || 'unknown'); // Push date to x-axis data
    seriesData.push(dataPoint?.totalSales || 0); // Push total sales to series data
  });

  const options = {
    chart: {
      id: 'sales-progress-chart',
      toolbar: {
        show: false
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
      <Chart options={options} series={series} type="bar" height={350}  width={500} />
    </div>
  );
};

export default StartupProgessGraph;

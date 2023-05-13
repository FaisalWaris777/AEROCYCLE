import React,{useState,useEffect} from 'react';
import Chart from 'react-apexcharts'

export default function Model_Table(props) {

  const line_series_engine= [{
    data: props.engine
  }];

    const line_series= [{
        data: props.price
      }];
      const line_options= {
        chart: {
          type: 'line',
          width: 100,
          height: 35,
          sparkline: {
            enabled: true
          }
        },
        stroke: {
          width:3,
        curve: 'smooth'
      },
        tooltip: {
          fixed: {
            enabled: false
          },
          x: {
            show: false
          },
          y: {
            title: {
              formatter: function (seriesName) {
                return ''
              }
            }
          },
          marker: {
            show: false
          }
        }
      };
      
      const funct=()=>{
        console.log("hello")
      }

return(
  <div className='tr'>
         <div className='td'><b>{props.model_name}</b></div>
         <div className='td'>{props.model_count} %</div>
         <div className='td'>
            <div id="chart-1">
  <Chart options={line_options} series={line_series_engine} type="line" height={40} width={150} />
</div>
</div>
<div className='td'>
            <div id="chart-5">
  <Chart options={line_options} series={line_series} type="line" height={40} width={150} />
</div>
</div>
</div>
)}
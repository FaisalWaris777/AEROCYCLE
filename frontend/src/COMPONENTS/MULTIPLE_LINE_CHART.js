import React,{useState,useEffect} from 'react';
import Chart from 'react-apexcharts'

export default function COMPANY_COMPONENT_1(props) {

        const line_series= props.data;

          var line_options={
            chart: {
              height: 350,
              type: 'line',
              zoom: {
                enabled: false
              }
            },
            dataLabels: {
              enabled: false
            },
            stroke: {
                width:3,
              curve: 'smooth'
            },
            title: {
              text: 'Product Trends by Month',
              align: 'left'
            },
            grid: {
                row: {
                  colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                  opacity: 0.5
                },
              },
            xaxis: {
                // categories: ['07 fevr.', '08 fevr.', '09 fevr.', '10 fevr.', '11 fevr.', '12 fevr.', '13 fevr.', '14 fevr.', '15 fevr.', '16 fevr.', '17 fevr.', '18 fevr.'],
                // tickPlacement: 'on',
                labels: {
                    formatter: function (value) {
                        return ""
                    }
                },
                axisBorder: {
                    show: true,
                    color: '#78909C',
                    height: 1,
                    width: '100%',
                    offsetX: 0,
                    offsetY: 0
                },
                title: {
                    text: props.title_x,
                    offsetX: 0,
                    offsetY: 0,
                    style: {
                        color: undefined,
                        fontSize: '14px',
                        fontFamily: 'Helvetica, Arial, sans-serif',
                        fontWeight: 800,
                        cssClass: 'apexcharts-xaxis-title',
                    },
                },
            },
            yaxis:{
                axisBorder: {
                    show: true,
                    color: '#78909C',
                    height: '100%',
                    width: 2,
                    offsetX: 0,
                    offsetY: 0
                },
                title: {
                    text:props.title,
                  },
            }
          };

    return(
      <div className='multiple_line_chart'>
    <Chart options={line_options} series={line_series} type="line" height={350} width={600}/>
    </div>
    )
}
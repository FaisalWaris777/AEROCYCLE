import React,{useState,useEffect} from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts'

export default function COMPANY_COMPONENT_3(props) {

    const [fuel_data,setfuel_data]=useState([])
    const [fuel_label,setfuel_label]=useState([])
    const [body_data,setbody_data]=useState([])
    const [body_label,setbody_label]=useState([])

    useEffect(()=>{
        component_3();
        },[])

        const component_3=async()=>{
            try {
              let company_name=props.company;
              let send={company_name}
              const res=await axios.post('http://localhost:5000/company_component_3',send)
              let res_data=res.data
              setfuel_data(res_data[0])
              setfuel_label(res_data[1])
              setbody_data(res_data[2])
              setbody_label(res_data[3])
            } catch (err) {
                console.error(err);
            }
        }

        const fuel_series= fuel_data;
     const fuel_options= {
        chart: {
          width: 380,
          type: 'donut',
        },
        labels: fuel_label,
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }]
      };

      const body_series= [{
        data: body_data
      }];

      var options = {
        chart: {
        type: 'bar',
        height: 380,
        foreColor: 'black'
      },
      plotOptions: {
        bar: {
          barHeight: '100%',
          distributed: true,
          horizontal: true,
          dataLabels: {
            position: 'bottom'
          },
        }
      },
      colors: ['#33b2df', '#546E7A', '#d4526e', '#13d8aa', '#A5978B', '#2b908f', '#f9a3a4', '#90ee7e',
        '#f48024', '#69d2e7'
      ],
      dataLabels: {
        enabled: true,
        textAnchor: 'start',
          style: {
            forecolor:'#546E7A',
            fontSize: '14px',
            fontFamily: 'Trebuchet MS',
            fontWeight: 900,
            
        },
        formatter: function (val, opt) {
          return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val
        },
        offsetX: 0,
        forecolor:'#546E7A',
        dropShadow: {
          enabled: true
        }
      },
      stroke: {
        width: 1,
        colors: ['#fff']
      },
      xaxis: {
        axisBorder: {
          show: true,
          color: 'black',
          height: 2,
          width:'100%',
          offsetX: 0,
          offsetY: 0
      },
        title: {
          text:"Count",
        },
        categories: body_label,
      },
      yaxis: {
        title: {
          text:"Body Type",
        },
        labels: {
          show: false
        }
      },
      title: {
        text: 'Body Type',
        align: 'center',
        floating: true
    },
      tooltip: {
        theme: 'dark',
        x: {
          show: false
        },
        y: {
          title: {
            formatter: function () {
              return ''
            }
          }
        }
      }}

        return(<div className='company_component_3'>
        <div className='bodytype'>
        <div className='body_type_head'><h2>BODY TYPE ANALYSIS</h2></div> 
      <Chart options={options} series={body_series} type="bar" height={320} width={600}/>
      <div className='finding'>
      <h3>Inference</h3>
        ➼ It shows most of the cars {props.company} makes are of {body_label[0]} Body Type.</div>
      </div>
      <div className='fueltype'>
      <div className='fuel_type_head'><h2>FUEL TYPE ANALYSIS</h2></div> 
      <Chart options={fuel_options} series={fuel_series} type="donut" height={320} width={600}/>
      <div className='finding'>
      <h3>Inference</h3>
        ➼ It shows most of the cars of {props.company} are of the {fuel_label[0]} Fuel Type.</div>
      </div>
      </div>
        )}
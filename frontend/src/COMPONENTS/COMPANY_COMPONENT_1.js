import React,{useState,useEffect} from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts'
import MULTIPLE_LINE_CHART from './MULTIPLE_LINE_CHART'

export default function COMPANY_COMPONENT_1(props) {

    const [boxplot_data,setboxplot_data]=useState([])
    const [power_data,setpower_data]=useState([])
    const [line_data,setline_data]=useState([])
    const [flag,setflag]=useState(['power'])
    const[bp_xaxis,setbpxaxis]=useState()
    const[p_xaxis,setpxaxis]=useState()

    useEffect(()=>{
        boxplot('Drivetrain')
        power('Cylinders')
        },[])
        
        const boxplot=async(column)=>{
            try {
                setbpxaxis(column)
              let company=props.company;
              let column_name=column;
              let send={company,column_name}
              const res=await axios.post('http://localhost:5000/boxplot',send)
              setboxplot_data(res.data)
            } catch (err) {
                console.error(err);
            }
        }

        const line_chart=async()=>{
            try {
              setpxaxis('Fuel Type')
              let company_name=props.company;
              let col_1_name='Power(in PS)';
              let send={company_name,col_1_name}
              const res=await axios.post('http://localhost:5000/multiple_line_chart',send)
              setline_data(res.data)
            } catch (err) {
                console.error(err);
            }
        setflag('line')}

        const power=async(column)=>{
            try {
                setpxaxis(column)
              let company=props.company;
              let column_name=column;
              let send={company,column_name}
              const res=await axios.post('http://localhost:5000/power',send)
              setpower_data(res.data)
            } catch (err) {
                console.error(err);
            }
            setflag('power')}

        const boxplot_series= [
            {
              type: 'boxPlot',
              data: boxplot_data
            }
          ]
          const boxplot_options= {
            chart: {
              type: 'boxPlot',
            //   height: 350
            },
            title: {
              text: 'Price Boxplot',
              align: 'center'
            },
            colors: ['#fff'],
            plotOptions: {
              boxPlot: {
                colors: {
                  upper: '#5C4742',
                  lower: '#A5978B'
                }
              }
            },
            grid: {
                row: {
                  colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                  opacity: 0.2
                },},
            xaxis:{
                axisBorder: {
                    show: true,
                    color: '#78909C',
                    height: 2,
                    width:'100%',
                    offsetX: 0,
                    offsetY: 0
                },
                title: {
                    text:bp_xaxis,
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
                text:"Ex-Showroom Price(in Rs)",
              },
           }
          };
    
         const scatter_series= [{
            name: "Power",
            data: power_data
          }];
          const scatter_options= {
            chart: {
              height: 350,
              type: 'scatter',
              zoom: {
                enabled: true,
                type: 'xy'
              }
            },
            title: {
                text: 'Power Plot',
                align: 'center'
              },
              grid: {
                row: {
                  colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                  opacity: 0.2
                },},
            markers: {
                size: 5,
                // colors:'red',
              },
            xaxis: {
                tickAmount: 7,
                title: {
                    text:p_xaxis,
                  },
                axisBorder: {
                    show: true,
                    color: '#78909C',
                    height: 2,
                    width:'100%',
                    offsetX: 0,
                    offsetY: 2
                },
              labels: {
                formatter: function(val) {
                  return parseFloat(val).toFixed(1)
                }
              }
            },
            yaxis: {
                title: {
                    text:"Power(in PS)",
                  },
                axisBorder: {
                    show: true,
                    color: '#78909C',
                    height: '100%',
                    width: 2,
                    offsetX: -5,
                    offsetY: 0
                },
              tickAmount: 10
            }
          };

    return(
        <div className='company_component_1'>
        <div className='price'>
        <div className='price_head'><h2>PRICE ANALYSIS WITH</h2></div> 
        <div className='price-body'>
          <div className='price-button'>
        <button onClick={()=>boxplot('Drivetrain')}>DriveTrain</button>
        <button onClick={()=>boxplot('Fuel_Type')}>Fuel Type</button> 
         <button onClick={()=>boxplot('Body_Type')}>Body</button></div>
    <Chart options={boxplot_options} series={boxplot_series} type="boxPlot" height={350} width={600}/>
    </div>
    <div className='finding'>
    <h3>Inference</h3>
        ➼ It shows range of Ex-Showroom Price according to {bp_xaxis}.</div>
    </div>
    <div className='power'>
    <div className='power_head'><h2>POWER ANALYSIS WITH</h2></div> 
    <div className='power-body'>
    <div className='power-button'>
    <button onClick={()=>power('Cylinders')}>Cylinders</button>
        <button onClick={()=>power('Displacement(in cc)')}>Displacement (cc)</button> 
         <button onClick={()=>line_chart('Fuel_Type')}>Fuel Type</button>
         </div>
         {flag==='power' ? (
    <Chart options={scatter_options} series={scatter_series} type="scatter" height={350} width={600}/>
              ) : (  <MULTIPLE_LINE_CHART data={line_data} title={"Power(in PS)"} title_x={'Fuel Type'}/> )}
    </div>
    <div className='finding'>
    <h3>Inference</h3>
        ➼ It shows how Power varies with {p_xaxis}.</div>
    </div>
    </div>
    )
}
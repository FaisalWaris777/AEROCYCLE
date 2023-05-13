import React,{useState,useEffect} from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts'
import Select, { components } from 'react-select';
import MULTIPLE_LINE_CHART from './MULTIPLE_LINE_CHART'

export default function COMPANY_COMPONENT_2(props) {

    const [mileage_data,setmileage_data]=useState([])
    const [column,setcolumn]=useState('Ex-Showroom_Price(in Rs)')
    const [col_data,setcol_data]=useState([])
    const [flag,setflag]=useState(['mileage'])
    const [line_data,setline_data]=useState([])
    const [axis,setaxis]=useState()

    useEffect(()=>{
        mileage('Displacement(in cc)')
        company_numeric_col('Ex-Showroom_Price(in Rs)')
        },[])

        const col=[
          {value:'Displacement(in cc)',label:'Displacement(in cc)'},
          {value:'Ex-Showroom_Price(in Rs)',label:'Ex-Showroom_Price(in Rs)'},
          {value:'City_Mileage(in km/litre)',label:'City_Mileage(in km/litre)'},
          {value:'Kerb_Weight(in kg)',label:'Kerb_Weight(in kg)'},
          {value:'Fuel_Tank_Capacity(in litres)',label:'Fuel_Tank_Capacity(in litres)'},
          {value:'Height(in mm)',label:'Height(in mm)'},
          {value:'Length(in mm)',label:'Length(in mm)'},
          {value:'Width(in mm)',label:'Width(in mm)'},
          {value:'Power(in PS)',label:'Power(in PS)'},
          {value:'Torque(in Nm)',label:'Torque(in Nm)'},
          {value:'Wheelbase(in mm)',label:'Wheelbase(in mm)'},
          ]
        
          const mileage=async(column)=>{
            try {
              setaxis(column)
              let company=props.company;
              let column_name=column;
              let send={company,column_name}
              const res=await axios.post('http://localhost:5000/mileage',send)
              setmileage_data(res.data)
            } catch (err) {
                console.error(err);
            }
        setflag('mileage')}

        const line_chart=async()=>{
          try {
            setaxis('Fuel Type')
            let company_name=props.company;
            let col_1_name='City_Mileage(in km/litre)';
            let send={company_name,col_1_name}
            const res=await axios.post('http://localhost:5000/multiple_line_chart',send)
            setline_data(res.data)
          } catch (err) {
              console.error(err);
          }
      setflag('line')}

        const company_numeric_col=async(column)=>{
            try {
              let company=props.company;
              let column_name=column;
              let send={company,column_name}
              const res=await axios.post('http://localhost:5000/company_numeric_col',send)
              setcol_data(res.data)
            } catch (err) {
                console.error(err);
            }
        }

        const handleChange=(e)=>{
            setcolumn(e.value);
            company_numeric_col(e.value)
            }

            const line_series= [{
              name: column,
              data: col_data
          }]
              
              const scatter_series= [{
                name: "Mileage",
                data: mileage_data
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
                  text: 'Mileage Plot',
                  align: 'center'
                },
                grid: {
                  row: {
                    colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                    opacity: 0.2
                  },
                },
                xaxis: {
                  axisBorder: {
                    show: true,
                    color: '#78909C',
                    height: 2,
                    width:'100%',
                    offsetX: 0,
                    offsetY: 0
                },
                title: {
                    text:axis,
                  },
                  tickAmount: 10,
                  labels: {
                    formatter: function(val) {
                      return parseFloat(val).toFixed(1)
                    }
                  }
                },
                markers: {
                  size: 5,
                  // colors:'red',
                },
                yaxis:{
                  axisBorder: {
                      show: true,
                      color: '#78909C',
                      height: '100%',
                      width: 2,
                      offsetX: -2,
                      offsetY: 0
                  },
                  title: {
                      text:"Mileage(in km/l)",
                    },
                    tickAmount: 10,}
              };
    

    return(
        <div className='company_component_2'>
        <div className='mileage'>
        <div className='mileage_head'><h2>MILEAGE ANALYSIS WITH</h2></div> 
        <div className='mileage-body'>
          <div className='mileage-button'>
       <button onClick={()=>line_chart('Fuel_Type')}>Fuel Type</button>
        <button onClick={()=>mileage('Displacement(in cc)')}>Displacement(cc)</button> 
         <button onClick={()=>mileage('Kerb_Weight(in kg)')}>Kerb Weight</button></div>
         {flag==='mileage' ? (
    <Chart options={scatter_options} series={scatter_series} type="scatter" height={350} width={600}/>
              ) : (  <MULTIPLE_LINE_CHART data={line_data} title={"Mileage(in km/l"} title_x={'Fuel Type'}/> )}
    </div>
    <div className='finding'>
    <h3>Inference</h3>
        ➼ It shows how mileage of the cars of company {props.company} varies with {axis}.</div>
    </div>
        <div className='columnwise_analysis'>
        <div className='columnwise_analysis__head'><h2>FEATURE ANALYSIS </h2></div> 
        <div className='col-select'>
        <Select defaultValue={{ label: "Ex-Showroom_Price(in Rs)", value:'Ex-Showroom_Price(in Rs)' }} options={col} onChange={handleChange} />

        </div><br/>
        <div className='col-body'>
        <MULTIPLE_LINE_CHART data={line_series} title={column} title_x={''}/>
        </div>
        <div className='finding'>
        <h3>Inference</h3>
        ➼ It is the distribution of {props.company} car's {column}.</div>
        </div>
        </div>

    )
}
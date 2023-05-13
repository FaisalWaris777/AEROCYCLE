import React,{useState,useEffect} from 'react';
import Select, { components } from 'react-select';
import Chart from 'react-apexcharts'
import axios from 'axios';
import './CORRELATION.css'

export default function CORRELATION(props) {

    const [column_1,setcolumn_1]=useState('Displacement(in cc)');
    const [column_2,setcolumn_2]=useState('Ex-Showroom_Price(in Rs)');
    const [data_1,setdata_1]=useState();
    const [data_2,setdata_2]=useState();
    const [correlation_value,setcorrelation_value]=useState();
    const [ans,setans]=useState()

    let res_data;

    useEffect(()=>{
      fetch_correlation_data('Displacement(in cc)','Ex-Showroom_Price(in Rs)')
    },[])

    const handleChange_column_1=(e)=>{
        setcolumn_1(e.value);
        fetch_correlation_data(e.value,column_2)
        }
        const handleChange_column_2=(e)=>{
           setcolumn_2(e.value);
           fetch_correlation_data(column_1,e.value)
          }

    const fetch_correlation_data=async(column_1,column_2)=>{
           const send={column_1,column_2}
           try {
           const res=await axios.post('http://localhost:5000/fetch_correlation_data',send)
            res_data=res.data
            setdata_1(JSON.parse(res_data[0]))
            setdata_2(JSON.parse(res_data[1]))
            let temp=JSON.parse(res_data[2])
            setcorrelation_value(JSON.parse(res_data[2]))
            if(temp=>0.8)
            {setans("Very Strong Positive Correlation");}
            if((temp<=0.79) && (temp=>0.6))
            {setans("Strong Positive Correlation");}
            if((temp<=0.59) && (temp=>0.4))
            {setans("Moderate Positive Correlation");}
            if((temp<=0.39) && (temp=>0.0))
            {setans("Weak Positive Correlation");}
            if(temp<0)
            {setans("Negative Correlation");}
           } catch (err) {
               console.error(err);
           }
    }

   const series= [{
    name: column_1,
    data: data_1  },
    
    {name: column_2,
     data: data_2 }];

    const options= {
        chart: {
          height: 350,
          type: 'scatter',
          zoom: {
            enabled: true,
            type: 'xy'
          }
        },
        xaxis: {
          axisBorder: {
            show: true,
            color: '#78909C',
            height: 2,
            width: '100%',
            offsetX: 2,
            offsetY: 6
        },
          title: {
            text:"cat codes for "+column_1,
          },
          tickAmount: 10,
          labels: {
            formatter: function(val) {
              return parseFloat(val).toFixed(1)
            }
          }
        },
        yaxis: {
          axisBorder: {
            show: true,
            color: '#78909C',
            height: '100%',
            width: 2,
            offsetX: -7,
            offsetY: 0
        },
          title: {
            text:"cat codes for "+column_2,
          },
          tickAmount: 7
        }
      };

    return(
      <div>
      <div className='correlation_head'><h2>CORRELATION</h2></div>
        <div className='select_component'>
       <div className='select_1'> <Select defaultValue={{ label: "Displacement(in cc)", value:'Displacement(in cc)' }} options={props.columns} onChange={handleChange_column_1} /></div>
        <div className='select_2'><Select defaultValue={{ label: "Ex-Showroom_Price(in Rs)", value:'Ex-Showroom_Price(in Rs)' }} options={props.columns} onChange={handleChange_column_2} /></div>
            <br/>
                </div>
                <div className='correlation-value'><h3>Correlation Value : {correlation_value}</h3></div>
                <br/>
                <div style={{ maxWidth: "700px" ,height: "350px",padding:"10px"} }>
                <Chart options={options} series={series} type="scatter" height={320} />
                </div>
                <div className='finding'>
                <h3>Inference</h3>
                ➼ It demonstrates a {ans} between {column_1} and {column_2}</div>
                 </div>)
}
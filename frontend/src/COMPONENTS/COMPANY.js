import React,{useState,useEffect} from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts'
import Select, { components } from 'react-select';
import MODEL_ITERATE from './MODEL_ITERATE'
import COMPANY_COMPONENT_1 from './COMPANY_COMPONENT_1';
import COMPANY_COMPONENT_3 from './COMPANY_COMPONENT_3';
import COMPANY_COMPONENT_2 from './COMPANY_COMPONENT_2';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import './COMPANY.css'

export default function COMPANY(props) {

    const [radial_data,setradial_data]=useState('empty')
    const [company_name,setcompany_name]=useState()
    const [model_data,setmodel_data]=useState([])
    const [model_label,setmodel_label]=useState([])
    const [model_col,setmodel_col]=useState()
    const [list3,setlist3]=useState([])
    const [comp,setcomp]=useState([])

    let title="Market Captured By "+company_name;
    
const col_model=[
  {value:'Tata',label:'Tata'},
  {value:"Volvo",label:"Volvo"},
]

const fetch_companies=async()=>{
  try {
    const res=await axios.post('http://localhost:5000/fetch_comp_names')
    let res_data=res.data;
    setcomp(res_data)
    } catch (err) {
        console.error(err);
    }
}

useEffect(()=>{
  fetch_companies()
company_data('Tata')
window.scrollTo(0, 0)
},[])


const company_data=async(column)=>{
    try {
      let company_name=column;
      setcompany_name(column)
      let send={company_name}
      const res=await axios.post('http://localhost:5000/company_data',send)
      let res_data=res.data;
      setmodel_data(res_data[0])
      setmodel_label(res_data[1])
      setmodel_col(res_data[2])
      setlist3(res_data[3])
      setradial_data(res_data[4])
      } catch (err) {
          console.error(err);
      }
  }

 const radial_series=[radial_data];
 const radial_options= {
    chart: {
      height: 350,
      forecolor:'#546E7A',
      fontFamily: 'sans-serif',
      type: 'radialBar',
      toolbar: {
        show: true
      }
    },
    title: {
        text: title,
        align: 'center'
      },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 225,
         hollow: {
          margin: 0,
          size: '70%',
          background: '#fff',
          image: undefined,
          imageOffsetX: 0,
          imageOffsetY: 0,
          position: 'front',
          dropShadow: {
            enabled: true,
            top: 3,
            left: 0,
            blur: 4,
            opacity: 0.24
          }
        },
        track: {
          background: '#fff',
          strokeWidth: '67%',
          margin: 0, // margin is in pixels
          dropShadow: {
            enabled: true,
            top: -3,
            left: 0,
            blur: 4,
            opacity: 0.35
          }
        },
    
        dataLabels: {
          show: true,
          name: {
            offsetY: -10,
            show: true,
            color: '#888',
            fontSize: '17px'
          },
          value: {
            formatter: function(val) {
              return parseFloat(val);
            },
            color: '#111',
            fontSize: '36px',
            show: true,
          }
        }
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'horizontal',
        shadeIntensity: 0.5,
        gradientToColors: ['#ABE5A1'],
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100]
      }
    },
    stroke: {
      lineCap: 'round'
    },
    labels: ['Percent'],
  };

  const handleChange_model_name=(e)=>{
    setradial_data('empty')
    company_data(e.value)
    console.log(e.value)
 }     

  return (<div>

<div className='boxx'>
  <div className='field-set'>
        <div className='company-analysis'>
      <div className='company-analysis-div'>
      <label>Select the Company :</label></div>
      <div className='company-analysis-select'>
        <Select defaultValue={{ label: "Tata", value:'Tata' }} options={comp} onChange={handleChange_model_name} />
        </div></div></div></div>
         

    {radial_data==='empty' ? (
      <Box sx={{ width: '100%' }}>
      <LinearProgress />
    </Box> 
         ) : ( 
      <div className='Particular_company'>
        <div className='grp1'>
        <div className='percernt-model'>
            <div className='company-name'><h2>{company_name}</h2></div>
        <div className='radialBar-company'>
        <Chart options={radial_options} series={radial_series} type="radialBar" height={405} width={400}/>
        </div>  
        </div>
          <div className='table_model'>
          <div className='table_model_head'>
                <h2>MODEL WISE ANALYSIS</h2>
            </div>
            <div className='table-elements'>
    <table>
      <div className='table-head'>
        <div className='th'>MODEL</div>
        <div className='th'>PERCENT</div>
        <div className='th'>POWER </div>
        <div className='th'>PRICE</div>
        </div>
      <div className='tbody'>
        <MODEL_ITERATE list={list3} model_data={model_data} model_label={model_label} funct={props.funct}/>
        </div>
      </table></div>
          </div>
      </div>


     <COMPANY_COMPONENT_1 company={company_name}/>

     <COMPANY_COMPONENT_3 company={company_name}/>

    <COMPANY_COMPONENT_2 company={company_name}/>

      </div>)}
      </div> );
}


import React,{useState,useEffect} from 'react';
import axios from 'axios';
import { Bar } from "react-chartjs-2";
import {Chart,CategoryScale,registerables} from 'chart.js'; 
import { Pie,Line } from 'react-chartjs-2';
import Select, { components } from 'react-select';
import './UNIVARIATE.css'
Chart.register(CategoryScale);
Chart.register(...registerables);

let temp=[]
let tempp_var='bar';
let label;
export default function VISUALIZE_UNIVARITE(props) {
    const [file, setFile] = useState();
    const [make,setmake]=useState([]);
    const [count,setcount]=useState([]);
    const [graph,setgraph]=useState('bar');
    const [columns_input,setcolumns_input]=useState('Condition');
    

    const col=[
      {value:'bar',label:'Bar'},
      {value:'pie',label:'Pie'},
      {value:'line',label:'Line'},
    ]

    useEffect(()=>{
      visualize('Condition')
    },[])

 const visualize=async(columns_inputt)=>{
     let column_name=columns_inputt;
        const send={column_name}
        try {
        const res=await axios.post('http://localhost:5000/univariate',send)
         temp=res.data
        } catch (err) {
            // Handle Error Here
            console.error(err);
        } 
        setmake(temp[0])
         setcount(temp[1])
         await funct()
      }

    const funct=async()=>{        
         setgraph(tempp_var);

    }
    const handleChange=(e)=>{
      tempp_var=e.value;
      funct()
      }
      const handleChange_columns=(e)=>{
        setcolumns_input(e.value)
        visualize(e.value); 
      }

const data={
  labels: make,
  datasets: [
    {
      // Label for bars
      label: columns_input,
      // Data or value of your each variable
      data: count,
      backgroundColor: ['#d72631','#322e2f','#b20238','#077b8a','#5c3c92','#e2d810','#d9138a','#12a4d9'],
      // Border color of each bar
      borderColor: ["aqua", "green", "red", "yellow"],
      // Color of each bar
      borderWidth: 0.5,
    },
  ],
}

const options={
  maintainAspectRatio: false,
  scales: {
    yAxes: [
      { display: true,
        title: {
          display: true,
          text: "yAxisTitle",
          font: {
              size: 25
          }},
        // ticks: {
        //   // The y-axis value will start from zero
        //   beginAtZero: true,
        // },
      },
    ],
      xAxes: [{
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Value'
        }
      }]
  },
  legend: {
    labels: {
      fontSize: 15,
    },
  },
}


    return(
        <div>
          <div className='univariate_head'><h2>UNIVARIATE ANALYSIS</h2></div>
          <div className='select_component'>
      <div className='select_1'><Select defaultValue={{ label: "Condition", value:'Condition' }} options={props.columns} onChange={handleChange_columns} /></div>
      <div className='select_2'><Select defaultValue={{ label: "Bar", value:'bar' }} options={col} label="Native" onChange={handleChange} /></div>
                </div>
  
            <div style={{ maxWidth: "750px" ,height: "350px",padding:"10px" } }>
            {graph==='bar' ? (
            <Bar data={data} height={400} options={options}/>
              ) : ( <p></p> )}
           {graph==='pie' ? (
            <Pie data={data} height={400} options={options}/>
               ) : ( <p></p> )}
               {graph==='line' ? (
            <Line data={data} height={400} options={options}/>
               ) : ( <p></p> )}
      </div>
      <div className='finding'>
        <h3>Inference</h3>
        ➼ It shows most of the cars have {make[0]} as their {columns_input} value.
       </div>
       </div>
        
    )
}
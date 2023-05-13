import React,{useState,useEffect} from 'react';
import { Bar } from "react-chartjs-2";

export default function STACKED_DATA(props) {

      const daataa={
        // Name of the variables on x-axies for each bar
        labels: ['2019', '2020', '2021', '2022'],
        datasets:props.data
      }

  
      const  optionss= {
          plugins: {
            title: {
              display: true,
              text: ''
            },
          },
          responsive: true,
          scales: {
            x: {
              stacked: true,
            },
            y: {
              stacked: true
            }
          }
        };


  return(<div>
       <div className='yealy_bar_plot_head'><h2>ANNUAL AUTOMOBILE PRODUCTION</h2></div>
       <div className='stacked-bar-plot'>
       <div className='stacked-bar-plot-height' style={{ maxWidth: "700px" ,height: "400px",padding:"10px"}}>
       <Bar data={daataa} height={400} options={optionss}/>
       </div>
       </div>
       <div className='finding'>
       <h3>Inference</h3>
       ➼ It shows Maruti Suzuki is the leading manufacturer.</div>
    </div>
   )};
import React,{useState,useEffect} from 'react';
import axios from 'axios';
import { Bar } from "react-chartjs-2";
import Select, { components } from 'react-select';
import './FEATURES.css'

export default function FEATURE(props) {

    const [label,setlabel]=useState([])
    let [common_spec,setcommon_spec]=useState([])
    const [data,setdata]=useState()
    const [column,setcolumn]=useState([])

    useEffect(()=>{
       fetch_top_5_cars('City_Mileage(in km/litre)')
       setcolumn('Most Economical Car');
        },[])

        const col=[
            {value:'City_Mileage(in km/litre)',label:'Most Economical Car'},
            {value:'Power(in PS)',label:'Car with the highest Horse Power'},
            {value:'Ex-Showroom_Price(in Rs)',label:'Most Expensive Car'},
            {value:'Fuel_Tank_Capacity(in litres)',label:'Car with highest Fuel Tank Capacity'},
            {value:'Gears',label:'Car with maximum numbers of Gears'},
            ]

        const fetch_top_5_cars=async(column)=>{
            try {
              let column_name=column
              let send={column_name}
              const res=await axios.post('http://localhost:5000/top_5_cars',send)
              let res_data=res.data
              setlabel(res_data[0])
              setdata(JSON.parse(res_data[1]))
              setcommon_spec(res_data[2])
              } catch (err) {
                  console.error(err);
              } }
    

        const handleChange=(e)=>{
            setcolumn(e.label);
            fetch_top_5_cars(e.value)
            }

            const bar_data={
                // Name of the variables on x-axies for each bar
                labels: label,
                datasets: [
                  {
                    // Label for bars
                    label: column,
                    // Data or value of your each variable
                    data: data,
                    backgroundColor: ['#d72631','#322e2f','#b20238','#077b8a','#5c3c92'],
                    // Border color of each bar
                    borderColor: ["aqua", "green", "red", "yellow"],
                    // Color of each bar
                    borderWidth: 0.5,
                  },
                ],
              }
              // Height of graph
              
              const bar_options={
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
        <div className='app_component_4'>
        <div className='common-specs'>
        <div className='common-specs_head'><h2>MOST COMMON SPECIFICATION</h2></div> 
        <div className='specs'>
          {/* <div className='specs-head'>Most Common Specification</div> */}
          <div className='specs-body'>
        <div className='specs-rows'><div>➼ Displacement</div><div>{common_spec[0]} cc</div></div>
        <div className='specs-rows'><div>➼ Mileage</div><div> {common_spec[1]} km/litre</div></div>
        <div className='specs-rows'> <div>➼ Kerb_Weight</div><div>{common_spec[2]} kg</div></div>
        <div className='specs-rows'><div>➼ Fuel_Tank_Capacity</div><div>{common_spec[3]}  litres</div></div>
        <div className='specs-rows'><div>➼ Power</div><div>{common_spec[4]} PS</div></div>
        <div className='specs-rows'><div>➼ Torque</div><div>{common_spec[5]} Nm</div></div>
        <div className='specs-rows'><div>➼ Body_Type</div><div> {common_spec[6]}</div></div>
        <div className='specs-rows'><div>➼ Type</div><div>{common_spec[7]}</div></div>
        <div className='specs-rows'><div>➼ Fuel_Type</div><div>{common_spec[8]}</div></div>
        <div className='specs-rows'><div>➼ Drivetrain</div><div>{common_spec[9]}</div></div>
        </div>
        </div>
        <div className='finding'>
        <h3>Inference</h3>
        ➼ These are the most common specifications that cars have.</div>
    </div>
        <div className='top-car'>
        <div className='top-car-head'><h2>FIND</h2></div> 
        <div className='top-car-select'><Select defaultValue={{ label: "Most Economical Car", value:'City_Mileage(in km/litre)' }} options={col} onChange={handleChange} /></div>
        <div style={{ maxWidth: "650px" ,height: "350px",padding:"20px"} }>
        <Bar data={bar_data} height={400} options={bar_options}/>
        </div>
        <br/>
        <div className='finding'>
        <h3>Inference</h3>
        ➼ It shows {label[0]} is the {column}.</div>
        </div>
        </div>

    )
}
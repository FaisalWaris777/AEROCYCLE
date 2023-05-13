import React,{useState,useEffect,useLayoutEffect} from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts'
import UNIVARIATE_ANALYSIS from './COMPONENTS/UNIVARIATE_ANALYSIS';
import BIVARIATE_ANALYSIS from './COMPONENTS/BIVARIATE_ANALYSIS';
import CORRELATION from './COMPONENTS/CORRELATION';
import COMPANY from './COMPONENTS/COMPANY';
import { BrowserRouter,Routes, Route,useHistory,Link} from 'react-router-dom';
import NAVBAR from './COMPONENTS/NAVBAR';
import FEATURE from './COMPONENTS/FEATURES';
import STACKED_DATA from './COMPONENTS/STACKED_COLUMN';
import './App.css';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import PRICE_PREDICTION from './COMPONENTS/PRICE_PREDICTION';
import Search from './COMPONENTS/Search';
import SignIn from "./COMPONENTS/Login"
import SignUp from './COMPONENTS/Signup';
import Upload from './COMPONENTS/Upload';
import ADD_DATA from'./COMPONENTS/ADD_DATA';
function App() {

 let [data,setdata]=useState(['empty'])
 let [company_name,setcompany_name]=useState()
 const [yearly_data,setyearly_data]=useState([]);
 const [columns_list,setcolumns_list]=useState([]);
 const [columns_display,setcolumns_display]=useState([]);
 let [label,setlabel]=useState([])
 const [open, setOpen] = useState(true);
  
 const handleClose = () => {
   setOpen(false);
 };

// let model_name;
 let temp=[]

 let backgroundColor=['#df1317','#e4934b','#e2bb8b','#e1e7e7','#91bcc6']

 useEffect(()=>{  
  async function fetchMyAPI() {
  await fetch_make()
  await fetch_columns()}
  fetchMyAPI()
},[])

// const fetch_yearly_data=async()=>{
//   let res_data;
//   try {
//     const res=await axios.post('http://localhost:5000/fetch_yearly_data')
//     res_data=res.data
//     } catch (err) {
//         console.error(err);
//     } 
//     let l1=JSON.parse(res_data[0])
//    let l2=res_data[1]
//    let list=[];
//    for(let i=0;i<l1.length;i++)
// {
//     list.push({'label':l2[i],'data':l1[i],'backgroundColor':backgroundColor[i]})
// }
//   setyearly_data(list)}

  const fetch_columns=async()=>{
    try {
      const res=await axios.post('http://localhost:5000/fetch_columns')
      let res_data=res.data
      setcolumns_list(res_data[0])
      setcolumns_display(res_data[1])
      } catch (err) {
          console.error(err);
      } }

 const fetch_make=async()=>{
  try {
    let column_name='Part Name'
    let send={column_name}
    const res=await axios.post('http://localhost:5000/material_comp',send)
    temp=res.data
    } catch (err) {
        console.error(err);
    }
    setdata(temp[1])
    setlabel(temp[0])
}

const onclick=(index)=>{
  setcompany_name(label[index])
}

const donut_series= data;
  
const donut_options= {
              chart: {
                type: 'donut',
                dropShadow: {
                  enabled: true,
                  color: '#111',
                  top: -1,
                  left: 3,
                  blur: 3,
                  opacity: 0.2
                },
                events: {
                  dataPointSelection: function(event, chartContext, config) {
                      let index=config.dataPointIndex
                      onclick(index)
                  }
              }},
              stroke: {
                width: 0,
              },
              plotOptions: {
                pie: {
                  donut: {
                    labels: {
                      show: true,
                      total: {
                        showAlways: true,
                        show: true
                      }
                    }
                  }
                }
              },
              dataLabels: {
                enabled: true,
              },
              labels: label,
              dataLabels: {
                dropShadow: {
                  blur: 3,
                  opacity: 0.8
                }
              },// add colour using fill
              states: {
                hover: {
                  filter: 'none'
                }
              },
              theme: {
                palette: 'palette2'
              },
              title: {
                text: "CAR COMPANIES :",
                // align:"center",
              },
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

  return (
  < BrowserRouter>
  <Routes>
    <Route exact path="/" element={
      <div className='whole-body'>
      <NAVBAR/>
    {data[0]==='empty' ? (
          <Box sx={{ width: '100%' }}>
          <LinearProgress />
        </Box> 
             ) : ( 
   <div className='main_page'>
        <br/>
        {/* <a href="/compan">Click me</a> */}
      <div className='car_make_details'>
      <div className='make_name'>
      {<Chart options={donut_options} series={donut_series} type="donut" height={450} width={850}/>}
      </div>
      </div>

      <div className='graph_visualization'>
        <div className='part_1'>
       <div className='univariate_analysis'>
       <UNIVARIATE_ANALYSIS columns={columns_list}/>
       </div>

       <div className='bivariate_analysis'>
       <BIVARIATE_ANALYSIS columns={columns_list}/>
       </div> 
       </div>

       <br/>
       {/* <div className='part_2'>
       <div className='correlation'>
        <CORRELATION columns={columns_list}/>
       </div>

       <div className='yearly_bar_plot'>
       <STACKED_DATA data={yearly_data}/> 
         </div>
         </div>
         <div className='part_3'>
      <FEATURE/>
      </div> */}
      </div>
      <Search/>
  </div> )} </div>
    }/>
    <Route path="/login" element={<SignIn />} />

<Route path="/Signup" element={<SignUp />} />
<Route path="/Upload" element={
  <div className='whole-body'>
    <div className='main_page'>
      
      <NAVBAR/>
      <div className='car_make_details'>
      <div className='make_name'>
<ADD_DATA /></div></div></div>
</div>} />
</Routes>
    </BrowserRouter>
  );
}

export default App;
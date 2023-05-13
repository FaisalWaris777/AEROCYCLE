import React,{useState,useEffect} from 'react';
import axios from 'axios';
import Select, { components } from 'react-select';
import './PREDICTION.css'

export default function PRICE_PREDICTION(props) {

    const [col1,setcol1]=useState([])
    const [col2,setcol2]=useState([])
    const [input1,setinput1]=useState()
    const [input2,setinput2]=useState()
    const [input3,setinput3]=useState()
    const [input4,setinput4]=useState()
    const [value,setvalue]=useState()

    const fetch_prediction_col=async()=>{
        try {
            const res= await axios.post('http://localhost:5000/fetch_prediction_col')
            let res_data=res.data
            setcol1(res_data[0])
            setcol2(res_data[1])
            } catch (err) {
                console.error(err);
            }    
} 

    useState(()=>{
        fetch_prediction_col()
     setinput1(2)
     setinput2(624)
     setinput3('Injection')
     setinput4('In-line')
    })


   const col_3=[
    {value:'Injection',label:'Injection'},
    {value:'PGM - Fi',label:'PGM - Fi'},
]

   const col_4=[
    {value:'In-line',label:'In-line'},
    {value:'V',label:'V'},
    {value:'Flat',label:'Flat'},
    {value:'W',label:'W'},
]

const col_5=[
    {value:'0-100',label:'0-100'},
    {value:'100-300',label:'100-300'},
    {value:'300-500',label:'300-500'},
    {value:'Above 600',label:'Above 600'},
]


const prediction_value=async()=>{
    try {let send={input1,input2,input3,input4}
        const res=await axios.post('http://localhost:5000/prediction_value',send)
        let res_data=res.data
        setvalue(res_data)
        } catch (err) {
            console.error(err);
        }    
}
const handleChange_columns_1=(e)=>{
   setinput1(e.value)
    }
const handleChange_columns_2=(e)=>{
    setinput2(e.value)
         }   
const handleChange_columns_3=(e)=>{
    setinput3(e.value)
             }   
const handleChange_columns_4=(e)=>{
      setinput4(e.value)
                 }   

return(
<div className='prediction-body'>
    <div className='pred-head'><h2>EX-SHOWROOM PRICE PREDICTION</h2></div>
    <div className='select-buttons'>
        <label>Select Cylinder value :</label>
    <div className='pred-select'><Select defaultValue={{ label: 2, value:2 }} options={col1} onChange={handleChange_columns_1} /></div>
    <label>Select Engine Displacement(cc) :</label>
    <div className='pred-select'><Select defaultValue={{ label: 624, value:624 }} options={col2} onChange={handleChange_columns_2} /></div>
    <label>Select Fuel System :</label>
    <div className='pred-select'><Select defaultValue={{ label: "Injection", value:'Injection' }} options={col_3} onChange={handleChange_columns_3} /></div>
    <label>Select Cylinder Configuration :</label>
    <div className='pred-select'><Select defaultValue={{ label: "In-line", value:'In-line' }} options={col_4} onChange={handleChange_columns_4} /></div>
    </div>
    <div className='pred-footer'>
    <button className='prediction-button' onClick={()=>{prediction_value()}}>Predict Price</button>
    <div className='value'><h2>Predicted Price : Rs  {value}</h2></div>
    </div></div>
)
}


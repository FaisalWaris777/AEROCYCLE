import React,{useState,useEffect} from 'react';
import MODEL_TABLE from './MODELS_TABLE';
export default function MODEL_ITERATE(props) {

    let list=props.list;
    let model_data=props.model_data;
    let model_label=props.model_label;


          return list.length>0 ?(
            list.map((row,i)=>{
            return <MODEL_TABLE model_name={model_label[i]} 
            model_count={model_data[i]}
            engine={row[0]} 
            price={row[1]}
            funct={props.funct}
             />
          })):(<h2></h2>);

}
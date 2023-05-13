import React, { useEffect } from "react";
import "./NAVBAR.css";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
export default function NAVBAR(props) {
  let history = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      history("/login");
    }
  }, []);
  let instagram = "";
  let phone = "";
  let gm = "";
  const handleClick=()=>{
    localStorage.removeItem("token")
    history("/login")
  }
  return (
    <div id="topnav" style={{justifyContent:"space-between"}}>
      <div className="left" >
        <a href="/">
          <b>Airlinnes/Manufacturer</b>
        </a>
      </div>
      <div style={{display:"flex",marginRight:"20px",alignItems:"center",columnGap:"20px"}}>
      <Button variant="contained" style={{height:"40px"}} onClick={()=>{history("/Upload")}}>Upload</Button>
      <Button variant="contained" style={{height:"40px"}} onClick={handleClick}>Log Out</Button>
      </div>
    </div>
  );
}

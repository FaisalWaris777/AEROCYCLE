import * as React from "react";
import { useState ,useEffect} from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import { CircularProgress } from "@mui/material";


function Search() {
  const parts = ["Avionics", "Engine", "Fuselage", "Landing Gear", "Wing"];
  const materials = ["Aluminum", "Composite", "Steel", "Titanium"];
  const manufacturer = [
    "Airbus",
    "Boeing",
    "Bombardier",
    "Cessna",
    "Embraer",
    "Gulfstream",
  ];
  const [Data, setData] = React.useState({
    Part:"Avionics" ,
    Age:0,
    Condition: "New",
    Material: "Aluminum",
    Manufacturer: "Airbus",
  });
  const [Results,SetResults]=useState([])
  const handleChange = (e) => {
    setData({ ...Data, [e.target.name]: e.target.value });
  };
  console.log(Data)
  const [Loader,setLoader]=useState(false)
  /*const handleClick = async () => {
    const res = await fetch("http://localhost:5000/search", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(Data),
    });
    const data=await res.json()
    let x=JSON.parse(data.results)
    SetResults(x)
  };*/
  useEffect( ()=>{
    const controller= new AbortController()
    const signal=controller.signal
    setLoader(true)
    fetch("http://localhost:5000/search", {
      signal,
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(Data),
    }).then((res)=> res.json()).then((data)=>{
      console.log(data)
      setLoader(false)
      SetResults(JSON.parse(data.results))
    }).catch(err=>{
      if(err.name!=="AbortError")
      {
        console.error(err)
      }
    });
    return ()=>{
      controller.abort()
    }
  },[Data.Age,Data.Condition,Data.Manufacturer,Data.Material,Data.Part])
  return (
    <>
      <div className="car_make_details" style={{ Height: "200px" }}>
        <div className="make_name">
          <h1>Searching</h1>
          <div style={{ display: "Flex", columnGap: "50px" }}>
            <Box sx={{ minWidth: 135 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Part name</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={Data.Part}
                  label="Part name"
                  name="Part"
                  onChange={handleChange}
                >
                  {parts.map((p) => {
                    return (
                      <MenuItem key={p} value={p}>
                        {p}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ minWidth: 135 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Age</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={`${Data.Age}`}
                  label="Age"
                  onChange={handleChange}
                  name="Age"
                >
                  <MenuItem value={0}>0-10</MenuItem>
                  <MenuItem value={10}>10-20</MenuItem>
                  <MenuItem value={20}>20-30</MenuItem>
                  <MenuItem value={30}>30-40</MenuItem>
                  <MenuItem value={40}>40-50</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ minWidth: 135 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Condition</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={Data.Condition}
                  label="Condition"
                  onChange={handleChange}
                  name="Condition"
                >
                  <MenuItem value={"New"}>New</MenuItem>
                  <MenuItem value={"Used"}>Used</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ minWidth: 135 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Material</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={Data.Material}
                  label="Material"
                  onChange={handleChange}
                  name="Material"
                >
                  {materials.map((p) => {
                    return (
                      <MenuItem key={p} value={p}>
                        {p}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ minWidth: 135 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Manufacturer
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={Data.Manufacturer}
                  label="Manufacturer"
                  onChange={handleChange}
                  name="Manufacturer"
                >
                  {manufacturer.map((p) => {
                    return (
                      <MenuItem key={p} value={p}>
                        {p}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Box>
            {/* <Button variant="contained" onClick={handleClick}>
              Search
            </Button> */}
          </div>
          {Loader?(<CircularProgress/>):(Object.keys(Results).map((i)=>{
            return(
                <div style={{display:"flex",columnGap:"50px"}}>
                <div>{Results[i]["Part Name"]}</div>
                <div>{Results[i]["Age (years)"]}</div>
                <div>{Results[i]["Condition"]}</div>
                <div>{Results[i]["Material Composition"]}</div>
                <div>{Results[i]["Manufacturer"]}</div>
                </div>
            )
          }))}
        </div>
      </div>
    </>
  );
}

export default Search;

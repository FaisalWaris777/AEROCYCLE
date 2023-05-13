import React from "react";
import { Button } from "@mui/material";
function Upload() {
  const handleClick=()=>{
    
  }
  return (
    <div>
      <input type="file" />
      <div>
        <Button variant="contained" component="label" onClick={handleClick}>
          Upload File
        </Button>
      </div>
    </div>
  );
}

export default Upload;

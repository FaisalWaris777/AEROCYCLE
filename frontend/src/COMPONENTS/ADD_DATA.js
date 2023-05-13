import React, { useState } from "react";
import axios from 'axios';
import { Button } from "@mui/material";

// Allowed extensions for input file
const allowedExtensions = ["csv"];

const App = () => {
	
	// This state will store the parsed data
	const [data, setData] = useState([]);
	
	// It state will contain the error when
	// correct file extension is not used
	const [error, setError] = useState("");
	
	// It will store the file uploaded by the user
	const [file, setFile] = useState("");

	// This function will be called when
	// the file input changes
	const handleFileChange = (e) => {
		setError("");
		
		// Check if user has entered the file
		if (e.target.files.length) {
			const inputFile = e.target.files[0];
			
			// Check the file extensions, if it not
			// included in the allowed extensions
			// we show the error
			const fileExtension = inputFile?.type.split("/")[1];
			if (!allowedExtensions.includes(fileExtension)) {
				setError("Please input a csv file");
				return;
			}

			// If input type is correct set the state
			setFile(inputFile);
		}
	};
	const handleParse = () => {
              const res=axios.post('http://localhost:5000/add_data',file)
              let res_data=res.data
            alert("Data Uploaded Sucessfully");
            window.location.reload();
	};

	return (
		<div>
			<label htmlFor="csvInput" style={{ display: "block" }}>
				<h2>Enter Data to be inserted</h2>
			</label>
			<input
				onChange={handleFileChange}
				id="csvInput"
				name="file"
				type="File"
			/>
			<div>
				{/* <button onClick={handleParse}>Button</button> */}
                <div style={{display:"flex",marginTop:"20px",alignItems:"center"}}>
                <Button variant="contained" style={{height:"20px"}} onClick={handleParse}>INSERT DATA</Button>
			</div></div>
		</div>
	);
};

export default App;

import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { useNavigate } from "react-router-dom";

export default function  UploadFile(){
  const [file, setFile] = useState(null);
  const [results, setResults] = useState([]);
  const [filename,setFileName]= useState("uplaod File");
  const [summaryData, setSummaryData] = useState([]);
  const [loading,setLoading]= useState(false);
  const navigate = useNavigate();

  const handleFileUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:5000/predict/file", formData);
      setResults(response.data.results);

      // Calculate summary data for positive and negative ranges
      const positiveCount = response.data.results.filter((res) => res.sentiment === "Positive").length;
      const negativeCount = response.data.results.filter((res) => res.sentiment === "Negative").length;
      const neutralCount = response.data.results.filter((res) => res.sentiment === "Neutral").length;

      setSummaryData([
        { name: "Positive", count: positiveCount ,fill: "#06FC16"},
        { name: "Negative", count: negativeCount,fill: "#D80191" },
        { name: "Neutral", count: neutralCount,fill: "#D80191" },
      ]);
    } catch (error) {
      alert("Error uploading file.");
    }finally {
      setLoading(false);
    }
  };

  const handeFileName = (e) =>{
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFileName(selectedFile ? selectedFile.name : "Upload File")
  }
  return (
    <Container>
      <button className="Btn" onClick={() => navigate("/")} >
        Home
      </button>
      <button className="Btn" onClick={() => navigate("/text-input")} >
        Text Input
      </button>
            <h1>Upload CSV File</h1>
      <Content>
        <h2>Select your csv file to analysis the data </h2>
      <input id="file" type="file" onChange={handeFileName} />
      <label htmlFor="file" className="file-label">{filename}</label>
      <br/>
      <button onClick={handleFileUpload} className="file-btn">
        Submit
      </button>
      
     <p>The comment,reveiw,post and tweet of any Social Media platform or even ecommer product review <br/>
     will be analysis and as result a barchat will appear which how the many positive and negative 
     <br/>
     review are there and also there will list of the file with the positive or negative label</p>
     <img src="./document-upload.webp"/>
      </Content>
      
      {loading ? (
         <LoaderContainer>
         <Spinner />
       </LoaderContainer>
      ):(
        <Results>
      <div style={{ marginTop: "30px" }}>
        {/* Bar chart to show summary */}
        {summaryData.length > 0 && (
          <div>
            <h2>Sentiment Summary</h2>
            <BarChart width={600} height={300} data={summaryData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill={(entry) => entry.fill} />
            </BarChart>
          </div>
        )}
      </div>

      <div style={{ marginTop: "30px" }}>
        {/* Table to show individual results */}
        {results.length > 0 && (
          <div>
            <h2>Analysis Results</h2>
            <table style={{ margin: "auto", border: "1px solid black", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ border: "1px solid #F3C623", padding: "8px" }}>Original Text</th>
                  <th style={{ border: "1px solid #F3C623", padding: "8px" }}>Sentiment</th>
                </tr>
              </thead>
              <tbody>
                {results.map((res, index) => (
                  <tr key={index}>
                    <td style={{ border: "1px solid #bd2bd1", padding: "8px" }}>{res.original_text}</td>
                    <td style={{ border: "1px solid #bd2bd1", padding: "8px" }}>{res.sentiment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      </Results>
      )}

     
    </Container>
  );
};

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  border: 8px solid #f3f3f3; /* Light grey */
  border-top: 8px solid #3a0246; /* Purple */
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: ${spin} 1s linear infinite;
`;

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;


const Container = styled.div`
 margin:10px;

 img{
   position:relative;
   top:-23rem;
   left:40rem;
   height:40vh;
   width:40vh;
 }
 
 .Btn{
 position:relative;
   top:-62px;
  margin:10px;
  padding:10px 30px;
  font-size:1.2rem;
  border:none;
  border-radius:15px;
  background-color: #242424; /* Google Blue */
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 20px;
   box-shadow: inset -3px 3px 8px rgba(0, 0, 0, 0.6), 
                  inset 10px -10px 8px rgba(255, 255, 255, 0.3);
  transition: background-color 0.3s;

  &:hover {
    
    background-color:#bd2bd1; /* Darker blue */
  }

}



 #file{
   display:none;
 }
 .file-label {
        margin: 10px;
        padding: 10px 100px;
        background: #592176;
        color: white;
        border-radius: 20px;
        text-align: center;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    }
  .file-btn{
  margin:30px;
  padding:10px 30px;
  border:none;
  border-radius:20px;
  background-color: #242424; /* Google Blue */
  color: white
  cursor: pointer;
  font-size: 20px;
   box-shadow: inset -3px 3px 8px rgba(0, 0, 0, 0.6), 
                  inset 10px -10px 8px rgba(255, 255, 255, 0.3);
  transition: background-color 0.3s;

  &:hover {
    
    background-color:#bd2bd1; /* Darker blue */
  }

}

  }
`

const Content = styled.div`
margin-top:20px;
padding:2rem;
background:#3a0246b1;
width:100%;
height:30vh;
border:1px solid #F3C623;
box-shadow:5px 5px 30px #F3C623;
border-radius:15px;

`

const Results = styled.div`
  display:flex;
  justify-content:space-between;
`


import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
    <Container>
      <div  className="MainContent">
       <h3>Analysis Your text and file to predict the future</h3>
       <button className="Btn" onClick={() => navigate("/upload-file")} >
        Upload File
      </button>
      <button className="Btn" onClick={() => navigate("/text-input")} >
        Text Input
      </button>
      </div>
     
      <img className="container" src="girl.png"/>
    </Container>
    <Content>
      <div className="obj">
      <h3>Objective</h3>
      <p>The objective of this project is to design and implement a sentiment analysis system using textblob and Natural Language Processing (NLP) machine learning algorithms.<br/> The system aims to analyze and categorize emotions expressed in text to better understand the feelings behind opinions and use the sentiment data to inform strategic decisions, <br/>marketing campaigns, and product development based on collected data of reviews, comments and tweets. 
      </p>
      </div>
      <img src="./girlwithpc.png"/>
    </Content>
    </>
     
  );
};

export default Home;

const Container = styled.div`
display:flex;
text-align:center;
margin-top:70px;
padding:2rem;
background:#3a0246b1;
width:100%;
height:30vh;
border:1px solid #F3C623;
box-shadow:5px 5px 30px #F3C623;
border-radius:15px;

.MainContent{
  position:relative;
  left:20rem;

}

.Btn{
 
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

.container{
  position:relative;
  top:-8rem;
  left:40rem;
  width:70vh;
  height:70vh;
}

`
const Content = styled.div`
display:flex;
height:100vh;


.obj{

 margin-left:20rem;
 margin-top:70px;
height:50vh;
 width:30%;
}
 img{
 margin:20px;
  width:50vh;
  height:50vh;
 }
`

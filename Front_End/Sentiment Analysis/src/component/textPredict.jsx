import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FaShareAlt } from "react-icons/fa";

export default function TextInput() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/predict/text",
        new URLSearchParams({ text }).toString(),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );
      setResult(response.data);
      setText("");
    } catch (error) {
      console.error("Error processing text:", error);
    }
  };

  const handclear = async () =>{

    setResult(null);
  }

  const handleShare = (platform) => {
    const encodedText = encodeURIComponent(text);
    if (platform === "whatsapp") {
      window.open(`https://api.whatsapp.com/send?text=${encodedText}`, "_blank");
    } else if (platform === "twitter") {
      window.open(`https://twitter.com/intent/tweet?text=${encodedText}`, "_blank");
    } else if (platform === "youtube") {
      window.open(`https://www.youtube.com`, "_blank");
    }
  };

  return (
    <Container>
      <button className="Btn" onClick={() => navigate("/")}>
        Home
      </button>
      <button className="Btn" onClick={() => navigate("/upload-file")}>
        Upload File
      </button>
      <h1>Analyze Text</h1>
     
      <Content>
        <textarea
          className="text-box"
          rows="4"
          cols="50"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text here..."
        />
        <br />
        <button className="text-btn" onClick={handleSubmit}>
          Submit
        </button>
        <img src="./grilwithemoji.png"/>
      </Content>

      <div style={{ marginTop: "30px" }}>
        {result && (
          <div className="result">
            <button className="Closebtn" onClick={handclear}>X</button>
            <h3>Text: {result.original_text}</h3>
            <h3>Sentiment: {result.sentiment}</h3>
            
            <p>{result.sentiment === "Positive" ? "😊" :result.sentiment ==="Neutral" ? "😊":"😢"}</p>
            

            {/* Show share button only for positive results */}
            {(result.sentiment === "Positive" || result.sentiment === "Neutral") && (
              <ShareContainer>
                <button className="share-btn" onClick={() => handleShare("whatsapp")}>
                  <FaShareAlt /> Share on WhatsApp
                </button>
                <button className="share-btn" onClick={() => handleShare("twitter")}>
                  <FaShareAlt /> Share on Twitter
                </button>
                <button className="share-btn" onClick={() => handleShare("youtube")}>
                  <FaShareAlt /> Share on YouTube
                </button>
              </ShareContainer>
            )}
          </div>
        )}
      </div>
    </Container>
  );
}

const Container = styled.div`
  margin: 10px;
  height: 100vh;

  

  .Btn {
   position:relative;
   top:-62px;
    margin: 10px;
    padding: 10px 30px;
    font-size: 1.2rem;
    border: none;
    border-radius: 15px;
    background-color: #242424;
    color: white;
    cursor: pointer;
    font-size: 20px;
    box-shadow: inset -3px 3px 8px rgba(0, 0, 0, 0.6),
      inset 10px -10px 8px rgba(255, 255, 255, 0.3);
    transition: background-color 0.3s;

    &:hover {
      background-color: #bd2bd1;
    }
  }

  .result {
    margin-left: 20px;
    margin-buttom:50px;
    border: 1px solid #bd2bd1;
    border-radius: 15px;
    width: 100%;
    height: 35vh;
    padding: 10px;
  }

  p {
    font-size: 2.5rem;
  }

  .Closebtn{
    position: relative;
    top:0;
    left:-49%;
    background:none;
    border:none;
    font-size:1.5em;
  }
`;

const Content = styled.div`
  margin-top: 25px;
  padding: 2rem;
  background: #3a0246b1;
  width: 100%;
  height: 30vh;
  border:1px solid #F3C623;
box-shadow:5px 5px 30px #F3C623;
border-radius:15px;

  img{
   position:relative;
   top:-15rem;
   left:30rem;
    height:50vh;
    
  }

  .text-box {
    background: #17001bd1;
    border: none;
    resize: none;
    padding: 50px 50px;
    color: white;
    font-size: 1rem;
    border-radius: 15px;
  }

  .text-btn {
    position:relative;
    top:-25rem;
    left:15rem;
    margin: 30px;
    padding: 10px 30px;
    border: none;
    border-radius: 20px;
    background-color: #242424;
    color: white;
    cursor: pointer;
    font-size: 20px;
    box-shadow: inset -3px 3px 8px rgba(0, 0, 0, 0.6),
      inset 10px -10px 8px rgba(255, 255, 255, 0.3);
    transition: background-color 0.3s;

    &:hover {
      background-color: #bd2bd1;
    }
  }
`;

const ShareContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;

  .share-btn {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 10px 20px;
    border: none;
    border-radius: 10px;
    background-color: #242424;
    color: white;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
      background-color: #bd2bd1;
    }
  }
`;

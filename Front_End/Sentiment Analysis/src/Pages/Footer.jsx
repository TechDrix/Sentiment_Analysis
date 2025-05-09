import React from "react";
import styled from "styled-components";

export default function Footer(){
    return(
        <>
        <Container>
            <div className="about">
            <h2>About</h2>
            <p>A sentiment analysis interprets and categorizes thousands of tweets and comments on any social media platform and also includes reviews of new product launches by any company. It's more reliable than an actual human’s sixth sense and useful for businesses, politics, and social media analytics.

            </p>
            </div>
            <div className="Ceated">
            <h2>Created By</h2>
            <p>Salam Saimon Singh, MCA 3rd SEM</p>
            <p>2350111</p>
            <p>NIELIT,IMPHAL</p>
            </div>
            <div className="Ceated">
            <h2>Under the guidence of</h2>
            <p>Laisharam Simran Devi, Teaching Faculty</p>
            <p>NIELIT,IMPHAL</p>
            </div>
            
        </Container>
        </>
    )
}

const Container = styled.div`
   
   display:flex;
   flex-direction:row;
   justify-content: space-evenly;
   align-content:start;
   background:#3a0246b1;
   color:#BCBBBB;
   margin-left:25px;
   width:100%;
   border-radius:20px;

   .about{
     display:flex;
     flex-direction:column;
     justify-content:center;
     width:30%;
    
   }

   .created{
     display:flex;
     flex-direction:column;
     justify-content:center;
     width:50%;
   }
`;
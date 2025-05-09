import styled from "styled-components"

export default function Header(){
    return(
        <>
        <Container>
            <h2 className="Webname">Sentiment Analysis</h2>
        

        </Container>
        </>
    )
}

const Container = styled.div`
.Webname{
position:relative;
margin:20px;
top:10px;
left:-35rem;
}



`
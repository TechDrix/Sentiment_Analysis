
import { BrowserRouter } from 'react-router-dom'
import './App.css'
import Pages from './Pages/Routes'
import Header from './Pages/Header'
import Footer from './Pages/Footer'


function App() {
 

  return (
    <>
     <BrowserRouter>
       <Header/>
       <Pages/>
       <Footer/>
     </BrowserRouter>
    </>
  )
}

export default App

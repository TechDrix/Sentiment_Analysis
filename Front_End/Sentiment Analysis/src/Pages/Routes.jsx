import { Router, Route, Routes } from "react-router-dom";
import Home from "./Home";
import UploadFile from "../component/filePredic";
import TextInput from "../component/textPredict";

export default function Pages() {
    return (
        
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/upload-file" element={< UploadFile/>} />
                <Route path="/text-input" element={<TextInput />} />
            </Routes>
    
    )
}
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import { Login } from './Login.js';
import Home from './Home.js';
import { UploadPage } from './UploadPage.js';
import PatientDashboard from './PatientDash.js';
import MedicalFacilityDashboard from './MedicalFacilityDash.js';
import NewPatient from './NewPatient.js';
import NewMFL from './NewMFL.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/uploadpage" element={<UploadPage />}/>
        {/* <Route path="/how-to" element={<HowTo />}/> */}
        <Route path="/PDashboard" element={<PatientDashboard />}/>
        <Route path="/MFDashboard" element={<MedicalFacilityDashboard />}/>
        <Route path="/new-patient" element={<NewPatient />}/>
        <Route path="/new-mfl" element={<NewMFL />}/>
      </Routes>
    </Router>
  );
}

export default App;

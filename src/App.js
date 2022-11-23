import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import { Login } from './Login';
import Home from './Home';
import PatientDashboard from './PatientDash';
import MedicalFacilityDashboard from './MedicalFacilityDash';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />}/>
        <Route path="/login" element={<Login />}/>
        {/* <Route path="/how-to" element={<HowTo />}/> */}
        <Route path="/PDashboard" element={<PatientDashboard />}/>
        <Route path="/MFDashboard" element={<MedicalFacilityDashboard />}/>
      </Routes>
    </Router>
  );
}

export default App;

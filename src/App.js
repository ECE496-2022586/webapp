import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import { Login } from './Login';
import Home from './Home';
import UploadPage from './UploadPage';
import PatientDashboard from './PatientDash';
import MedicalFacilityDashboard from './MedicalFacilityDash';
import NewUser from './NewUser';

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
        <Route path="/new-user" element={<NewUser />}/>
      </Routes>
    </Router>
  );
}

export default App;

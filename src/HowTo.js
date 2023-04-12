import React from 'react';
import Box from './Box.js';
import Header from './Header.js';
  
function HowTo() {
    return(
        <div className='how-to-page'>
            <Header />
            <div style={{marginLeft: 80, fontFamily: 'Quicksand'}}>
                <h1>Patient Instructions</h1>
                <h2 style={{marginLeft: 250}}>Here's how you can accept or deny a request from a medical facility</h2>
                <video width="800" height="600" controls style={{marginLeft:240, marginTop:-70, marginBottom: 50}}>
                    <source src="/videos/PatientAcceptDeny.mp4" type="video/mp4"/>
                </video>
                <h2 style={{marginLeft: 330}}>Here's how you can revoke access from a medical facility</h2>
                <video width="800" height="600" controls style={{marginLeft:240, marginTop:-70, marginBottom: 50}}>
                    <source src="/videos/PatientRevoke.mp4" type="video/mp4"/>
                </video>
                <h1>Medical Facility Instructions</h1>
                <h2 style={{marginLeft: 330}}>Here's how you can request access to a patient's files</h2>
                <video width="800" height="600" controls style={{marginLeft:240, marginTop:-70, marginBottom: 50}}>
                    <source src="/videos/MFRequest.mp4" type="video/mp4"/>
                </video>
                <h2 style={{marginLeft: 380}}>Here's how you can view/upload patient files</h2>
                <video width="800" height="600" controls style={{marginLeft:240, marginTop:-70, marginBottom: 50}}>
                    <source src="/videos/MFUpload.mp4" type="video/mp4"/>
                </video>
            </div>
        </div>
    );
}

export default HowTo;

import React from "react";
import Header from "./Header";
import Box from "./Box";

function MedicalFacilityDashboard() {
    return (
        <div className="mfdashboard">
          <Header />
          <h2 style={{marginLeft: 550, marginTop: 70}}>Welcome to your dashboard!</h2>
          <Box style={{
            backgroundColor: '#ACC578',
            color: 'white',
            minHeight: 20,
            width: 150,
            fontSize: 20,
            fontFamily: 'Quicksand',
            textAlign: 'center',
            padding: 15,
            marginLeft: 250,
            marginTop: 70,
            }}>
                Find a patient
          </Box>
          <Box style={{
            backgroundColor: 'transparent',
            color: '#ACC578',
            border: 'solid #ACC578',
            minHeight: 50,
            width: 680,
            fontSize: 20,
            fontFamily: 'Quicksand',
            textAlign: 'center',
            padding: 15,
            marginLeft: 350,
            marginTop: -20,
            }}>
                <input style={{border: '2px solid grey', fontSize: 20, textAlign: 'left', width: 500, padding: 3}} placeholder='Patient Health Card Number' required />
                <button style={{width: 90, textAlign:'center', padding: 5, fontSize:20, marginLeft:10}} className="access-button" type="menu-button"> Search </button>
          </Box>
        </div>
    );
}

export default MedicalFacilityDashboard;
import React from 'react';
import Header from './Header.js';
import Box from './Box.js';
import { user } from './Login.js';

function PatientDashboard() {
    return (
        <div className="pdashboard">
          <Header />
          <h2 style={{textAlign: 'center', marginTop: 70}}>Welcome to your dashboard {user} !</h2>
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
                Access Records
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
                <input style={{border: '2px solid grey', fontSize: 20, textAlign: 'left', width: 500, padding: 3}} name='seed' placeholder='Seed Phrase' required />
                <button style={{width: 90, textAlign:'center', padding: 5, fontSize:20, marginLeft:10}} className="access-button" type="menu-button"> Access </button>
          </Box>
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
                Requests
          </Box>
          <Box style={{
            backgroundColor: 'transparent',
            color: 'black',
            border: 'solid #ACC578',
            minHeight: 50,
            width: 680,
            fontSize: 20,
            fontFamily: 'Quicksand',
            textAlign: 'center',
            padding: 20,
            marginLeft: 350,
            marginTop: -20,
            marginBottom: 50,
            }}>
                You don't have any requests at the moment.
          </Box>
        </div>
    );
}

export default PatientDashboard;
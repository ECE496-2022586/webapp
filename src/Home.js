import React from 'react';
import Box from './Box.js';
import Header from './Header.js';
  
function Home() {
    return(
        <div className='home-page'>
            <Header />
            <Box style={{
                width: 700,
                wordWrap: true,
                fontSize: 25,
                fontFamily: 'Quicksand',
                textAlign: 'center',
                marginTop: 100,
                marginLeft: 360,
                }}>
                HealthChainON is a patient-centric web application that allows for health record management between patients and healthcare practitioners through the use of blockchain technology while ensuring confidentiality, ownership, and efficiency compared to current EHR systems.
            </Box>
        </div>
    );
}

export default Home
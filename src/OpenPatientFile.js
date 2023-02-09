import React, {useState, useEffect} from 'react';
import Box from './Box.js';
import Header from './Header.js';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { CircularProgress} from '@mui/material';

function OpenPatientFile(props) {
    const params= useLocation();
    const foundUser = params.state.foundUser;
    let upload = <Link to='/uploadpage' state={{foundUser}}> <button className="home-button" type="button"> Upload </button> </Link> 
  
    return (
        <div className="open-patient-file">
            <Header />
            <h2 style={{fontFamily: 'Quicksand', textAlign: 'center', marginTop: 70}}>Welcome to {foundUser.firstName}'s dashboard  !</h2>
            <Box style={{
                    backgroundColor: 'transparent',
                    color: '#7e9f38',
                    minHeight: 300,
                    width: 300,
                    borderRadius: 10,
                    fontSize: 15,
                    fontFamily: 'Quicksand',
                    textAlign: 'center',
                    marginLeft: 560,
                    marginTop: 100,
            }}>
            {upload}
            </Box>
        </div>
    );
}

export { OpenPatientFile };

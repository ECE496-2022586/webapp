import React from 'react';
import Box from './Box';
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

let user;

function Login () {
    const navigate = useNavigate();
    const authenticate = async (e) => {
        e.preventDefault();
        const username = e.target.parentElement[0].value;
        const password = e.target.parentElement[1].value;
        
        const res = await axios.post('http://localhost:5000/authenticate', { username, password });
        if(res.status === 200) {
            user = username;
            if (res.data.userType === 'patient')
                navigate('/PDashboard');
            else
            navigate('/MFDashboard');
        }
    }
    return (
      <div className="login">
        <Header />
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
            <div className='login-form'>
                <form>
                    <input type='username' name='username' placeholder='health card number' required />
                    <input type='password' name='password' placeholder='password' required />
                    <button className="login-button" type="menu-button" onClick={authenticate}> Login </button>
                    <a href="/new-user">New User? Create an account</a>
                </form>
            </div>
        </Box>
      </div>
    );
  }
   
export { Login, user };
import React from 'react';
import Box from './Box.js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function NewUser() {
    const navigate = useNavigate();
    async function addNewUser(e) {
        const mainDiv = e.target.parentElement.children[1];
        const mainDivInputs = mainDiv.getElementsByTagName('input');
        const name = mainDivInputs[0].value;
        const lastName = mainDivInputs[1].value;
        const email = mainDivInputs[2].value;
        const cEmail = mainDivInputs[3].value;
        const HCNumber = mainDivInputs[4].value;
        const password = mainDivInputs[5].value;
        const cPassword = mainDivInputs[6].value;

        if(email !== cEmail)
            console.log("Emails don't match:(");

        if(password !== cPassword)
            console.log("Passwords don't match:(");
        if (password.len < 12)
            console.log('Your password is not long enough:(');
        
        console.log(name, lastName, email, cEmail, HCNumber, password, cPassword);
        const res = await axios.post('/addPatient', { name, lastName, email, HCNumber, password });
        if (res.status === 200) {
            console.log('You are my strange addiction');
            navigate('/login');
        }
    }
    return (
        <div className='new-patient'>
            <h1 style={{fontFamily: 'Quicksand', color: '#0a5f42', marginLeft:50, marginTop:50}}> Perosnal Information</h1>
            <Box style={{
                color: 'black',
                backgroundColor: '#ACC578',
                borderRadius: 30,
                minHeight: 50,
                width: 600,
                fontSize: 15,
                fontFamily: 'Quicksand',
                textAlign: 'center',
                padding: 30,
                marginLeft: 80,
                marginTop: 50,
                marginBottom:-35,
            }}>
                <div className='name' style={{fontFamily: 'Quicksand', marginLeft:-300, marginTop:10}}>
                    <h3 style={{marginLeft:-175, marginBottom:-10}}>Name</h3>
                    <input style={{backgroundColor:'white', fontSize:20, padding:5, textAlign:'left'}} placeholder='e.g Santa' required />
                </div>
                <div className='last-name' style={{fontFamily: 'Quicksand', marginLeft:300, marginTop:-102}}>
                    <h3 style={{marginLeft:-140, marginBottom:-10}}>Last Name</h3>
                    <input style={{backgroundColor:'white', fontSize:20, padding:5, textAlign:'left'}} placeholder='e.g Clause' required />
                </div>
                <div className='email'style={{fontFamily: 'Quicksand', marginLeft:0, marginTop:0}}>
                    <h3 style={{marginLeft:-485, marginBottom:-10}}>Email</h3>
                    <input style={{width: 516, backgroundColor:'white', fontSize:20, padding:5, textAlign:'left'}} placeholder='e.g santa.clause@christmas.com' required />
                </div>
                <div className='cemail' style={{fontFamily: 'Quicksand', marginLeft:0, marginTop:0}}>
                    <h3 style={{marginLeft:-410, marginBottom:-10}}>Confirm Email</h3>
                    <input style={{width:516, backgroundColor:'white', fontSize:20, padding:5, textAlign:'left'}} placeholder='e.g santa.clause@christmas.com' required />
                </div>
                <div className='hcnumber' style={{fontFamily: 'Quicksand', marginLeft:0, marginTop:0}}>
                    <h3 style={{marginLeft:-295, marginBottom:-10}}>Ontario Health Card Number</h3>
                    <input style={{width:516, backgroundColor:'white', fontSize:20, padding:5, textAlign:'left'}} placeholder='e.g 123456789AB' required />
                </div>
                <div className='pass' style={{fontFamily: 'Quicksand', marginLeft:-300, marginTop:0}}>
                    <h3 style={{marginLeft:-145, marginBottom:-10}}>Password</h3>
                    <input type='password' style={{backgroundColor:'white', fontSize:20, padding:5, textAlign:'left'}} placeholder='e.g Password12345?' required />
                </div>
                <div className='cpass' style={{fontFamily: 'Quicksand', marginLeft:300, marginTop:-102}}>
                    <h3 style={{marginLeft:-70, marginBottom:-10}}>Confirm Password</h3>
                    <input type='password' style={{backgroundColor:'white', fontSize:20, padding:5, textAlign:'left'}} placeholder='e.g Password12345?' required />
                </div>
            </Box>
            <button className='join' style={{marginLeft:550, backgroundColor:'#0a5f42', borderRadius:10, width: 100, textAlign:'center', padding: 10}} onClick={addNewUser}>Join!</button>
            <Box style={{
                color: 'white',
                backgroundColor: '#0a5f42',
                borderRadius: 30,
                minHeight: 50,
                width: 400,
                fontSize: 20,
                fontFamily: 'Quicksand',
                textAlign: 'left',
                padding: 30,
                marginLeft: 850,
                marginTop: -600,
                marginBottom:-35,
            }}>
                <ul>
                    <li>Your health card number will be your username</li>
                    <h2/>
                    <li>Make sure to choose a strong password with 12 characters including numbers, lower and upper case letters, and some very special characters!?%~</li>
                    <h2 />
                    <li>Welcome to HealthChainON, we're happy to have you here!</li>
                </ul>
            </Box>
        </div>
    )
}

export default NewUser;
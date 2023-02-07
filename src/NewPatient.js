import { React, useState } from 'react';
import Box from './Box.js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './Header.js';
import { Modal } from 'react-bootstrap';

const ERROR_MESSAGES = {
    emptyField: 'Please ensure you have filled all fields',
    invalidEmail: 'The email you have entered is invalid',
    emailsDontMatch: 'Your emails don\'t match',
    invalidHCNumber: 'Your healthcard number should be 10 numbers followed by 2 capital letters',
    invalidPassword: 'Your password should 8 characters including numbers, lower and upper case letters, and some very special characters',
    passwordsDontMatch: 'Your passwords don\'t match',
    apiError: 'There was an api error',
};

function NewPatient() {
    const [showSuccessPopup, setSuccessPopup] = useState(false);
    const [emptyField, setEmptyField] = useState(false);
    const [invalidEmail, setInvalidEmail] = useState(false);
    const [emailsDontMatch, setEmailsDontMatch] = useState(false);
    const [invalidHCNumber, setInvalidHCNumber] = useState(false);
    const [invalidPassword, setInvalidPassword] = useState(false);
    const [passwordsDontMatch, setPasswordsDontMatch] = useState(false);
    const [apiError, setApiError] = useState(false);
    const navigate = useNavigate();

    function resetErrors () {
        setEmptyField(false);
        setInvalidEmail(false);
        setEmailsDontMatch(false);
        setInvalidHCNumber(false);
        setInvalidPassword(false);
        setPasswordsDontMatch(false);
        setApiError(false);
    }

    function Errors() {
        let errors = [];

        if (emptyField) errors.push(ERROR_MESSAGES.emptyField);
        if (invalidEmail) errors.push(ERROR_MESSAGES.invalidEmail);
        if (emailsDontMatch) errors.push(ERROR_MESSAGES.emailsDontMatch);
        if (invalidHCNumber) errors.push(ERROR_MESSAGES.invalidHCNumber);
        if (invalidPassword) errors.push(ERROR_MESSAGES.invalidPassword);
        if (passwordsDontMatch) errors.push(ERROR_MESSAGES.passwordsDontMatch);
        if (apiError) errors.push(ERROR_MESSAGES.apiError);

        console.log(errors);

        return (
            errors.map((error) => {
                return <h6 style={{width: '40%', marginLeft: 50, marginBottom:-15, fontFamily: 'Quicksand', fontSize:15, color: '#900C3F'}}>{error}</h6>
            })
        );
    }
    
    const redirectToLogin = () => {
        setSuccessPopup(false);
        navigate('/login');
    }

    const SuccessPopUp = (props) => {
        if (showSuccessPopup) {
            console.log('accept');
            return(
            <Modal centered {...props}>
                <Box style={{
                backgroundColor: 'white',
                color: 'black',
                border: 'solid #ACC578',
                minHeight: 50,
                width: 500,
                fontSize: 20,
                fontFamily: 'Quicksand',
                textAlign: 'center',
                padding: 20,
                marginLeft: 385,
                marginTop: 300,
                marginBottom: 50,
                }}>
                    <h4 style={{marginTop:20}}>Your account was successfuly created!</h4>
                    <button style={{width: 90, textAlign:'center', padding: 5, fontSize:20, marginLeft:10}} className="access-button" type="button" onClick={redirectToLogin}> OK </button>
                </Box>
            </Modal>
            );
        }
    }
    
    async function addNewPatient(e) {
        resetErrors();

        const mainDiv = e.target.parentElement.children[2];
        const mainDivInputs = mainDiv.getElementsByTagName('input');
        const name = mainDivInputs[0].value;
        const lastName = mainDivInputs[1].value;
        const email = mainDivInputs[2].value;
        const cEmail = mainDivInputs[3].value;
        const HCNumber = mainDivInputs[4].value;
        const password = mainDivInputs[5].value;
        const cPassword = mainDivInputs[6].value;

        if (!name.length || !lastName.length || !email.length || !cEmail.length || !HCNumber.length || !password.length || !cPassword.length) {
            setEmptyField(true);
            return;
        }
    
        if (!/^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            setInvalidEmail(true);
            return;
        }

        if(email !== cEmail) {
            setEmailsDontMatch(true);
            return;
        }
        
        if (!HCNumber.length === 12 || !/[A-Z]{2}/.test(HCNumber.slice(-2)) || !/\d{10}/.test(HCNumber.slice(0, 11))) {
            setInvalidHCNumber(true);
            return;
        }

        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#%^&])(?=.{8,})/.test(password)) {
            setInvalidPassword(true);
            return;   
        }
    
        if (password !== cPassword) {
            setPasswordsDontMatch(true);
            return;
        }
        
        console.log(name, lastName, email, cEmail, HCNumber, password, cPassword);
        const res = await axios.post('/addPatient', { name, lastName, email, HCNumber, password }).catch(() => {
            setApiError(true);
        });

        if (res.status === 200)
            setSuccessPopup(true);
    }
    return (
        <div className='new-patient'>
            <Header />
            <h1 style={{fontFamily: 'Quicksand', color: '#0a5f42', marginLeft:50, marginTop:70}}> Perosnal Information</h1>
            <Errors/>
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
            <button className='join' style={{marginLeft:550, backgroundColor:'#0a5f42', borderRadius:10, width: 100, textAlign:'center', padding: 10}} onClick={addNewPatient}>Join!</button>
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
                marginTop: -708,
                marginBottom:-35,
            }}>
                <ul>
                    <li>Your health card number will be your username</li>
                    <h2/>
                    <li>Make sure to choose a strong password with 8 characters including numbers, lower and upper case letters, and some very special characters!?%~</li>
                    <h2 />
                    <li>Welcome to HealthChainON, we're happy to have you here!</li>
                </ul>
            </Box>
            <SuccessPopUp show={showSuccessPopup} onHide={() => setSuccessPopup(false)}/>
        </div>
    )
}

export default NewPatient;

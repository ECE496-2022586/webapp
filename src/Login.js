import './flipStyles.scss';
import { React, useState, useEffect } from 'react';
import Box from './Box.js';
import Header from './Header.js';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import FlipCard from './FlipCard.js';

let user;
let requestsString;

function Login () {
    const [auth, setAuth] = useState(null);
    const [loginError, setLoginError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/current-session').then(({data}) => {
            setAuth(data);
        })
    });

    if (!auth) {
        const authenticateMedFacility = async (e) => {
            e.preventDefault();
            setLoginError('');
            const username = e.target.parentElement[0].value;
            const password = e.target.parentElement[1].value;
            
            const res = await axios.post('/authenticateMedFacility', { username, password }).catch((err) => {
                setLoginError(err.response.data.msg);
            });
        
            if(res && res.status === 200) {
                user = res.data.user;
                navigate('/MFDashboard');
            }
        }
        const authenticatePatient = async (e) => {
            e.preventDefault();
            setLoginError('');
            const username = e.target.parentElement[0].value;
            const password = e.target.parentElement[1].value;
            
            const res = await axios.post('/authenticatePatient', { username, password }).catch((err) => {
                setLoginError(err.response.data.msg);
            });

            if(res && res.status === 200) {
                user = res.data.user;
                if(user.requests.length) {
                    const res2 = await axios.post('/getInstitutionNameFromID', { ids: user.requests });
                    if(res2.status === 200) requestsString = res2.data.requestsString;
                }
                navigate('/PDashboard');
            }
        }
        const medFacilityTile = () => {
            return (
                <Box style={{
                        backgroundColor: '#609339',
                        color: 'white',
                        minHeight: 100,
                        width: 100,
                        borderRadius: 10,
                        fontSize: 20,
                        fontFamily: 'Quicksand',
                        textAlign: 'center',
                        marginLeft: 310,
                        marginTop: 150,
                        padding: 60,
                }}>
                    Login as a Health Provider
                </Box>
            );
        }
        const patientTile = () => {
            return(
                <Box onClick={authenticatePatient}
                    style={{
                        backgroundColor: '#7e9f38',
                        color: 'white',
                        minHeight: 100,
                        width: 100,
                        borderRadius: 10,
                        fontSize: 20,
                        fontFamily: 'Quicksand',
                        textAlign: 'center',
                        marginLeft: 610,
                        marginTop: 150,
                        padding: 60,
                }}>
                    Login as a Patient
                </Box>
            );
        }
        const labTile = () => {
            return(
                <Box style={{
                    backgroundColor: '#0a5f42',
                    color: 'white',
                    minHeight: 100,
                    width: 100,
                    borderRadius: 10,
                    fontSize: 20,
                    fontFamily: 'Quicksand',
                    textAlign: 'center',
                    marginLeft: 910,
                    marginTop: 150,
                    padding: 60,
            }}>
                Login as a Lab
            </Box>
            );
        }
        const patientLogin = () => {
            return(
                <Box style={{
                    backgroundColor: 'transparent',
                    color: '#7e9f38',
                    width: 290,
                    borderRadius: 10,
                    fontSize: 15,
                    fontFamily: 'Quicksand',
                    textAlign: 'center',
                    marginLeft: 570,
                    marginTop: 150,
                }}>
                    <div className='login-form'>
                        <form>
                            <input type='username' name='username' placeholder='health card number' required />
                            <input type='password' name='password' placeholder='password' required />
                            <button className="login-button" type="menu" style={{fontSize:20, width: 220, marginLeft:10, padding:5}} onClick={authenticatePatient}> Login </button>
                            <a style={{marginLeft:25, marginRight:25}} href="/new-patient">New User? Create an account</a>
                        </form>
                    </div>
                </Box>
            );
        }
        const medFacilitiesLogin = () => {
            return(
                <Box style={{
                    backgroundColor: 'transparent',
                    color: '#7e9f38',
                    width: 290,
                    borderRadius: 10,
                    fontSize: 15,
                    fontFamily: 'Quicksand',
                    textAlign: 'center',
                    marginLeft: 270,
                    marginTop: 150,
                }}>
                    <div className='login-form'>
                        <form>
                            <input type='username' name='username' placeholder='institute id' required />
                            <input type='password' name='password' placeholder='password' required />
                            <button className="login-button" type="menu" style={{fontSize:20, width: 220, marginLeft:10, padding:5, backgroundColor: '#609339'}} onClick={authenticateMedFacility}> Login </button>
                            <a style={{marginLeft:25, marginRight:25}} href="/new-mfl">New User? Create an account</a>
                        </form>
                    </div>
                </Box>
            );
        }
        const labLogin = () => {
            return(
                <Box style={{
                    backgroundColor: 'transparent',
                    color: '#7e9f38',
                    width: 290,
                    borderRadius: 10,
                    fontSize: 15,
                    fontFamily: 'Quicksand',
                    textAlign: 'center',
                    marginLeft: 870,
                    marginTop: 150,
                }}>
                    <div className='login-form'>
                        <form>
                            <input type='username' name='username' placeholder='institute id' required />
                            <input type='password' name='password' placeholder='password' required />
                            <button className="login-button" type="dark-green-button" style={{fontSize:20, width: 220, marginLeft:10, padding:5}}> Login </button>
                            <a style={{marginLeft:25, marginRight:25}} href="/new-mfl">New User? Create an account</a>
                        </form>
                    </div>
                </Box>
            );
        }
        return (
        <div className="login">
            <Header/>
            <h6 style={{width: '100%', marginLeft: 500, marginBottom: -50, fontFamily: 'Quicksand', fontSize:20, color: '#900C3F'}}>{loginError}</h6>
            <FlipCard Front={medFacilityTile} Back={medFacilitiesLogin}/>
            <FlipCard Front={patientTile} Back={patientLogin}/>
            <FlipCard Front={labTile} Back={labLogin}/>
        </div>
        );
    } else if(auth == null) {
        return(
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
                }}></Box>
            </div>
        )
    } else {
        navigate('/');
    }
  }
   
export { Login, user, requestsString };

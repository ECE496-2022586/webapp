import './flipStyles.scss';
import { React, useState, useEffect } from 'react';
import Box from './Box.js';
import Header from './Header.js';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import FlipCard from './FlipCard.js';
import { Modal } from 'react-bootstrap';

let user;

function Login () {
    const [showEncryptionKeyPopupPatient, setEncryptionKeyPopupPatient] = useState(false);
    const [auth, setAuth] = useState(null);
    const [loginError, setLoginError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const loggedInUser = localStorage.getItem("user");
        if (loggedInUser && loggedInUser != "undefined") {
           user = JSON.parse(loggedInUser);
        }
      }, []);
    
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
                localStorage.setItem('user', JSON.stringify(res.data.user))
                console.log(user)
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
                setEncryptionKeyPopupPatient(true)
            }
        }

        const EncryptionKeyPopupPatient = (props) => {
            if (showEncryptionKeyPopupPatient) {
              return(
                <Modal centered {...props}>
                  <Box style={{
                  backgroundColor: 'white',
                  color: 'black',
                  border: 'solid #ACC578',
                  minHeight: 50,
                  width: 600,
                  fontSize: 20,
                  fontFamily: 'Quicksand',
                  textAlign: 'center',
                  padding: 20,
                  marginLeft: 385,
                  marginTop: 300,
                  marginBottom: 50,
                  }}>
                      <button type="btn-close" style={{marginTop:-10, marginLeft:480}} onClick={()=> setEncryptionKeyPopupPatient(false)}>x</button>
                      <h4 style={{marginTop:-20}}>Please enter your secret key to login</h4>
                      <input type="password" style={{border: '2px solid grey', fontSize: 20, textAlign: 'left', width: 400, padding: 3}} name='seed' placeholder='Seed Phrase' required />
                      <button style={{width: 90, textAlign:'center', padding: 5, fontSize:20, marginLeft:10}} className="access-button" type="button" onClick={validateKey}> Validate </button>
                </Box>
              </Modal>
              );
            }
        }

        const validateKey = async (e) => {
            e.preventDefault();
            const seed = e.target.previousElementSibling.value;
            const res = await axios.post('/authenticateWithLedger', { username: user.HCNumber, password: user.password, seed: seed, identity: "patient" }).catch((err) => {
                setLoginError(err.response.data.msg);
            });
            if (res.status !== 200) {
                const res_logout = await axios.get('/logout');
                if(res_logout.status === 200) {
                    navigate('/');
                }
            }
            user = res.data.user;
            localStorage.setItem('user',  JSON.stringify(res.data.user))

            if(user.pendingRequests.length) {
                const res2 = await axios.post('/getInstitutionNameFromID', { ids: user.pendingRequests });
                if(res2.status === 200) localStorage.setItem('requestsString', res2.data.requestsString)
            }
            if(user.approvedRequests.length) {
                const res2 = await axios.post('/getInstitutionNameFromID', { ids: user.approvedRequests });
                if(res2.status === 200) localStorage.setItem('accessListOfMfString', res2.data.requestsString)
            }
            console.log(user)
            navigate('/PDashboard');
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
            <EncryptionKeyPopupPatient show={showEncryptionKeyPopupPatient} onHide={() => setEncryptionKeyPopupPatient(false)}/>
        </div>
        );
    } else if(auth === null) {
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
   
export { Login};

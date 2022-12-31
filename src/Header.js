import { React, useState, useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Box from './Box.js';
import axios from 'axios';
import { user } from './Login.js';

function NavBar() {
    const [auth, setAuth] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
         axios.get('/current-session').then(({data}) => {
          setAuth(data);
        })
      }, [auth])

    const logout = async (e) => {
        const res = await axios.get('/logout');
        if(res.status === 200) {
            navigate('/');
            window.location.reload();
        }
    }

    let loginButton;
    if (!auth) {
      loginButton = <Link to="/login">
                    <button
                    className="home-button"
                    type="menu-button"
                    >
                        Login
                    </button>
                </Link>
    } else {
        loginButton = <button className="logout-button" type="menu-button" onClick={logout}> Logout </button>;
    }
    let upload;

    if(user && !user.isPatient) {
        upload  =   <Link to='/uploadpage'>
                        <button
                            className="home-button"
                            type="menu-button"
                        >
                            Upload
                        </button>
                    </Link> 
    }
    return(
      <div className='menu-bar'>
          <Box style={{
              backgroundColor: '#ACC578',
              color: 'white',
              minHeight: 15,
              width: 700,
              fontSize: 25,
              fontFamily: 'Quicksand',
              textAlign: 'center',
              padding: 10,
              marginLeft: 350,
              marginTop: -35,
            }}>
                <Link to='/'>
                    <button
                        className="home-button"
                        type="menu-button"
                    >
                        Home
                    </button>
                </Link> 
                <Link to='/how-to'>
                    <button
                        className="home-button"
                        type="menu-button"
                    >
                        How-to
                    </button>
                </Link>   
                {loginButton}
                {upload}
          </Box>
        </div>
    );
  }

function Header() {
    return(
        <div className='header'>
            <Box style={{
                backgroundColor: '#0a5f42',
                color: 'white',
                minHeight: 50,
                width: 1320,
                fontSize: 50,
                fontFamily: 'Quicksand',
                textAlign: 'center',
                padding: 65,
            }}>
                HealthChainON
            </Box>
            <NavBar/>
        </div>
    );
}

export default Header;

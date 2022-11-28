import { React, useState, useEffect} from "react";
import { Link } from 'react-router-dom';
import Box from "./Box";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function NavBar() {
    const [auth, setAuth] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
         axios.get('/current-session').then(({data}) => {
          setAuth(data);
          console.log(auth);
        })
      }, [auth])

    const logout = async (e) => {
        e.preventDefault();
        const res = await axios.get('/logout');
        if(res.status === 200) {
            navigate('/');
        }
    }

    let loginButton;
    if (!auth) {
      loginButton = <Link to="/login">
                    <menu-button
                    className="home-button"
                    type="button"
                    >
                        Login
                    </menu-button>
                </Link>
    } else {
        loginButton = <button className="logout-button" type="menu-button" onClick={logout}> Logout </button>;
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
                    <menu-button
                        className="home-button"
                        type="button"
                    >
                        Home
                    </menu-button>
                </Link> 
                <Link to='/how-to'>
                    <menu-button
                        className="home-button"
                        type="button"
                    >
                        How-to
                    </menu-button>
                </Link>   
                {loginButton}  
          </Box>
        </div>
    );
  }

function Header() {
    return(
        <div className='header'>
            <Box style={{
                backgroundColor: '#7e9f38',
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
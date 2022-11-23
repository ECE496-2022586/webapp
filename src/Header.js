import React from "react";
import { Link } from 'react-router-dom';
import Box from "./Box";

function NavBar() {
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
                <Link to="/login">
                    <menu-button
                    className="home-button"
                    type="button"
                    >
                        Login
                    </menu-button>
                </Link>
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
            <NavBar />
        </div>
    );
}

export default Header;
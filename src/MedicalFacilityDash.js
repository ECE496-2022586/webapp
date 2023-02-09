import { React, useState } from 'react';
import Header from './Header.js';
import Box from './Box.js';
import { user } from './Login.js';
import axios from 'axios';
import {Link} from 'react-router-dom';

function MedicalFacilityDashboard() {
  const [showTable, setTable] = useState(false);
  let [foundUser, setFoundUser] = useState({});
  let [userAccessButton, setUserAccessButton] = useState(false);
  const [showRequested, setRequested] = useState(false);

  const requestAccess = async (e) => {
    const HCNumber = e.target.parentElement.parentElement.children[0].textContent;

    const res = await axios.post('/requestAccess', { HCNumber });
    if(res.status === 200) {
      setRequested(true);
    }
  }

  const RequestButton = () => {
    if(userAccessButton) {
      return  <Link to="/openpatientfile" state={{foundUser}}> <button style={{fontSize:20}}>View</button></Link>
    } 
    else {
      if(!showRequested)
        return <button className="request-button" type="button" style={{padding:7, fontSize:20}} onClick={requestAccess}>Request</button>
      else
        return <button className="request-button" type="menu-button" style={{border: 'solid #ACC578', backgroundColor: 'white', color:'#ACC578', padding:7, fontSize:20}} onClick={requestAccess}>Requested</button>
      }
  }

  const SearchResultTable = () => {
    if (showTable) {
      return (
        <Box style={{
          backgroundColor: 'transparent',
          border: 'solid #ACC578',
          minHeight: 50,
          width: 680,
          fontSize: 20,
          fontFamily: 'Quicksand',
          textAlign: 'center',
          padding: 15,
          marginLeft: 350,
          marginTop: 30,
          }}>
            <table style={{width:'100%'}}>
              <tr>
                <th>Health Card#</th>
                <th>Fisrt Name</th>
                <th>Last Name</th>
                <th>Request Access</th>
              </tr>
              <tr>
                <td>{foundUser.HCNumber}</td>
                <td>{foundUser.firstName}</td>
                <td>{foundUser.lastName}</td>
                <td ><RequestButton/></td>
              </tr>
            </table>          
          </Box>
      );
    }
  }

  const search = async (e) => {
    setTable(false);
    setRequested(false);
    foundUser = {};
    const HCNumber = e.target.previousElementSibling.value;
    const res = await axios.post('/search', { HCNumber });
    if(res.status === 200) {
      setFoundUser({
        HCNumber: res.data.user.health_card_number,
        firstName: res.data.user.first_name,
        lastName: res.data.user.last_name,
      });
      setTable(true);
      const res2 = await axios.post('/searchPatientAccessList', { HCNumber });
      if(res2.status === 200) {
        setUserAccessButton(true);
      }
    } else {
      console.log('did not found user!');
    }
  }
  return (
      <div className="mfdashboard">
        <Header />
        <h2 style={{fontFamily: 'Quicksand', textAlign: 'center', marginTop: 70}}>Welcome to your dashboard {user && user.name} !</h2>
        <Box style={{
          backgroundColor: '#ACC578',
          color: 'white',
          minHeight: 20,
          width: 150,
          fontSize: 20,
          fontFamily: 'Quicksand',
          textAlign: 'center',
          padding: 15,
          marginLeft: 250,
          marginTop: 70,
          }}>
              Find a patient
        </Box>
        <Box style={{
          backgroundColor: 'transparent',
          color: '#ACC578',
          border: 'solid #ACC578',
          minHeight: 50,
          width: 680,
          fontSize: 20,
          fontFamily: 'Quicksand',
          textAlign: 'center',
          padding: 15,
          marginLeft: 350,
          marginTop: -20,
          }}>
              <input style={{border: '2px solid grey', fontSize: 20, textAlign: 'left', width: 500, padding: 3}} placeholder='Patient Health Card Number' required />
              <button onClick={search} style={{width: 90, textAlign:'center', padding: 5, fontSize:20, marginLeft:10}} className="search-button" type="button"> Search </button>
        </Box>
        <SearchResultTable />
      </div>
  );
}

export default MedicalFacilityDashboard;

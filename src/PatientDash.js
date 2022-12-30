import React from 'react';
import Header from './Header.js';
import Box from './Box.js';
import { user, requestsString } from './Login.js';

function PatientDashboard() {
  const TableFromArray = () => {
    if (requestsString) {
      const requestsMap = new Map(Object.entries(JSON.parse(requestsString)));
      return(
        <table style={{width:'100%'}}>
          <tr>
            <th>Institute ID</th>
            <th>Name</th>
            <th>Accept</th>
            <th>Deny</th>
          </tr>
            {user.requests.map((id) => {
              return(
                <tr>
                  <td>{id}</td>
                  <td>{requestsMap.get(id)}</td>
                  <td><button className="accept-button" type="button" style={{padding:7, fontSize:20}}>Accept</button></td>
                  <td><button className="deny-button" type="dark-green-button" style={{padding:7, fontSize:20}}>Deny</button></td>
                </tr>
              );
            })}
        </table>
      );
    }
  }
  const RequestsTable = () => {
    if (user && user.requests) {
      if (user.requests.length) {
        return (
          <Box style={{
            backgroundColor: 'transparent',
            color: 'black',
            border: 'solid #ACC578',
            minHeight: 50,
            width: 680,
            fontSize: 20,
            fontFamily: 'Quicksand',
            textAlign: 'center',
            padding: 20,
            marginLeft: 350,
            marginTop: -20,
            marginBottom: 50,
            }}>
                <TableFromArray />
          </Box>
        );
      } else {
        return (
          <Box style={{
            backgroundColor: 'transparent',
            color: 'black',
            border: 'solid #ACC578',
            minHeight: 50,
            width: 680,
            fontSize: 20,
            fontFamily: 'Quicksand',
            textAlign: 'center',
            padding: 20,
            marginLeft: 350,
            marginTop: -20,
            marginBottom: 50,
            }}>
                You don't have any requests at the moment.
          </Box>
        );
      }
    }
  }
    return (
        <div className="pdashboard">
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
                Access Records
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
                <input style={{border: '2px solid grey', fontSize: 20, textAlign: 'left', width: 500, padding: 3}} name='seed' placeholder='Seed Phrase' required />
                <button style={{width: 90, textAlign:'center', padding: 5, fontSize:20, marginLeft:10}} className="access-button" type="menu-button"> Access </button>
          </Box>
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
                Requests
          </Box>
          <RequestsTable />
        </div>
    );
}

export default PatientDashboard;
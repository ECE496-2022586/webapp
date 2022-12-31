import { React, useState } from 'react';
import Header from './Header.js';
import Box from './Box.js';
import { user, requestsString } from './Login.js';
import { Modal } from 'react-bootstrap';
import axios from 'axios';

function PatientDashboard() {
  const [showAcceptPopup, setAcceptPopup] = useState(false);
  const [showDenyPopup, setDenyPopup] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(-1);
  let requestsMap = {};

  const TableFromArray = () => {
    if (requestsString) {
      requestsMap = new Map(Object.entries(JSON.parse(requestsString)));
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
                  <td><button className="accept-button" type="button" style={{padding:7, fontSize:20}} onClick={acceptRequest}>Accept</button></td>
                  <td><button className="deny-button" type="dark-green-button" style={{padding:7, fontSize:20}} onClick={denyRequest}>Deny</button></td>
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

  const acceptRequest = (e) => {
    setAcceptPopup(true);
    const instituteID = e.target.parentElement.parentElement.children[0].textContent;
    setCurrentRequest(instituteID);
  }

  const denyRequest = (e) => {
    setDenyPopup(true);
    const instituteID = e.target.parentElement.parentElement.children[0].textContent;
    setCurrentRequest(instituteID);
  }

  const AcceptPopUp = (props) => {
    if (showAcceptPopup) {
      console.log('accept');
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
              <button type="btn-close" style={{marginTop:-10, marginLeft:480}} onClick={()=> setAcceptPopup(false)}>x</button>
              <h4 style={{marginTop:-20}}>Please enter your seed phrase to accept the request</h4>
              <input style={{border: '2px solid grey', fontSize: 20, textAlign: 'left', width: 400, padding: 3}} name='seed' placeholder='Seed Phrase' required />
              <button style={{width: 90, textAlign:'center', padding: 5, fontSize:20, marginLeft:10}} className="access-button" type="button"> Accept </button>
        </Box>
      </Modal>
      );
    }
  }

  const DenyPopUp = (props) => {
    if (showDenyPopup) {
      console.log('deny');
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
            marginLeft: 450,
            marginTop: 300,
            marginBottom: 50,
            }}>
                <button type="btn-close" style={{marginTop:-10, marginLeft:385}} onClick={()=> setDenyPopup(false)}>x</button>
                <h4 style={{marginTop:-30}}>Are you sure you want to deny this request?</h4>
                <button style={{width: 90, textAlign:'center', padding: 5, fontSize:20, marginLeft:10}} type="button" onClick={confirmDenial}> Yes </button>
                <button style={{width: 90, textAlign:'center', padding: 5, fontSize:20, marginLeft:10}} type="dark-green-button" onClick={()=> setDenyPopup(false)}> No </button>
          </Box>
        </Modal>
      );
    }
  }

  const confirmDenial = async () => {
    setDenyPopup(false);
    const HCNumber = user.HCNumber;
    const instituteID = currentRequest;
    const res = await axios.post('/denyRequest', { HCNumber, instituteID });
    if(res.status === 200) {
      requestsMap.delete(instituteID);
      // window.location.reload(false);
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
            <button style={{width: 90, textAlign:'center', padding: 5, fontSize:20, marginLeft:10}} className="access-button" type="button"> Access </button>
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
      <RequestsTable/>
      <AcceptPopUp show={showAcceptPopup} onHide={() => setAcceptPopup(false)}/>
      <DenyPopUp show={showDenyPopup} onHide={() => setDenyPopup(false)}/>
    </div>
  );
}

export default PatientDashboard;
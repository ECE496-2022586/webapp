// import authenticate from '../src/Authenticate';
const fs = require("fs");
const { parse } = require("csv-parse");
const getStream = require('get-stream');

const express = require('express');
const app = express();
const PORT = 5000;

app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    next();
});

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Headers', '*');
    next();
});

app.listen(
    PORT, 
    () => console.log('listening')
);

async function authenticate(username, password) {
    console.log('usa', username);
    console.log('pass', password);
    let patients = {};
    let medFacilities = {};

    const patientParseStream = parse({delimiter: ',', from_line: 2});
    const patientData = await getStream.array(fs.createReadStream("../src/Patients.csv").pipe(patientParseStream));
    for (let i = 0; i<patientData.length; i+=1) {
        let row = patientData[i];
        patients[row[0]] = row[4];
    }

    const medParseStream = parse({delimiter: ',', from_line: 2});
    const medFacilData = await getStream.array(fs.createReadStream("../src/MedicalFacilities.csv").pipe(medParseStream));
    for (let i = 0; i<medFacilData.length; i+=1) {
        let row = medFacilData[i];
        medFacilities[row[0]] = row[2];
    }

    if (!patients[username] && !medFacilities[username]) {
        return 'fail';
    } else if (patients[username]) {
        if (patients[username] !== password)
            return 'fail';
        else {
            return 'patient';
        }
    } else if (medFacilities[username]) {
        if (medFacilities[username] !== password)
            return 'fail';
        else {
            return 'medicalFacility';
        }
    }
}

app.post('/authenticate', async (req, res) => {
    console.log(req.body);
    const { username, password } = req.body;
    const loggedIn = await authenticate(username, password);
    console.log(loggedIn);

    if (loggedIn == 'fail'){
        res.status(403).send({
            msg: 'Health card number or password is incorrect.',
        })
    } else {
        res.status(200).send({
            msg: 'Login successfull!',
            userType: loggedIn,
        })
    }
});

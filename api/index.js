// import authenticate from '../src/Authenticate';
const { Web3Storage, getFilesFromPath } = require('web3.storage');
const fileUpload = require('express-fileupload');
const fs = require("fs");
const { parse } = require("csv-parse");
const getStream = require('get-stream');
const bodyParser = require('body-parser');
const fastcsv = require('fast-csv');

const express = require('express');
const app = express();
const PORT = 5000;

app.use(fileUpload());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));

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

const client = getClient();

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
        });
    } else {
        res.status(200).send({
            msg: 'Login successfull!',
            userType: loggedIn,
        });
    }
});

app.post('/addUser', (req, res) =>  {
    console.log(req.body);
    const { name, lastName, email, HCNumber, password } = req.body;
    console.log(name, lastName, email, HCNumber, password);
      
    const data = [{
        HCNumber,
        name,
        lastName,
        email,
        password,
    }];

    const ws = fs.createWriteStream("../src/Patients.csv", {flags: 'a'});
    fastcsv
        .write(data, { headers: false })
        .pipe(ws);
    // writer.pipe(fs.createWriteStream('../src/Patients.csv', {flags: 'a'}));
    // writer.write(data, { headers: false });
    res.status(200).send({});
});

app.post('/upload', (req, res) =>  {
    console.log(req.files);
    const file = req.files.file;
    const fileName = req.body.fileName;
    const filePath =  '../public/'  + fileName;

    file.mv(filePath, async (err)  => {
        if (err) {
            console.log('Error: failed to download the file');
            return res.status(500).send(err);
        }

        const fileHash = await addFile(fileName, filePath);
        
        fs.unlink(filePath, (err) => {
            if (err) console.log(err);
        });

        const link = getLink(fileHash,fileName);
        // listUploads();
        console.log(link);
        res.status(200).send({msg: 'File uploaded!', link: link});
    })
});

async function addFile(fileName, filePath) {
    // Pack files into a CAR and send to web3.storage
    const files = await getFilesFromPath(filePath)
    const fileHash = await client.put(files)
    return fileHash
}

function getLink(fileHash, fileName) {
    return "https://"+fileHash+".ipfs.w3s.link/"+fileName
}

function getToken() {
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDJCMzdFZmJlZDFCNDNhZWNkRkM3RThhRjFkQTg2RkI0Y2Y1MDEwMDkiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2Njg5NjAxNzEwNDQsIm5hbWUiOiJoZWFsdGhBcHAifQ.oWtGq8EecLBhShX6nmLIaSqJUvoNUH8d0bAugvWa4i0";
}

function getClient() {
    return new Web3Storage({ token: getToken() })
}
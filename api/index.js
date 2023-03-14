import { Web3Storage, getFilesFromPath } from 'web3.storage';
import https from 'https';
import fileUpload from 'express-fileupload';
import CryptoJS from "crypto-js";
import fs from 'fs';
import bodyParser from 'body-parser';
import session from 'express-session';
import redis from 'redis';
import connectRedis from 'connect-redis';
import express from 'express';
import nodeLocalStorage from 'node-localstorage';
import {authenticatePatient,
        authenticateMedFacility,
        search, 
        searchPatientAccessList,
        insertRequest,
        getInstitutionNameFromID, 
        removeRequest,
        removeAccess,
        getLink,
        insertAccessList} from './helpers.js';
    
const LocalStorage = nodeLocalStorage.LocalStorage;

import pgClient from './database.js';
import pgClientMock from './mockDatabase.js';
import dotenv from 'dotenv';
import axios from 'axios';

let dbClient;
const app = express();
const PORT = 5000;

const RedisStore = connectRedis(session)
const redisClient = redis.createClient({
    legacyMode: true 
})
redisClient.connect().catch(console.error);
redisClient.on('error', function (err) {
    console.log('Could not establish a connection with redis. ' + err);
});
redisClient.on('connect', function (err) {
    console.log('Connected to redis successfully');
});

app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      saveUninitialized: true,
      secret: "ssshhhhh",
      resave: false,
      name: 'test',
      cookie: {
        secure: false,
        httpOnly: false, 
        maxAge:  24 * 60 * 60 * 1000 //in millisecond and right now saves for a day
    }
    })
  )

app.use(function (req, res, next) {
    if (!req.session) {
      return next(new Error("oh no"))
    }
    next() 
  })

app.use(fileUpload());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("src/view/"));

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

dotenv.config();
if (process.env.NODE_ENV === 'development'){
    dbClient = pgClient;
}
if (process.env.NODE_ENV === 'testing'){
    dbClient = pgClientMock;
}
dbClient.connect((err) => {
    if (err) {
        if (err !== 'Client has already been connected. You cannot reuse a client.');
    else
        throw new Error(err);
    }
});

app.post('/authenticatePatient', async (req, res) => {
    console.log("1st step login...")
    const { username, password } = req.body;
    const patient = await authenticatePatient(username, password);

    if (patient == null ){
        res.status(403).send({
            msg: 'Health card number or password is incorrect.',
        });
    } else {
        req.session.username = username;
        req.session.isPatient = true;
        req.session.links = []
        res.status(200).send({
            msg: 'Login step 1 successfull!',
            user: patient,
        });
    }
});

app.post('/authenticateWithLedger', async (req, res) => {
    console.log("2nd step login...")
    const { username, password, seed, identity } = req.body;
    const organization = "hospital";

    const hash = CryptoJS.SHA256(username);
    const encryptionKey = CryptoJS.AES.encrypt(seed, hash, { mode: CryptoJS.mode.ECB }).toString();

    const res_ledger = await axios.post('http://localhost:3001/login', { username, password, encryptionKey, identity, organization }).catch((err) => {
        console.error(err)
    });
    let patient;
    if (res_ledger && res_ledger.data)
        patient = res_ledger.data.user;
    if (patient == null ){
        res.status(403).send({
            msg: 'Health card number, password or secret key is incorrect.',
        });
    } else {
        req.session.user = patient
        req.session.token = res_ledger.data.token;
        axios.defaults.headers.common['authorization'] = req.session.token;
        res.status(200).send({
            msg: 'Login step 2 successfull!',
            user: patient,
        });
    }

});

app.get('/getUser', async (req,res) => {
    console.log(req.session.user)
    res.json(req.session.user)
});

app.post('/authenticateMedFacility', async (req, res) => {
    console.log(req.body);
    const { username, password } = req.body;
    // const medFacility1 = await authenticateMedFacility(username, password);
    // localStorage.setItem('currentUser', JSON.stringify(medFacility));
    const organization = "hospital";
    const identity = "doctor";
    const res_ledger = await axios.post('http://localhost:3001/login', { username, password, identity, organization }).catch((err) => {
        console.error(err)
    });
    let medFacility;
    if (res_ledger && res_ledger.data)
        medFacility = res_ledger.data.user;
    console.log("authenticating " + res_ledger.data.user)

    if (medFacility == null){
        res.status(403).send({
            msg: 'Institute ID or password is incorrect.',
        });
    } else {
        req.session.username = username;
        req.session.token = res_ledger.data.token;
        req.session.isPatient = false;
        req.session.links = []
        axios.defaults.headers.common['authorization'] = req.session.token;
        res.status(200).send({
            msg: 'Login successfull!',
            user: medFacility
        });
    }
});

app.post('/addPatient', async (req, res) =>  {
    const { firstName, lastName, email, HCNumber, password, seed } = req.body;
    if (!firstName.length || !lastName.length || !email.length || !HCNumber.length || !password.length)
        res.status(403).send({
            msg: 'User was not inserted into the db successfully.'
        });
      
    const data = [
        HCNumber,
        firstName,
        lastName,
        email,
        password,
    ];
    const hash = CryptoJS.SHA256(HCNumber);
    const encryptionKey = CryptoJS.AES.encrypt(seed, hash, { mode: CryptoJS.mode.ECB }).toString();

    const organization = "hospital"
    const identity = "patient"
    const username = HCNumber
    await axios.post('http://localhost:3001/patient', { firstName, lastName, email, username, password, encryptionKey, identity, organization }).catch((error) => {
        res.status(403).send({
            msg: 'User was not inserted into the db successfully.'
        });
    });

    const results = await dbClient.query('INSERT INTO public."Patients" VALUES ($1, $2, $3, $4, $5)', data);
    if (results.rowCount == 1)
        res.status(200).send({
            msg: 'User inserted into the db successfully.'
        });
    else
        res.status(403).send({
            msg: 'User was not inserted into the db successfully.'
        });
});

app.post('/addMFL', async (req, res) =>  {
    console.log(req.body);
    const { name, instituteID, email, password, userType } = req.body;
      
    const data = [
        instituteID,
        name,
        password,
    ];
    const organization = "hospital"
    const identity = "doctor"
 
    await axios.post('http://localhost:3001/doctor', { name, email, instituteID, password, identity, organization }).catch((error) => {
        res.status(403).send({error});
    });

    let results;
    if(userType == 'Laboratory') {
        results = await dbClient.query('INSERT INTO public."Labs" VALUES ($1, $2, $3)', data);
    } else {
        results = await dbClient.query('INSERT INTO public."Health_Providers" VALUES ($1, $2, $3)', data);
    }

    if (results && results.rowCount == 1)
        res.status(200).send({});
    else
        res.status(403).send({});
});

app.post('/search', async (req, res) => {
    const { HCNumber } = req.body;
    // const user = await search(HCNumber);
    const res_ledger = await axios.get(`http://localhost:3001/patients/${HCNumber}`).catch((err) => {
        res.status(404).send({
            msg: 'User does not exist. ' + err.message,
        });
    });

    if (res_ledger && res_ledger.status === 200) {
        const user = res_ledger.data;
        console.log(user)
        console.log("Found result for "+ user.username)
        res.status(200).send({
            msg: 'User Found!',
            user: user
        });
    }
});

app.post('/searchPatientAccessList', async (req, res) => {
    console.log("Check if MF has access...");
    const { HCNumber } = req.body;
    const instituteID = req.session.username;
    const userWithAccessGrant = await searchPatientAccessList(HCNumber,instituteID);

    if (userWithAccessGrant.length != 1){
        res.status(204).send({
            msg: 'User has not granted access.',
        });
    } else {
        res.status(200).send({
            msg: 'User has granted access!',
        });
    }
});

app.post('/requestAccess', async (req, res) => {
    const patient = req.body.patient;
    const instituteID = req.session.username;
    const update = await insertRequest(patient.username, instituteID);

    const res_ledger = await axios.post(`http://localhost:3001/patients/${patient.username}/pendingRequests/${instituteID}`).catch((err) => {
        console.error(err)
    });

    console.log("Added MF to patients requests: " + res_ledger.data.pendingRequests)
    if(update && update.rowCount == 1) {
        res.status(200).send({
            msg: 'Request Sent!',
        });
    } else {
        res.status(403).send({
            msg: 'Update unsuccessful.',
        });
    }
});

app.post('/getInstitutionNameFromID', async (req, res) => {
    console.log(req.body);
    const { ids } = req.body;
    const requestsMap = await getInstitutionNameFromID(ids);
    var obj = Object.fromEntries(requestsMap);
    var jsonString = JSON.stringify(obj);
    res.status(200).send({
        msg: 'Got names!',
        requestsString: jsonString,
    });
});

app.post('/denyRequest', async (req, res) => {
    console.log(req.body);
    const { HCNumber, instituteID } = req.body;
    const update = await removeRequest(HCNumber, instituteID);

    const res_ledger = await axios.delete(`http://localhost:3001/patients/${HCNumber}/pendingRequest/${instituteID}`).catch((err) => {
        console.error(err)
    });

    if(update && update.rowCount == 1) {
        res.status(200).send({
            msg: 'Deny Sent!',
        });
    } else {
        res.status(403).send({
            msg: 'Update unsuccessful.',
        });
    }
});

app.post('/removeAccess', async (req, res) => {
    const { HCNumber, instituteID } = req.body;
    const update = await removeAccess(HCNumber, instituteID);

    const res_ledger = await axios.delete(`http://localhost:3001/patients/${HCNumber}/approvedRequests/${instituteID}`).catch((err) => {
        console.error(err)
    });
    
    if(update && update.rowCount == 1 && res_ledger.status == 200) {
        res.status(200).send({
            msg: 'Revoked Access!',
        });
    } else {
        res.status(403).send({
            msg: 'Update unsuccessful.',
        });
    }
});

app.post('/insertAccessList', async (req, res) => {
    const { HCNumber, instituteID, seed } = req.body;
    const update = await insertAccessList(HCNumber, instituteID);
    const removal = await removeRequest(HCNumber, instituteID);

    const patient = await search(HCNumber);
    const password = patient[0].password;

    const hash = CryptoJS.SHA256(HCNumber);
    const encryptionKey = CryptoJS.AES.encrypt(seed, hash, { mode: CryptoJS.mode.ECB }).toString();

    const res_ledger = await axios.post(`http://localhost:3001/patients/${HCNumber}/approvedRequests/${instituteID}`, { encryptionKey: encryptionKey, password: password }).catch((err) => {
        console.error(err)
    });

    if(update && update.rowCount == 1 && removal && removal.rowCount == 1 && res_ledger.status == 200) {
        res.status(200).send({
            msg: 'Granted Access!',
        });
    } else {
        res.status(403).send({
            msg: 'Access grant failed.',
        });
    }
});

app.get('/current-session', (req, res) => {
    let sess = req.session;
    if(sess.token) {
        return res.send(true);
    }
    return res.send(false);
});

app.get('/isPatient', (req, res) => {
    let sess = req.session;
    if(sess.isPatient) {
        return res.send(true);
    }
    return res.send(false);
});

app.get('/logout',(req,res) => {
    console.log("logging out now...")
    req.session.destroy((err) => {
        if(err) {
            console.log(err);
            return res.status(500).send(err);
        }
        localStorage.clear();
        res.status(200).send({});
    });

});
const localStorage = new LocalStorage('./scratch');
async function addFile(fileName, filePath) {
    // Pack files into a CAR and send to web3.storage
    const file = await getFilesFromPath(filePath)
    const fileHash = await client.put(file)
    return fileHash
}

function getToken() {
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDJCMzdFZmJlZDFCNDNhZWNkRkM3RThhRjFkQTg2RkI0Y2Y1MDEwMDkiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2Njg5NjAxNzEwNDQsIm5hbWUiOiJoZWFsdGhBcHAifQ.oWtGq8EecLBhShX6nmLIaSqJUvoNUH8d0bAugvWa4i0";
}

function getClient() {
    return new Web3Storage({ token: getToken() })
}

app.get('/queryFileFromIPFS', async (req, res) => {

    try {
        let ipfsHash = "bafybeif4zgqaiaoslxztmfvjp5ulvvpg3hpm45s7kabdkbynvwni2fjax4";
        let ipfsFileName = "first";
        let downloadedFile = await retrieveFile(ipfsHash, ipfsFileName);
        // downloadedFile = DECRYPT HEREEEEEE

        fs.access(downloadedFile, function (exists) {
            if (exists) {
                res.writeHead(200, {
                });
                fs.createReadStream(downloadedFile).pipe(res);

            } else {
                res.writeHead(400, { "Content-Type": "text/plain" });
                res.end("ERROR File does not exist");
            }
        });
    } catch (err) {
        res.status(500).send(err);
    }
});

async function retrieveFile(cid, fileName = "first") {
    fileName = "../public/" + fileName+".pdf";
    const file = fs.createWriteStream(fileName);
    const link = getLink(cid,"first")
    const request = https.get(link, function (response) {
        response.pipe(file);
    });
    return fileName;
  }

app.get('/getFilesFromLedger', async (req, res) => {
    const fileName = "first" // req.body.fileName
    const cid = "bafybeif4zgqaiaoslxztmfvjp5ulvvpg3hpm45s7kabdkbynvwni2fjax4"  // req.body.cid
    const link = getLink(cid,fileName);
    console.log(link)
    const files = [{link: link, name: fileName}]
    res.status(200).send({files: files});
})

app.post('/upload', (req, res) =>  {
    const file = req.files.file;
    const fileName = req.body.fileName;
    const currentPatient = req.body.currentPatient; //use to save for a specific patient
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
        localStorage.setItem('link',link);
        var links = req.session.links || [];  
        links.push(link);
        // listUploads();
        console.log(link);
        return res.status(200).send({msg: 'File uploaded!', link: link});
    })
});

app.get('/getLink', (req,res) => {
    if (localStorage.getItem('link')) {
        const link = localStorage.getItem('link');
        console.log(req.session);
        return res.status(200).send({link: req.session.links});
    }
    return res.status(200).send({link: null});
});

export default app;

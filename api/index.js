import { Web3Storage, getFilesFromPath } from 'web3.storage';
import fileUpload from 'express-fileupload';
import fs from 'fs';
import bodyParser from 'body-parser';
import session from 'express-session';
import redis from 'redis';
import connectRedis from 'connect-redis';
import express from 'express';
import nodeLocalStorage from 'node-localstorage';
const LocalStorage = nodeLocalStorage.LocalStorage;

import { Patient, MedFacility } from '../public/types.js';
import pgClient from './database.js';

const app = express();
const PORT = 5000;

// const RedisStore = connectRedis(session)
// const redisClient = redis.createClient({
//     legacyMode: true 
// })
// redisClient.connect().catch(console.error);
// redisClient.on('error', function (err) {
//     console.log('Could not establish a connection with redis. ' + err);
// });
// redisClient.on('connect', function (err) {
//     console.log('Connected to redis successfully');
// });

app.use(
    session({
    //   store: new RedisStore({ client: redisClient }),
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
pgClient.connect();

async function authenticatePatient(username, password) {
    console.log('usa', username);
    console.log('pass', password);

    const results = await pgClient.query('SELECT health_card_number, first_name, password, requests FROM public."Patients" WHERE health_card_number=$1', [username]);
    if (!results.rows.length) {
        return null;
    } else if (password == results.rows[0].password) {
        const patient = new Patient(username, results.rows[0].first_name, results.rows[0].requests);
        return patient;
    } else {
        return null;
    }
}

async function authenticateMedFacility(username, password) {
    console.log('usa', username);
    console.log('pass', password);

    const results = await pgClient.query('SELECT institute_id, name, password FROM public."Health_Providers" WHERE institute_id=$1', [username]);
    if (!results.rows.length) {
        return null;
    } else if (password == results.rows[0].password) {
        const medFacility = new MedFacility(username, results.rows[0].name);
        return medFacility;
    } else {
        return null;
    }
}

async function search(HCNumber) {
    const results = await pgClient.query('SELECT * from public."Patients" WHERE health_card_number=$1', [HCNumber]);
    return results.rows;
}

async function insertRequest(HCNumber, instituteID) {
    const results = await pgClient.query('UPDATE public."Patients" SET requests=array_append(requests, $1) WHERE health_card_number=$2', [instituteID, HCNumber]);
    return results;
}

async function getInstitutionNameFromID(ids) {
    let map = new Map();
    for (let i = 0; i<ids.length; i++) {
        const results = await pgClient.query('SELECT name from public."Health_Providers" WHERE institute_id=$1', [ids[i]]);
        if (results.rowCount == 1){
            map.set(ids[i],results.rows[0].name);
        }
    }
    return map;
}

async function denyRequest(HCNumber, instituteID) {
    const results = await pgClient.query('UPDATE public."Patients" SET requests=array_remove(requests, $1) WHERE health_card_number=$2', [instituteID, HCNumber]);
    return results;
}

app.post('/authenticatePatient', async (req, res) => {
    console.log(req.body);
    const { username, password } = req.body;
    const patient = await authenticatePatient(username, password);

    if (patient == null){
        res.status(403).send({
            msg: 'Health card number or password is incorrect.',
        });
    } else {
        req.session.username = username;
        req.session.password = password;
        req.session.links = []
        console.log(req.session)
        res.status(200).send({
            msg: 'Login successfull!',
            user: patient,
        });
    }
});

app.post('/authenticateMedFacility', async (req, res) => {
    console.log(req.body);
    const { username, password } = req.body;
    const medFacility = await authenticateMedFacility(username, password);

    if (medFacility == null){
        res.status(403).send({
            msg: 'Institute ID or password is incorrect.',
        });
    } else {
        req.session.username = username;
        req.session.password = password;
        req.session.links = []
        console.log(req.session)
        res.status(200).send({
            msg: 'Login successfull!',
            user: medFacility
        });
    }
});

app.post('/addPatient', async (req, res) =>  {
    console.log(req.body);
    const { name, lastName, email, HCNumber, password } = req.body;
      
    const data = [
        HCNumber,
        name,
        lastName,
        email,
        password,
    ];

    const results = await pgClient.query('INSERT INTO public."Patients" VALUES ($1, $2, $3, $4, $5)', data);
    if (results.rowCount == 1)
        res.status(200).send({});
    else
        res.status(403).send({});
});

app.post('/addMFL', async (req, res) =>  {
    console.log(req.body);
    const { name, instituteID, password, userType } = req.body;
      
    const data = [
        instituteID,
        name,
        password,
    ];

    let results;
    if(userType == 'Laboratory') {
        results = await pgClient.query('INSERT INTO public."Labs" VALUES ($1, $2, $3)', data);
    } else {
        results = await pgClient.query('INSERT INTO public."Health_Providers" VALUES ($1, $2, $3)', data);
    }

    if (results && results.rowCount == 1)
        res.status(200).send({});
    else
        res.status(403).send({});
});

app.post('/search', async (req, res) => {
    console.log(req.body);
    const { HCNumber } = req.body;
    const user = await search(HCNumber);

    if (!user || user.length != 1){
        res.status(403).send({
            msg: 'User does not exist.',
        });
    } else {
        res.status(200).send({
            msg: 'User Found!',
            user: user[0]
        });
    }
});

app.post('/requestAccess', async (req, res) => {
    console.log(req.body);
    const { HCNumber } = req.body;
    const instituteID = req.session.username;
    const update = await insertRequest(HCNumber, instituteID);
    if(update.rowCount == 1) {
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
    const update = await denyRequest(HCNumber, instituteID);
    if(update.rowCount == 1) {
        res.status(200).send({
            msg: 'Deny Sent!',
        });
    } else {
        res.status(403).send({
            msg: 'Update unsuccessful.',
        });
    }
});

app.get('/current-session', (req, res) => {
    let sess = req.session;
    if(sess.username) {
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

        const link = await getLink(fileHash,fileName);
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

async function addFile(fileName, filePath) {
    // Pack files into a CAR and send to web3.storage
    const file = await getFilesFromPath(filePath)
    const fileHash = await client.put(file)
    return fileHash
}

async function getLink(fileHash, fileName) {
    return "https://"+fileHash+".ipfs.w3s.link/"+fileName;
}

function getToken() {
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDJCMzdFZmJlZDFCNDNhZWNkRkM3RThhRjFkQTg2RkI0Y2Y1MDEwMDkiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2Njg5NjAxNzEwNDQsIm5hbWUiOiJoZWFsdGhBcHAifQ.oWtGq8EecLBhShX6nmLIaSqJUvoNUH8d0bAugvWa4i0";
}

function getClient() {
    return new Web3Storage({ token: getToken() })
}

export default app;

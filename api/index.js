// import authenticate from '../src/Authenticate';
const { Web3Storage, getFilesFromPath } = require('web3.storage');
const fileUpload = require('express-fileupload');
const fs = require("fs");
const { parse } = require("csv-parse");
const getStream = require('get-stream');
const bodyParser = require('body-parser');
const fastcsv = require('fast-csv');
const session = require('express-session');
const redis = require('redis');
const connectRedis = require('connect-redis');
const express = require('express');

const LocalStorage = require('node-localstorage').LocalStorage;

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

async function authenticate(username, password) {
    console.log('usa', username);
    console.log('pass', password);
    let patients = {};
    let medFacilities = {};

    const patientParseStream = parse({delimiter: ',', from_line: 2});
    const patientData = await getStream.array(fs.createReadStream("../src/Patients.csv").pipe(patientParseStream));
    for (let i = 0; i<patientData.length; i+=1) {
        let row = patientData[i];
        patients[row[0]] = new Patients(row[0],row[1],row[2],row[3],row[4],true);
    }

    const medParseStream = parse({delimiter: ',', from_line: 2});
    const medFacilData = await getStream.array(fs.createReadStream("../src/MedicalFacilities.csv").pipe(medParseStream));
    for (let i = 0; i<medFacilData.length; i+=1) {
        let row = medFacilData[i];
        medFacilities[row[0]] = new MedFacilities(row[0],row[1],row[2],false);
    }

    if (!patients[username] && !medFacilities[username]) {
        return ['fail',null];
    } else if (patients[username]) {
        if (patients[username].password !== password)
            return ['fail',null];
        else {
            return ['patient',patients[username]];
        }
    } else if (medFacilities[username]) {
        if (medFacilities[username].password !== password)
            return ['fail', null];
        else {
            return ['medicalFacility',medFacilities[username]];
        }
    }
}

app.post('/authenticate', async (req, res) => {
    console.log(req.body);
    const { username, password } = req.body;
    const [loggedIn, user] = await authenticate(username, password);
    console.log(loggedIn);

    if (loggedIn == 'fail'){
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
            userType: loggedIn,
            user: user
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

class Patients {
    constructor(HCNumber, name, surname, email, password,isPatient) {
        this.HCNumber = HCNumber;
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.password = password;
        this.isPatient = isPatient;
    }
}

class MedFacilities {
    constructor(orgNumber, name, password,isPatient) {
        this.orgNumber = orgNumber;
        this.name = name;
        this.password = password;
        this.isPatient = isPatient;
    }
}
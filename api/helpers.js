import { Patient, MedFacility } from '../public/types.js';
import dotenv from 'dotenv';
import pgClient from './database.js';
import pgClientMock from './mockDatabase.js';

let dbClient;
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

async function authenticatePatient(username, password) {
    const results = await dbClient.query('SELECT health_card_number, first_name, password, requests FROM public."Patients" WHERE health_card_number=$1', [username]);

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
    const results = await dbClient.query('SELECT institute_id, name, password FROM public."Health_Providers" WHERE institute_id=$1', [username]);
   
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
    const results = await dbClient.query('SELECT * from public."Patients" WHERE health_card_number=$1', [HCNumber]);
    return results.rows;
}

async function insertRequest(HCNumber, instituteID) {
    if ((!instituteID || !HCNumber) && process.env.NODE_ENV === 'development')
        return null;

    const results = await dbClient.query('UPDATE public."Patients" SET requests=array_append(requests, $1) WHERE health_card_number=$2', [instituteID, HCNumber]);
    return results;
}

async function getInstitutionNameFromID(ids) {
    let map = new Map();
    for (let i = 0; i<ids.length; i++) {
        const results = await dbClient.query('SELECT name from public."Health_Providers" WHERE institute_id=$1', [ids[i]]);
        if (results.rowCount == 1){
            map.set(ids[i],results.rows[0].name);
        }
    }
    return map;
}

async function denyRequest(HCNumber, instituteID) {
    if ((!instituteID || !HCNumber) && process.env.NODE_ENV === 'development')
        return null;

    const results = await dbClient.query('UPDATE public."Patients" SET requests=array_remove(requests, $1) WHERE health_card_number=$2', [instituteID, HCNumber]);
    return results;
}

async function getLink(fileHash, fileName) {
    return "https://"+fileHash+".ipfs.w3s.link/"+fileName;
}

export  {authenticatePatient,
        authenticateMedFacility,
        search, 
        insertRequest,
        getInstitutionNameFromID, 
        denyRequest, 
        getLink}

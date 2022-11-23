const fs = require("fs");
const { parse } = require("csv-parse");

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

export default authenticate;
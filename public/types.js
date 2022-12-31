class Patient {
    constructor(HCNumber, name, requests, surname='', email='', password='') {
        this.HCNumber = HCNumber;
        this.name = name;
        this.requests = requests;
        this.surname = surname;
        this.email = email;
        this.password = password;
    }
}

class MedFacility {
    constructor(instituteID, name, password='') {
        this.instituteID = instituteID;
        this.name = name;
        this.password = password;
    }
}

export { Patient, MedFacility };

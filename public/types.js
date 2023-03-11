class Patient {
    constructor(HCNumber, name, requests, access_list, password='', surname='', email='') {
        this.HCNumber = HCNumber;
        this.name = name;
        this.requests = requests;
        this.surname = surname;
        this.email = email;
        this.password = password;
        this.access_list = access_list;
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

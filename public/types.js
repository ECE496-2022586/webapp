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

export { Patients, MedFacilities };
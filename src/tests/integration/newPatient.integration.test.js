import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../api/index.js';
import { should } from 'chai';

chai.use(chaiHttp);
should();

describe('Add Patient endpoints', () => {
    afterEach((done)=>{
        done();
    });

    describe('/POST addPatient', () => {
        it('returns 200 with correct information', (done) => {
            const reqBody = { 
                name: 'new', 
                lastName: 'patient', 
                email: 'new.patient@gmail.com',
                HCNumber: '123456789890NP',
                password: 'newPatient'
            };

            chai.request(app)
            .post('/addPatient')
            .send(reqBody)
            .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                done();
            });
        });
    });
});

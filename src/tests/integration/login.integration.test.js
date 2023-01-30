import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../api/index.js';
import { should } from 'chai';

chai.use(chaiHttp);
should();

describe('Login endpoints', () => {
    afterEach((done)=>{
        done();
    });

    describe('/POST authenticatePatient', () => {
        it('returns 200 with correct crdentials', (done) => {
            const reqBody = {
                username: '0000000000AA',
                password: 'elmo'
            };

            chai.request(app)
            .post('/authenticatePatient')
            .send(reqBody)
            .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.user.should.not.be.equal(null);
                    res.body.msg.should.be.equal('Login successfull!');
                done();
            });
        });
        it('returns 403 with incorrect crdentials', (done) => {
            const reqBody = {
                username: '0000000000AA',
                password: 'bigBird'
            };

            chai.request(app)
            .post('/authenticatePatient')
            .send(reqBody)
            .end((err, res) => {
                    res.should.have.status(403);
                    res.body.should.be.a('object');
                    res.body.msg.should.be.equal('Health card number or password is incorrect.');
                done();
            });
        });
    });
    describe('/POST authenticateMedFacility', () => {
        it('returns 200 with correct crdentials', (done) => {
            const reqBody = {
                username: '123456789',
                password: 'sunnyBrook'
            };

            chai.request(app)
            .post('/authenticateMedFacility')
            .send(reqBody)
            .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.user.should.not.be.equal(null);
                    res.body.msg.should.be.equal('Login successfull!');
                done();
            });
        });
        it('returns 403 with incorrect crdentials', (done) => {
            const reqBody = {
                username: '123456789',
                password: 'hospital'
            };

            chai.request(app)
            .post('/authenticateMedFacility')
            .send(reqBody)
            .end((err, res) => {
                    res.should.have.status(403);
                    res.body.should.be.a('object');
                    res.body.msg.should.be.equal('Institute ID or password is incorrect.');
                done();
            });
        });
    });

    describe('/POST getInstitutionNameFromID', () => {
        it('returns 200 with correct instituteIDs', (done) => {
            const reqBody = {
                ids: ['1234566789', '234567891'],
            };

            chai.request(app)
            .post('/getInstitutionNameFromID')
            .send(reqBody)
            .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.requestsString.should.not.be.a('json');
                    res.body.msg.should.be.equal('Got names!');
                done();
            });
        });
    });
});

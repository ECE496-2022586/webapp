// let mongoose = require("mongoose");
// let Book = require('../app/models/book');

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
            }

            chai.request(app)
            .post('/authenticatePatient')
            .send(reqBody)
            .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.msg.should.be.equal('Login successfull!');
                done();
            });
        });
        it('returns 403 with incorrect crdentials', (done) => {
            const reqBody = {
                username: '0000000000AA',
                password: 'bigBird'
            }

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
        it('returns 403 with non-existing crdentials', (done) => {
            const reqBody = {
                username: 'non-existing',
                password: 'elmo'
            }

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
            }

            chai.request(app)
            .post('/authenticateMedFacility')
            .send(reqBody)
            .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.msg.should.be.equal('Login successfull!');
                done();
            });
        });
        it('returns 403 with incorrect crdentials', (done) => {
            const reqBody = {
                username: '123456789',
                password: 'hospital'
            }

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
        it('returns 403 with non-existing crdentials', (done) => {
            const reqBody = {
                username: 'non-existing',
                password: 'sunnyBrook'
            }

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
});

import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../api/index.js';
import sinon from 'sinon';
import { should } from 'chai';
import { insertRequest } from '../../../api/helpers.js';

chai.use(chaiHttp);
should();

describe('Medical Facility Dashbaord endpoints', () => {
    afterEach((done)=>{
        done();
    });

    describe('/POST search', () => {
        it('returns 200 with existing healthcard number', (done) => {
            const HCNumber = '0000000000AA';

            chai.request(app)
            .post('/search')
            .send({ HCNumber })
            .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.user.should.not.be.equal(null);
                    res.body.msg.should.be.equal('User Found!');
                done();
            });
        });
    });
    describe('/POST requestAccess', () => {
        it('returns 200 with existing healthcard number', (done) => {
            const HCNumber = '0000000000AA';

            chai.request(app)
            .post('/requestAccess')
            .send({HCNumber})
            .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.msg.should.be.equal('Request Sent!');
                done();
            });
        });
    });
});

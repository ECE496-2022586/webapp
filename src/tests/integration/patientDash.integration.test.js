import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../api/index.js';
import { should } from 'chai';

chai.use(chaiHttp);
should();

describe('Patient Dash endpoints', () => {
    afterEach((done)=>{
        done();
    });

    describe('/POST denyRequest', () => {
        it('returns 200 with correct HCNumber and instituteID', (done) => {
            const reqBody = {
                HCNumber:  '0000000000AA',
                instituteID: '123456789'
            }

            chai.request(app)
            .post('/denyRequest')
            .send(reqBody)
            .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.msg.should.be.equal('Deny Sent!');
                done();
            });
        });
    });
});

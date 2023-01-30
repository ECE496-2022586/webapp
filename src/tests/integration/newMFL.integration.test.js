import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../api/index.js';
import { should } from 'chai';

chai.use(chaiHttp);
should();

describe('Add MFL endpoints', () => {
    afterEach((done)=>{
        done();
    });

    describe('/POST addMFL', () => {
        it('returns 200 with correct information for a Laboratory', (done) => {
            const reqBody = { 
                name: 'New Lab',
                instituteID: '123',
                password: 'newLab', 
                userType: 'Laboratory'
            };

            chai.request(app)
            .post('/addMFL')
            .send(reqBody)
            .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                done();
            });
        });
        it('returns 200 with correct information for a Medical Facility', (done) => {
            const reqBody = { 
                name: 'New Lab',
                instituteID: '123',
                password: 'newLab', 
                userType: 'Medical Facility'
            };

            chai.request(app)
            .post('/addMFL')
            .send(reqBody)
            .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                done();
            });
        });
    });
});

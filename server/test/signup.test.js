import request from 'supertest';
import { stub } from 'sinon';
import server from '../app';
import database from '../config/database';
import User from '../models/userModel';
import Dashboard from '../models/dashboardModel';

server.close();
describe('Sign up API test', () => {
  let requestBody;
  beforeEach(() => {
    requestBody = {
      name: 'Batman',
      email: 'bruce@wayneEnterpise.com',
      password: 'batman',
    };
  });

  afterAll(() => {
    server.close();
    database.disconnectDB();
  });

  it('should throw error if email not passed', (done) => {
    requestBody.email = '';
    request(server)
      .post('/signup')
      .send(requestBody)
      .expect(400, done);
  });

  it('should throw error if password not passed', (done) => {
    requestBody.password = '';
    request(server)
      .post('/signup')
      .send(requestBody)
      .expect(400, done);
  });

  it('should throw error if email not in correct format', (done) => {
    requestBody.email = 'bruce';
    request(server)
      .post('/signup')
      .send(requestBody)
      .expect(400, done);
  });

  it('should throw error if email not in correct format', (done) => {
    requestBody.email = 'bruce';
    request(server)
      .post('/signup')
      .send(requestBody)
      .expect(400, done);
  });

  it('should throw error if email is existing', (done) => {
    const finOneStub = stub(User, 'findOne').returns('email');
    const saveStub = stub(User.prototype, 'save').returns(null);
    request(server)
      .post('/signup')
      .send(requestBody)
      .expect(400)
      .end((err) => {
        if (err) return done(err);
        finOneStub.restore();
        saveStub.restore();
        return done();
      });
  });

  it('should save user if evrything is correct', (done) => {
    const findOneUser = stub(User, 'findOne').returns(null);
    const saveUser = stub(User.prototype, 'save').returns({ _id: 'batmansecretid' });
    const saveDashboard = stub(Dashboard.prototype, 'save').returns(null);
    request(server)
      .post('/signup')
      .send(requestBody)
      .expect(200)
      .end((err) => {
        if (err) return done(err);
        findOneUser.restore();
        saveUser.restore();
        saveDashboard.restore();
        return done();
      });
  });
});

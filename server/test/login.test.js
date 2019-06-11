import request from 'supertest';
import { stub } from 'sinon';
import server from '../app';
import database from '../config/database';
import User from '../models/userModel';

const dbValidUser = {
  email: 'bruce@wayneEnterprise.com',
  password: 'batman',
};

const loginIn = data => request(server)
  .post('/login')
  .send(data);

const onLoginResponse = (data, done, expectedStatusCode, onResponse = () => {}) => {
  const userObj = new User(dbValidUser);

  const validatePassword = stub(User.prototype, 'validatePassword').returns(
    pswd => pswd === dbValidUser.password,
  );
  const findOneUser = stub(User, 'findOne').returns(userObj);

  request(server)
    .post('/login')
    .send(data)
    .expect(expectedStatusCode)
    .end((err, res) => {
      if (err) return done(err);
      findOneUser.restore();
      validatePassword.restore();
      onResponse(res);
      return done();
    });
};

describe('Login API test', () => {
  let data;
  beforeEach(() => {
    data = Object.assign({}, dbValidUser);
  });

  afterAll(() => {
    server.close();
    database.disconnectDB();
  });

  it("should response with 400 if email isn't passed", (done) => {
    data.email = '';
    loginIn(data).expect(400, done);
  });

  it("should response with 400 if password isn't passed", (done) => {
    data.password = '';
    loginIn(data).expect(400, done);
  });

  it("should response with 400 if email isn't in correct format", (done) => {
    data.email = 'bruce';
    loginIn(data).expect(400, done);
  });

  it("should response with 400 if email & password isn't passed", (done) => {
    data = {};
    onLoginResponse(data, done, 400, (res) => {
      if (res.isSuccess) return done(false);
      return done();
    });
  });

  it('should response isSuccess as false if username & password is incorrect', (done) => {
    data.password = '61555';
    onLoginResponse(data, done, 200, (res) => {
      if (!res.isSuccess) return done(false);
      return done();
    });
  });

  it('should login user if username & password is correct', (done) => {
    onLoginResponse(data, done, 200, (res) => {
      if (!res.isSuccess) return done(false);
      return done();
    });
  });
});

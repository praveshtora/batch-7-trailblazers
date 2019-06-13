import request from 'supertest';
import { stub } from 'sinon';
import server from '../app';
import database from '../config/database';
import Board from '../models/boardModel';
import Dashboard from '../models/dashboardModel';

server.close();
describe('Dashboard screen APIs', () => {
  beforeEach(() => {
    server.close();
    database.disconnectDB();
  });
  describe('Add dashboard API', () => {
    let requestBody;
    const userId = '5cf9425d064475090357aa87';
    beforeEach(() => {
      requestBody = {
        name: 'Pesto',
        lifecycles: ['to-do', 'in-progress', 'done']
      };
    });

    afterAll(() => {
      server.close();
      database.disconnectDB();
    });

    test('Should return 404 if user id not passed in params found', done => {
      request(server)
        .post('/dashboard/add')
        .send(requestBody)
        .expect(404, done);
    });

    test('Should return 400 if board name not provided', done => {
      requestBody.name = '';
      request(server)
        .post(`/dashboard/add/${userId}`)
        .send(requestBody)
        .expect(400, done);
    });

    test('Should return 400 if board lifecycle is required not provided', done => {
      requestBody.lifecycles = [];
      request(server)
        .post(`/dashboard/add/${userId}`)
        .send(requestBody)
        .expect(400, done);
    });

    test('Should return 200 if board name and userid provided', done => {
      const save = stub(Board.prototype, 'save').returns({
        _id: 'test',
        name: 'Pesto'
      });
      const findOneDashboard = stub(Dashboard, 'findOneAndUpdate').returns({
        userId
      });
      request(server)
        .post(`/dashboard/add/${userId}`)
        .send(requestBody)
        .expect(200)
        .end(err => {
          if (err) return done(err);
          save.restore();
          findOneDashboard.restore();
          return done();
        });
    });
  });
  describe('Test boards list  API', () => {
    afterAll(() => {
      server.close();
      database.disconnectDB();
    });
    const userId = '5cf9425d064475090357aa87';
    const resultObject = {
      isSuccess: true,
      message: '',
      data: [
        {
          name: 'amazon',
          owner: {
            _id: Object('5cf9425d064475090357aa87'),
            name: 'manish zanzad'
          }
        },
        {
          name: 'flipkat',
          owner: {
            _id: Object('5cf9425d064475090357aa87'),
            name: 'manish zanzad'
          }
        }
      ]
    };

    test('Should return 200', done => {
      const findOneDashboard = stub(Dashboard, 'findOne').returns({
        _id: 'sadsds',
        populate: () => {
          return {
            boards: []
          };
        }
      });
      const populateDashboard = stub(Dashboard.prototype, 'populate').returns(
        resultObject.data
      );

      request(server)
        .get(`/dashboard/getboards/${userId}`)
        .expect(200, () => {
          findOneDashboard.restore();
          populateDashboard.restore();

          done();
        });
    });
  });
});

import request from 'supertest';
import { stub } from 'sinon';
import server from '../app';
import database from '../config/database';
import Board from '../models/boardModel';
import Dashboard from '../models/dashboardModel';

server.close();
describe('Dashboard screen APIs', () => {
  describe('Add dashboard API', () => {
    let requestBody;
    const userId = '5cf9425d064475090357aa87';
    beforeEach(() => {
      requestBody = {
        name: 'Pesto',
        lifecycles: ['to-do', 'in-progress', 'done'],
      };
    });

    afterAll(() => {
      server.close();
      database.disconnectDB();
    });

    test('Should return 404 if user id not passed in params found', (done) => {
      request(server)
        .post('/dashboard/add')
        .send(requestBody)
        .expect(404, done);
    });

    test('Should return 400 if board name not provided', (done) => {
      requestBody.name = '';
      request(server)
        .post(`/dashboard/add/${userId}`)
        .send(requestBody)
        .expect(400, done);
    });

    test('Should return 400 if board lifecycle is required not provided', (done) => {
      requestBody.lifecycles = [];
      request(server)
        .post(`/dashboard/add/${userId}`)
        .send(requestBody)
        .expect(400, done);
    });

    test('Should return 200 if board name and userid provided', (done) => {
      const save = stub(Board.prototype, 'save').returns({ _id: 'test', name: 'Pesto' });
      const findOneDashboard = stub(Dashboard, 'findOneAndUpdate').returns({ userId });
      request(server)
        .post(`/dashboard/add/${userId}`)
        .send(requestBody)
        .expect(200)
        .end((err) => {
          if (err) return done(err);
          save.restore();
          findOneDashboard.restore();
          return done();
        });
    });
  });
});

import request from 'supertest';
import { stub, mock } from 'sinon';
import server from '../app';
import database from '../config/database';
import Board from '../models/boardModel';
import Dashboard from '../models/dashboardModel';
import 'sinon-mongoose';

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
        lifeCycles: ['to-do', 'in-progress', 'done'],
      };
    });

    afterAll(() => {
      server.close();
      database.disconnectDB();
    });

    test('Should return 400 if board name not provided', (done) => {
      requestBody.name = '';
      request(server)
        .post('/dashboard/add')
        .send(requestBody)
        .expect(400, done);
    });

    test('Should return 400 if board lifecycle is required not provided', (done) => {
      requestBody.lifeCycles = [];
      request(server)
        .post('/dashboard/add')
        .send(requestBody)
        .expect(400, done);
    });

    test('Should return 200 if board name and userid provided', (done) => {
      const save = stub(Board.prototype, 'save').returns({
        _id: 'test',
        name: 'Pesto',
      });
      const findOneDashboard = stub(Dashboard, 'findOneAndUpdate').returns({
        userId,
      });
      request(server)
        .post('/dashboard/add')
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
  describe('Test boards list  API', () => {
    afterAll(() => {
      server.close();
      database.disconnectDB();
    });
    const resultObject = {
      isSuccess: true,
      message: '',
      data: [
        {
          name: 'amazon',
          owner: {
            _id: Object('5cf9425d064475090357aa87'),
            name: 'manish zanzad',
          },
        },
        {
          name: 'flipkat',
          owner: {
            _id: Object('5cf9425d064475090357aa87'),
            name: 'manish zanzad',
          },
        },
      ],
    };

    test('Should return 200', (done) => {
      const dashBoard = mock(Dashboard);
      dashBoard
        .expects('findOne')
        .withArgs({ userId: '5cf9425d064475090357aa87' })
        .chain('populate')
        .withArgs({
          path: 'boards',
          select: { id: 1, name: 1, owner: 1 },
          populate: {
            path: 'owner',
            select: { name: 1 },
          },
        })
        .resolves(resultObject);

      request(server)
        .get('/dashboard/getboards')
        .expect(200, () => done());
    });
  });
});

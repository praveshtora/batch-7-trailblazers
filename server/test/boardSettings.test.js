import request from 'supertest';
import { stub } from 'sinon';
import server from '../app';
import database from '../config/database';
import Board from '../models/boardModel';

server.close();
describe('Get board team members', () => {
  beforeEach(() => {
    server.close();
    database.disconnectDB();
  });
  afterEach(() => {
    server.close();
    database.disconnectDB();
  });
  describe('Get board team members', () => {
    afterAll(() => {
      server.close();
      database.disconnectDB();
    });
    const resultObject = {
      id: 12,
      name: 'Satellite',
      lifeCycles: ['to-do'],
      owner: '22',
      members: [
        {
          user: '22',
          role: 'SUPER_ADMIN',
        },
        {
          user: '23',
          role: 'ADMIN',
        },
      ],
    };
    const boardId = 12;

    test('return 400 if board id not passed', (done) => {
      request(server)
        .get('/board/members/')
        .expect(400, done);
    });
    test('return 400 if board id not valid', (done) => {
      request(server)
        .get('/board/members/sdf')
        .expect(400, done);
    });
    test('return 200', (done) => {
      const findOneBoard = stub(Board, 'findOne').returns({
        _id: 'dsdds',
        populate: () => ({
          members: resultObject.members,
        }),
      });

      const populateBoard = stub(Board.prototype, 'populate').returns(
        resultObject.members,
      );
      request(server)
        .get(`/board/members/${boardId}`)
        .expect(200, () => {
          findOneBoard.restore();
          populateBoard.restore();
          done();
        });
    });
  });

  describe('Update board team member', () => {
    afterAll(() => {
      server.close();
      database.disconnectDB();
    });
    const boardId = 12;
    const requestBody = {
      role: 'ADMIN',
      member: 'abc',
    };
    test('return 404 if board id not passed', (done) => {
      request(server)
        .patch('/board/member/')
        .expect(404, done);
    });

    test('return 400 if role is not present', (done) => {
      request(server)
        .patch(`/board/member/${boardId}`)
        .send({ role: 'ADMIN' })
        .expect(400, done);
    });
    test('return 200', (done) => {
      const findOneAndUpdate = stub(Board, 'findOneAndUpdate').returns({});

      request(server)
        .patch(`/board/member/${boardId}`)
        .send(requestBody)
        .expect(200, () => {
          findOneAndUpdate.restore();
          done();
        });
    });
  });
});

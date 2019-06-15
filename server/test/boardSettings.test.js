import request from 'supertest';
import { stub } from 'sinon';
import server from '../app';
import database from '../config/database';
import Board from '../models/boardModel';
import Issue from '../models/issueModel';

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

  describe('Add issue to board', () => {
    afterAll(() => {
      server.close();
      database.disconnectDB();
    });
    const boardId = 12;
    const requestBody = {
      title: 'Create Project structure',
      description: 'create client and server projects',
      assignee: '',
      dueDate: '',
    };
    test('return 404 if board id not passed', (done) => {
      request(server)
        .patch('/board/issue/add/')
        .expect(404, done);
    });

    test('return 400 if title is not present', (done) => {
      request(server)
        .post(`/board/issue/add/${boardId}`)
        .send({ description: 'create client and server projects', assignee: '', dueDate: '' })
        .expect(400, done);
    });
    test('return 200', (done) => {
      const findOne = stub(Board, 'findOne').returns({ _id: 'fddsdscsd' });
      const save = stub(Issue.prototype, 'save').returns({ _id: '222222' });
      const findOneAndUpdate = stub(Board, 'findOneAndUpdate').returns({ _id: '2e322222' });

      request(server)
        .post(`/board/issue/add/${boardId}`)
        .send(requestBody)
        .expect(200, () => {
          findOne.restore();
          save.restore();
          findOneAndUpdate.restore();
          done();
        });
    });
  });
});

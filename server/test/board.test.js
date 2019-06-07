import request from 'supertest';
import { stub } from 'sinon';
import server from '../app';
import database from '../config/database';
import Board from '../models/boardModel';

const boardMock = {
  lifecycles: [
    'to-do',
    'in-porgress',
    'complete',
  ],
  issues: [
    {
      id: 1002,
      title: 'Creat Repo',
      description: 'ASKK askjka asda',
      asignee: 'Manish',
      lifeCycle: 'to-do',
      comments: [
        '5cf5973060e08a863a9cf46f',
      ],
    },
  ],
  name: 'amazon',
  members: [
  ],
  id: 74,
  __v: 0,
};

const expectedResponse = {
  isSuccess: true,
  message: '',
  data: {
    lifeCycles: {
      'to-do': {
        issues: [
          {
            asignee: 'Manish',
            comments: [
              '5cf5973060e08a863a9cf46f',
            ],
            id: 1002,
            title: 'Creat Repo',
            description: 'ASKK askjka asda',
            lifeCycle: 'to-do',
          },
        ],
      },
      'in-porgress': {
        issues: [],
      },
      complete: {
        issues: [],
      },
    },
  },
};

describe('Sign up API test', () => {
  afterAll(() => {
    server.close();
    database.disconnectDB();
  });

  const id = 200;

  it('should throw Bad request if board id not present', (done) => {
    const find = stub(Board, 'find').returns([null]);
    request(server)
      .get(`/board/${id}`)
      .expect(400, {
        isSuccess: false,
        message: `No board found with id :${id}`,
      })
      .end((err) => {
        if (err) {
          return done(err);
        }
        find.restore();
        return done();
      });
  });
  it('should send data if boardId found', (done) => {
    const board = boardMock;
    const find = stub(Board, 'find').returns([board]);
    const populate = stub(Board, 'populate').returns(board);
    request(server).get(`/board/${id}`).expect(200, { ...expectedResponse }).end((err) => {
      if (err) return done(err);
      find.restore();
      populate.restore();
      return done();
    });
  });
});

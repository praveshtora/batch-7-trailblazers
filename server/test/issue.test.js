import { stub } from 'sinon';
import request from 'supertest';

import server from '../app';
import Issue from '../models/issueModel';
import database from '../config/database';

describe('/issue', () => {
  describe('/update', () => {
    let requestBody;
    const url = '/issue/update';
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 1);

    beforeEach(() => {
      requestBody = {
        id: 12,
        title: 'Create Project structure',
        description: 'create client and server project directories',
        assignee: '',
        dueDate,
      };
    });

    afterAll(() => {
      server.close();
      database.disconnectDB();
    });

    test('should return 400 if id not passed.', (done) => {
      delete requestBody.id;

      request(server)
        .post(url)
        .expect(400, done);
    });

    test('should be able to update single field', (done) => {
      const { id, title } = requestBody;
      const findOneAndUpdate = stub(Issue, 'findOneAndUpdate').returns({ _id: '123' });

      request(server)
        .post(url)
        .send({ id, title })
        .expect(200, () => {
          findOneAndUpdate.restore();
          done();
        });
    });
  });
});

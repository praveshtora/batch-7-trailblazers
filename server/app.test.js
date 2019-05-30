import http from 'http';
import config from './config';
import server from './app';

const port = config.server.PORT;

describe('httpServer', () => {
  afterAll(() => {
    server.close();
  });

  describe('/', () => {
    test('should return 200', (done) => {
      http.get(`http://localhost:${port}`, (res) => {
        expect(res.statusCode).toBe(200);
        done();
      });
    });
  });
});

import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import logger from 'morgan';
import dotenv from 'dotenv';
import cors from 'cors';
import passport from 'passport';
import cookieSession from 'cookie-session';

import config from './config';
import router from './routes';
import dashboard from './routes/dashboard';
import database from './config/database';
import board from './routes/board';
import issueRoutes from './routes/issue';

const milliSecondsInADay = 8640000;

dotenv.config();
const app = express();
const port = config.server.PORT;
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  cookieSession({
    maxAge: milliSecondsInADay,
    keys: [config.session.SECRET],
  }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Credentials', 'true');
  return next();
});
require('./config/passport');

app.use('/', router);
app.use('/dashboard', dashboard);
app.use('/board', board);
app.use('/issue', issueRoutes);

const server = app.listen(port, () => console.log(`Listening on port ${port}`));

database.connectDB(() => server.close());

module.exports = server;

import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import logger from 'morgan';
import dotenv from 'dotenv';
import cors from 'cors';
import config from './config';
import router from './routes';
import database from './config/database';

dotenv.config();
const app = express();
const port = config.server.PORT;
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use('/', router);


const server = app.listen(port, () => console.log(`Listening on port ${port}`));

database.connectDB(() => (server.close()));

module.exports = server;

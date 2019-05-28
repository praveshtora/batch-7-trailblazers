
import express from 'express'
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import config from './config/config'
import router from './routes/index'


const app = express();
const port = config.server.SERVER_PORT;
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", router);

app.listen(port, () => console.log(`Listening on port ${port}`))

module.exports = app;

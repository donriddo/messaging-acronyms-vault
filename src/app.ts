import * as express from 'express';
import * as cors from 'cors';
import * as morgan from 'morgan';

import { generatedRoutes } from './api';
import errorHandler from './middlewares/errorHandler';
import { loggerStream } from './utils/app';
import * as config from '../config';

const app = express();

app.use(cors());
app.use(express.json({ limit: '5mb', type: 'application/json' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

const isDevOrTest = ['development', 'test'].indexOf(config.get('env')) > -1;
const logType = isDevOrTest ? 'dev' : 'combined';
app.use(morgan(logType, { stream: loggerStream }));

app.use('/api/', generatedRoutes());

app.use('*', (req, res, next) => {
  if (!req.route) {
    const { method, originalUrl } = req;
    res.status(404).send({ message: `Cannot ${method} ${originalUrl}` });
  }
  next();
});

app.use(errorHandler);

export default app;

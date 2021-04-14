import * as express from 'express';
import * as cors from 'cors';

import { generatedRoutes } from './api';
import errorHandler from './middlewares/errorHandler';

const app = express();

app.use(cors());
app.use(express.json({ limit: '5mb', type: 'application/json' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));
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

import * as express from 'express';
import * as cors from 'cors';

import setupDB from './setup/mongoose';
import seeds from './db/seeds';
import { generatedRoutes } from './api';
import errorHandler from './middlewares/errorHandler';

const app = express();

app.use(cors());
app.use(express.json({ limit: '5mb', type: 'application/json' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));
app.use('/api/', generatedRoutes());
app.use(errorHandler);

setupDB();
seeds.run();

export default app;

import { NextFunction, Request, Response, Router } from 'express';
import * as path from 'path';
import { IRequest } from './utils/interfaces';

const requireAll = require('require-all');
const controllers = requireAll({
  dirname: path.resolve(__dirname, './components'),
  filter: /(.+Controller)\.(t|j)s$/,
  recursive: true,
  resolve: (controller) => {
    if (typeof controller.default === 'function') {
      return new controller.default();
    }
  },
});

export const generatedRoutes = () => {
  const router = Router();

  router.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.json({ message: 'Bonjour Manda!' });
  });

  Object.keys(controllers).forEach((key) => {
    const controllerKey = Object.keys(controllers[key])[0];
    const controller = controllers[key][controllerKey];
    if (controller.$routes) {
      for (const { method, url, middleware, fnName } of controller.$routes) {
        console.log(`${method}: ${url} -> ${fnName}`);
        router[method](url, ...middleware, (req: IRequest, res: Response, next: NextFunction) => {
          controller[fnName](req, res, next);
        });
      }
    }
  });
  return router;
};

export const allRoutes = controllers;

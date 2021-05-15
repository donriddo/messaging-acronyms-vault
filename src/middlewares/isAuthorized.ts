import { Response, NextFunction } from 'express';
import * as createError from 'http-errors';

import UserService from '../components/users/UserService';
import { IRequest } from '../utils/interfaces';

export default async function isAuthorized(
  req: IRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const apiKey = req.headers['x-api-key'] as string;
    if (!apiKey) {
      throw createError(
        401,
        'You are not authorized to access this resource',
      );
    }

    const user = await UserService.findOne({ apiKey });
    if (!user) {
      throw createError(
        401,
        'You are not authorized to access this resource',
      );
    }

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
}

import { Response, NextFunction } from 'express';
import * as createError from 'http-errors';

import AuthorService from '../components/authors/AuthorService';
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

    const author = await AuthorService.findOne({ apiKey });
    if (!author) {
      throw createError(
        401,
        'You are not authorized to access this resource',
      );
    }

    req.author = author;

    next();
  } catch (error) {
    next(error);
  }
}

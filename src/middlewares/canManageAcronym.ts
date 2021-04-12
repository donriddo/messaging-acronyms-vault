import { Response, NextFunction } from 'express';
import * as createError from 'http-errors';

import AcronymService from '../components/acronyms/AcronymService';
import { IRequest } from '../utils/interfaces';

export default async function canManageAcronym(
  req: IRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const acronym = await AcronymService.findOne({
      _id: req.params.acronymId,
    });

    if (!acronym) {
      throw createError(404, 'Acronym not found');
    }

    if (acronym.author !== req.author.id) {
      throw createError(
        403,
        'You are not allowed to perform this action',
      );
    }

    next();
  } catch (error) {
    next(error);
  }
}

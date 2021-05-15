import { controller, del, get, post, put } from 'route-decorators';
import { Request, Response, NextFunction, Router } from 'express';

import AcronymService from './AcronymService';
import { validate } from '../../utils/app';
import isAuthorized from '../../middlewares/isAuthorized';
import { IRequest } from '../../utils/interfaces';
import canManageAcronym from '../../middlewares/canManageAcronym';

@controller('/acronyms')
export default class AcronymController {
  public $routes: any[];

  @post(isAuthorized)
  public async createAcronym(
    req: IRequest,
    res: Response,
    next: NextFunction,
  ) {

    try {
      this.validate(req.body);
      const acronym = await AcronymService.createOne({
        ...req.body,
        author: req.author.id,
      });

      return res.status(200).json({
        message: 'Acronym created successfully',
        data: acronym,
      });
    } catch (e) {
      next(e);
    }
  }

  @get()
  public async listAcronyms(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {

    try {
      const acronyms = await AcronymService.findAll(req.query);

      return res.status(200).json({
        message: 'Acronyms retrieved successfully',
        ...acronyms,
      });
    } catch (e) {
      next(e);
    }
  }

  @put('/:acronymId', isAuthorized, canManageAcronym)
  public async updateAcronym(
    req: IRequest,
    res: Response,
    next: NextFunction,
  ) {

    try {
      this.validate(req.body, 'create', true);

      await AcronymService.update(
        { _id: req.params.acronymId },
        req.body,
      );

      return res.status(200).json({
        message: 'Acronym updated successfully',
        data: await AcronymService.findOne({ _id: req.params.acronymId }),
      });
    } catch (e) {
      next(e);
    }
  }

  @del('/:acronymId', isAuthorized, canManageAcronym)
  public async deleteAcronym(
    req: IRequest,
    res: Response,
    next: NextFunction,
  ) {

    try {
      await AcronymService.remove(
        { _id: req.params.acronymId },
      );

      return res.status(200).json({
        message: 'Acronym deleted successfully',
      });
    } catch (e) {
      next(e);
    }
  }

  private validate(body, type = 'create', isUpdate = false) {
    let fields = {};

    if (type === 'create') {
      fields = {
        key: {
          type: 'string',
          required: !isUpdate,
        },
        value: {
          type: 'string',
          required: !isUpdate,
        },
      };
    }

    validate(
      body,
      {
        properties: fields,
      },
      {
        strictRequired: !isUpdate,
        unknownProperties: 'delete',
        trim: true,
      },
    );
  }
}

import * as createError from 'http-errors';
import { controller, del, get, post, put } from 'route-decorators';
import { Request, Response, NextFunction } from 'express';

import UserService from './UserService';
import { validate } from '../../utils/app';
import { IRequest } from '../../utils/interfaces';

@controller('/users')
export default class UserController {
  public $routes: any[];

  @post()
  public async createUser(
    req: IRequest,
    res: Response,
    next: NextFunction,
  ) {

    try {
      this.validate(req.body);
      const user = await UserService.createOne(req.body);

      return res.status(200).json({
        message: 'User created successfully',
        data: user,
      });
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  @get('/:userId')
  public async getUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {

    try {
      const conditions = {
        ...req.query,
        _id: req.params.userId,
      };

      const user = await UserService.findOne(conditions);
      if (!user) {
        throw createError(404, 'User not found');
      }

      return res.status(200).json({
        message: 'User retrieved successfully',
        data: user,
      });
    } catch (e) {
      next(e);
    }
  }

  @get()
  public async listUsers(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {

    try {
      const users = await UserService.findAll(req.query);

      return res.status(200).json({
        message: 'Users retrieved successfully',
        ...users,
      });
    } catch (e) {
      next(e);
    }
  }

  @put('/:userId')
  public async updateUser(
    req: IRequest,
    res: Response,
    next: NextFunction,
  ) {

    try {
      this.validate(req.body, 'create', true);
      const user = await UserService.findOne({
        _id: req.params.userId,
      });

      if (!user) {
        throw createError(404, 'User not found');
      }

      await UserService.update(
        { _id: req.params.userId },
        req.body,
      );

      return res.status(200).json({
        message: 'User updated successfully',
        data: await UserService.findOne({ _id: req.params.userId }),
      });
    } catch (e) {
      next(e);
    }
  }

  @del('/:userId')
  public async deleteUser(
    req: IRequest,
    res: Response,
    next: NextFunction,
  ) {

    try {
      const user = await UserService.findOne({
        _id: req.params.userId,
      });

      if (!user) {
        throw createError(404, 'User not found');
      }

      await UserService.remove(
        { _id: req.params.userId },
      );

      return res.status(200).json({
        message: 'User deleted successfully',
      });
    } catch (e) {
      next(e);
    }
  }

  private validate(body, type = 'create', isUpdate = false) {
    let fields = {};

    if (type === 'create') {
      fields = {
        email: {
          type: 'string',
          required: !isUpdate,
          format: 'email',
        },
        password: {
          type: 'string',
          required: !isUpdate,
          minLength: 8,
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

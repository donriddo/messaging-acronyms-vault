import * as createError from 'http-errors';
import { controller, post } from 'route-decorators';
import { Response, NextFunction } from 'express';
import * as passport from 'passport';
import { DocumentType } from '@typegoose/typegoose';

import { getToken, validate } from '../../utils/app';
import { IRequest } from '../../utils/interfaces';
import { UserSchema } from '../users/UserModel';

@controller('/auth')
export default class UserController {
  public $routes: any[];

  @post('/login')
  public async login(
    req: IRequest,
    res: Response,
    next: NextFunction,
  ) {
    this.validate(req.body, 'login');
    return passport.authenticate(
      'local',
      { session: false },
      async (err, user: DocumentType<UserSchema>, info) => {
        try {
          const errored = err || info;
          if (errored) {
            throw createError(401, errored);
          }

          await user.updateOne({ lastLoginAt: new Date() });

          const result = getToken({
            shortTokenExpiry: req.body.shortTokenExpiry || false,
            ...user.toJSON(),
          });

          return res.send({ ...result });
        } catch (error) {
          console.log(error);
          next(error);
        }
      },
    )(req, res, next);
  }

  private validate(body, type = 'login') {
    let fields = {};

    if (type === 'login') {
      fields = {
        email: {
          type: 'string',
          required: true,
          format: 'email',
        },
        password: {
          type: 'string',
          required: true,
        },
      };
    }

    validate(
      body,
      {
        properties: fields,
      },
      {
        strictRequired: true,
        unknownProperties: 'delete',
        trim: true,
      },
    );
  }
}

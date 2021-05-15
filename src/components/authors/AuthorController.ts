import { controller, get, post } from 'route-decorators';
import { Request, Response, NextFunction, Router } from 'express';
import * as createError from 'http-errors';

import AuthorService from './AuthorService';
import { generateApiKey, validate } from '../../utils/app';

@controller('/authors')
export default class AuthorController {
  public $routes: any[];

  @post('/register')
  public async registerAuthor(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {

    try {
      this.validate(req.body);
      const author = await AuthorService.createOne(req.body);

      return res.status(200).json({
        message: 'Registration successful. Please keep your API key safe. It will only be shown to you once',
        data: {
          ...author.toJSON(),
          apiKey: author.apiKey,
        },
      });
    } catch (e) {
      next(e);
    }
  }

  @post('/generate-api-key')
  public async generateNewApiKey(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {

    try {
      this.validate(req.body, 'generate-api-key');
      const author = await AuthorService.findOne({
        email: req.body.email,
      });

      if (!author) {
        throw createError(404, 'Email not registered');
      }

      const apiKey = generateApiKey(author.email);
      await AuthorService.update({ email: req.body.email }, { apiKey });

      return res.status(200).json({
        message: 'Please keep your API key safe. It will only be shown to you once',
        data: {
          apiKey,
        },
      });
    } catch (e) {
      next(e);
    }
  }

  @get()
  public async listAuthors(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {

    try {
      const authors = await AuthorService.findAll(req.query);

      return res.status(200).json({
        message: 'Authors retrieved successfully',
        ...authors,
      });
    } catch (e) {
      next(e);
    }
  }

  private validate(body, type = 'register') {
    let fields = {};

    if (type === 'register') {
      fields = {
        email: {
          type: 'string',
          format: 'email',
          required: true,
        },
        name: {
          type: 'string',
        },
      };
    }

    if (type === 'generate-api-key') {
      fields = {
        email: {
          type: 'string',
          format: 'email',
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

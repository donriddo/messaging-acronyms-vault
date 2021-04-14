import { NextFunction, Response, Request } from 'express';
import { omit } from 'lodash';

export default function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (err.message.includes('Cast to ObjectId failed')) {
    return res.status(400).json({
      message: 'Invalid request parameter sent',
    });
  }

  if (/^5/.test(err.status) || !err.status) {
    return res.status(500).send({ message: 'Something broke. We will fix it' });
  }

  if (err.response) {
    const errorText = JSON.parse(err.response.text);
    if (errorText) {
      return res.status(400).send({ message: errorText.message || errorText.error });
    }
  }

  if (err) {
    return res.status(err.status).send({ message: err.message, errors: omit(err, ['response']) });
  }
}

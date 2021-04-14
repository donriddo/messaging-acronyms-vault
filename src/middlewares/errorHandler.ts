import { omit, startCase } from 'lodash';
import * as pluralize from 'pluralize';

export default function errorHandler(err, req, res, next) {
  if (err.code === 'ENOTFOUND') {
    return res.status(500).send({
      message: 'Service not available at the moment. Please try again later',
    });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).send({
      message: err.errors[0].message.replace('must be unique', 'already exist'),
    });
  }

  if (err.code === 11000) {
    const vars = err.message.split(':');
    const tableName = vars[1].split(' ')[1].split('.')[1];
    const modelName = startCase(pluralize.singular(tableName));
    const fieldName = vars[2].split(' ')[1].split('_')[0];

    return res.status(400).json({
      message: `${modelName} with the ${fieldName} exists`,
    });
  }

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

  res.status(404).json({ message: 'Not Found' });
}

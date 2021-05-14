import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import * as createError from 'http-errors';
import { sign } from 'jsonwebtoken';
import { omit } from 'lodash';
import * as validator from 'lx-valid';
import { createLogger, transports } from 'winston';
import { DocumentType } from '@typegoose/typegoose';

import * as config from '../../config';
import { UserSchema } from '../components/users/UserModel';

const SECRET = process.env.SECRET_KEY;
export const SEVEN_DAYS = 60 * 60 * 24 * 7;
export const SIXTY_DAYS = 60 * 60 * 24 * 60;

const isDev = process.env.NODE_ENV === 'development';
const isProduction = config.get('env') === 'production';
const options = {
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

const logger = createLogger({
  transports: [
    new transports.Console(options.console),
  ],
  exitOnError: false,
});

export function generateApiKey(userEmail) {
  const secretKey = config.get('secretKey');
  return crypto.createHmac('sha256', secretKey)
    .update(JSON.stringify({ userEmail, timestamp: Date.now() }))
    .digest('hex');
}

export const hashPassword = (password: string): string => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

export function validate(object, schema, options) {
  const fn = options.isUpdate ? validator.getValidationFunction() : validator.validate;
  const result = fn(object, schema, Object.assign({ cast: true }, options));

  if (!result.valid) {
    const msg = `'${result.errors[0].property}' ${result.errors[0].message}`;
    throw createError(400, msg, result.errors);
  }
}

export function processPopulate(query) {
  const paths = query?.split('.');
  let currentPopulate;
  while (paths?.length) {
    const path = paths.pop();
    const populate: any = { path };

    if (currentPopulate) {
      currentPopulate = { path, populate: currentPopulate };
    } else {
      currentPopulate = populate;
    }
  }

  return currentPopulate;
}

export function buildPopulateQuery(populate, cursor) {
  const populateFields = populate?.split(',');
  if (populateFields?.length) {
    populateFields.forEach((field) => {
      cursor = cursor.populate(processPopulate(field));
    });
  }

  return cursor;
}

export async function buildFindOneQuery(model, conditions) {
  const populate = conditions.$populate;
  const query = omit(conditions, ['$offset', '$limit', '$populate']);

  const cursor = model.findOne(query);

  const data = await buildPopulateQuery(populate, cursor);

  return data;
}

export async function buildFindAllQuery(
  model,
  conditions,
  useFuzzySearch = false,
) {
  const limit = parseInt(conditions.$limit || 10, 10);
  const offset = parseInt(conditions.$offset || 0, 10);
  const search = conditions.$search;
  const populate = conditions.$populate;
  const query = omit(conditions, ['$offset', '$limit', '$populate', '$search']);

  const total = useFuzzySearch
    ? (await model.fuzzySearch(search, query)).length // hacky
    : await model.countDocuments(query);

  let cursor = useFuzzySearch
    ? model.fuzzySearch(search, query)
    : model.find(query);

  cursor = cursor.skip(offset).limit(limit);

  const data = await buildPopulateQuery(populate, cursor);

  return {
    data,
    meta: { limit, offset, total },
  };
}

export const loggerStream = {
  write: (message) => (isProduction ? logger : console).info(message.trim()),
};

const getExpiry = (options: any = {}) => {
  if (options.shortExpiry && !isDev) {
    return SEVEN_DAYS;
  }

  return SIXTY_DAYS;
};

export const createToken = (user: DocumentType<UserSchema>, exp = null) => {
  const { _id: id, email } = user;
  return sign(
    {
      email,
      id,
      accountId: (user as any).accountId,
    },
    SECRET,
    { expiresIn: exp || getExpiry() },
  );
};

export const getToken = (data: any) => {
  const expiryMins = getExpiry(
    { shortExpiry: data.shortTokenExpiry },
  );
  const token = createToken(data, expiryMins);
  const issued = Math.floor(Date.now() / 1000);

  const result = {
    issued,
    token,
    expires: issued + expiryMins,
  };

  return result;
};

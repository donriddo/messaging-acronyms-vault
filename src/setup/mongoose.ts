import * as mongoose from 'mongoose';
import bluebird from 'bluebird';

import * as config from '../../config';

export default async function setupDB(databaseUrl?: string) {
  const dbUrl = databaseUrl || config.get('db.url');

  return new Promise((resolve, reject) => {
    mongoose.connect(
      dbUrl,
      {
        useNewUrlParser: true,
        promiseLibrary: bluebird,
        useCreateIndex: true,
        useUnifiedTopology: true,
      },
      (error) => {
        if (error) {
          return reject(error);
        }

        resolve(true);
      },
    );
  });
}

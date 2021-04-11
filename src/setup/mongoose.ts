import * as mongoose from 'mongoose';
import bluebird from 'bluebird';
import config from 'config';

export const dbUrl = config.get('db.url');

export default async function setupDB() {
  mongoose.connect(
    dbUrl,
    {
      useNewUrlParser: true,
      dbName: 'acronyms',
      promiseLibrary: bluebird,
      useCreateIndex: true,
      useUnifiedTopology: true,
    },
    (error) => {
      if (error) {

      }
    },
  );
}

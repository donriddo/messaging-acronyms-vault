import { expect } from 'chai';
import * as mongoose from 'mongoose';

import setupDB from '../mongoose';

describe('DB setup:', () => {
  describe('#Mongoose', () => {
    it('returns error when database url is invalid', async () => {
      try {
        await setupDB('invalid');
      } catch (error) {
        // console.log({ error }, error.message, error.name);
        expect(error).to.have.property('name');
        expect(error.name).to.eql('MongoParseError');
        expect(error).to.have.property('message');
        expect(error.message).to.eql('Invalid connection string');
      }
    });
  });
});

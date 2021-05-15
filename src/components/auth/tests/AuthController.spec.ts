import 'mocha';
import { expect } from 'chai';
import * as request from 'supertest';
import * as mongoose from 'mongoose';

import app from '../../../app';
import setupDB from '../../../setup/mongoose';
import { setupPassportAuthentication } from '../../../setup/passport';
import { SIXTY_DAYS } from '../../../utils/app';

describe('Users:', () => {
  beforeEach(async () => {
    try {
      await setupDB('mongodb://localhost/gamify_learning_test');
      setupPassportAuthentication();
    } catch (error) {
      console.log('Error setting up: ', error);
    }
  });

  afterEach(async () => {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.db.dropDatabase();
      await mongoose.disconnect();
    }
  });

  describe.only('#AUTH', () => {
    it('create user and login successfully', async () => {
      const res = await request(app)
        .post('/api/v1/users')
        .send({ email: 'user@example.com', password: 'password' })
        .expect(200);

      expect(res.body).to.not.be.empty;
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.eql('User created successfully');
      expect(res.body).to.have.property('data');
      expect(res.body.data).to.be.an('object');
      expect(res.body.data).to.have.property('email');
      expect(res.body.data.email).to.eql('user@example.com');

      const res2 = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'user@example.com', password: 'password' })
        .expect(200);
      expect(res2.body).to.have.property('issued');
      expect(res2.body).to.have.property('token');
      expect(res2.body).to.have.property('expires');

      expect(res2.body.expires - res2.body.issued).to.eql(SIXTY_DAYS);
    });
  });
});

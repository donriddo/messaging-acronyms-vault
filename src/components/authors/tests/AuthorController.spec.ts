import 'mocha';
import { expect } from 'chai';
import * as request from 'supertest';
import app from '../../../app';

describe('Banks', () => {
  let user;
  beforeEach(async () => {
    user = {
      email: 'test_user@example.com',
      password: 'test-password',
      role: 'admin',
      adminGroupId: 1,
    };
  });

  describe('#GET', () => {
    it('finds all existing banks', async () => {
      const res = await request(app)
        .get('/api/authors')
        .expect(200);
      console.log(res.body.data);

      expect(res.body.data).to.not.be.empty;
    });
  });
});

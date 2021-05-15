import 'mocha';
import { expect } from 'chai';
import * as request from 'supertest';
import * as mongoose from 'mongoose';

import app from '../../../app';
import setupDB from '../../../setup/mongoose';

describe('Users:', () => {
  beforeEach(async () => {
    try {
      await setupDB('mongodb://localhost/gamify_learning_test');
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

  describe('#GENERAL', () => {
    it('400: invalid ObjectID', async () => {
      const res = await request(app)
        .get('/api/v1/users/invalid')
        .expect(400);

      expect(res.body).to.not.be.empty;
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.eql('Invalid request parameter sent');
    });
  });

  describe('#POST', () => {
    it('does not create new user: password missing', async () => {
      const res = await request(app)
        .post('/api/v1/users')
        .send({ email: 'user@example.com' })
        .expect(400);

      expect(res.body).to.not.be.empty;
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.eql('\'password\' is required');
    });

    it('does not create new user: email missing', async () => {
      const res = await request(app)
        .post('/api/v1/users')
        .send({ password: 'password' })
        .expect(400);

      expect(res.body).to.not.be.empty;
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.eql('\'email\' is required');
    });

    it('does not create new user: password too short', async () => {
      const res = await request(app)
        .post('/api/v1/users')
        .send({ email: 'user@example.com', password: 'pass' })
        .expect(400);

      expect(res.body).to.not.be.empty;
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.eql('\'password\' is too short (minimum is 8 characters)');
    });

    it('create new user successfully', async () => {
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
        .get('/api/v1/users')
        .expect(200);

      expect(res2.body.data).to.not.be.empty;
      expect(res2.body.data).to.be.an('array');
      expect(res2.body.data.length).to.eql(1);
      expect(res2.body.data[0]).to.be.an('object');
      expect(res2.body.data[0]).to.have.property('email');
      expect(res2.body.data[0].email).to.eql('user@example.com');
    });
  });

  describe('#PUT', () => {
    it('cannot update user: not found', async () => {
      const res = await request(app)
        .put('/api/v1/users/607708e2658374819c03f843')
        .expect(404);

      expect(res.body).to.not.be.empty;
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.eql('User not found');
    });

    it('updates user successfully', async () => {
      const res = await request(app)
        .post('/api/v1/users/')
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
        .put(`/api/v1/users/${res.body.data.id}`)
        .expect(200);

      expect(res2.body).to.not.be.empty;
      expect(res2.body).to.be.an('object');
      expect(res2.body).to.have.property('message');
      expect(res2.body.message).to.eql('User updated successfully');
    });
  });

  describe('#DELETE', () => {
    it('cannot delete user: not found', async () => {
      const res = await request(app)
        .delete('/api/v1/users/607708e2658374819c03f843')
        .expect(404);

      expect(res.body).to.not.be.empty;
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.eql('User not found');
    });

    it('deletes user successfully', async () => {
      const res = await request(app)
        .post('/api/v1/users/')
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
        .delete(`/api/v1/users/${res.body.data.id}`)
        .expect(200);

      expect(res2.body).to.not.be.empty;
      expect(res2.body).to.be.an('object');
      expect(res2.body).to.have.property('message');
      expect(res2.body.message).to.eql('User deleted successfully');
    });
  });
});

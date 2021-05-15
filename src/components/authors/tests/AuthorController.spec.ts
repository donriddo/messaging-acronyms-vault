import 'mocha';
import { expect } from 'chai';
import * as request from 'supertest';
import * as mongoose from 'mongoose';

import app from '../../../app';
import setupDB from '../../../setup/mongoose';

describe('Authors:', () => {
  beforeEach(async () => {
    try {
      await setupDB('mongodb://localhost/acronym_test');
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

  describe('#GET', () => {
    it('404: invalid URL', async () => {
      const res = await request(app)
        .get('/api/authors/invalid')
        .expect(404);

      expect(res.body).to.not.be.empty;
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.eql('Cannot GET /api/authors/invalid');
    });

    it('finds no existing authors', async () => {
      const res = await request(app)
        .get('/api/authors')
        .expect(200);

      expect(res.body.data).to.be.empty;
      expect(res.body.data).to.be.an('array');
      expect(res.body.data.length).to.eql(0);
    });
  });

  describe('#REGISTER', () => {
    it('does not register new author: invalid email', async () => {
      const res = await request(app)
        .post('/api/authors/register')
        .send({ email: 'invalid' })
        .expect(400);

      expect(res.body).to.not.be.empty;
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.eql('\'email\' is not a valid email');
    });

    it('does not register new author: invalid name', async () => {
      const res = await request(app)
        .post('/api/authors/register')
        .send({ email: 'you@domain.tld', name: 50 })
        .expect(400);

      expect(res.body).to.not.be.empty;
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.eql('\'name\' must be of string type');
    });

    it('register new author successfully', async () => {
      const res = await request(app)
        .post('/api/authors/register')
        .send({ email: 'you@domain.tld', name: 'you and me' })
        .expect(200);

      expect(res.body).to.not.be.empty;
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.eql('Registration successful. Please keep your API key safe. It will only be shown to you once');
      expect(res.body).to.have.property('data');
      expect(res.body.data).to.be.an('object');
      expect(res.body.data).to.have.property('apiKey');
      expect(res.body.data).to.have.property('email');
      expect(res.body.data.email).to.eql('you@domain.tld');
      expect(res.body.data).to.have.property('name');
      expect(res.body.data.name).to.eql('you and me');

      const res2 = await request(app)
        .get('/api/authors')
        .expect(200);

      expect(res2.body.data).to.not.be.empty;
      expect(res2.body.data).to.be.an('array');
      expect(res2.body.data.length).to.eql(1);
    });
  });

  describe('#API KEY', () => {
    it('cannot generate api key: invalid email', async () => {
      const res = await request(app)
        .post('/api/authors/generate-api-key')
        .send({ email: 'invalid' })
        .expect(400);

      expect(res.body).to.not.be.empty;
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.eql('\'email\' is not a valid email');
    });

    it('cannot generate api key: email not registered', async () => {
      const res = await request(app)
        .post('/api/authors/generate-api-key')
        .send({ email: 'you@domain.tld' })
        .expect(404);

      expect(res.body).to.not.be.empty;
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.eql('Email not registered');
    });

    it('generates api key successfully', async () => {
      const res = await request(app)
        .post('/api/authors/register')
        .send({ email: 'you@domain.tld', name: 'you and me' })
        .expect(200);

      expect(res.body).to.not.be.empty;
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.eql('Registration successful. Please keep your API key safe. It will only be shown to you once');
      expect(res.body).to.have.property('data');
      expect(res.body.data).to.be.an('object');
      expect(res.body.data).to.have.property('apiKey');
      expect(res.body.data).to.have.property('email');
      expect(res.body.data.email).to.eql('you@domain.tld');
      expect(res.body.data).to.have.property('name');
      expect(res.body.data.name).to.eql('you and me');

      const res2 = await request(app)
        .post('/api/authors/generate-api-key')
        .send({ email: 'you@domain.tld' })
        .expect(200);

      expect(res2.body.data).to.not.be.empty;
      expect(res2.body.data).to.be.an('object');
      expect(res2.body).to.have.property('message');
      expect(res2.body.message).to.eql('Please keep your API key safe. It will only be shown to you once');
      expect(res2.body.data).to.have.property('apiKey');
    });
  });
});

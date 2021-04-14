import 'mocha';
import { expect } from 'chai';
import * as request from 'supertest';
import * as mongoose from 'mongoose';

import app from '../../../app';
import setupDB from '../../../setup/mongoose';
import AuthorService from '../../authors/AuthorService';

describe('Acronyms:', () => {
  let apiKey = '';
  beforeEach(async () => {
    try {
      await setupDB('mongodb://localhost/acronym_test');
      const author = await AuthorService.createOne({ email: 'you@domain.tld' });
      apiKey = author.apiKey;
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
        .delete('/api/acronyms/invalid')
        .set('x-api-key', apiKey)
        .expect(400);

      expect(res.body).to.not.be.empty;
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.eql('Invalid request parameter sent');
    });
  });

  describe('#POST', () => {
    it('does not create new acronym: unauthorized', async () => {
      const res = await request(app)
        .post('/api/acronyms')
        .send({ key: 'me', value: 'you' })
        .expect(401);

      expect(res.body).to.not.be.empty;
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.eql('You are not authorized to access this resource');
    });

    it('does not create new acronym: invalid key', async () => {
      const res = await request(app)
        .post('/api/acronyms')
        .set('x-api-key', apiKey)
        .send({ key: 50, value: 'you' })
        .expect(400);

      expect(res.body).to.not.be.empty;
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.eql('\'key\' must be of string type');
    });

    it('does not create new acronym: invalid key', async () => {
      const res = await request(app)
        .post('/api/acronyms')
        .set('x-api-key', apiKey)
        .send({ key: 'me', value: 50 })
        .expect(400);

      expect(res.body).to.not.be.empty;
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.eql('\'value\' must be of string type');
    });

    it('create new acronym successfully', async () => {
      const res = await request(app)
        .post('/api/acronyms')
        .set('x-api-key', apiKey)
        .send({ key: 'me', value: 'you' })
        .expect(200);

      expect(res.body).to.not.be.empty;
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.eql('Acronym created successfully');
      expect(res.body).to.have.property('data');
      expect(res.body.data).to.be.an('object');
      expect(res.body.data).to.have.property('key');
      expect(res.body.data.key).to.eql('me');
      expect(res.body.data).to.have.property('value');
      expect(res.body.data.value).to.eql('you');

      const res2 = await request(app)
        .get('/api/acronyms?$populate=author')
        .expect(200);

      expect(res2.body.data).to.not.be.empty;
      expect(res2.body.data).to.be.an('array');
      expect(res2.body.data.length).to.eql(1);
      expect(res2.body.data[0]).to.be.an('object');
      expect(res2.body.data[0]).to.have.property('author');
      expect(res2.body.data[0].author).to.be.an('object');
      expect(res2.body.data[0].author).to.have.property('email');
      expect(res2.body.data[0].author.email).to.eql('you@domain.tld');
    });
  });

  describe('#PUT', () => {
    it('cannot update acronym: not found', async () => {
      const res = await request(app)
        .put('/api/acronyms/607708e2658374819c03f843')
        .set('x-api-key', apiKey)
        .expect(404);

      expect(res.body).to.not.be.empty;
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.eql('Acronym not found');
    });

    it('updates acronym successfully', async () => {
      const res = await request(app)
        .post('/api/acronyms/')
        .set('x-api-key', apiKey)
        .send({ key: 'me', value: 'you' })
        .expect(200);

      expect(res.body).to.not.be.empty;
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.eql('Acronym created successfully');
      expect(res.body).to.have.property('data');
      expect(res.body.data).to.be.an('object');
      expect(res.body.data).to.have.property('key');
      expect(res.body.data.key).to.eql('me');
      expect(res.body.data).to.have.property('value');
      expect(res.body.data.value).to.eql('you');

      const res2 = await request(app)
        .put(`/api/acronyms/${res.body.data.id}`)
        .set('x-api-key', apiKey)
        .expect(200);

      expect(res2.body).to.not.be.empty;
      expect(res2.body).to.be.an('object');
      expect(res2.body).to.have.property('message');
      expect(res2.body.message).to.eql('Acronym updated successfully');
    });
  });

  describe('#DELETE', () => {
    it('cannot delete acronym: not found', async () => {
      const res = await request(app)
        .delete('/api/acronyms/607708e2658374819c03f843')
        .set('x-api-key', apiKey)
        .expect(404);

      expect(res.body).to.not.be.empty;
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.eql('Acronym not found');
    });

    it('deletes acronym successfully', async () => {
      const res = await request(app)
        .post('/api/acronyms/')
        .set('x-api-key', apiKey)
        .send({ key: 'me', value: 'you' })
        .expect(200);

      expect(res.body).to.not.be.empty;
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.eql('Acronym created successfully');
      expect(res.body).to.have.property('data');
      expect(res.body.data).to.be.an('object');
      expect(res.body.data).to.have.property('key');
      expect(res.body.data.key).to.eql('me');
      expect(res.body.data).to.have.property('value');
      expect(res.body.data.value).to.eql('you');

      const res2 = await request(app)
        .delete(`/api/acronyms/${res.body.data.id}`)
        .set('x-api-key', apiKey)
        .expect(200);

      expect(res2.body).to.not.be.empty;
      expect(res2.body).to.be.an('object');
      expect(res2.body).to.have.property('message');
      expect(res2.body.message).to.eql('Acronym deleted successfully');
    });
  });
});

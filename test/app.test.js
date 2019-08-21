const app = require('../app');
const expect = require('chai').expect;
const supertest = require('supertest');

describe('GET /apps', () => {
  it('should return an array of apps', () => {
    return supertest(app)
      .get('/apps')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.lengthOf.at.least(1);
        const app = res.body[0];
        expect(app).to.include.all.keys(
          'App',
          'Category',
          'Rating',
          'Reviews',
          'Size',
          'Installs',
          'Type',
          'Price',
          'Content Rating',
          'Genres',
          'Last Updated',
          'Current Ver',
          'Android Ver'
        );
      });
  });

  it('should send 400 if sort is invalid', () => {
    return supertest(app)
      .get('/apps')
      .query({ sort: 'MISTAKE' })
      .expect(400, 'Sort must be either by Rating or App');
  });

  it('should send 400 if genres is invalid', () => {
    return supertest(app)
      .get('/apps')
      .query({ genres: 'MISTAKE' })
      .expect(
        400,
        'Genres must be one of Action, Puzzle, Strategy, Casual, Arcade, Card'
      );
  });

  it('should sort with valid query', () => {
    const query = 'Rating';
    return supertest(app)
      .get('/apps')
      .query({ sort: query })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
        let i = 0;
        let sorted = true;
        while (sorted && i < res.body.length - 1) {
          sorted = sorted && res.body[i][query] <= res.body[i + 1][query];
          i++;
        }
        expect(sorted).to.be.true;
      });
  });

  it('should filter with valid query', () => {
    const query = 'Arcade';
    return supertest(app)
      .get('/apps')
      .query({ genres: query })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
        let i = 0;
        let filtered = true;
        while (filtered && i < res.body.length - 1) {
          filtered = filtered && res.body[i].Genres.includes('Arcade');
          i++;
        }
        expect(filtered).to.be.true;
      });
  });
});

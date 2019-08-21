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

  it('should be 400 if sort is incorrect', () => {
    return supertest(app)
      .get('/apps')
      .query({ sort: 'MISTAKE' })
      .expect(400, 'Sort must be either by Rating or App');
  });

  it('should be 400 if genres is incorrect', () => {
    return supertest(app)
      .get('/apps')
      .query({ genres: 'MISTAKE' })
      .expect(400, 'Genres must be one of Action, Puzzle, Strategy, Casual, Arcade, Card');
  });

  it('should sort by Rating', () => {
    return supertest(app)
      .get('/apps')
      .query({ sort: 'Rating' })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
        let i = 0;
        let sorted = true;
        while (sorted && i < res.body.length - 1) {
          sorted = sorted && res.body[i].Rating <= res.body[i + 1].Rating;
          i++;
        }
        expect(sorted).to.be.true;
      });
  });

  it('should filter by genre', () => {
    return supertest(app)
      .get('/apps')
      .query({genres : 'Arcade' })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
        let filterWorking = true;
        for (let i = 0; i < res.body.length; i++) {
          if (!(res.body[i].Genres.includes('Arcade'))) {
            filterWorking = false;
            i = res.body.length;
          }
        }
        expect(filterWorking).to.be.true;
      });
  });

});

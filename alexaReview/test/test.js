const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../src/server');

chai.should();
chai.use(chaiHttp);


describe('Reviews', () => {

  describe('/GET totalRatings', () => {
      it('it should GET totalRatings by store', (done) => {
        chai.request(server)
            .get('/totalRatings')
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  res.body.should.have.property('iTunes');
                  res.body.should.have.property('GooglePlayStore');
              done();
            });
      });
  });

  describe('/GET Average Monthly Ratings', () => {
    it('it should GET Average Monthly Ratings per store', (done) => {
      chai.request(server)
          .get('/averageMonthlyRating')
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('iTunes');
                res.body.should.have.property('GoolgePlayStore');
            done();
          });
    });
});

describe('/GET  All Reviews', () => {
    it('it should GET All Reviews', (done) => {
      chai.request(server)
          .get('/reviews')
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.not.be.eq(0);
            done();
          });
    });
});

describe('/GET  All Reviews by rating=5', () => {
    it('it should GET All Reviews by rating=5', (done) => {
      chai.request(server)
          .get('/reviews?rating=5')
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.not.be.eq(0);
            done();
          });
    });
});


describe('/GET  All Reviews by store:GooglePlayStore', () => {
    it('it should GET All Reviews by store=GooglePlayStore', (done) => {
      chai.request(server)
          .get('/reviews?review_source=GooglePlayStore')
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.not.be.eq(0);
            done();
          });
    });
});


describe('/GET  All Reviews by reviewed_date:2018-02-25T00:00:00.000Z', () => {
    it('it should GET All Reviews by reviewed_date =2018-02-25T00:00:00.000Z', (done) => {
      chai.request(server)
          .get('/reviews?reviewed_date=2018-02-25T00:00:00.000Z')
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.not.be.eq(0);
            done();
          });
    });
});


describe('/GET  All Reviews filter by store, rating  ', () => {
    it('it should GET All Reviews filter by store, rating', (done) => {
      chai.request(server)
          .get('/reviews?review_source=GooglePlayStore&rating=5')
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.not.be.eq(0);
            done();
          });
    });
});

describe('/GET  All Reviews filter by store, rating and review Date  ', () => {
    it('it should GET All Reviews filter by store, rating and review Date', (done) => {
      chai.request(server)
          .get('/reviews?review_source=GooglePlayStore&rating=5&reviewed_date=2018-02-25T00:00:00.000Z')
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.not.be.eq(0);
            done();
          });
    });
});



describe('/POST  ADD Review', () => {
    it('it should POST  Review', (done) => {

     const newReview={
        review: "Testing_UT",
        author: "Test user",
        review_source: "GooglePlayStore",
        rating: 5,
        title: "TESTING UT using chai mocha",
        product_name: "Amazon Alexa",
        reviewed_date: "2018-02-25T00:00:00.000Z"
    }
      chai.request(server)
          .post('/create')
          .send(newReview)
          .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.property('review').eql(newReview.review);
                res.body.should.have.property('review_source').eql(newReview.review_source);
                res.body.should.have.property('rating').eql(newReview.rating);
            done();
          });
    });
});


describe('/POST  ADD Review missing Review parameter.', () => {
    it('it should POST  Review missing Review paramete', (done) => {

     const newReview={
        author: "Test user",
        review_source: "GooglePlayStore",
        rating: 5,
        title: "TESTING UT using chai mocha",
        product_name: "Amazon Alexa",
        reviewed_date: "2018-02-25T00:00:00.000Z"
    }
      chai.request(server)
          .post('/create')
          .send(newReview)
          .end((err, res) => {
                res.should.have.status(500);
            done();
          });
    });
});


});




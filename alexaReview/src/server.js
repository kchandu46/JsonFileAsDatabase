"use strict";
const expres = require('express');
const cors = require('cors');
const { ReviewHandler } = require('./review_handler');

const app = expres();

// middleware
app.use(expres.json());
app.use(cors({
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
}));


const reviewHandler = new ReviewHandler();
reviewHandler.readFile();

// Endpoints
app.post('/create', async (req, res, next) => {

    try {
        const data = await reviewHandler.addReview(req);
        res.status(201).json(data);
    } catch (err) {
        console.log('error create ' + err);
        res.status(500).send(JSON.stringify(err));
    }
});


app.get('/reviews', async (req, res, next) => {

    try {
        const data = await reviewHandler.getReviewByfilter(req.query);
        res.status(200).json(data);
    } catch (err) {
        console.log(err);
        res.status(500).send(JSON.stringify(err));
    }

});

app.get('/averageMonthlyRating', async (req, res, next) => {

    try {
        const data = await reviewHandler.getMonthlyAvgByStore();
        res.status(200).json(data);
    } catch (err) {
        console.log(err);
        res.status(500).send(JSON.stringify(err));
    }

})

app.get('/totalRatings', async (req, res, next) => {

    try {
        const data = await reviewHandler.totalRatings();
        res.status(200).json(data);
    } catch (err) {
        console.log(err);
        res.status(500).send(JSON.stringify(err));
    }

});

app.listen(8080, () => {
    console.log('Server listening on 8080')
})

module.exports = app;
'use strict';

module.exports = (app, database) => {
    app.get('/', (req, res) => {
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

        res.setHeader('Access-Control-Allow-Credentials', true);

        let collection = database.collection('myshit');
        collection.find({}).toArray((error, documents) => {
            res.send(JSON.stringify(documents));
        });
    });

    app.get('/put', (req, res) => {
        let collection = database.collection('myshit');
        collection.insert({
            shitWorks: true
        }, (error, result) => res.send(result));
    });
};
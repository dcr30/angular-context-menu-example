'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongodb.MongoClient.connect("mongodb://localhost:27017/myapi", (error, database) => {
    if (error) {
        console.log("Error connecting to database");
        console.error(error);
        process.exit(1);
    }
    console.log("Database connection success");
    const routes = require('./routes.js')(app, database);
    var server = app.listen(3000, () => {
        console.log('Listening on port: ' + server.address().port);
    });
});
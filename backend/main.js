'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:8000');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    next();
});

mongodb.MongoClient.connect("mongodb://localhost:27017/angular_context_menu", (error, database) => {
    if (error) {
        console.log("Error connecting to database");
        console.error(error);
        process.exit(1);
    }    
    console.log("Database connection success");        
    require('./endpoints.js')(app, database);

    console.log("Starting server...")
    var server = app.listen(3000, () => {
        console.log('Listening on port: ' + server.address().port);
    });
});
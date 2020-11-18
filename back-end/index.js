"use strict";
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const mongoose = require('mongoose');

// const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://msqassociates:sunz8lyoztRAkVIw@cluster0.uc6o6.mongodb.net/MsQAssociates?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useUnifiedTopology: true, useNewUrlParser: true });

mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true }).then(() => {
    console.log('Connected to database!');
}).catch((err) => {
    console.log("Error: ", err)
});

require('dotenv').config();

const app = express();
app.use(cors())

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// const uri = "mongodb://127.0.0.1/missqassociates";

// mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true }).then(() => {
//     console.log("Connection to database is established!")
// }).catch((error) => {
//     console.log("Error", error);
// });

const authentication = require('./controllers/authentication');

app.use('/authenticate', authentication);

const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
    console.log('Server listening at http://localhost:' + port);
});
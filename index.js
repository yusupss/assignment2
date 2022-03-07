if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const express = require('express');
const router = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(router);

module.exports = app
"use strict";

var dotenv = require('dotenv').config();

var express = require('express');

var app = express();
var PORT = process.env.PORT || 3232;

var con = require("mongoose");

var cron = require('node-cron');

con.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, function (err, db) {
  if (err) console.log(err);else {
    console.log('connected');
  }
}); // cron.schedule('11 */1 * * *', () => {

var scrap = require('./sources/ES/PARAGUAY');

scrap(); // });

app.listen(PORT, function () {
  console.log('connected at ' + PORT);
});
"use strict";

var dotenv = require('dotenv').config();

var express = require('express');

var app = express();
var PORT = process.env.PORT || 3232;

var con = require("mongoose");

var cron = require('node-cron');

var _require = require('./model/Category'),
    category = _require.category;

con.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, function (err, db) {
  if (err) console.log(err);else {
    var model = category('articles');
    model.find({
      status: null
    }, function (err, doc) {
      if (err) console.log(err);else {
        console.log("connected");
      }
    });
  }
}); //cron.schedule('5 */1 * * *', () => {
// 30 min

var HuffPost = require('./sources/HuffPost_NEWS');

HuffPost(); //});

app.listen(PORT, function () {
  console.log('connected at ' + PORT);
});
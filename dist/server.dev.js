"use strict";

var dotenv = require('dotenv').config();

var express = require('express');

var app = express();
var PORT = process.env.PORT || 3232;

var con = require("mongoose");

var _require = require('./function/insertData'),
    InsertData = _require.InsertData;

var cron = require('node-cron');

var _require2 = require('./model/Category'),
    category = _require2.category;

con.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, function (err, db) {
  if (err) console.log(err);else {
    console.log('connected');
  }
});
cron.schedule('00 */1 * * *', function () {
  var BASCKETUSA = require('./sources/FR/BASCKETUSA');

  BASCKETUSA();
});
app.listen(PORT, function () {
  console.log('connected at ' + PORT);
});
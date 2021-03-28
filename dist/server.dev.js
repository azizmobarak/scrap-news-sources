"use strict";

var dotenv = require('dotenv').config();

var express = require('express');

var app = express();
var PORT = process.env.PORT || 3232;

var con = require("mongoose");

var _require = require('./function/insertData'),
    insertData = _require.insertData,
    InsertData = _require.InsertData;

var cron = require('node-cron');

var _require2 = require('./model/Category'),
    category = _require2.category;

con.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, function (err, db) {
  if (err) console.log(err);else {}
});
cron.schedule('35 * * * *', function () {
  // 15 min
  var CBC = require('./sources/CBS News');

  CBC();
});
app.listen(PORT, function () {
  console.log('connected at ' + PORT);
});
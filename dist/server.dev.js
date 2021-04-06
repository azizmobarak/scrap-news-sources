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
  if (err) console.log(err);else {// var model = category('articles');
    // model.find({},(err,doc)=>{
    // if(err)console.log(err)
    // else{
    //     console.log(doc)
    // }
    // });
  }
});
cron.schedule('20 */1 * * *', function () {
  var NEWYORKTIMES = require("./sources/The_New_York_Times");

  NEWYORKTIMES();
});
app.listen(PORT, function () {
  console.log('connected at ' + PORT);
});
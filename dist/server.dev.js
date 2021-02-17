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

con.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, function (err, db) {
  if (err) console.log(err);else {
    console.log('connected');
  }
});
cron.schedule('* * */1 * *', function () {
  // 1 hour
  var ABC_NEWS = require('./sources/ABC News');

  ABC_NEWS();
});
cron.schedule('* */45 * * *', function () {
  // 45 hour
  var BBC = require('./sources/BBC');

  BBC();
});
cron.schedule('* */15 * * *', function () {
  // 15 min
  var Bloomberg = require('./sources/Bloomberg');

  Bloomberg();
});
cron.schedule('30 */20 * * *', function () {
  // 15 min
  var CBC = require('./sources/CBS News');

  CBC();
});
cron.schedule('* */23 * * *', function () {
  //15 min
  var CNET = require('./sources/CNET');

  CNET();
});
cron.schedule('* */30 * * *', function () {
  //30
  var CNN = require('./sources/CNN');

  CNN();
});
cron.schedule('* */20 * * *', function () {
  // 20
  var FOXNEWS = require('./sources/Fox News Channel');

  FOXNEWS();
});
cron.schedule('* * */22 * *', function () {
  // with low content and link to page contain videos about the movie/serie run it for 24h and more.
  var HBO = require('./sources/HBO');

  HBO();
});
cron.schedule('* */28 * * *', function () {
  // 30 min
  var HuffPost = require('./sources/HuffPost');

  HuffPost();
});
cron.schedule('* 10 */1 * *', function () {
  //1h
  var LosAngelesNews = require('./sources/Los Angeles Daily News');

  LosAngelesNews();
});
cron.schedule('* 5 */1 * *', function () {
  //1h
  var LosAngelesNews = require('./sources/Los Angeles Daily News');

  LosAngelesNews();
});
cron.schedule('* 3 */1 * *', function () {
  //1h
  var LosAngeleceTimes = require('./sources/Los Angeles Times');

  LosAngeleceTimes();
});
cron.schedule('* 8 */1 * *', function () {
  //1h
  var MSNBC = require('./sources/MSNBC');

  MSNBC();
});
cron.schedule('* */35 * * *', function () {
  //1h
  var Gardian = require('./sources/The Guardian');

  Gardian();
});
cron.schedule('* */33 * * *', function () {
  //1h
  var NEWYORKTIMES = require("./sources/The New York Times");

  NEWYORKTIMES();
});
cron.schedule('* */40 * * *', function () {
  //1h
  var WALLSTREET = require('./sources/The Wall Street Journal');

  WALLSTREET();
});
cron.schedule('* */55 * * *', function () {
  //1h
  var WASHINGTONPOST = require('./sources/The Washington Post');

  WASHINGTONPOST();
});
cron.schedule('* */50 * * *', function () {
  //1h
  var VICENEWS = require('./sources/Vice News');

  VICENEWS();
});
app.listen(PORT, function () {
  console.log('connected at ' + PORT);
});
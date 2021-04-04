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
  if (err) console.log(err);else {
    var model = category('articles');
    model.find({
      status: null
    }, function (err, doc) {
      if (err) console.log(err);else {// doc.map(item=>{
        //    // console.log(item.status)
        //     model.updateOne({_id:item._id},{ $set : {status:"published"} },(err,count)=>{
        //         if(err) console.log(err)
        //         else{
        //             console.log(count)
        //         }
        //     });
        // })
      }
    });
  }
});
cron.schedule('30 */2 * * *', function () {
  var INVESTOPEDIA = require('./sources/Investopedia');

  INVESTOPEDIA();
}); // // cron.schedule('22 1 * * *', () => {
// //    // 1 hour
// //     const DailyMail = require('./sources/Daily Mail');
// //     DailyMail();
// // });
// // cron.schedule('* 1 * * *', () => {
// //    // 1 hour
// //     const ABC_NEWS = require('./sources/ABC News');
// //      ABC_NEWS();
// //   });
// // cron.schedule('45 * * * *', () => {
// //    // 45 hour
// //     const BBC = require('./sources/BBC');
// //     BBC();
// //   });
// // cron.schedule('15 * * * *', () => {
// //  // 15 min
// // const Bloomberg = require('./sources/Bloomberg');
// // Bloomberg();
// // });
// // cron.schedule('20 * * * *', () => {
// //   // 15 min
// //   const CBC = require('./sources/CBS News');
// //   CBC();
// // });
// // cron.schedule('23 * * * *', () => {
// //   //15 min
// //   const CNET = require('./sources/CNET');
// //   CNET();
// // });
// // cron.schedule('30 * * * *', () => {
// //     //30
// //  const CNN = require('./sources/CNN');
// //  CNN();
// // });
// // cron.schedule('30 * * * *', () => {
// //   // 30
// //    const FOXNEWS = require('./sources/Fox News Channel');
// //    FOXNEWS();
// // });
// // cron.schedule('00 */1 * * *', () => {
// // // with low content and link to page contain videos about the movie/serie run it for 24h and more.
// // const HBO = require('./sources/HBO');
// // //HBO();
// // var d =new Date;
// // console.log('runing',d.getMinutes())
// // });
// // cron.schedule('28 * * * *', () => {
// // // 30 min
// //  const HuffPost = require('./sources/HuffPost');
// //  HuffPost();
// // });
// // cron.schedule('10 1 * * *', () => {
// // //1h
// //  const LosAngelesNews = require('./sources/Los Angeles Daily News');
// //  LosAngelesNews();
// // });
// // cron.schedule('*/30 * * * *', () => {
// //   //1h
// // const LosAngeleceTimes = require('./sources/Los Angeles Times');
// // //LosAngeleceTimes();
// // console.log("heel")
// // });
// // cron.schedule('4 */1 * * *', () => {
// //     //1h
// // const MSNBC = require('./sources/MSNBC');
// // MSNBC()
// // });
// // cron.schedule('*/35 * * * *', () => {
// // //1h
// // const Gardian = require('./sources/The Guardian');
// // Gardian();
// // });
// // cron.schedule('33 */1 * * *', () => {
// //     //1h
// // const NEWYORKTIMES = require("./sources/The_New_York_Times");
// // NEWYORKTIMES();
// // });
// // cron.schedule('*/40 * * * *', () => {
// //     //1h
// // const WALLSTREET = require('./sources/The_Wall_Street_Journal');
// // WALLSTREET();
// // });
// // cron.schedule('55 * * * *', () => {
// //     //1h
// // const WASHINGTONPOST = require('./sources/The Washington Post');
// // WASHINGTONPOST();
// // });
// cron.schedule('50 */1 * * *', () => {
//     //1h
// const VICENEWS = require('./sources/Vice News');
// VICENEWS();
// });

app.listen(PORT, function () {
  console.log('connected at ' + PORT);
});
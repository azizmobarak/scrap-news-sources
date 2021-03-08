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
    console.log('conn');
    var model = category('articles');
    model.find({}, function (err, doc) {
      if (err) console.log(err);else {// console.log(doc.length)
        // doc.map(item=>{
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
}); //cron.schedule('00 */1 * * *', () => {

var lexpress = require('./sources/FR/LEXPRESS');

lexpress(); //});
//cron.schedule('20 */1 * * *', () => {
// const CVT = require('./sources/CTV');
// CVT();
//});
// cron.schedule('20 */1 * * *', () => {
//  const ESPN = require('./sources/ESPN_NEWS');
//  ESPN();
// });
// cron.schedule('30 */2 * * *', () => {
//  const INVESTOPEDIA = require('./sources/Investopedia');
//  INVESTOPEDIA();
// });
// // cron.schedule('22 1 * * *', () => {
// //    // 1 hour
// //     const DailyMail = require('./sources/Daily Mail');
// //     DailyMail();
// // });
// cron.schedule('*/45 * * * *', () => {
// // //    // 1 hour
//      const ABC_NEWS = require('./sources/ABC_News');
//       ABC_NEWS();
//    });
// // cron.schedule('45 * * * *', () => {
// //    // 45 hour
// //     const BBC = require('./sources/BBC');
// //     BBC();
// //   });
// cron.schedule('15 */1 * * *', () => {
//  const Bloomberg = require('./sources/Bloomberg_News');
//  Bloomberg();
// });
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
// cron.schedule('5 */1 * * *', () => {
// // //   // 30
//  const FOXNEWS = require('./sources/Fox_News_Channel');
//   FOXNEWS();
//  });
// // cron.schedule('00 */1 * * *', () => {
// // // with low content and link to page contain videos about the movie/serie run it for 24h and more.
// // const HBO = require('./sources/HBO');
// // //HBO();
// // var d =new Date;
// // console.log('runing',d.getMinutes())
// // });
// cron.schedule('5 */1 * * *', () => {
// // 30 min
//   const HuffPost = require('./sources/HuffPost_NEWS');
//   HuffPost();
// });
// // cron.schedule('10 1 * * *', () => {
// // //1h
// //  const LosAngelesNews = require('./sources/Los Angeles Daily News');
// //  LosAngelesNews();
// // });
//cron.schedule('*/30 * * * *', () => {
//1h
// const LosAngeleceTimes = require('./sources/Los_Angeles_Times');
// LosAngeleceTimes();
//});
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
//cron.schedule('55 * * * *', () => {
//1h
// const WASHINGTONPOST = require('./sources/The_Washington_Post');
// WASHINGTONPOST();
//});
// cron.schedule('50 */1 * * *', () => {
//     //1h
// const VICENEWS = require('./sources/Vice News');
// VICENEWS();
// });

app.listen(PORT, function () {
  console.log('connected at ' + PORT);
});
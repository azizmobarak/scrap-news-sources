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
});
cron.schedule('30 * * * *', function () {
  //30
  var CNN = require('./sources/EN/CNN_NEWS');

  CNN();
});
app.listen(PORT, function () {
  console.log('connected at ' + PORT);
});
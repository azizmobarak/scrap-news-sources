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
cron.schedule('*/45 * * * *', function () {
  // //    // 1 hour
  var ABC_NEWS = require('./sources/ABC_News');

  ABC_NEWS();
});
app.listen(PORT, function () {
  console.log('connected at ' + PORT);
});
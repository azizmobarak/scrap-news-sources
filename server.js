const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3232;
const con = require("mongoose");
const cron = require('node-cron')
const {category} = require('./model/Category');

con.connect(process.env.DATABASE,{useNewUrlParser: true,useUnifiedTopology: true},(err,db)=>{
    if(err)console.log(err);
    else{
        var model = category('articles');
        model.find({status:null},(err,doc)=>{
        if(err)console.log(err)
        else{
           console.log("connected")
        }
        });
     }
});



cron.schedule('5 */1 * * *', () => {
// 30 min
  const HuffPost = require('./sources/HuffPost_NEWS');
  HuffPost();
});

app.listen(PORT, ()=>{
    console.log('connected at '+ PORT);
});
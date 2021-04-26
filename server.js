const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3232;
const con = require("mongoose");
const {InsertData} = require('./function/insertData');
const cron = require('node-cron')
const {category} = require('./model/Category');


con.connect(process.env.DATABASE,{useNewUrlParser: true,useUnifiedTopology: true},(err,db)=>{
    if(err)console.log(err);
    else{
       
     }
});



cron.schedule('*/30 * * * *', () => {
  const sbs = require('./sources/SBS');
  sbs();
});


app.listen(PORT, ()=>{
    console.log('connected at '+ PORT);
});

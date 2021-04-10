const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3232;
const con = require("mongoose");
const cron = require('node-cron')


con.connect(process.env.DATABASE,{useNewUrlParser: true,useUnifiedTopology: true},(err,db)=>{
    if(err)console.log(err);
    else{
      console.log('connected')
     }
});


cron.schedule('*/30 * * * *', () => {
   const scrap = require('./sources/ES/NotiTrade');
   scrap();
});

app.listen(PORT, ()=>{
    console.log('connected at '+ PORT);
});

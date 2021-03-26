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


cron.schedule('10 */1 * * *', () => {
   const scrap = require('./sources/ES/ELUNIVERSAL');
   scrap();
});

app.listen(PORT, ()=>{
    console.log('connected at '+ PORT);
});

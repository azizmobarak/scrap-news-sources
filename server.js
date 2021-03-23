const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3232;
const con = require("mongoose");
const {insertData, InsertData} = require('./function/insertData');
const cron = require('node-cron')
const {category} = require('./model/Category');


con.connect(process.env.DATABASE,{useNewUrlParser: true,useUnifiedTopology: true},(err,db)=>{
    if(err)console.log(err);
    else{
       console.log('connected')
    }
});



cron.schedule('*/22 * * * *', () => {
    //1h
const VICENEWS = require('./sources/Vice_News');
VICENEWS();
 });



app.listen(PORT, ()=>{
    console.log('connected at '+ PORT);
});

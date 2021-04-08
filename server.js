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
      console.log('conn')
        var model = category('articles');
        model.find({},(err,doc)=>{
        if(err)console.log(err)
        else{
        console.log('connected')
        }
        });
     }
});



cron.schedule('40 */1 * * *', () => {
   const france24a = require('./sources/ES/FRANCE24');
   france24a();
});


cron.schedule('30 */1 * * *', () => {
    const france24 = require('./sources/FR/FRANCE24');
    france24();
});


app.listen(PORT, ()=>{
    console.log('connected at '+ PORT);
});

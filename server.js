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
        
        }
        });
     }
});



// cron.schedule('00 */1 * * *', () => {
   const VRT = require('./sources/FR/VRT');
   VRT();
// });



app.listen(PORT, ()=>{
    console.log('connected at '+ PORT);
});

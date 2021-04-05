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
        var model = category('articles');
        model.find({status:null},(err,doc)=>{
        if(err)console.log(err)
        else{
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

cron.schedule('30 */2 * * *', () => {
const INVESTOPEDIA = require('./sources/Investopedia');
INVESTOPEDIA();
});

app.listen(PORT, ()=>{
    console.log('connected at '+ PORT);
});

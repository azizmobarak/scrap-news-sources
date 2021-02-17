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
        // var model = category('articles');
        // model.find({},(err,doc)=>{
        // if(err)console.log(err)
        // else{
        //     console.log(doc)
        // }
        // })
    }
});



cron.schedule('* * 1 * *', () => {
    console.log(1)
    // 1 hour
    const ABC_NEWS = require('./sources/ABC News');
    ABC_NEWS();
  });



cron.schedule('* 45 * * *', () => {
    console.log(2)
    // 45 hour
   const BBC = require('./sources/BBC');
   BBC();
  });


cron.schedule('* 15 * * *', () => {
    console.log(3)
 // 15 min
const Bloomberg = require('./sources/Bloomberg');
Bloomberg();
  });


cron.schedule('30 20 * * *', () => {
    console.log(4)
  // 15 min
  const CBC = require('./sources/CBS News');
  CBC();
     });


cron.schedule('* 23 * * *', () => {
    console.log(5)
  //15 min
  const CNET = require('./sources/CNET');
  CNET();
});


cron.schedule('* 30 * * *', () => {
    console.log(6)
    //30
 const CNN = require('./sources/CNN');
 CNN();
  });


cron.schedule('* 20 * * *', () => {
    console.log(7)
  // 20
   const FOXNEWS = require('./sources/Fox News Channel');
   FOXNEWS();
  });


cron.schedule('* * 22 * *', () => {
    console.log(8)
// with low content and link to page contain videos about the movie/serie run it for 24h and more.
const HBO = require('./sources/HBO');
HBO();
});


cron.schedule('* 28 * * *', () => {
    console.log(9)
// 30 min
 const HuffPost = require('./sources/HuffPost');
 HuffPost();
});

cron.schedule('* 10 1 * *', () => {
    console.log(10)
//1h
 const LosAngelesNews = require('./sources/Los Angeles Daily News');
 LosAngelesNews();
});


cron.schedule('* 5 1 * *', () => {
    console.log(11)
    //1h
     const LosAngelesNews = require('./sources/Los Angeles Daily News');
     LosAngelesNews();
});

cron.schedule('* 3 1 * *', () => {
    console.log(12)
  //1h
const LosAngeleceTimes = require('./sources/Los Angeles Times');
LosAngeleceTimes();
});

cron.schedule('* 8 1 * *', () => {
    console.log(13)
    //1h
const MSNBC = require('./sources/MSNBC');
MSNBC()
});

cron.schedule('* 35 * * *', () => {
    console.log(14)
    //1h
const Gardian = require('./sources/The Guardian');
Gardian();
});

cron.schedule('* 33 * * *', () => {
    console.log(15)
    //1h
const NEWYORKTIMES = require("./sources/The New York Times");
NEWYORKTIMES();
});

cron.schedule('* 40 * * *', () => {
    console.log(16)
    //1h
const WALLSTREET = require('./sources/The Wall Street Journal');
WALLSTREET();
});


cron.schedule('* 55 * * *', () => {
    console.log(17)
    //1h
const WASHINGTONPOST = require('./sources/The Washington Post');
WASHINGTONPOST();
});

cron.schedule('* 50 * * *', () => {
    console.log(18)
    //1h
const VICENEWS = require('./sources/Vice News');
VICENEWS();
});



app.listen(PORT, ()=>{
    console.log('connected at '+ PORT);
});
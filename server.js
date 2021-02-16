const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3232;
const con = require("mongoose");
const {insertData, InsertData} = require('./function/insertData');

con.connect(process.env.DATABASE,{useNewUrlParser: true,useUnifiedTopology: true},(err,db)=>{
    if(err)console.log(err);
    else{
        console.log('connected')
    }
})



// 1 hour
// const ABC_NEWS = require('./sources/ABC News');
// ABC_NEWS();


// const BBC = require('./sources/BBC');
// BBC();


// 15 min
// const Bloomberg = require('./sources/Bloomberg');
// Bloomberg();

// 15 min
// const CBC = require('./sources/CBS News');
// CBC();

//15 min
// const CNET = require('./sources/CNET');
// CNET();

//30
// const CNN = require('./sources/CNN');
// CNN();

// 20
// const FOXNEWS = require('./sources/Fox News Channel');
// FOXNEWS();


// with low content and link to page contain videos about the movie/serie run it for 24h and more.
// const HBO = require('./sources/HBO');
// HBO();

// 30 min
// const HuffPost = require('./sources/HuffPost');
// HuffPost();

//1h
// const LosAngelesNews = require('./sources/Los Angeles Daily News');
// LosAngelesNews();


//1h
// const LosAngeleceTimes = require('./sources/Los Angeles Times');
// LosAngeleceTimes();

// const MSNBC = require('./sources/MSNBC');
// MSNBC()

// const Gardian = require('./sources/The Guardian');
// Gardian();

// const NEWYORKTIMES = require("./sources/The New York Times");
// NEWYORKTIMES();

//const WALLSTREET = require('./sources/The Wall Street Journal');

//const WASHINGTONPOST = require('./sources/The Washington Post');

//const VICENEWS = require('./sources/Vice News');



app.listen(PORT, ()=>{
    console.log('connected at '+ PORT);
});
const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3232;

// 1 hour
//const ABC_NEWS = require('./sources/ABC News');
//ABC_NEWS();


// const BBC = require('./sources/BBC');
// BBC();


// 15 min
// const Bloomberg = require('./sources/Bloomberg');
// Bloomberg();

// 15 min
//const CBC = require('./sources/CBS News');
//CBC();

//15 min
//const CNET = require('./sources/CNET');
//CNET();

const CNN = require('./sources/CNN');
CNN();

//const FOXNEWS = require('./sources/Fox News Channel');

// with low content and link to page contain videos about the movie/serie run it for 24h and more.
// const HBO = require('./sources/HBO');

//const HuffPost = require('./sources/HuffPost');

//const LosAngelesNews = require('./sources/Los Angeles Daily News');

//const MSNBC = require('./sources/MSNBC');

//const Gardian = require('./sources/The Guardian');

//const NEWYORKTIMES = require("./sources/The New York Times");

//const WALLSTREET = require('./sources/The Wall Street Journal');

//const WASHINGTONPOST = require('./sources/The Washington Post');

//const VICENEWS = require('./sources/Vice News');



app.listen(PORT, ()=>{
    console.log('connected at '+ PORT);
});
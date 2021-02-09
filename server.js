const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3232;
//const ABC_NEWS = require('./sources/ABC News');
//const Bloomberg = require('./sources/Bloomberg');
//const CBC = require('./sources/CBS News');
//const CNET = require('./sources/CNET');
//const CNN = require('./sources/CNN');
//const FOXNEWS = require('./sources/Fox News Channel');

// with low content and link to page contain videos about the movie/serie run it for 24h and more.
// const HBO = require('./sources/HBO');

//const HuffPost = require('./sources/HuffPost');

//const LosAngelesNews = require('./sources/Los Angeles Daily News');

const MSNBC = require('./sources/MSNBC');

MSNBC();

app.listen(PORT, ()=>{
    console.log('connected at '+ PORT);
});
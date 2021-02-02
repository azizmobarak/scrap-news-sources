const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3232;
const ABC_NEWS = require('./sources/ABC News');

ABC_NEWS();


app.listen(PORT, ()=>{
    console.log('connected at '+ PORT);
});
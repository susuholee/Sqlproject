


const express = require('express');
const path = require('path');
require('dotenv').config();
const Router = require('./Routers/router')

const app = express();


app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use('/public', express.static(path.join(__dirname,'public')));

app.use(Router);

app.listen(3000, () => {
    console.log('server on~')
})
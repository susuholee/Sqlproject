require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();

const boardrouter = require('./router/boardrouter')

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use('/public', express.static(path.join(__dirname, "public")));

app.use(boardrouter);

app.listen(3000, () => {
    console.log("서버 오픈이다~")
})
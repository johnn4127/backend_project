const express = require('express')
const bodyParser = require('body-parser');
const app = express();
const winston = require("winston");
const bcrypt = require('bcrypt')
// const {} = require('./models')
app.use(express.json())
//link ejs/css
app.use(express.static(__dirname + '/public'));
const path = require('path')
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/registration',(req,res) => {
    res.render("registration")
})

app.get('/',(req,res) => {
    res.render('home')
})


app.post('/register',(req,res)=>{
})

app.get('/login',(req,res) =>{
    res.render("login")
})

app.post('/login',(req,res)=>{
    res.render("login")
})

app.listen(3000, () =>{
    console.log(`Server is running on port 3000`)
})
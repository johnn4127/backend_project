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

//winston logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [

      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' }),
    ],
  });

    //winston logger added to all endpoints
  app.all('*', (req, res, next) => {
    logger.log({
      level: 'info',
      method: req.method,
      url: req.url,
      body: req.body,
      params: req.params,
      timestamp: new Date().toLocaleString()
    });
    next()
  })

app.get('/registration',(req,res) => {
    res.render("registration")
})

app.get('/home',(req,res) => {
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
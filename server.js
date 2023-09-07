const express = require('express')
const bodyParser = require('body-parser');
const app = express();
const winston = require("winston");
const bcrypt = require('bcrypt')
const {Accounts,Books,Histories} = require('./models')
const jwt=require('jsonwebtoken')
app.use(express.json())
//link ejs/css
app.use(express.static(__dirname + '/public'));
const path = require('path');
const db = "postgres://oniifgkp:VEr8-v22_Ty-JC7eNMdfoTFRPD8YcjLc@berry.db.elephantsql.com/oniifgkp";
const { Sequelize } = require("sequelize");
const sequelize = new Sequelize(db)
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

  app.get('/home',(req,res) => {
    res.render('home')
})

app.get('/registration',(req,res) => {
    res.render("registration")
})




app.post('/registration', async(req,res) => {
    const { firstName, lastName, email, password } = req.body;
    try {
        // Hash the password
        const saltRounds = 10; // You can adjust the number of salt rounds as needed
        const hashedPassword = await bcrypt.hash(password, saltRounds);
    
        // Store the hashed password in the database
        await Accounts.create({
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: hashedPassword, // Store the hashed password
          repassword: hashedPassword, // Store the hashed password
        });
}catch (err){
    console.log(err)
}
})


app.delete('/delete', async(req,res) =>{
    await Books.destroy({
        where:{book_name:"test"}
    })
    res.send("sent")
})
app.get('/login',(req,res) =>{
    res.render("login")
})

app.post('/login',(req,res)=>{
    res.render("login")
})

let user={
  id: "2",
  email: "theman@gmail.com" ,
  password: "lilbro"
}
const JWT_SECRET='some super secret...'
app.get('/forgot_password',(req,res,next) =>{
  res.render("forgot_password")
})

app.post('/forgot_password',(req,res,next)=>{
  const {email}=req.body;
//makes sure user exist in database
if(email !== user.email){

  res.send('User not found')
  return;
}
//creates a link for the existing user
const secret=JWT_SECRET + user.password
const payload={
  email: user.email,
  id: user.id
}
const token=jwt.sign(payload,secret,{expiresIn: '15m'})
const link=`http://localhost:3000/reset-password/${user.id}/${token}`
console.log(link)
res.send(`password reset link has been sent to ur email`)
})

app.get('/reset-password/:id/:token',(req,res,next)=>{
const {id,token}=req.params
res.send(req.params)
})
app.post('/reset-password',(req,res,next)=>{

})

app.listen(3000, () =>{
    console.log(`Server is running on port 3000`)
})
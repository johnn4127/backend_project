const express = require('express')
const bodyParser = require('body-parser');
const app = express();
const winston = require("winston");
const bcrypt = require('bcrypt')
const {Accounts,Books,Histories} = require('./models')
app.use(express.json())
//link ejs/css
app.use(express.static(__dirname + '/public'));
const path = require('path');
const db = "postgres://oniifgkp:VEr8-v22_Ty-JC7eNMdfoTFRPD8YcjLc@berry.db.elephantsql.com/oniifgkp";
const { Sequelize } = require("sequelize");
const sequelize = new Sequelize(db)
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }))

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
      //
      // - Write all logs with importance level of `error` or less to `error.log`
      // - Write all logs with importance level of `info` or less to `combined.log`
      //
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' }),
    ],
  });
  
  //
  // If we're not in production then log to the `console` with the format:
  // `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
  //
  if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
      format: winston.format.simple(),
    }));
  }
  
  
  
app.all('*', (req, res, next) => {
      logger.log({
          level: 'info',
          method: req.method,
          url: req.url,
          body: req.body,
          params: req.params,
          timestamp: new Date().toLocaleString()
      });
      next();
  })

  app.get('/home',(req,res) => {
    res.render('home')
})

app.get('/registration',(req,res) => {
    res.render("registration")
})

app.get('/account',(req,res) => {
    res.render('myAccount')
})

app.get('/update',(req,res) => {
    res.render('update_info')
    
})





app.get('/test', async(req,res) => {
    let bookdata = await Books.findAll()
    console.log(bookdata)
    res.render('forgot_password',{title:bookdata})
})

app.post('/registration', async(req,res) => {
    const { firstName, lastName, email, password, repassword} = req.body;
        const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
  // Check if password contains a URL
  if (urlRegex.test(password)) {
    return res.status(400).render('registration',{errorMessage:'Password should not contain a URL'});
}

  //
    //checks all fields are entered
    if (!firstName || !lastName ||!email || !password || !repassword) {
        return res.render('registration',{errorMessage:'All fields are required'});
      //  return res.render('register', { error: "All fields are required" }); --old code 
    }
    //first name only contains letters
    const nameRegex = /^[A-Za-z]+$/; 

    if (!nameRegex.test(firstName)) {
    return res.status(400).render('registration',{errorMessage:'Name should only contain letters'})}
    //last name contains letters
    if (!nameRegex.test(lastName)) {
      return res.status(400).render('registration',{errorMessage:'Name should only contain letters'})}
    
    //check password matches repassword
    if (password !== repassword) {
        return res.status(400).render('registration',{errorMessage:'Passwords do not match'});
        
    }
   //Email existing
    const existingEmail = await Accounts.findOne({ where: { email: email } });

  if (existingEmail) {
    return res.status(400).render('registration',{errorMessage:'Email already registered'});
    
  }
    try {
        // Hash the password
        const saltRounds = 10; 
        const hashedPassword = await bcrypt.hash(password, saltRounds);
    
        // Store the hashed password in the database
        await Accounts.create({
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: hashedPassword, // Store the hashed password
          repassword: hashedPassword, // Store the hashed password
        });
        res.render('registration',{ successMessage: 'Account created successfully' })
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
    res.render("home")

})

app.listen(3000, () =>{
    console.log(`Server is running on port 3000`)
})

app.get('/books', async(req,res) => {
  const allBooks = await Books.findAll()
  
  res.render("books", {allBooks:allBooks})
})
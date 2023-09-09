const express = require('express')
const bodyParser = require('body-parser');

const app = express();
const winston = require("winston");
const bcrypt = require('bcrypt')
const {Accounts,Books,Histories} = require('./models')
const jwt=require('jsonwebtoken')
const sgMail=require('@sendgrid/mail')
const API_KEY='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'
sgMail.setApiKey(API_KEY)
app.use(express.json())
const swaggerJSDoc = require('swagger-jsdoc');
//link ejs/css
app.use(express.static(__dirname + '/public'));
const path = require('path');
const db = "postgres://oniifgkp:VEr8-v22_Ty-JC7eNMdfoTFRPD8YcjLc@berry.db.elephantsql.com/oniifgkp";
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(db)
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }))
// const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('./swagger.json');
// const express = require('express');
// const app = express();
const swaggerUi = require('swagger-ui-express');

var options = {
  explorer: true,
  swaggerOptions: {
    urls: [
      {
        url: 'http://petstore.swagger.io/v2/swagger.json',
        name: 'Spec1'
      },
      {
        url: 'http://petstore.swagger.io/v2/swagger.json',
        name: 'Spec2'
      }
    ]
  }
}
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'Your API Title',
      version: '1.0.0',
      description: 'Description of your API',
    },
  },
  apis: ['./index.js'], // Specify the path to your main route file (index.js in this case)
};
const swaggerSpec = swaggerJSDoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(null, options));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));



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



  app.get('/home', (req, res) => {
    const userName = req.query.name; 
    res.render('home', { userName });

  });

  app.get('/userhome', async (req, res) => {
    const { email } = req.query;
    res.render('userhome', { email: email})
  });


  
  

app.get('/registration',(req,res) => {
    res.render("registration")
})

app.get('/account',(req,res) => {
    res.render('myAccount')
})

app.get('/update',(req,res) => {
    res.render('update_info')
    
})






  
app.get('/account',(req,res) => {
    res.render('myAccount')
})

app.get('/update',(req,res) => {
    res.render('update_info')
    
})

// Assuming you're using Express
app.get('/delete', (req, res) => {
    res.render('delete_info'); // Render the delete_account.ejs template
  });
  





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

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Assuming you have a Sequelize model named Accounts
        const user = await Accounts.findOne({ where: { email } });

        if (!user) {
            // Handle the case where the user doesn't exist
            return res.render('login_fail', { error: 'Account not found' }); // Pass the error message
        }

        // Check if the provided password matches the user's password (you should have password hashing logic)
        // For example, you can use bcrypt to compare the hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            // Handle incorrect password
            return res.render('login_fail', { error: 'Incorrect password' }); // Pass the error message
        }

        // Redirect to userhome with the email as a query parameter
        return res.redirect('/userhome?email=' + encodeURIComponent(email));
    } catch (error) {
        // Handle any database errors or other errors
        console.error('Error during login:', error);
        return res.status(500).send('Internal Server Error');
    }
});


  
  




let user={
  id: "2",
  email: "theman@gmail.com" ,
  password: "lilbro"
}

app.post('/delete_account', async (req, res) => {
    const { email } = req.body;
  
    try {
      // Assuming you have a Sequelize model named User
      const user = await Accounts.findOne({ where: { email } });
  
      if (!user) {
        // Handle the case where the user doesn't exist
        return res.status(404).send('User not found');
      }
      
      // Delete the user
      await user.destroy();
  
      // Redirect to a confirmation page
      return res.redirect('/home'); // Redirect to a confirmation page
    } catch (error) {
      // Handle any database errors with a more user-friendly message
      console.error('Error deleting user:', error);
      return res.status(500).send('An error occurred while deleting the account. Please try again later.');
    }
  });
  
  
const JWT_SECRET='some super secret...'
const message={
  to: 'deronfambro0112@gmail.com',
  from: 'snugglereads@gmail.com',
  subject: 'hello from snugglereads',
  text: 'hello from sendgrid',
  html: '<h1>Hello from Snugglereads</h1>'
}
sgMail.send(message).then(res=>console.log('email sent')).catch(err=>console.log(err.message))



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
//creates a one time link for the user
const secret=JWT_SECRET + user.password 
//stored in the jwt token
const payload={
  email: user.email,
  id: user.id
}
//creating the token and making it expire in 15 min
const token=jwt.sign(payload,secret,{expiresIn: '15m'})
const link=`http://localhost:3000/reset-password/${user.id}/${token}` //where the user goes when they click the link
console.log(link) //send emails here
res.send(`password reset link has been sent to your email`)
})



//this is the rounte the link above takes the user to
app.get('/reset-password/:id/:token',(req,res,next)=>{
const {id,token}=req.params

//this checks if the id is in the database
if(id !== user.id){
  res.send(`invalid id`)
  return
}
const secret=JWT_SECRET + user.password
try{
  const payload=jwt.verify(token, secret)
  res.render('reset-password',{email: user.email})
}catch(err){
  console.log(err.message)
  res.send(err.message)
}
})


app.post('/reset-password/:id/:token',(req,res,next)=>{
  const {id,token}=req.params
  const {password,password2}=req.body
  res.send(user)
  if(id !== user.id){
    res.send(`invalid id`)
    return
  }
  const secret=JWT_SECRET + user.password
  //validate password and passwoed2 should match
  try{
    const payload=jwt.verify(token, secret)
    user.password=password
    res.send(user)
  }catch(err){
    console.log(err.message)
    res.send(err.message)
  }
})



app.get('/books', async(req,res) => {
  
  const allBooks = await Books.findAll()
  
  res.render("books", {allBooks:allBooks})
})


app.listen(3000, () =>{
    console.log(`Server is running on port 3000`)
})

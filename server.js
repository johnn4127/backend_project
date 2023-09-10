const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const winston = require("winston");
const bcrypt = require('bcrypt')
const {Accounts,Books,Histories} = require('./models')
const jwt=require('jsonwebtoken')
const sgMail=require('@sendgrid/mail')
const {user}=require('./models')
const API_KEY= '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'                                   //'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'
sgMail.setApiKey(API_KEY)
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static(__dirname + '/public'));
const path = require('path');
const db = "postgres://oniifgkp:VEr8-v22_Ty-JC7eNMdfoTFRPD8YcjLc@berry.db.elephantsql.com/oniifgkp";
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize(db) //is this the same thing as line 164
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

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

  app.get('/', (req, res) => {
    const userName = req.query.name; 
    res.render('home', { userName });
    
  });

  app.get('/userhome', async (req, res) => {
    if (req.session.user) {
      // User is authenticated, you can access user data like req.session.user
      const user = req.session.user;
      res.render('userhome', { user });
    } else {
      // User is not authenticated, handle it accordingly (e.g., redirect to login)
      res.redirect('/login');
    }
  });
  


  
  

app.get('/registration',(req,res) => {
    res.render("registration")
})

app.get('/account',(req,res) => {
    res.render('myAccount')
})


const Account = require('./models/accounts'); // Import your model


app.get('/accountinfo', async (req, res) => {
  try {
    const accounts = await Accounts.findAll();

    
})






  
app.get('/account',(req,res) => {
    res.render('myAccount')
})

app.get('/update',(req,res) => {
    
    res.render('update_info')
    
})


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

app.get('/update_info', async (req, res) => {
    if (req.session.user) {
      const user = req.session.user; // Retrieve user data from the session
      res.render('update_info', { user });
    } else {
      res.redirect('/login'); // Redirect to the login page if not authenticated
    }
});



  
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
        return res.render('login_fail', { error: 'Account not found' });
      }
  
      // Check if the provided password matches the user's password
      const passwordMatch = await bcrypt.compare(password, user.password);
  
      if (!passwordMatch) {
        // Handle incorrect password
        return res.render('login_fail', { error: 'Incorrect password' });
      }
  
      // Store user data in the session upon successful login
      req.session.user = user;
  
      // Redirect to userhome with the email as a query parameter
      return res.redirect('/userhome');
    } catch (error) {
      console.error('Error during login:', error);
      return res.status(500).send('Internal Server Error');
    }
  });
  
  app.post("/update", async (req, res) => {
    const { newFirstName, newLastName, newEmail } = req.body;
    const userId = req.session.user.id; 
  
    try {
      
      const user = await Accounts.findByPk(userId);
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      // Update user information in the database
      user.firstName = newFirstName;
      user.lastName = newLastName;
      user.email = newEmail;
      await user.save();
  
      return res.json({ success: true });
    } catch (error) {
      console.error("Error updating user information:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
  





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
// const message={
//   to: 'deronfambro0112@gmail.com',
//   from: 'snugglereads@gmail.com',
//   subject: 'hello from snugglereads',
//   text: 'hello from sendgrid',
//   html: '<h1>Hello from Snugglereads</h1>'
// }
// sgMail.send(message).then(res=>console.log('email sent')).catch(err=>console.log(err.message))


app.get('/forgot_password',(req,res,next) =>{
  res.render("forgot_password")
})

app.post('/forgot_password',async(req,res,next)=>{
  const {email}=req.body;
//makes sure user exist in database
try{
  const user = await Accounts.findOne({ where: { email } });

    if (!user) {
      return res.send('User not found');
    }

    //creates a one time link for the user
    const secret=JWT_SECRET + user.password 
    //stored in the jwt token
    const payload={
      email: user.email,
      id: user.id
    }
    
//creating the token and making it expire in 1 day
const token=jwt.sign(payload,secret,{expiresIn: '1d'})
const link=`http://localhost:3000/reset-password/${user.id}/${token}` //where the user goes when they click the link
console.log(link) //send emails here
res.send(`password reset link has been sent to your email`)
})



//this is the rounte the link above takes the user to
app.get('/reset-password/:id/:token', async(req,res,next)=>{
const {id,token}=req.params
try{
  const user=await Accounts.findOne({ where: { id } })
  //this checks if the id is in the database
if(!user){
  res.send(`invalid id`)
  return
}
const secret=JWT_SECRET + user.password
console.log('token:',token)
console.log('secret:',secret)
payload=jwt.verify(token, secret)
console.log('payload',payload)
res.render('reset-password',{email: user.email})
}catch(err){
  console.log(token)
  res.send('an error occured during password reset')
}
})

app.post('/reset-password/:id/:token',async(req,res,next)=>{
  const {id,token}=req.params
  const {password,repassword}=req.body
  try {
    const userId = parseInt(id, 10);
    
    if (isNaN(userId)) {
      return res.send('Invalid user ID');
    }
    const user = await Accounts.findOne({ where: { id: userId } });  //remove iser id if err
    
    if(!user){
      return res.send(`invalid id`)
    }
    
    const secret=JWT_SECRET + user.password
    payload = jwt.verify(token, secret);

  if (password.trim() !== repassword.trim()) {
    console.log('Passwords do not match');
    return res.send('Passwords do not match');
  }
  const saltRounds = 10;
  const hashedNewPassword = await bcrypt.hash(password, saltRounds);
  // Update the user's password in the database
  user.password = hashedNewPassword;
  await user.save();
  
  const updatedUser = await Accounts.findOne({ where: { id: userId } });
  if (updatedUser && updatedUser.password !== hashedNewPassword) {
    console.log('Password update failed in the database');
    return res.send('Password update failed');
  }

  res.send('Password reset successful');
} catch (err) {
  console.error(err);
  res.send('Password reset failed');
}
});







app.listen(3000, () =>{
    console.log(`Server is running on port 3000`)
})

app.get('/books', async(req,res) => {
  const allBooks = await Books.findAll()
  
  res.render("books", {allBooks:allBooks})
})


app.listen(3000, () =>{
    console.log(`Server is running on port 3000`)
})

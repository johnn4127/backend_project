const express = require("express")
const app = express()
app.use(express.json()) 


app.get('/registration',(req,res) => {
    
})



app.post('/registration',(req,res)=>{
})

app.get('/login',(req,res) =>{

})

app.post('/login',(req,res)=>{
})

app.listen(3000, () =>{
    console.log(`Server is running on port 3000`)
})
const exp=require('express')
const app=exp();
require('dotenv').config()//It makes the available of enviromental variables in server file in the form of process.env file we can access them
const mongoose =require("mongoose");
const userApp = require('./APIs/userApi');
const authorApp = require('./APIs/authorApi');
const adminApp = require('./APIs/adminApi');
const cors=require('cors')
app.use(cors())
const port=process.env.PORT || 4000;//If it env file doesn't provide any port number
//db connection
mongoose.connect(process.env.DBURL)
.then(()=>{
    //after creating the database we need to assign the port number
    app.listen(port,()=>console.log(`server listening on port ${port}...`))
    console.log("Database connection success")
})
.catch(err=>console.log("Error in DB connection",err))

//body parser middleware
app.use(exp.json())
//connect API routes
app.use('/user-api',userApp);
app.use('/author-api',authorApp)
app.use('/admin-api',adminApp)
//error handler
app.use((err,req,res,next)=>{
    console.log("Error object in express error handler: ",err)
    res.send({message:err.message})
})
//any one can acces the our localhost instead of own authentication we are using clerk
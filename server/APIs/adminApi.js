const exp=require('express')
const expressAsyncHandler=require('express-async-handler')
const createUserOrAuthor=require('./createUserOrAuthor')
const UserAuthor=require('../models/userAuthorModel')
const adminApp=exp.Router()
//to protect backend
const {requireAuth}=require('@clerk/express')
require('dotenv').config()
//creating new admin
adminApp.post("/admin",expressAsyncHandler(createUserOrAuthor))
adminApp.get("/",(req,res)=>{
    res.send({Message:"This is from Admin"})
})
//getting all users
adminApp.get('/users',requireAuth({signInUrl:"unauthorized"}),expressAsyncHandler(async(req,res)=>{
    //read all article from db
    const listOfUsers=await UserAuthor.find({role:'user'});
    res.status(200).send({message:"users",payload:listOfUsers})
}))
//get all authors
adminApp.get('/authors',requireAuth({signInUrl:"unauthorized"}),expressAsyncHandler(async(req,res)=>{
    //read all article from db
    const listOfAuthors=await UserAuthor.find({role:'author'});
    res.status(200).send({message:"authors",payload:listOfAuthors})
}))
//for unauthorized access
adminApp.get('/unauthorized',(req,res)=>{
    res.send({message:"Unauthorized request"})
})
//authors get modified
adminApp.put("/author/:email",requireAuth({signInUrl:"unauthorized"}),expressAsyncHandler(async(req,res)=>{
    //get modified user
    const email=req.params.email;
    const {isActive}=req.body;
    //update user by userid
    const dbRes=await UserAuthor.findOneAndUpdate({email:email},
        {isActive:isActive},
        {new:true})
        //send res
        res.status(200).send({message:"user is blocked or unblocked",payload:dbRes})
    
}))
//user get modified
adminApp.put("/user/:email",requireAuth({signInUrl:"unauthorized"}),expressAsyncHandler(async(req,res)=>{
    //get modified user
    const email=req.params.email;
    const {isActive}=req.body;
    //update user by userid
    const dbRes=await UserAuthor.findOneAndUpdate({email:email},
        {isActive:isActive},
        {new:true})
        //send res
        res.status(200).send({message:"user is blocked or unblocked",payload:dbRes})
    
}))
module.exports=adminApp;
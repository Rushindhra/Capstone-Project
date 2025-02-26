const exp=require('express')
const userApp=exp.Router();
const expressAsyncHandler=require('express-async-handler')
const createUserOrAuthor=require('./createUserOrAuthor')
const UserAuthor=require("../models/userAuthorModel")
const Article=require("../models/articleModel")
//API
// userApp.get("/users",async(req,res)=>{
//     //get user
//     let usersList=await UserAuthor.find()
//     res.send({message:"Users",payload:usersList})
// })

//creating new user
userApp.post("/user",expressAsyncHandler(createUserOrAuthor))

//add comment
userApp.put('/comment/:articleId',expressAsyncHandler(async(req,res)=>{
    //get comment obj
    const commentObj=req.body;
    //add commentsObj to comments array of article
    const articleWithComment=await Article.findOneAndUpdate(
        {articleId:req.params.articleId},
        {$push:{comments:commentObj}},
        {returnOriginal:false}
        
    )
    //send res
    res.status(200).send({message:"comment added",payload:articleWithComment})
}))
module.exports=userApp;
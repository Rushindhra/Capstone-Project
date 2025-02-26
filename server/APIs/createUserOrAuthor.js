const UserAuthor=require('../models/userAuthorModel')
//function for creaing user or author
async function createUserOrAuthor(req,res){
    //business logic to create the user or author
        //get useror authorobject from req
        const newUserAuthor=req.body;
        //find user by email id
        const userInDb=await UserAuthor.findOne({email:newUserAuthor.email})
        //user or auther existed
        if(userInDb!=null)
        {
            //check with role
            if(newUserAuthor.role===userInDb.role)
            {
                res.status(200).send({message:newUserAuthor.role,payload:userInDb})
            }else{
                //if the role is not matched
                res.status(200).send({Message:"Invalid role"})
            }
        }else{
            //if the user doesn't exist create the new user in the database 
            let newUser=new UserAuthor(newUserAuthor);
            //save the new user in returns the new document
            let newUserOrAuthorDoc=await newUser.save();
            res.status(201).send({message:newUserOrAuthorDoc.role,payload:newUserOrAuthorDoc})
        }
}

module.exports=createUserOrAuthor;
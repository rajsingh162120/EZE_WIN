const adminRouter = require("express").Router();

const User = require("../Models/userModel.js");
const { verifyToken } = require("../utlis/generateToken.js");

//GET ALL USERS 
adminRouter.get("/allusers", async( req, res )=>{
    const token = req.headers.authorization;
    if(!token){
        res.status(401).json({ message : "Authorization token is missing" });
    }
    const tokenResult = verifyToken(token);
    if(tokenResult.success){
        const adminId = tokenResult.message;
        const adminExists = await User.findById(adminId);
        if(adminExists.isAdmin){
            const allUsers = await User.find();
            res.status(200).json({message : allUsers})
        }else{
            res.status(400).json({message : "unAuthorized User"});
        }
    }
    else{
        res.status(400).json({message : "Token expired"})
    }
});

//DELETE ALL USERS
adminRouter.delete("/allusers",async(req,res)=>{
    const token = req.headers.authorization;
    if(!token){
        res.status(401).json({ message : "Authorization token is missing" });
    }
    const tokenResult = verifyToken(token);
    if(tokenResult.success){
        const adminId = tokenResult.message;
        const adminExists = await User.findbyId(adminId);
        if(adminExists.isAdmin){
            const deleteUsers = await Users.deleteMany(isAdmin);
            if(deleteUsers){
                res.status(200).json({ message : "users deleted successfully" });
            }else{
                res.status(401).json({ message : "Got error while deletion" });
            }
        }
        else{
            res.status(401).json({ message : "unAuthorized User" });
        }
    }else{
        res.status(400).json({ message : "Token expired" });
    }
})

module.exports = adminRouter;
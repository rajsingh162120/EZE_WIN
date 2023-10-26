
const express = require("express");
const router = express.Router();

const User = require("../Models/userModel.js");
const { verifyToken } = require("../utlis/generateToken.js");

const AdminController = require('../Controllers/Admin/AdminController');
const QuestionController = require('../Controllers/Admin/QuestionController');
const ContestController = require('../Controllers/Admin/ContestController');

router.get('/dashboard',AdminController.dashboard);
router.get('/profile',AdminController.profile);
router.get('/user',AdminController.user);
router.get('/user-details',AdminController.user_details);

router.get('/question',QuestionController.index);
router.get('/question-details',QuestionController.show);
router.post('/store-question',QuestionController.store);
router.post('/update-question',QuestionController.update);
router.post('/delete-question',QuestionController.delete);

router.get('/contest',ContestController.index);
router.get('/contest-details',ContestController.show);
router.post('/store-contest',ContestController.store);
router.post('/update-contest',ContestController.update);
router.post('/delete-contest',ContestController.delete);

router.get('/setting',AdminController.setting);

router.post('/logout',AdminController.logout);

//GET ALL USERS 
router.get("/allusers", async( req, res )=>{
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
router.delete("/allusers",async(req,res)=>{
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

module.exports = router;

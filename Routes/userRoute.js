const userRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../Models/userModel.js");
const { generateToken, verifyToken } = require("../utlis/generateToken.js");

//PASSWORD VALIDATION
isValidPassword=(Password)=>{
    return(
        Password.length >=5 && /[A-Z]/.test(Password) && /[a-z]/.test(Password) && /\d/.test(Password)
    );
};

//OTP
otp=()=>{ return 1234 };

//REGISTRATION API
userRouter.post("/register",async(req,res)=>{
    try{
        const { Name, Email, Phone_Number, Gender, Password } = req.body;
        const userExists = await User.findOne({ $and : [{Email}, {Phone_Number}] });
        if(!userExists){
            if(isValidPassword(Password)){
                const Newuser = await User.create({ Name, Email,Phone_Number, Gender, Password });
                if(Newuser){
                    res.status(200).json({ message : "Registration Successful", token : generateToken(Newuser)});
                }else{
                    res.status(404).json({ message : "Invalid User Data" });
                };
            }else{
                res.status(401).json({ message : "Invalid password" });
            };
        }else{
            res.status(409).json({ message : "User Already registered" });
        };
    }catch(error){
        res.status(500).json({ error : "Internal server error" });
        console.log(error);
    };
});

//LOGIN API
userRouter.post("/login",async(req,res)=>{                        
    try{
        const { Email, Password, Phone_Number } = req.body
        const userExists = await User.findOne({ $or : [{ Email }, { Phone_Number }] });
        if(userExists){
            if(await userExists.matchPassword(Password)){
                res.status(200).json({ message : "Login Successful", _id : userExists._id,  Name : userExists.Name, Token : generateToken(userExists._id) });
            }else{
                res.status(401).json({ message : "Password is wrong" });
            };
        }else{
            res.status(404).json({ message : "User not found" });
        };
    }catch(error){
        res.status(500).json({ error : "Internal Server Error" });
        console.log(error);
    };
});

//FORGOT PASSWORD
userRouter.post("/forgotpassword",async(req,res)=>{
    try{
        const { Email, Phone_Number } = req.body;
        const userExists = await User.findOne({$and : [{Email}, {Phone_Number}]});
        if(userExists){
            res.status(200).json({message : "Credentials matched enter new password ", _id : userExists._id});
        }else{
            res.status(400).json({ message : "User not found" });
        };
    }
    catch(error){
        res.status(500).json({ error : "Internal Server Error" });
        console.log(error)
    };
});

//UPDATE PASSWORD
userRouter.post("/updatepassword/:id",async(req,res)=>{
    try {
        const userId = req.params.id;
        const { NewPassword, ConfirmPassword } = req.body;
        const user = await User.findById(userId);
        if(user){
            if(isValidPassword( NewPassword && ConfirmPassword )){
                if(NewPassword === ConfirmPassword){
                    const hashedPassword = await bcrypt.hash( NewPassword, 10 );
                    await User.updateOne({_id : userId}, {$set : { Password : hashedPassword }});
                    // const newToken = generateToken(userId);
                    res.status(200).json({message : "Password updated successfully"});
                }else{
                    res.status(400).json({message : "Password doesn't match"});
                }
            }else{
                res.status(400).json({message : "Invalid new password"});
            }
        }
        else{
            res.status(400).json({ message : "User notFound" });
        }
    } catch (error) {
        res.status(500).json({Error : "Internal server error"});
    }
});


//USER - PROFILE
userRouter.get("/profile",async(req,res)=>{
   try{
    const token = req.headers.authorization;
    if(!token){
        res.status(401).json({ message : "Authorization token is missing" })
    }
    const tokenResult = verifyToken(token);
    if(tokenResult.success){
        const userId = tokenResult.message;
        const userExists = await User.findById(userId);
        if(!userExists){
            res.status(400).json({message : "User not found"});
        }
        else{
            res.status(200).json({
                _id : userExists._id,
                Name : userExists.Name,
                Email : userExists.Email,
                Phone_Number : userExists.Phone_Number,
                Gender : userExists.Gender,
                createdAt : userExists.createdAt
            });
        }
    }else{
        res.status(400).json({ message : "Token is not valid or expired" })
    }
   }catch(error){
    res.status(500).json({message:"Internal server error"});
    console.log(error);
   } 
});

module.exports = userRouter;
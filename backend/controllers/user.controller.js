import {User} from "../models/user.model.js"; 
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import crypto from "crypto";
import { sendResetEmail } from "../utils/sendMail.js"; 
//Business logic
export const register = async(req,res) =>{
    try{
        const{fullname,email,phoneNumber,password,role} = req.body;
        if(!fullname || !email || !phoneNumber || !password || !role){
            return res.status(400).json({
            message:"Something is missing",
            success:false
        });
    };
    const file = req.file;
    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
    const user = await User.findOne({email});
    if(user){
        return res.status(400).json({
            message:'User already exists',
            success:false,
        })
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
        fullname,
        email,
        phoneNumber,
        password:hashedPassword,
        role,
        profile:{
            profilePhoto:cloudResponse.secure_url,
        }
    });
    return res.status(201).json({
        message:'Account created successfully',
        success:true
    });
}
    catch(error){
        console.log(error)
    }
}
export const login = async(req,res) =>{
    try {
        const {email,password,role} = req.body;
        if(!email || !password || !role){
            return res.status(400).json({
            message:"Something is missing",
            success:false
        });
    };
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                message:"Incorrect email or password.",
                success:false,
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch){
            return res.status(400).json({
                message:"Incorrect email or password.",
                success: false,
            })
        }
        //check role is correct or not
        if(role !== user.role){
            return res.status(400).json({
                message:"Account doesn't exist with current role.",
                success:false,
            })
        };
        const tokenData = {
            userId :user._id
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' })
        //store the token into cookies
        user = {
            userId:user._id,
            fullname:user.fullname,
            email:user.email,
            phoneNumber:user.phoneNumber,
            role:user.role,
            profile:user.profile
        }
        return res.status(200).cookie("token",token,{maxAge:1*24*60*60*1000,httpOnly:true,sameSite:'strict'}).json({
            message:`welcome back ${user.fullname}`,
            user,
            success:true
        })
    } catch (error) {
        console.log(error)
    }
}
export const logout = async (req,res) =>{
    try {
        return res.status(200).cookie("token","",{maxAge:0}).json({
            message:"Logged out succesfully",
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}
export const updateProfile = async(req,res) => {
    try {
        const {fullname,email,phoneNumber,bio,skills} = req.body;
        
        const file = req.file;
        //cloudinary will come here later on will implement
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        let skillsArray = [];
    if(skills) skillsArray = skills.split(",");
    const userId = req.id; //middleware authentication
    let user = await User.findById(userId);
    if(!user){
        return res.status(400).json({
            message:"user not found",
            success:false
        })
    }
    //updating data
    if(fullname)user.fullname = fullname
    if(email)user.email = email
    if(phoneNumber)user.phoneNumber = phoneNumber
    if(bio)user.profile.bio = bio
    if(skills)user.profile.skills = skillsArray
    // console.log(user.fullname,user.email,user.phoneNumber,user.profile.bio,user.profile.skills);

    //resume will be here later on will implement
    if(cloudResponse){
        user.profile.resume = cloudResponse.secure_url // save the cloudinary url
        user.profile.resumeOriginalName = file.originalname // save the original file name
    }

    await user.save();
    user = {
        _id:user._id,
        fullname:user.fullname,
        email:user.email,
        phoneNumber:user.phoneNumber,
        role:user.role,
        profile:user.profile
    }
    return res.status(200).json({
        message:"profile updated successfully.",
        user,
        success:true
    })
 } catch (error) {
        console.log(error);
}
};

export const updateProfilePic = async (req, res) => {
  try {
    const userId = req.id;  // <-- use req.id, not req.user
   // console.log("User ID:", userId);
    
    const file = req.file;
   // console.log("priiting the file", file);
    if (!file) {
      return res.status(400).json({ message: "No file provided." });
    }
        
    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update profile.profilePhoto
    user.profile = {
      ...user.profile,
      profilePhoto: cloudResponse.secure_url,
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile picture updated successfully.",
      profilePhoto: user.profile.profilePhoto,
    });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile picture.",
    });
  }
};


export const forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
  
      // check if email is provided
      if (!email) {
        return res.status(400).json({
          message: "Email is required.",
          success: false,
        });
      }
  
      // find user
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          message: "User not found.",
          success: false,
        });
      }
  
      // generate reset token
      const token = crypto.randomBytes(32).toString("hex");
      const expireTime = Date.now() + 60 * 60 * 1000; // 1 hour
      user.resetToken = token;
      user.resetTokenExpire = expireTime;
  
      // save token to user
      await user.save();
  
      // dynamically get reset link
      const origin = req.headers.origin || `http://${req.headers.host}`;
      const resetLink = `${origin}/reset-password/${token}`;
  
      // send email
      await sendResetEmail(email, resetLink);
  
      return res.status(200).json({
        message: "Reset link sent successfully!",
        success: true,
      });
  
    } catch (error) {
      console.log("Forgot Password Error:", error);
      return res.status(500).json({
        message: "Server error. Try again later.",
        success: false,
      });
    }
  };
  
  export const resetPassword = async (req, res) => {
    try {
      const { token } = req.params;
      const { newPassword } = req.body;
      if (!newPassword) return res.status(400).json({ message: "New password is required." });
      const user = await User.findOne({
        resetToken: token,
        resetTokenExpire: { $gt: Date.now() },
      });
      if (!user) return res.status(400).json({ message: "Invalid or expired token." });
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      user.resetToken = undefined;
      user.resetTokenExpire = undefined;
      await user.save();
      return res.status(200).json({ message: "Password reset successfully!" });
    } catch (error) {
      console.error("Reset Password Error:", error);
      return res.status(500).json({ message: "Server error. Try again later." });
    }
  };
  
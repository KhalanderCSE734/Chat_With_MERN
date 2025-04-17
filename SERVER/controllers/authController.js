import User from '../models/userModel.js';



import bcrypt from 'bcryptjs';
import 'dotenv/config';



import cloudinary from '../config/cloudinary.js';


import { setUserTokenAndCookie } from '../middlewares/jwtAuth.js';


const signup = async(req,res)=>{
    const {fullName,email,password} = req.body;

    if(!fullName){
        return res.status(400).json({success:false,message:`Name is Required`});
    }
    if(!email){
        return res.status(400).json({success:false,message:`E-Mail is Required`});
    }
    if(!password){
        return res.status(400).json({success:false,message:`Password is Required`});
    }
    if(password.length<6){
        return res.status(400).json({success:false,message:`Password Must be minimum of 6 letters`})
    }

    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    // Above Is for strong password confirmation 



    try{

        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({success:false,message:`User Already Exist`});
        }


        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = await User.create({
            fullName,
            email,
            password:hashedPassword,
        })

        setUserTokenAndCookie(newUser,res);

        return res.status(201).json({success:true,message:`User Created SuccessFully`});

    }catch(error){
        return res.status(500).json({success:false,message:`${error.message}`});
    }

}




const login = async (req,res)=>{
    const {email,password} = req.body;

    if(!email){
        return res.status(400).json({success:false,message:`Email Is Required to Login`});
    }
    if(!password){
        return res.status(400).json({success:false,message:`Password Is Required to Login`});
    }

    try{

        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({success:false,message:`User Doesn't Exist with the Provided E-Mail`});
        }

        const isPassWordMatch = await bcrypt.compare(password,user.password); 

        if(!isPassWordMatch){
            return res.status(400).json({success:false,message:`Incorrect PassWord!, Please Try Again`});
        }

        setUserTokenAndCookie(user,res);

        return res.status(200).json({success:true,message:`User LoggedIn Successfully`});




    }catch(error){
        return res.status(500).json({success:false,message:`${error.message}`});
    }



}



const logOut = async (req,res)=>{

    try{
        res.clearCookie('JWT',{
            httpOnly:true,
            secure:process.env.NODE_ENV === 'production',
            sameSite:process.env.NODE_ENV === 'development' ? 'strict' : 'none',
        })

        return res.status(200).json({success:true,message:`User Logged Out SuccessFully`});
    }catch(error){
        return res.status(500).json({success:false,message:`${error.message}`});
    }


}



/**
 *            How to Use "Cloudinary"
 *      1.) First of visit 'https://www.cloudinary.com' and Creat Account
 *      2.) Visit DashBoard of the website
 *      3.) Copy Past the 'cloud name' from the website into '.env' file
 *      4.) Then Go to 'settings' of in the website 
 *      5.) Then go to 'Api keys' section there
 *      6.) Then Create (or Generate) a new 'Api key' for the Project (After entering the confirmation code from Gmail)
 *      7.) Then Copy Paste the 'API key' and 'Api secret' into '.env' file 
 *      8.) Then follow the code written in '/server/config/cloudinary.js'
 *      9.) The 'const response = await cloudinary.uploader.upload(profilePic);'
 */


const updateProfile = async (req,res)=>{
    let { name, email,  profilePic} = req.body;
    // console.log(req.body);
    const userId = req.user;


    if(!profilePic){
        return res.json({success:false,message:`Profile Picture is Needed to Update the Profile`});
    }

    try{
        
        const user = await User.findById(userId);
        if(!user){
            return res.status(400).json({success:false,message:`User Doesn't Exist`});
        }

        if(!name){
             name = await User.findOne({_id:userId}).fullName;
        }
        if(!email){
             email = await User.findOne({_id:userId}).email;
        }


        const uploadedPic = await cloudinary.uploader.upload(profilePic);

        // console.log(" The Profile Photo Uploaded by the User is ",uploadedPic);


        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $set:{
                    fullName:name,
                    email:email,
                    profilePic:uploadedPic.secure_url,
                }
            },
            { new: true }
        )
        
        // console.log("Upadate user After updating the Profile Picture is ",updatedUser);

        res.status(200).json({success:true,message:`Profile Updated SuccessFully`,userData:{
            userId:updatedUser._id,
            name:updatedUser.fullName,
            email:updatedUser.email,
            profilePic:updatedUser.profilePic,
            createdAt:updatedUser.createdAt,
        }});

    }catch(error){
        // console.log(error);
        return res.status(500).json({success:false,message:`${error.message}`});
    }



}   



const checkAuthorisation = async (req,res)=>{
    try{
        // const userId = req.user;
        // console.log(userId);
        return res.status(200).json({success:true,message:`User Is Authorized`});
    }catch(error){
        return res.status(500).json({success:false,message:`${error.message}`});
    }
}




export {signup,login,logOut,checkAuthorisation,updateProfile};
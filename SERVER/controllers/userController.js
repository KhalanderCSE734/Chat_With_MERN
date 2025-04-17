import User from "../models/userModel.js";

const getUser = async (req,res)=>{

    const userId = req.user;

    if(!userId){
        return res.json({success:false,message:`UnAuthorized User`});
    }

    try{

        const user = await User.findById(userId);
        if(!user){
            return res.json({success:false,message:`User Doesn't Exist`});
        }
         
        return res.json({success:true,userData:{
            userId:user._id,
            name:user.fullName,
            email:user.email,
            profilePic:user.profilePic,
            createdAt:user.createdAt,
        }})

    }catch(error){
        return res.json({success:false,message:error.message});
    }

}

export { getUser };
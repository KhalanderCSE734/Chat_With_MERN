import User from "../models/userModel.js";
import Message from "../models/messageModel.js";
import cloudinary from "../config/cloudinary.js";



import { getReceiverSocketId, io } from "../config/socket.js";



const getUsersForSideBar = async (req,res)=>{


    try{

        const loggedInUserId = req.user;
        const filterdUsers = await User.find(
            {
                _id: 
                    {
                        $ne:loggedInUserId,
                    }
            }
        ).select("-password");
        
        // Here Above '.select' will make sure that 'password' is not selected

        return res.status(200).json({success:true,message:filterdUsers});


    }catch(error){
        return res.status(500).json({success:false,message:error.message});
    }

}


const sendMessages = async(req,res)=>{
    try{
        
        let {text,image} = req.body;
        const recieverId = req.params.id;
        const userId = req.user;

        // console.log(recieverId,userId,text,image);

        let imageURl="";

        if(image!=""){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageURl = uploadResponse.secure_url;
        }
      
        if(!text){
            text = " ";
        }

        const newMessage = await Message.create({
            senderId:userId,
            receiverId:recieverId,
            text:text,
            image:imageURl,
        });

        await newMessage.save();


        /** Real Time with Socket.io */
        const receiverSockeId = getReceiverSocketId(recieverId);

        if(receiverSockeId){
            io.to(receiverSockeId).emit("newMessage",newMessage);
        }



        return res.status(201).json({success:true,message:newMessage});



    }catch(error){
        return res.status(500).json({success:false,message:error.message});
    }

}



const getMessages = async (req,res)=>{
    try{


        let  id  = req.params.id;
        const senderId = req.user;

        // console.log(id);

        if(id.includes(":")){
            id = id.replace(":","");
        }

        const messages = await Message.find(
            {
                $or:[
                    {senderId:senderId,receiverId:id},
                    {senderId:id,receiverId:senderId}
                ]
            }
        );

        return res.status(200).json({success:true,message:messages});

    }catch(error){
        console.log("Error in GeMessages ",error);
        return res.status(500).json({success:false,message:error.message});
    }
}

export { getUsersForSideBar, getMessages, sendMessages };
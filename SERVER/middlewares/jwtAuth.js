import JWT from 'jsonwebtoken';

import 'dotenv/config';



const setUserTokenAndCookie = (user,res)=>{
    const payLoad = {
        userId:user._id,
    }

    const token = JWT.sign(payLoad,process.env.JWT_SECRET,{expiresIn:'7d'});

    res.cookie('JWT',token,{
        htttpOnly:true,
        secure:process.env.NODE_ENV === 'production',
        sameSite:process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    })

}



const userAuth = async (req,res,next)=>{
    try{    

        const token = req.cookies.JWT;
        if(!token){
            return res.json({success:false,message:`Your Session Has Been Expired , Login Please`});
        }

        const user = JWT.verify(token,process.env.JWT_SECRET);

        if(user.userId){
            // req.body = {...req.body,userId:user.userId};
            req.user = user.userId;
        }else{
            return res.status(401).json({success:false,message:`User Is Not Authorized, Login Again Please`});
        }

        next();


    }catch(error){
        return res.json({success:false,message:`${error.message}`});
    }
}


export {setUserTokenAndCookie,userAuth};
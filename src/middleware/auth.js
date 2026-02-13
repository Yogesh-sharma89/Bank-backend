import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import BlockModel from '../models/blockInvalidTokenModel.js';

export const authMiddleware = async(req,res,next)=>{

    const token  = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if(!token){
        return res.status(401).json({meessage:'Unauthorized access'})
    }

    const isBlocked = await BlockModel.findOne({token});

    if(isBlocked){
        return res.status(401).json({message:'Unauthorized access'})
    }

    try{

        //check the token 

        const decoded =  jwt.verify(token,process.env.JWT_SECRET)

        const user = await User.findById(decoded.id);

        if(!user){
            return res.status(404).json({message:'User not found . Please register to continue'})
        }

        req.user  = user;

        return next();

    }catch(err){
        console.log(`Error in auth middleware  : ${err}`)
        return res.status(500).json(
            {message:'failed to authenticate token in auth middleware '}
        )
    }

}

export const authSystemUserMiddleware  = async(req,res,next)=>{
    
    const token  = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if(!token){
        return res.status(401).json({meessage:'Unauthorized access'})
    }

    const isBlocked = await BlockModel.findOne({token});

    if(isBlocked){
        return res.status(401).json({message:'Unauthorized access'})
    }

    try{

        const decoded =  jwt.verify(token,process.env.JWT_SECRET)

        const user = await User.findById(decoded.id).select("+systemUser");



        if(!user){
            return res.status(404).json({message:'User not found . Please register to continue'})
        }

        console.log("User email ",user.email);
        console.log("system user ",user.systemUser)

        if(!user?.systemUser){
            return res.status(403).json(
                {
                    message:'Fordbidded access , not a system user'
                }
            )
        }

        req.user = user;

        return next();

    }catch(err){
      console.log(`Error in auth system user middleware  : ${err}`)
        return res.status(500).json(
            {message:'failed to check system user '}
        )
    }
}
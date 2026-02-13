import User from "../models/userModel.js";
import jwt from 'jsonwebtoken'
import { sendLoginEmail, sendRegistirationEmail } from "../services/email.js";
import BlockModel from "../models/blockInvalidTokenModel.js";


export const Register = async(req,res)=>{
    try{
    const {email,password,name} = req.body;

    if(!email || !password || !name){
        return res.status(400).json({message:"All fields are required to register"})
    }

    const user = await User.findOne({email});

    if(user){
        return res.status(422).json({message:'Account already exits with this email',success:false})
    }


    const newUser = await User.create({
        email,password,name
    })

    //create jwt token

    const payload={
        id:newUser.id,
        email:newUser.email
    }

    const secretKey = process.env.JWT_SECRET;

    const token =  jwt.sign(payload,secretKey,{expiresIn:'3d'});

    res.cookie('token',token);

    res.status(201).json({
        user:newUser,
        message:"User registered successfully",
        success:true,
        token
    })

    await sendRegistirationEmail(newUser.email,newUser.name);

    return;

    }catch(err){
        console.log('Failed to register user : '+err);
        return res.status(500).json({message:"Failed to create user account"})

    }
}

export const Login = async(req,res)=>{

    const {email,password} = req.body;

    if(!email || !password){
        return res.status(404).json({message:"Email or password is required to login"})
    }

    //find user 

    try{

        const user = await User.findOne({email});

        if(!user){
            return res.status(401).json({message:"Email not registered.",success:false})
        }

        const isValidEmail =  user.email === email;

        const isValidPassword = await user.comparePassword(password);

        if(!isValidEmail || !isValidPassword){
            return res.status(400).json({message:'Invalid email or password'})
        }

        //create new token '

        const payload={
            id:user.id,
            email:user.email
        }

        const secretKey = process.env.JWT_SECRET;

        const token =  jwt.sign(payload,secretKey,{expiresIn:'3d'});

        res.cookie('token',token);

        res.status(200).json({message:"Login successfull",success:true,token});

        //send email 
        
        await sendLoginEmail(user.email,user.name);

        return;
        


   }catch(err){
    console.log('Error in login controller : '+err);
    return res.status(500).json({message:'Failed to login',success:false})

   } 


}

export const Logout = async(req,res)=>{
    try{

        const token  = req.cookies.token || req.headers.authorization?.split(" ")[1];

        if(!token){
            return res.status(200).json({meessage:'You are already logged out.'})
        }

        res.cookie("token","");

        await BlockModel.create({
            token
        });

        return res.status(200).json({message:'User logged out successfully',success:false})



    }catch(err){

        console.log('Error in log out controller ',err);
        return res.status(500).json({message:"Failed to logout",success:false})

    }
}
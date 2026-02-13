import mongoose from "mongoose";
import Account from "../models/accountModel.js";
import { sendAccountCreatingEmail } from "../services/email.js";

export const createAccount = async(req,res)=>{
    try{

        const user  = req.user;

        const  existingAccount =  await Account.findOne({user:user._id});

        if(existingAccount){
            return res.status(400).json({message:'Your account is already exits',success:false})
        }

        //now create account 

        const newAccount = await Account.create({
            user:user._id
        })

        res.status(201).json(
            {message:'Account created successfully',success:true,account:newAccount}
        )

        //send account creaitng email

        await sendAccountCreatingEmail(user.email,user.name,newAccount._id,newAccount.createdAt)

        
    }catch(err){
        console.log('error in creating account : '+err);
        return res.status(500).json({message:'failed to create account',success:false})
    }
}

export const getCurrentUserAllAccounts = async(req,res)=>{
    try{
 
      const accounts = await Account.find({user:req.user._id});

      return res.status(200).json(
        {
            message:'All account fetch successfully',
            accounts,
            success:true,
            no_of_accounts : accounts.length
        }
      )

    }catch(err){

        console.log('error in get users all accounts ',err);

        return res.status(500).json({
            message:err.message || 'Internal server error',
            success:false
        })

    }
}

export const getAccountBalance = async (req , res )=>{

    const {accountId} = req.params;

    console.log(accountId);
    console.log(`Is valid objectId : ${mongoose.Types.ObjectId.isValid(accountId)}`)
    console.log(req.user._id);

    if(!accountId){
        return res.status(400).json({
            message:'Account Id is required to get account balance',
            success:false
        })
    }

    //get account by this id 

    const account   = await Account.findOne({
        _id:accountId,
        user:req.user._id
    });

    console.log(account);

    if(!account){
        return res.status(404).json(
            {
                message:`Account with the Id : ${accountId} not found`,
                success:false
            }
        )
    }

    const balance = await account?.getBalance();

    return res.status(200).json(
        {
            message:'Account balance fetch successfully',
            success:false,
            account,
            balance
        }
    )
}
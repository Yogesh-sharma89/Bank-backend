import mongoose, { mongo } from "mongoose";
import Account from "../models/accountModel.js";
import Transaction from "../models/transactionModel.js";
import Ledger from "../models/ledgerModel.js";
import { sendIntialTransactionEmail, sendTransactionEmail, sendTransactionFailEmail } from "../services/email.js";

export const createTransaction  = async(req,res)=>{

    const session   = await mongoose.startSession();
    session.startTransaction();
    
    const { from , to , amount,key} = req.body;

    try{

    

    if(!from || !to || !amount || !key){
        await session.abortTransaction();
        return res.status(400).json({message:'Invalid request  . Some info is missing',success:false})
    }

    const fromUserAccount = await Account.findOne({_id:from},null,{session});

    const toUserAccount = await Account.findOne({_id:to},null,{session});

    if(!fromUserAccount || !toUserAccount){
        await session.abortTransaction();
        return res.status(404).json(
            {
                message:'No accounts found . transaction failed',
                success:false
            }
        )
    }

    //check that this trnasaction is created before or not with the help of unique key 

    const existingTransaction =  await Transaction.findOne({idempotencyKey:key}).session(session);

    if(existingTransaction){
        if(existingTransaction.status==='COMPLETED'){

            await session.commitTransaction();
            return res.status(200).json(
                {
                    message:'This transaction has completed',
                    transaction:existingTransaction,
                    success:true
                }
            )
        }

        if(existingTransaction.status==='PENDING'){
            return res.status(200).json(
                {
                    message:'Transaction is still processing',
                    success:'pending',
                    transaction:existingTransaction
                }
            )
        }

        if(existingTransaction.status==='FAILED'){
            await session.abortTransaction();
            return res.status(500).json(
                {
                    message:'transaction has failed . please try again afer some time',
                    success:false,

                }
            )
        }

        if(existingTransaction.status==='REVERSED'){
            await session.abortTransaction();
            return res.status(500).json(
                {
                    message:'transaction has reversed . please retry',
                    success:false,

                }
            )
        }


    }

    if(fromUserAccount.status!=='ACTIVE' || toUserAccount.status!=='ACTIVE'){
        await session.abortTransaction();

        return res.status(400).json(
            {
                message:'Both the account must be active to process or initiate transaction',
                success:false
            }
        )

    }

    //now get sender account balance from ledger to make sure it should have balance to create transaction

    const balance = await fromUserAccount.getBalance();

    if(balance<amount){
        await session.abortTransaction();
        return res.status(400).json(
            {
                message:`Insufficient balance . Current balance is ${balance,fromUserAccount.currency} and Request amount is ${amount,fromUserAccount.currency}`,
                success:false
            }
        )
    }

    //now create transaction with pending status 

    const newTransaction = await Transaction.create([{
        from,to,amount,idempotencyKey:key,status:"PENDING"
    }],{session})

    //now create debit ledger entry

    const debitEntry = await Ledger.create([{
        account:fromUserAccount._id,
        amount,
        transaction:newTransaction._id,
        type:"DEBIT"
    }],{session})

    //now create credit entry

    const creditEntry = await Ledger.create([{
        account:toUserAccount._id,
        amount,
        transaction:newTransaction._id,
        type:"CREDIT"
    }],{session})


    await Transaction.findOneAndUpdate(
        {_id:newTransaction._id},
        {status:'COMPLETED'}
    )

    await session.commitTransaction();

    res.status(201).json({
        message:'Transaction completely successfully',
        transaction:newTransaction,
        success:true
    })

    //send transaction email 

    await sendTransactionEmail(req.user.email,amount,req.user.name,toUserAccount._id,new Date(Date.now()),newTransaction._id)



   }catch(err){

    await session.abortTransaction();


    return res.status(400).json({message:'transaction is peding due to some issue, Pleae try again later'})

   }finally{
    session.endSession();
   }
}

export const createInitialFundTransaction = async(req,res)=>{

    const {to,amount,key} = req.body;

    if(!to || !amount || !key){
        return res.status(400).json({message:'Toaccount , amount and idempotency key is required'})
    }

    if(amount <0 || amount===0){
        return res.status(400).json({message:'Amount value is invalid . Please give valid amount'})
    }

    try{

        const toUserAccount = await Account.findOne({_id:to});

        if(!toUserAccount){
            return res.status(404).json({message:'Account not found. Invalid request'})
        }

        const systemAcount = await Account.findOne({user:req.user._id});

        if(!systemAcount){
            return res.status(404).json({message:'System account not found!!'})
        }
    

        const session = await mongoose.startSession();
        session.startTransaction();

        //create a new transaction 

        const [transaction] = await Transaction.create([{
            from:systemAcount._id,
            to:toUserAccount._id,
            amount,
            idempotencyKey:key,
            status:"PENDING"
        }],{session})

        console.log(transaction)


        //now create ledger entreis

        const debitLedgerEntry = await Ledger.create([{
            account:systemAcount._id,
            amount,
            transaction:transaction._id,
            type:'DEBIT'
        }],{session})


        //noe create credit ledger for to account 

        const creditLedgerEntry = await Ledger.create([{
            account:toUserAccount._id,
            amount,
            transaction:transaction._id,
            type:"CREDIT"
        }],{session})

        //now update trnsaction status 

        transaction.status = "COMPLETED";
        await transaction.save({session});


        await session.commitTransaction();
        session.endSession();

        res.status(201).json(
            {
                message:'Initial funds transaction completed successfully',
                success:true,
                transaction
            }
        )

        await sendIntialTransactionEmail(req.user.email,new Date(Date.now()),transaction._id,req.user.name,amount);

        return;

   }catch(err){

    console.log('error in inital fund : ',err)

    return res.status(500).json({message:'Failed to add Initial fund in account'});

   }


}


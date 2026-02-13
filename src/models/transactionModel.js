import { Schema,model } from "mongoose";

const transactionSchema = new Schema({

    from:{
        type:Schema.Types.ObjectId,
        ref:'Account',
        required:true,
        index:true
    },
    to:{
        type:Schema.Types.ObjectId,
        ref:'Account',
        required:true,
        index:true
    },
    amount:{
        type:Number,
        required:[true,'Amount is required to begin a transaction'],
        min:1,
    },
    status:{
        type:String,
        enum:{
            values:['PENDING','COMPLETED','FAILED','REVERSED'],
            message:"Status can either be pending , completed  , failed or reversed"
        },
        default:"PENDING"
    },
    idempotencyKey:{
        type:String,
        required:[true,'Idem-potency key is required to create a transaction'],
        unique:true,
        index:true,

    }

},{timestamps:true})

const Transaction = model('Transaction',transactionSchema);

export default Transaction;
import { Schema,model } from "mongoose";

const ledgerSchema = new Schema({

    account:{
        type:Schema.Types.ObjectId,
        ref:"Account",
        required:[true,"A ledger must be associated with an account"],
        index:true,
        immutable:true
    },
    amount:{
        type:Number,
        required:[true,'Amount is required to create a ledger entry'],
        immutable:true
    },
    transaction:{
        type:Schema.Types.ObjectId,
        ref:"Transaction",
        required:[true,'A transaction id is required for ledger creation'],
        index:true,
        immutable:true
    },
    type:{
        type:String,
        enum:{
            values:['CREDIT',"DEBIT"],
            message:'Type can either be credit ot debit'
        },
        required:[true,'Ledger type is required'],
        immutable:true
    }

},{timestamps:true})

function preventLedgerModification(){
    throw new Error('Ledger entries are immutable and cannot be modified and deleted')
}

ledgerSchema.pre('findOneAndDelete',preventLedgerModification);
ledgerSchema.pre('findOneAndReplace',preventLedgerModification);
ledgerSchema.pre('findOneAndUpdate',preventLedgerModification);
ledgerSchema.pre('updateOne',preventLedgerModification);
ledgerSchema.pre('updateMany',preventLedgerModification);
ledgerSchema.pre('deleteOne',preventLedgerModification);
ledgerSchema.pre('deleteMany',preventLedgerModification);
ledgerSchema.pre('replaceOne',preventLedgerModification); 

const Ledger = model("Ledger",ledgerSchema);



export default Ledger;
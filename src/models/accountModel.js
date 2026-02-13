import { Schema,model } from "mongoose";
import Ledger from "./ledgerModel.js";

const accountSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:[true,'An account must be associated with a user '],
        index:true
    },
    status:{
        type:String,
        enum:{
            values:['ACTIVE','FROZEN','CLOSED'],
            message:"Status can either be active , frozen or closed"
        },
        default:'ACTIVE'
    },
    currency:{
        type:String,
        required:[true,'Currency is required to create an account'],
        default:'INR'
    }
},{timestamps:true})

accountSchema.index({user:1,status:1})

accountSchema.methods.getBalance = async function(){

    const balanceData = await Ledger.aggregate([
        {$match:{account:this._id}},

        {
            $group:{
                _id:null,
                totalDebit:{
                    $sum:{
                        $cond:[
                            {$eq:["$type","DEBIT"]},
                            "$amount",
                            0
                        ]
                    }
                },
                totalCredit:{
                    $sum:{
                        $cond:[
                            {$eq:["$type","CREDIT"]},
                            "$amount",
                            0
                        ]
                    }
                }
            }
        },
        {
            $project:{
                _id:0,
                balance:{ $subtract : ["$totalDebit","$totalCredit"] }
            }
        }
    ])

    if(balanceData.length===0){
        return 0;
    }

    return balanceData[0]?.balance || 0;
}


const Account = model('Account',accountSchema);

export default Account;
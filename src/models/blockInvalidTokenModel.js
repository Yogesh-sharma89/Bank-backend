import { Schema,model } from "mongoose";

const blocklistSchema = new Schema({
    token:{
        type:String,
        required:[true,'Token is required to create blocklist'],
        unique:[true,'Token is already blocked'],
        trim:true
    }
},{timestamps:true})

blocklistSchema.index({createdAt:1},{
    expireAfterSeconds:1000*60*60*24*3
})

const BlockModel = model('BlockModel',blocklistSchema);

export default BlockModel;
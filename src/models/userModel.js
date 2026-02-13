import { Schema,model } from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = new Schema({
    email:{
        type:String,
        required:[true,"Email Id id required for creating account"],
        trim:true,
        lowercase:true,
        match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,"Invalid Email Id"],
        unique:[true,"Email Already exits."]
    },
    name:{
        type:String,
        required:[true,"Your name is required ."],
        trim:true,
    },
    password:{
        type:String,
        required:[true,'Password is required for creating account'],
        minLength:[6,'Password must be at least 6 characters long'],
        unique:[true,'This password already exists'],
        trim:true
    },
    systemUser:{
        type:Boolean,
        default:false,
        immutable:true,
        select:false
    }
},{timestamps:true})

userSchema.pre("save",async function(){
    if(!this.isModified('password')){
        return;
    }

    const hash  = await  bcrypt.hash(this.password,10);
    this.password = hash;

})

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password,this.password);
}

const User  = model('User',userSchema);

export default User;
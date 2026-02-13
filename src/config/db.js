import mongoose from 'mongoose';
import "dotenv/config"

export const ConnnectToDb = async()=>{
    try{
       await mongoose.connect(process.env.MONGODB_URL);
       console.log('Database connected successfully ✅')
    }catch(err){
        console.log('Failed to connect with Db : '+err);
        process.exit(1);
    }
}
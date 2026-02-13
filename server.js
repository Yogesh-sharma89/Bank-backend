import app from "./src/app.js";
import "dotenv/config";
import { ConnnectToDb } from "./src/config/db.js";

const port = process.env.PORT || 3000;

app.get('/',(_,res)=>{
    res.json({message:"Hey home route working"})
})



const StartConnection = async()=>{
    try{

        await ConnnectToDb();

        app.listen(port,()=>{
            console.log('Server is listening on port 3000 ✅')
        })

    }catch(err){

        console.log('Failed to start connection in server file : '+err);
        process.exit(1);

    }
}

StartConnection();
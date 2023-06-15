import mongoose from "mongoose";

export async function dbConnect(){
  console.log(mongoose.connection.readyState)
   if(mongoose.connection.readyState == 0){
    console.log('connecting to database')
    await mongoose.connect(process.env.MONGO_URI)
   }
} 



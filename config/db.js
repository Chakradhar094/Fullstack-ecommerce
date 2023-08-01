import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config();
const connectDB=async()=>{
    try {
        const conn=await mongoose.connect(process.env.MONGO_URL);
        console.log(`connected to Mongodb Datbase ${conn.connection.host}`)
    } catch (error) {
        console.log(`'Error in mongodb ${error}'`);
    }
}

export default connectDB;

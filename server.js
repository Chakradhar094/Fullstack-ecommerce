
import  express  from "express";
import dotenv from "dotenv"
import connectDB from "./config/db.js";
import authroute from "./routes/authRoute.js"
import cors from 'cors'
import morgan from "morgan";
import categoryRoute from './routes/categoryRoute.js'
import productRoute from './routes/productRoute.js'
import path from 'path'
import {fileURLToPath}from 'url'
const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename)

//configure env
dotenv.config();
//connect db
connectDB();
//rest object
const app=express();
//midddlewares
app.use(cors())
app.use(morgan("dev"))
app.use(express.json())
app.use(express.static(path.join(__dirname,'./client/bulid'))); 
//routes
app.use(`/api/v1/auth`,authroute)
app.use(`/api/v1/category`,categoryRoute);
app.use(`/api/v1/product`,productRoute);
app.use('*',(req,res)=>{
    res.sendFile(path.join(__dirname,'./client/build/index.html'))
})
app.get('/',(req,res)=>{
    res.send({
        message:'Welcome to Ecommerce '
    })
})
const PORT=process.env.PORT||8080;

app.listen(PORT,()=>{
    console.log(`server running on ${PORT}`.bgGreen)
});
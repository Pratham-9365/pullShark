import express from "express" ; 
import { connectDB } from "./config/mongodbconfig.js";
import dotenv from "dotenv" 
import authRouter from "./routes/auth.js";
import cookieParser from "cookie-parser";
const app = express() ;
app.use(cookieParser())
app.use(express.json()) ;
dotenv.config() ; 
app.use("/auth", authRouter) ;
connectDB().
then(()=>{
    app.listen(3000, ()=>{
        console.log("Server is running on port 3000") ;
    })
}).catch((error)=>{
    console.error("Error connecting to MongoDB:", error);
})

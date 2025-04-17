import express from "express";
import 'dotenv/config';
import cors from 'cors';
import cookieParser from 'cookie-parser';


import connectMongoDB from './config/connection.js';



import authRouter from './routers/authRoutes.js';
import messageRouter from './routers/messageRouter.js';

import { app, server } from "./config/socket.js";


// const app = express();




const PORT = process.env.PORT || 7000;
 

const corsOptions = {
    origin:`${process.env.FRONT_END_URL}`,
    methods:"GET, POST, PUT, DELETE, PATCH, HEAD",
    credentials:true,
}



// app.use(express.json());
app.use(express.json({limit:'10mb'}));
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(cors(corsOptions));


connectMongoDB(process.env.MONGODB_URI).then(()=>{
    console.log("DataBase(MongoDB) Connected Successfully");
}).catch((error)=>{
    console.log(`Failed To Conenct DataBase ${error} `);
})



app.get("/",(req,res)=>{
    res.send("Creating Chat Application");
})



app.use("/api/auth",authRouter);
app.use("/api/messages",messageRouter);


// app.listen(PORT,()=>{
//     console.log(`Server Started At PORT ${PORT}`);
// })



server.listen(PORT,()=>{
    console.log(`Server Started At PORT ${PORT}`);
})
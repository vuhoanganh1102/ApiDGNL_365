import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import addata from './src/router/addata.js'

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use('/api',addata)

const connect = async () => {
    try {
      await mongoose.connect("mongodb://localhost:27017/Base365");
      console.log("Connected to mongoDB.");
    } catch (error) {
      throw error;
    }
  };

mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected!");
});

app.listen(9000,  ()=>{
    connect();
 
   console.log("Connected to databse");
   console.log("Backend is running on http://localhost:9000")
 })
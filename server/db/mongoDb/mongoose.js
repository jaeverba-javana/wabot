import process from "node:process";
import mongoose from 'mongoose';
import {IS_PRODUCTION} from "./../../utils/contants.js";

export const mongooseConnect = () => {
    mongoose.connect(
        IS_PRODUCTION? `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@zenit-test.ywuvq.mongodb.net/?retryWrites=true&w=majority&appName=zenit-test` : "mongodb://localhost:27017/Johan",
    )
    .then((_r) => {
        console.log("Connected to MongoDB");
    })
    .catch((e) => {
        console.error("Error connecting to MongoDB: ", e);
    })
}

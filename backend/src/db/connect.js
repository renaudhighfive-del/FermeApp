import mongoose from "mongoose";

const MONGO_URL = process.env.MONGO_URL

const DB_NAME = process.env.DB_NAME

export async function connectDbApi(){

    if(!MONGO_URL || !DB_NAME){
        throw new Error("MONGO_URL or DB_NAME is not defined in the environment variables")
    }
    // Connect to the database
    await mongoose.connect(MONGO_URL, {dbName: DB_NAME})
    console.log("Connected to the database")
}
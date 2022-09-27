import * as dotenv from "dotenv";

dotenv.config();

export const MONGODB_DATABASE = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.frmhcab.mongodb.net`;

export const DB_NAME = process.env.DB_NAME || "";

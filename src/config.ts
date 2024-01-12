import * as dotenv from "dotenv";

dotenv.config();

export const config = {
    privateKey: process.env.PRIVATE_KEY || '',
};
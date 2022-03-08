import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import { NextApiRequest, NextApiResponse } from "next";
import { User } from "../../utils/interfaces";
import { Users } from "../../utils/schema";
import { sendJWT } from "../../utils/sendJWT";
import { authenticateUser } from "../../utils/authenticate";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == "GET") {
        let obj = authenticateUser(req) 
        if (obj) return res.json({user: obj.user})
        return res.json({user: null})
    }
    if (req.method == "POST") {
        try {
            await mongoose.connect(process.env.MONGO_URI!)
            const { username, password }: User = req.body
            let lowercase = username.toLowerCase()
            let user = await Users.findOne({ lowercase })
            mongoose.connection.close()
            if (!user || ! await bcrypt.compare(password, user.password)) {
                return res.status(400).json({ errors: ["Incorrect Credentials"] })
            }
            sendJWT(req, res, user.username)
            return res.json({ username: user.username })
        }
        catch (e: any) {
            console.log(e)
            mongoose.connection.close()
            return res.json({errors: [e.message]})
        }
    }
    
}
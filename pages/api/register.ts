import type { NextApiRequest, NextApiResponse } from 'next'
import {validateInput} from '../../utils/validate';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Users } from '../../utils/schema';
import { User } from '../../utils/interfaces';
import { sendJWT } from '../../utils/sendJWT';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        await mongoose.connect(process.env.MONGO_URI!)
        if (req.method == "POST") {
            let { username, password }: User = req.body;
            const lowercase = username.toLowerCase()
            
            const errors = validateInput(username, password)
            if (errors.length > 0) {
                return res.status(400).json({ errors })
            }
            let user = await Users.findOne({ lowercase });
            if (user) return res.status(400).json({ errors: ["Username has already been taken"] })
            
            password = await bcrypt.hash(password, 10)
            user = new Users({username, lowercase, password, joinDate: new Date()})
            await user.save()
            
            mongoose.connection.close() 
            sendJWT(req, res, username)
            return res.status(201).json({user: username})
        }
    }
    catch(e: any) {
        console.log(e)
        mongoose.connection.close()
        return res.status(500).json({})
    }    
    
}

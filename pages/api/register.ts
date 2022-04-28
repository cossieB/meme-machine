import type { NextApiRequest, NextApiResponse } from 'next'
import {validateInput} from '../../utils/validate';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Users } from '../../utils/schema';
import { IUser, UserPick } from '../../utils/interfaces';
import { sendJWT } from '../../utils/sendJWT';
import { getJwtUserFromDB } from '../../utils/getJwtUserFromDB';
import ServerError from '../../utils/ServerError';

type DATA = {user: UserPick} | {msg: "ok"} | {errors: any[]} | {error: any}

export default async function handler(req: NextApiRequest, res: NextApiResponse<DATA>) {
    try {
        await mongoose.connect(process.env.MONGO_URI!)
        if (req.method == "POST") {
            let { username, password }: IUser = req.body;
            const lowercase = username.toLowerCase()
            
            const errors = validateInput(username, password)
            if (errors.length > 0) {
                return res.status(400).json({ errors })
            }
            let user = await Users.findOne({ lowercase }).exec();
            if (user) return res.status(400).json({ errors: ["Username has already been taken"] })
            
            password = await bcrypt.hash(password, 10)

            let joinDate = new Date()
            user = new Users({username, lowercase, password, joinDate})
            await user.save()

            sendJWT(req, res, {username, joinDate, avatar: user.avatar})
            return res.status(201).json({user: {username, joinDate, avatar: user.avatar}})
        }
        if (req.method == "PUT") {
            const {avatar, status} = req.body
            const user = await getJwtUserFromDB(req)
            user.avatar = avatar;
            user.status = status

            await user.save()
            
            res.json({user: {joinDate: user.joinDate, username: user.username, avatar, status}})
        }
    }
    catch(e: any) {
        e !instanceof ServerError && console.log(e)
        return res.status(e.status || 500).json({error: e.message})
    }  
    finally {
        mongoose.connection.close()
    }  
    
}

import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import { NextApiRequest, NextApiResponse } from "next";
import { User, UserPick } from "../../utils/interfaces";
import { Users } from "../../utils/schema";
import { sendJWT } from "../../utils/sendJWT";
import { authenticateUser } from "../../utils/authenticate";
import ServerError from "../../utils/ServerError";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == "GET") {
        try {
            let payload = authenticateUser(req)
            return res.json({ user: payload.user })
        }
        catch (e: any) {
            !(e instanceof ServerError) && console.log(e)
            res.status(e.status || 500).json({ error: e.message })
        }
    }
    if (req.method == "POST") {
        try {
            await mongoose.connect(process.env.MONGO_URI!)
            const { username, password }: User = req.body
            let lowercase = username.toLowerCase()
            let user = await Users.findOne({ lowercase }).exec()

            if (!user || ! await bcrypt.compare(password, user.password)) {
                throw new ServerError("Incorrect Credentials", 400)
            }
            const userCookie: UserPick = {username: user.username, avatar: user.avatar, joinDate: user.joinDate}

            sendJWT(req, res, userCookie)
            return res.json({ user: userCookie })
        }
        catch (e: any) {
            console.log(e)
            return res.status(e.status || 500).json({ errors: [e.message] })
        }
        finally {
            mongoose.connection.close()
        }
    }

}
import bcrypt from 'bcrypt'
import { NextApiRequest, NextApiResponse } from "next";
import { IComment, IUser, UserPick } from "../../utils/interfaces";
import { sendJWT } from "../../utils/sendJWT";
import { authenticateUser } from "../../utils/authenticate";
import ServerError from "../../utils/ServerError";
import ConnectToMySQL from "../../utils/ConnectToMySQL";


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
            const connection = await ConnectToMySQL()
            connection.connect()
            const { username, password }: IUser = req.body
            let lowercase = username.toLowerCase()
            const [result] = await connection.query(`SELECT * FROM users WHERE lowercase = '${lowercase}';`) as [Array<IUser>, any]
            const user = result[0]

            if (!user || ! await bcrypt.compare(password, user.password)) {
                throw new ServerError("Incorrect Credentials", 400)
            }
            const userCookie: UserPick = {username: user.username, avatar: user.avatar, joinDate: user.joinDate, status: user.status}

            sendJWT(req, res, userCookie)
            return res.json({ user: userCookie })
        }
        catch (e: any) {
            console.log(e)
            return res.status(e.status || 500).json({ errors: [e.message] })
        }
    }

}
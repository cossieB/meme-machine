import { NextApiRequest } from "next"
import { authenticateUser } from "./authenticate"
import ConnectToMySQL from "./ConnectToMySQL"
import { IUser } from "./interfaces"
import ServerError from "./ServerError"

export async function getJwtUserFromDB(req: NextApiRequest) {
    let payload = authenticateUser(req)
    if (!payload) throw new ServerError("No token", 401)
    let {username} = payload.user
    const connection = await ConnectToMySQL()
    const [result] = await connection.query(`SELECT * FROM users where username = '${username}';`)
    connection.end()
    let user;
    if (result instanceof Array) user = result[0] as IUser

    if (!user) throw new ServerError("Unknown user", 401)
    return user
}
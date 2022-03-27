import { NextApiRequest } from "next"
import { authenticateUser } from "./authenticate"
import { Users } from "./schema"
import ServerError from "./ServerError"

export async function getJwtUserFromDB(req: NextApiRequest) {
    let payload = authenticateUser(req)
    if (!payload) throw new ServerError("No token", 401)
    let username = payload.user
    let user = await Users.findOne({username}).exec()
    if (!user) throw new ServerError("Unknown user", 401)
    return user
}
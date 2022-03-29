import jwt, { JwtPayload } from 'jsonwebtoken'
import { NextApiRequest } from 'next';
import ServerError from './ServerError';


export function authenticateUser(req: NextApiRequest) {
    let token = req.cookies.jwt;
    if (!token) throw new ServerError("No Token", 401)
    return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload

}
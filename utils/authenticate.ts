import jwt, { JwtPayload } from 'jsonwebtoken'
import { NextApiRequest } from 'next';


export function authenticateUser(req: NextApiRequest) {
    let token = req.cookies.jwt;
    if (!token) return false
    
    try {
        return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
    }
    catch(e) {
        return false
    }

}
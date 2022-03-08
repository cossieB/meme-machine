import { NextApiRequest, NextApiResponse } from "next";
import jwt from 'jsonwebtoken';
import cookie from 'cookie'

export function sendJWT(req: NextApiRequest, res: NextApiResponse, username: string) {
    const maxAge = 28 * 24 * 60 * 60
    let token = jwt.sign({ user: username }, process.env.JWT_SECRET!, { expiresIn: maxAge })
    const serialized = cookie.serialize("jwt", token, { maxAge, httpOnly: true, sameSite: "strict", path: "/" })
    res.setHeader('Set-Cookie', serialized)
}
import { NextApiRequest, NextApiResponse } from "next";
import jwt from 'jsonwebtoken';
import cookie from 'cookie'
import { UserPick } from "./interfaces";

export function sendJWT(req: NextApiRequest, res: NextApiResponse, user: UserPick) {
    const maxAge = 28 * 24 * 60 * 60
    let token = jwt.sign({ user }, process.env.JWT_SECRET!, { expiresIn: maxAge })
    const serialized = cookie.serialize("jwt", token, { maxAge, httpOnly: true, sameSite: "strict", path: "/" })
    res.setHeader('Set-Cookie', serialized)
}
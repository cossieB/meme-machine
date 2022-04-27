import { JwtPayload } from "jsonwebtoken";
import { GetServerSidePropsContext } from "next";
import jwt from 'jsonwebtoken'
import { UserPick } from "./interfaces";

/**
 * Decodes and verifies the JWT and returns the user if any.
 */
export function getServerSideUser(context: GetServerSidePropsContext) {
    const {req, res} = context; 
    const {cookies} = req
    let data: {user: UserPick | null}
    try {
        let token = jwt.verify(cookies.jwt, process.env.JWT_SECRET!) as JwtPayload
        data = {user: token.user}
    }
    catch(e) {
        data = {user: null}
        context.res.setHeader("Set-Cookie","user=11; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT")
    }
    return data.user
}
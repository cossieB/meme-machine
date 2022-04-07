import type { NextApiRequest, NextApiResponse } from 'next'
import {validateInput} from '../../utils/validate';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IUser, UserPick } from '../../utils/interfaces';
import { sendJWT } from '../../utils/sendJWT';
import { getJwtUserFromDB } from '../../utils/getJwtUserFromDB';
import mysql from 'mysql2/promise'
import ConnectToMySQL from '../../utils/ConnectToMySQL';
import formatDateForSQL from '../../utils/formatDateForSQL';

type DATA = {user: UserPick} | {msg: "ok"} | {errors: any[]} | {error: any}

export default async function handler(req: NextApiRequest, res: NextApiResponse<DATA>) {
    try {
        if (req.method == "POST") {
            let { username, password }: IUser = req.body;
            const lowercase = username.toLowerCase()
            
            const errors = validateInput(username, password)
            if (errors.length > 0) {
                return res.status(400).json({ errors })
            }

            const connection = await ConnectToMySQL()

            let joinDate = new Date()
            let dateString = formatDateForSQL(joinDate)
            password = await bcrypt.hash(password, 10)

            await connection.connect()

            const [rows, fields] = await connection.execute(`SELECT * FROM users WHERE lowercase = "${lowercase}"`) 
            if (rows instanceof Array && rows.length > 0) return res.status(400).json({errors: ["Username has already been taken"]}) 

            await connection.execute(`INSERT INTO users(username, lowercase, password, joinDate) VALUES('${username}', '${lowercase}', '${password}', '${dateString}');`)
            connection.end()
            sendJWT(req, res, {username, joinDate, avatar: '/favicon.ico'})
            return res.status(201).json({user: {username, joinDate, avatar: '/favicon.ico'}})
            
        }
        if (req.method == "PUT") {
            const connection = await ConnectToMySQL()
            await connection.connect()

            const {avatar, status} = req.body
            let user = await getJwtUserFromDB(req)

            connection.query(`UPDATE users SET avatar ='${avatar}', status = '${status}' WHERE username = '${user.username}' `)
            user = await getJwtUserFromDB(req)
            res.json({user: {joinDate: user.joinDate, username: user.username, avatar, status}})
        }
    }
    catch(e: any) {
        console.log(e)
        return res.status(e.status || 500).json({error: e.message})
    }  
}

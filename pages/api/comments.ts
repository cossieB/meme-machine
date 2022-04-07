import { NextApiRequest, NextApiResponse } from "next";
import ConnectToMySQL from "../../utils/ConnectToMySQL";
import formatDateForSQL from "../../utils/formatDateForSQL";
import { getJwtUserFromDB } from "../../utils/getJwtUserFromDB";
import {IComment} from "../../utils/interfaces"


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == "GET") {
        try {
            let {id} = req.query; 
            const connection = await ConnectToMySQL()
            connection.connect()
            const [result] = await connection.query(`SELECT * FROM comments`)
            connection.end()            
            res.json({response: result})
        }
        catch(e: any) {
            console.log(e)
            res.status(e.status || 500).json({errors: e.message})
        }
    }
    if (req.method == "POST") {
        try {
            const {comment, id} = req.body
            const user = await getJwtUserFromDB(req)
            const connection = await ConnectToMySQL()
            connection.connect()
            const [result] = await connection.query(`INSERT INTO comments(content, post_id, username, date) VALUES('${comment}', '${id}', '${user.username}', '${formatDateForSQL(new Date())}');`)
            res.status(201).json({msg: "ok"})
        }
        catch(e: any) {
            console.log(e)
            res.status(e.status || 500).json({errors: e.message})
        }
    }
}
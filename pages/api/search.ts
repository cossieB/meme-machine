import { NextApiRequest, NextApiResponse } from "next";
import ConnectToMySQL from "../../utils/ConnectToMySQL";
import formatDateForSQL from "../../utils/formatDateForSQL";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == 'POST') {
        const {searchTerm} = req.body
        const fromDate = req.body.fromDate ? new Date(req.body.fromDate) : new Date(2022,0,1)
        const toDate = req.body.toDate ? new Date(req.body.toDate).setHours(23,59,59,999) : new Date().setHours(23,59,59,999)
        const connection = await ConnectToMySQL()
        await connection.connect()

        const [posts] = await connection.query(`SELECT * FROM posts WHERE title LIKE '%${searchTerm}%' AND date > '${formatDateForSQL(fromDate)}' AND date < '${formatDateForSQL(new Date(toDate))}'`)
        

        res.json({posts})
    }
}
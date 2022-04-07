import { NextApiRequest, NextApiResponse } from "next";
import ConnectToMySQL from "../../utils/ConnectToMySQL";
import formatDateForSQL from "../../utils/formatDateForSQL";
import { getJwtUserFromDB } from "../../utils/getJwtUserFromDB";
import { IPost } from "../../utils/interfaces";
import ServerError from "../../utils/ServerError";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const connection = await ConnectToMySQL()
    await connection.connect()

    if (req.method == "POST") {
        const {title, description, url} = req.body

        try {
            const user = await getJwtUserFromDB(req)
            const date = formatDateForSQL(new Date())
            await connection.execute(`
                INSERT INTO posts(title, date, image, description, username) 
                VALUES('${title}', '${date}', '${url}', '${description}', '${user.username}');
            `)
            
            const [result] = await connection.query(`SELECT * FROM posts WHERE username = '${user.username}' AND date = '${date}';`) as [Array<any>, any]
            const newPost = result[0]
            console.log(newPost.post_id)
            res.json({id: newPost.post_id})
        }
        catch(e: any) {
            console.log(e)
            res.status(e.status || 500).json({error: e.message})
        }
    }
    
    if (req.method == "DELETE") {
        const {id} = req.body;

        try {
            const user = await getJwtUserFromDB(req)
            const [result] = await connection.query(`SELECT * FROM posts WHERE post_id = '${id}';`) as [Array<any>, any]
            let post = result[0]
            if (!post) throw new ServerError("Post not found", 400)
            if (post.username != user.username) throw new ServerError("User mismatch", 403)
            
            await connection.execute(`DELETE FROM posts WHERE post_id = '${id}';`)
            res.json({msg: "ok"})
        }
        catch(e: any) {
            console.log(e)
            res.status(e.status || 500).json({error: e.message})
        }
    }
    if (req.method == "PUT") {
        const {id, title, description} = req.body; 
        try {
            let user = await getJwtUserFromDB(req)
            const [result] = await connection.query(`SELECT * FROM posts WHERE post_id = '${id}';`) as [Array<any>, any]
            let post = result[0]
            if (!post) throw new ServerError("Post not found", 400)
            if (post.username != user.username) throw new ServerError("User mismatch", 403)

            connection.execute(`
                UPDATE posts
                SET title = '${title}', description = '${description}'
                WHERE post_id = '${id}'
                `)

            res.json({msg: "ok"})
        }
        catch(e: any) {
            console.log(e)
            res.status(e.status || 500).json({error: e.message})
        }
    }
}
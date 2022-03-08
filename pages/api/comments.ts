import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { getJwtUserFromDB } from "../../utils/getJwtUserFromDB";
import { Comments } from "../../utils/schema";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await mongoose.connect(process.env.MONGO_URI!)
    if (req.method == "GET") {
        try {
            let {id} = req.query; 
            let comments = await Comments.find({post: id})
            let response = comments.map(comment => ({
                content: comment.content,
                date: comment.date,
                username: comment.username
            }))
            res.json({response})
        }
        catch(e: any) {
            console.log(e)
            res.status(500).json({errors: e.message})
        }
    }
    if (req.method == "POST") {
        try {
            const {comment, id} = req.body
            const user = await getJwtUserFromDB(req)
            const {username} = user
            let newComment = new Comments({
                content: comment,
                date: new Date(),
                post: id,
                username
            })
            await newComment.save()
            res.status(201).json({msg: "ok"})
        }
        catch(e: any) {
            console.log(e)
            res.status(e.status || 500).json({errors: e.message})
        }
    }
    mongoose.connection.close()
}
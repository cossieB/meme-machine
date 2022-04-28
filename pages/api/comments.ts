import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { getJwtUserFromDB } from "../../utils/getJwtUserFromDB";
import { Comments } from "../../utils/schema";
import {IComment} from "../../utils/interfaces"
import ServerError from "../../utils/ServerError";

interface GET {
    response: (mongoose.Document<unknown, any, IComment> & IComment & {_id: mongoose.Types.ObjectId})[]
}

interface POST {
    errors?: any,
    msg?: string
}

type DATA = GET | POST

export default async function handler(req: NextApiRequest, res: NextApiResponse<DATA>) {
    await mongoose.connect(process.env.MONGO_URI!)
    if (req.method == "GET") {
        try {
            let {id} = req.query; 
            let comments = await Comments.find({post: id}).select('-user.password')
                      
            res.json({response: comments})
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
            let newComment = new Comments({
                content: comment,
                date: new Date(),
                post: id,
                user
            })
            await newComment.save()
            res.status(201).json({msg: "ok"})
        }
        catch(e: any) {
            e !instanceof ServerError && console.log(e)
            res.status(e.status || 500).json({errors: e.message})
        }
    }
    mongoose.connection.close()
}
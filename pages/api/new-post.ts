import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { getJwtUserFromDB } from "../../utils/getJwtUserFromDB";
import { Posts, Users } from "../../utils/schema";
import ServerError from "../../utils/ServerError";

type DATA = {id: string} | {msg: "ok"} | {error: any}

export default async function handler(req: NextApiRequest, res: NextApiResponse<DATA>) {
    await mongoose.connect(process.env.MONGO_URI!)

    if (req.method == "POST") {
        const {title, description, url} = req.body

        try {
            const user = await getJwtUserFromDB(req)
            let newPost = new Posts({title, date: new Date(), image: url, description, user})
            await newPost.save()
            console.log(newPost); 
            res.json({id: newPost.id})
        }
        catch(e: any) {
            e !instanceof ServerError && console.log(e)
            res.status(e.status || 500).json({error: e.message})
        }
    }
    
    if (req.method == "DELETE") {
        const {id} = req.body;

        try {
            const user = await getJwtUserFromDB(req)
            const post = await Posts.findById(id).exec();
            if (!post) throw new ServerError("Post not found", 400)
            if (post.user.id != user.id) throw new ServerError("User mismatch", 403)
            
            await post.delete()
            res.json({msg: "ok"})
        }
        catch(e: any) {
            e !instanceof ServerError && console.log(e)
            res.status(e.status || 500).json({error: e.message})
        }
    }
    if (req.method == "PUT") {
        const {id, title, description} = req.body; 
        try {
            let user = await getJwtUserFromDB(req)
            let post = await Posts.findById(id).exec();
            if (!post) throw new ServerError("Post not found", 400)
            if (post.user.id != user.id) throw new ServerError("User mismatch", 403)

            post.title = title;
            post.description = description 

            await post.save()
            res.json({msg: "ok"})
        }
        catch(e: any) {
            e !instanceof ServerError && console.log(e)
            res.status(e.status || 500).json({error: e.message})
        }
    }
    mongoose.connection.close()
}
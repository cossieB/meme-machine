import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { Posts } from "../../utils/schema";
import ServerError from "../../utils/ServerError";

export default async function hanlder(req: NextApiRequest, res: NextApiResponse) {
    try {
        await mongoose.connect(process.env.MONGO_URI!)
        if (req.method == "GET") {
            const postsPerPage = 25
            const {page, username} = req.query;
            const postQuery = Posts.find(username ? {"user.username": username} : {}).sort({date: 'desc'}).select('-user.password').limit(postsPerPage).skip(postsPerPage * Number(page))
            const countQuery = Posts.count()
            let [data, count] = await Promise.all([postQuery, countQuery])

            const posts = data.map(p => {
                return {
                    title: p.title,
                    image: p.image,
                    description: p.description,
                    dateString: p.date.toISOString(),
                    likes: p.likes,
                    id: p.id,
                    user: {
                        username: p.user.username,
                        avatar: p.user.avatar
                    }
                }}
            )

            res.json({posts, pageMax: Math.floor(count / postsPerPage)})
        }

    }
    catch(e: any) {
        e !instanceof ServerError && console.log(e)
    }
    
}
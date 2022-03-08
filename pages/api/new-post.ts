import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { getJwtUserFromDB } from "../../utils/getJwtUserFromDB";
import { Posts, Users } from "../../utils/schema";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == "POST") {
        const {title, description, url} = req.body
        
        try {
            await mongoose.connect(process.env.MONGO_URI!)
            const user = await getJwtUserFromDB(req)
            let newPost = new Posts({title, date: new Date(), image: url, description, user})
            await newPost.save()
            console.log(newPost); 
            res.json({id: newPost.id})
        }
        catch(e: any) {
            console.log(e)
            res.status(e.status || 500).json({errors: e.message})
        }
    }
    mongoose.connection.close()
}
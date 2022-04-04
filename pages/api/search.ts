import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { Posts } from "../../utils/schema";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == 'POST') {
        const {searchTerm} = req.body
        const fromDate = req.body.fromDate || new Date(2022,0,1)
        const toDate = req.body.toDate || new Date()
        await mongoose.connect(process.env.MONGO_URI!)
        let posts = await Posts.find({title: {$regex: `${searchTerm}`, $options: 'i'}}).where('date').lte(toDate).gte(fromDate).select('-user.password').exec()
        console.log(posts)
        res.json({posts})
    }
}
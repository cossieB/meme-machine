import mongoose from "mongoose";
import type {User, Post, Comment} from './interfaces'

let {Schema} = mongoose

let UserSchema = new Schema<User>({
    username: {type: String, required: true},
    lowercase: {type: String, required: true},
    password: {type: String, required: true},
    joinDate: {type: Date, required: true},
    avatar: {type: String, default: "https://i.imgur.com/xDqKhF7.png"}
})

let PostSchema = new Schema<Post>({
    title: {type: String, require: true, maxlength: [30, "Title length has to be less than 30 characters"]},
    image: {type: String, required: true},
    description: {type: String, maxlength: [200, "Description has to be less than 200 characters"]},
    user: {type: UserSchema, required: true},
    date: Date,
    likes: [UserSchema]
})

let CommentSchema = new Schema<Comment>({
    content: {type: String, required: true},
    user: UserSchema, 
    date: Date,
    post: String
})

export const Posts: mongoose.Model<Post, {}, {}, {}> = mongoose.models.Posts || mongoose.model('Posts', PostSchema)
export const Users: mongoose.Model<User, {}, {}, {}> = mongoose.models.Users || mongoose.model('Users', UserSchema)
export const Comments: mongoose.Model<Comment, {}, {}, {}> = mongoose.models.Comments || mongoose.model('Comments', CommentSchema)
import mongoose from "mongoose";
import type {IUser, IPost, IComment} from './interfaces'

let {Schema} = mongoose

let UserSchema = new Schema<IUser>({
    username: {type: String, required: true},
    lowercase: {type: String, required: true},
    password: {type: String, required: true},
    joinDate: {type: Date, required: true},
    avatar: {type: String, default: "/favicon.ico"},
    status: {type: String, maxlength: [180, "Status has to be less than 180 characters"]}
})

let PostSchema = new Schema<IPost>({
    title: {
        type: String, 
        require: true, 
        maxlength: [30, "Title length has to be less than 30 characters"], minlength: [3, "Title length has to be at least 3 characters"]},
    image: {
        type: String, 
        required: true
    },
    description: {
        type: String, 
        maxlength: [200, "Description has to be less than 200 characters"]
},
    user: {
        type: UserSchema, 
        required: true
    },
    date: Date,
    likes: [UserSchema]
})

let CommentSchema = new Schema<IComment>({
    content: {type: String, required: true},
    user: UserSchema, 
    date: Date,
    post: String
})

export const Posts: mongoose.Model<IPost, {}, {}, {}> = mongoose.models.Posts || mongoose.model('Posts', PostSchema)
export const Users: mongoose.Model<IUser, {}, {}, {}> = mongoose.models.Users || mongoose.model('Users', UserSchema)
export const Comments: mongoose.Model<IComment, {}, {}, {}> = mongoose.models.Comments || mongoose.model('Comments', CommentSchema)
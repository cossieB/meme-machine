import mongoose from "mongoose";

interface User {
    username: string,
    lowercase: string,
    avatar?: string,
    password: string,
    joinDate: Date,
    posts?: Post[],
    _id: mongoose.Types.ObjectId
}

interface Post {
    title: string,
    image: string,
    description?: string,
    user: User,
    date: Date,
    likes?: User[],
    _id: mongoose.Types.ObjectId,
}

interface Comment {
    content: string,
    user: User,
    date: Date,
    post: Post,
    id: mongoose.Types.ObjectId
}

export type {Comment, Post, User}

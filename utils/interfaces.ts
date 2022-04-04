import mongoose from "mongoose";

interface IUser {
    username: string,
    lowercase: string,
    avatar?: string,
    password: string,
    joinDate: Date,
    posts?: IPost[],
    status?: string,
    _id: mongoose.Types.ObjectId,
    id: string
}

interface IPost {
    title: string,
    image: string,
    description?: string,
    user: IUser,
    date: Date,
    likes?: IUser[],
    _id: mongoose.Types.ObjectId,
    id: string
}

interface IComment {
    content: string,
    user: IUser,
    date: Date,
    post: IPost,
    id: mongoose.Types.ObjectId
}

type UserPick = Pick<IUser, "username" | "avatar" | "joinDate" | "status">

interface IUserContext {
    user?: UserPick,
    setUser: React.Dispatch<React.SetStateAction<UserPick | undefined>>
}

export type {IComment, IPost, IUser, UserPick, IUserContext}

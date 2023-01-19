import { Meme } from "@prisma/client"
import React from "react"

export type WithChildren = {
    children: React.ReactNode
}

export type MemePostType = Pick<Meme, 'creationDate' | 'description' | 'image' | 'postId' | 'title'> & {username: string}
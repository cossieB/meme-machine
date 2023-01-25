import { createContext } from "react";

export type ContextUser = {
    username: string
    email: string
    status: string
    name: string
    image: string
    banner: string
    id: string
}

type UserContext = {
    user: ContextUser | null
    setUser: React.Dispatch<React.SetStateAction<ContextUser | null>>
}

export const UserContext = createContext<UserContext | null>(null)
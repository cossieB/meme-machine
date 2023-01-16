import { useSession, signIn, signOut } from "next-auth/react"
import React, { useState } from "react"
import { trpc } from "../utils/trpc"

export default function Profile() {
    const { data: session } = useSession()
    const [username, setUsername] = useState(session?.user?.username ?? "")
    const [image, setImage] = useState(session?.user?.image ?? "")
    const query = trpc.test.useQuery({image, username})
    async function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        console.log(query.data)
    }

    return (
        <>
            <form onSubmit={submit} className="flex flex-col w-1/2 h-1/2 bg-teal-800 p-3 rounded-xl shadow-lg">
                <input
                    className="mt-1 rounded-md pl-2 h-8"
                    type="text"
                    name="username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder={session?.user?.name || "Username"}
                />
                <input
                    className="mt-1 rounded-md pl-2 h-8"
                    type="text"
                    name="image"
                    value={image}
                    onChange={e => setImage(e.target.value)}
                    placeholder={session?.user?.image || "Profile Picture"}
                />
                <button className="bg-green-300 mt-3 rounded-full" type="submit">
                    Submit
                </button>
            </form>
            <button className="bg-red-600" onClick={() => signOut()}>
                Sign Out
            </button>
        </>
    )
}
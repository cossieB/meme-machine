import { User } from "next-auth"
import { useSession, signOut } from "next-auth/react"
import React, { useContext, useState } from "react"
import { useLocalStorage } from "../hooks/useLocalStorage"
import { UserContext } from "../hooks/userContext"
import { Optional } from "../lib/utilityTypes"
import { trpc } from "../utils/trpc"
import FormInput from "./FormInput"
import Loader from "./Loader"
import { exitSvg } from "../utils/svgs"

export default function Profile() {
    const { user, setUser } = useContext(UserContext)!
    const [username, setUsername] = useState(user?.username ?? "")
    const [image, setImage] = useState(user?.image ?? "")
    const [name, setName] = useState(user?.name ?? "")
    const [status, setStatus] = useState(user?.status ?? "");
    const { updateLocalStorage } = useLocalStorage<Optional<User, 'id'>>('user')

    const mutation = trpc.updateProfile.useMutation({ networkMode: process.env.NODE_ENV == 'development' ? 'always' : 'online' })

    async function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        await mutation.mutateAsync({ username, image, name, status });
        if (mutation.isSuccess) {
            setUser({ username, image, name, status, email: user!.email })
            updateLocalStorage({ username, image, name });
        }
    }

    return (
        <>
            <form onSubmit={submit} className="flex flex-col w-1/2 h-1/2 bg-teal-800 p-3 rounded-xl shadow-lg">

                <FormInput
                    label="Username"
                    value={username}
                    setValue={setUsername}
                    max={20}
                    min={3}
                    />
                <FormInput
                    label="Image"
                    value={image}
                    setValue={setImage} />
                <FormInput
                    label="Name"
                    value={name}
                    setValue={setName} />
                <FormInput
                    label="Status"
                    value={status}
                    setValue={setStatus}
                    max={255}
                    isTextarea />
                <button
                    className="bg-green-300 mt-3 rounded-full disabled:bg-slate-500 flex items-center justify-center h-10"
                    type="submit"
                    disabled={mutation.status == 'loading' || username.length < 3 || username.length > 20 || status.length > 255}
                >
                    {mutation.status == 'loading' ? <Loader /> : "Submit"}
                </button>
            </form>
            <button className="bg-red-600" onClick={() => signOut()}>
                {exitSvg}
                Sign Out
            </button>
        </>
    )
}


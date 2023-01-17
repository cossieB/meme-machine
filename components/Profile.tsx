import { User } from "next-auth"
import { useSession, signOut } from "next-auth/react"
import React, { useState } from "react"
import { useLocalStorage } from "../hooks/useLocalStorage"
import { Optional } from "../lib/utilityTypes"
import { trpc } from "../utils/trpc"
import FormInput from "./FormInput"
import Loader from "./Loader"
import { exitSvg } from "./svgs"

export default function Profile() {
    const { data: session } = useSession()
    const [username, setUsername] = useState(session?.user?.username ?? "")
    const [image, setImage] = useState(session?.user?.image ?? "")
    const [name, setName] = useState(session?.user?.name ?? "")
    const [status, setStatus] = useState("");
    const { storage, updateLocalStorage } = useLocalStorage<Optional<User, 'id'>>('user')

    const mutation = trpc.updateProfile.useMutation({ networkMode: 'always' })

    async function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        await mutation.mutateAsync({ username, image, name, status });
        if (mutation.isSuccess) {
            updateLocalStorage({ username, image, name })
        }
    }

    return (
        <>
            <form onSubmit={submit} className="flex flex-col w-1/2 h-1/2 bg-teal-800 p-3 rounded-xl shadow-lg">

                <FormInput label="Username" value={username} setValue={setUsername} />
                <FormInput label="Image" value={image} setValue={setImage} />
                <FormInput label="Name" value={name} setValue={setName} />
                <FormInput label="Status" value={status} setValue={setStatus} isTextarea />
                <button
                    className="bg-green-300 mt-3 rounded-full disabled:bg-slate-500"
                    type="submit"
                    disabled={mutation.status == 'loading'}
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


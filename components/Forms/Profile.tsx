import { signOut } from "next-auth/react"
import React, { useContext, useState } from "react"
import { useLocalStorage } from "../../hooks/useLocalStorage"
import { ContextUser, UserContext } from "../../hooks/userContext"
import { trpc } from "../../utils/trpc"
import FormInput from "./FormInput"
import { exitSvg } from "../../utils/svgs"
import SubmitButton from "./SubmitButton"

export default function Profile() {
    const { user, setUser } = useContext(UserContext)!
    const [username, setUsername] = useState(user?.username ?? "")
    const [image, setImage] = useState(user?.image ?? "")
    const [name, setName] = useState(user?.name ?? "")
    const [status, setStatus] = useState(user?.status ?? "");
    const { updateLocalStorage } = useLocalStorage<ContextUser>('user')

    const mutation = trpc.user.updateProfile.useMutation({ networkMode: process.env.NODE_ENV == 'development' ? 'always' : 'online' })

    async function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        await mutation.mutateAsync({ username, image, name, status });
        if (mutation.isSuccess) {
            setUser({ username, image, name, status, email: user!.email })
            updateLocalStorage({ username, image, name, status, email: user!.email });
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
                    setValue={setImage}
                />
                <FormInput
                    label="Name"
                    value={name}
                    setValue={setName}
                />
                <FormInput
                    label="Status"
                    value={status}
                    setValue={setStatus}
                    max={255}
                    isTextarea
                />
                <SubmitButton
                    disabledWhen={username.length < 3 || username.length > 20 || status.length > 255}
                    mutation={mutation}
                />
            </form>
            <button className="bg-red-600" onClick={() => signOut()}>
                {exitSvg}
                Sign Out
            </button>
        </>
    )
}

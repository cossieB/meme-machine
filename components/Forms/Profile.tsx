import { signOut } from "next-auth/react"
import React, { useContext, useRef, useState } from "react"
import { useLocalStorage } from "../../hooks/useLocalStorage"
import { ContextUser, UserContext } from "../../hooks/userContext"
import { trpc } from "../../utils/trpc"
import FormInput from "./FormInput"
import { exitSvg } from "../../utils/svgs"
import SubmitButton from "./SubmitButton"
import ActionButton from "../Nav/ActionButton"
import { NavItem } from "../Nav/SideBarIcon"

export default function Profile() {
    const { user, setUser } = useContext(UserContext)!
    const [username, setUsername] = useState(user?.username ?? "")
    const [image, setImage] = useState(user?.image ?? "")
    const [name, setName] = useState(user?.name ?? "")
    const [status, setStatus] = useState(user?.status ?? "");
    const [banner, setBanner] = useState(user?.banner ?? "")
    const { updateLocalStorage } = useLocalStorage<ContextUser>('user')

    const errorDiv = useRef<HTMLParagraphElement>(null)

    const mutation = trpc.user.updateProfile.useMutation({ networkMode: process.env.NODE_ENV == 'development' ? 'always' : 'online' })

    async function submit(e: React.FormEvent<HTMLFormElement>) {
        errorDiv.current!.textContent = "";
        e.preventDefault()
        mutation.mutate({ username: username.trimEnd(), image, name, status }, {
            onSuccess() {
                setUser({ username, image, name, status, banner, email: user!.email })
                updateLocalStorage({ username, image, name, status, banner, email: user!.email });
            },
            onError(error) {
                if (error.message == 'username already taken') {
                    errorDiv.current!.textContent = error.message;
                }
            },
        });

    }

    return (
        <>
            <form onSubmit={submit} className="flex flex-col w-11/12 md:w-1/2 h-5/6 bg-teal-800 p-3 rounded-xl shadow-lg">

                <FormInput
                    label="Username"
                    value={username}
                    setValue={setUsername}
                    max={20}
                    min={3}
                    pattern="^\w+$"
                    title="Only letters, numbers, underscores allowed"
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
                    label="Banner"
                    value={banner}
                    setValue={setBanner}
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
                <p className="bg-red-300" ref={errorDiv} />
            </form>
            <ActionButton
                onClick={() => signOut()}
            >
                <NavItem
                    icon={exitSvg}
                    text="Sign Out"
                />
            </ActionButton>
        </>
    )
}


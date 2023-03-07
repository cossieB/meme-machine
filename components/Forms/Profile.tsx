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
import uploadToFirebase from "../../utils/uploadToFirebase"
import FileInput from "./FileInput"
import ToggleLinkOrUpload from "./ToggleIsLinkOrUpload"
import writeErrorInDiv from "../../utils/writeErrorsInDiv"

export default function Profile() {
    const { user, setUser } = useContext(UserContext)!;
    const [username, setUsername] = useState(user?.username ?? "")
    const [image, setImage] = useState(user?.image ?? "")
    const [name, setName] = useState(user?.name ?? "")
    const [status, setStatus] = useState(user?.status ?? "");
    const [banner, setBanner] = useState(user?.banner ?? "")
    const [avatarIsUpload, setAvatarIsUpload] = useState(false)
    const [uploadedAvatar, setUploadedAvatar] = useState<File>()
    const [bannerIsUpload, setBannerisUpload] = useState(false)
    const [uploadedBanner, setUploadedBanner] = useState<File>()
    const { updateLocalStorage } = useLocalStorage<ContextUser>('user')
    const [submitted, setSubmitted] = useState(false)

    const errorDiv = useRef<HTMLParagraphElement>(null)

    const mutation = trpc.user.updateProfile.useMutation({ networkMode: process.env.NODE_ENV == 'development' ? 'always' : 'online' })

    async function submit(e: React.FormEvent<HTMLFormElement>) {
        errorDiv.current!.textContent = "";
        setSubmitted(true)
        e.preventDefault();
        let profilePic = image;
        let bannerPic = banner;
        try {
            if (avatarIsUpload) {
                if (!uploadedAvatar) return;
                try {
                    profilePic = await uploadToFirebase(uploadedAvatar, `/users/avatars/${user!.username}`)
                }
                catch (e: any) {
                    writeErrorInDiv(e.message, errorDiv)
                    return
                }
            }
            if (bannerIsUpload) {
                if (!uploadedBanner) return
                try {
                    bannerPic = await uploadToFirebase(uploadedBanner, `/users/banners/${user!.username}`)
                }
                catch (e: any) {
                    writeErrorInDiv(e.message, errorDiv)
                    return
                }
            }
            mutation.mutate({ username: username.trim(), image, name, status, banner }, {
                onSuccess() {
                    setUser({ username, image: profilePic, name, status, banner, email: user!.email, id: user!.id })
                    updateLocalStorage({ username, image, name, status, banner, email: user!.email, id: user!.id });
                },
                onError(error) {
                    if (error.message == 'username already taken') {
                        writeErrorInDiv(error.message, errorDiv)
                    }
                },
            });
        }
        finally {
            setSubmitted(false)
        }
    }

    return (
        <>
            <form onSubmit={submit} className="flex flex-col w-11/12 md:w-1/2 h-5/6 bg-slate-800 p-3 rounded-xl shadow-lg">

                <FormInput
                    label="Username"
                    value={username}
                    setValue={setUsername}
                    max={20}
                    min={3}
                    pattern="^\w+$"
                    title="Only letters, numbers, underscores allowed"
                />
                <ToggleLinkOrUpload
                    isUpload={avatarIsUpload}
                    name="avatar"
                    rollback={() => setImage(user!.image)}
                    setIsUpload={setAvatarIsUpload}
                />
                {avatarIsUpload
                    ?
                    <FileInput
                        setFile={setUploadedAvatar}
                        label="Profile Picture"
                        handleError={(str: string) => writeErrorInDiv(str, errorDiv)}
                    />
                    :
                    <FormInput
                        label="Profile Picture"
                        value={image}
                        setValue={setImage}
                    />
                }
                <FormInput
                    label="Name"
                    value={name}
                    setValue={setName}
                />
                <ToggleLinkOrUpload
                    isUpload={bannerIsUpload}
                    name="banner"
                    rollback={() => setBanner(user!.banner)}
                    setIsUpload={setBannerisUpload}
                />
                {bannerIsUpload
                    ?
                    <FileInput
                        setFile={setUploadedBanner}
                        label="Banner Image"
                        handleError={(str: string) => writeErrorInDiv(str, errorDiv)}
                    />
                    :
                    <FormInput
                        label="Banner Image"
                        value={banner}
                        setValue={setBanner}
                    />
                }
                <FormInput
                    label="Status"
                    value={status}
                    setValue={setStatus}
                    max={255}
                    isTextarea
                />
                <SubmitButton
                    disabledWhen={username.length < 3 || username.length > 20 || status.length > 255 || submitted}
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
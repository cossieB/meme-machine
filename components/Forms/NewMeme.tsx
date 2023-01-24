import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { ModalContext } from "../../hooks/modalContext";
import { UserContext } from "../../hooks/userContext";
import { trpc } from "../../utils/trpc";
import FormInput from "./FormInput";
import SubmitButton from "./SubmitButton";

export default function NewMeme() {
    const [title, setTitle] = useState("")
    const [image, setImage] = useState("")
    const [description, setDescription] = useState("")
    const router = useRouter()
    const mutation = trpc.meme.publishMeme.useMutation()
    const utils = trpc.useContext()
    const {user} = useContext(UserContext)!
    const {closeModal} = useContext(ModalContext)!

    function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        mutation.mutate({ title: title.trim(), image, description }, {
            onSuccess(data, variables, context) {
                utils.meme.getMeme.setData(data.postId, {...data, user: {
                    image: user!.image,
                    username: user!.username
                }})
                closeModal()
                router.push(`/posts/${data.postId}`)
            },
        });

    }
    return (
        <>
            <form onSubmit={submit} className="flex flex-col w-11/12 md:w-1/2 h-5/6 bg-teal-800 p-3 rounded-xl shadow-lg">
                <FormInput
                    label="Title"
                    value={title}
                    setValue={setTitle}
                    min={1}
                    max={100}
                />
                <FormInput
                    label="Image"
                    value={image}
                    setValue={setImage}
                    min={1}
                />
                <FormInput
                    label="Details"
                    value={description}
                    setValue={setDescription}
                    isTextarea
                    max={255}
                />
                <SubmitButton
                    mutation={mutation}
                    disabledWhen={ title.length == 0 || title.length > 100 || !image || description.length > 255 }
                />
            </form>
        </>
    )
}
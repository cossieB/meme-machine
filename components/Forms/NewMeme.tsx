import { useState } from "react";
import { trpc } from "../../utils/trpc";
import FormInput from "./FormInput";
import SubmitButton from "./SubmitButton";

export default function NewMeme() {
    const [title, setTitle] = useState("")
    const [image, setImage] = useState("")
    const [description, setDescription] = useState("")
    const mutation = trpc.meme.publishMeme.useMutation()

    async function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        await mutation.mutateAsync({ title, image, description });
        if (mutation.isSuccess) {
            
        }
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
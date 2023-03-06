import { useRouter } from "next/router";
import { useContext, useRef, useState } from "react";
import { ModalContext } from "../../hooks/modalContext";
import { UserContext } from "../../hooks/userContext";
import { trpc } from "../../utils/trpc";
import uploadToFirebase from "../../utils/uploadToFirebase";
import FileInput from "./FileInput";
import FormInput from "./FormInput";
import SubmitButton from "./SubmitButton";
import ToggleLinkOrUpload from "./ToggleIsLinkOrUpload";

export default function NewMeme() {
    const [title, setTitle] = useState("")
    const [image, setImage] = useState("")
    const [description, setDescription] = useState("")
    const router = useRouter()
    const mutation = trpc.meme.publishMeme.useMutation()
    const utils = trpc.useContext()
    const { user } = useContext(UserContext)!
    const { closeModal } = useContext(ModalContext)!
    const [imageIsUpload, setImageIsUpload] = useState(false)
    const [file, setFile] = useState<File>()
    const errorDiv = useRef<HTMLParagraphElement>(null)

    async function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        let meme = image;
        if (imageIsUpload) {
            if (!file) return;
            try {
                meme = await uploadToFirebase(file, `memes/${user!.username}${new Date().getTime()}`);
                console.log(meme)
            }
            catch (e: any) {
                errorDiv.current!.textContent = e.message;
                setTimeout(() => {
                    errorDiv.current!.textContent = ""
                }, 2500)
                return
            }
        }; 
        mutation.mutate({ title: title.trim(), image: meme, description }, {
            onSuccess(data) {
                utils.meme.getMeme.setData(data.postId, {
                    ...data,
                    user: {
                        image: user!.image,
                        username: user!.username
                    }
                })
                closeModal()
                router.push(`/posts/${data.postId}`)
            },
        });

    }
    return (
        <>
            <form onSubmit={submit} className="flex flex-col w-11/12 lg:w-1/2 h-5/6 bg-slate-800 p-3 rounded-xl shadow-lg">
                <FormInput
                    label="Title"
                    value={title}
                    setValue={setTitle}
                    min={1}
                    max={100}
                />
                <ToggleLinkOrUpload
                    isUpload={imageIsUpload}
                    name="image"
                    rollback={() => { }}
                    setIsUpload={setImageIsUpload}
                />
                {imageIsUpload
                    ?
                    <FileInput
                        label="Image"
                        setFile={setFile}
                    />
                    :
                    <FormInput
                        label="Image"
                        value={image}
                        setValue={setImage}
                        min={1}
                    />
                }
                <FormInput
                    label="Details"
                    value={description}
                    setValue={setDescription}
                    isTextarea
                    max={255}
                />
                <SubmitButton
                    mutation={mutation}
                    disabledWhen={title.length == 0 || title.length > 100 || (!imageIsUpload && !image) || (imageIsUpload && !file) || description.length > 255}
                />
                <p ref={errorDiv} className="bg-red-300" />
            </form>
        </>
    )
}
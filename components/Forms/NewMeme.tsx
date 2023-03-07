import { useRouter } from "next/router";
import { RefObject, useContext, useRef, useState } from "react";
import { ModalContext } from "../../hooks/modalContext";
import { UserContext } from "../../hooks/userContext";
import { trpc } from "../../utils/trpc";
import uploadToFirebase from "../../utils/uploadToFirebase";
import writeErrorInDiv from "../../utils/writeErrorsInDiv";
import FileInput from "./FileInput";
import FormInput from "./FormInput";
import SubmitButton from "./SubmitButton";
import ToggleLinkOrUpload from "./ToggleIsLinkOrUpload";

export default function NewMeme() {
    const [title, setTitle] = useState("")
    const [imageUrl, setImageUrl] = useState("")
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
        if (imageIsUpload) {
            if (!file) return;
            if (file.size > 1024 * 1024)
                return writeErrorInDiv("Maximum file size is 1MB", errorDiv)

            let base64Img = await getBase64(file)
            if (typeof base64Img != 'string') return;
            base64Img = base64Img.replace(/^data:.+base64,/, '')

            mutation.mutate({
                title: title.trim(),
                description,
                image: {
                    type: 'base64',
                    data: base64Img
                }
            }, {
                onError(error) {
                    writeErrorInDiv(error.message, errorDiv)
                },
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
            })
        }
        else {
            mutation.mutate({
                description,
                title: title.trim(),
                image: {
                    type: 'url',
                    data: imageUrl
                },
            }, {
                onError(error) {
                    writeErrorInDiv(error.message, errorDiv)
                },
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
    }
    function getBase64(file: File): Promise<string | ArrayBuffer | null> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => resolve(reader.result)
            reader.onerror = error => reject(error)
        })
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
                        label={file ? file.name : "Select Image"}
                        setFile={setFile}
                        handleError={(str: string) => writeErrorInDiv(str, errorDiv)}
                    />
                    :
                    <FormInput
                        label="Image"
                        value={imageUrl}
                        setValue={setImageUrl}
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
                    disabledWhen={title.length == 0 || title.length > 100 || (!imageIsUpload && !imageUrl) || (imageIsUpload && !file) || description.length > 255}
                />
                <p ref={errorDiv} className="bg-red-300" />
            </form>
        </>
    )
}
import React, { useState } from "react"
import { trpc } from "../../utils/trpc"
import FormInput from "../Forms/FormInput"
import SubmitButton from "../Forms/SubmitButton"

type P = {
    postId: string
}

export default function AddComment({postId}: P) {
    const utils = trpc.useContext()
    const [content, setContent] = useState("")
    const mutation = trpc.comment.addComment.useMutation()

    async function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        mutation.mutate({postId, content}, {
            onSuccess() {
                utils.comment.all.refetch(postId)
            },
        })
    }

    return (
        <form onSubmit={submit} className="flex w-full flex-col text-black" >
            <FormInput 
                label="Add Comment"
                setValue={setContent}
                value={content}
                max={255}
                min={1}
                isTextarea
            />
            <SubmitButton
                disabledWhen={content.length > 255 || content.length == 0}
                mutation={mutation}
            />
        </form>
    )
}
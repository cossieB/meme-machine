import Link from "next/link";
import { useRouter } from "next/router";
import React, { SetStateAction, useContext, useState } from "react";
import { UserContext } from "../pages/_app";

interface P {
    id: string,
    setRerenderChildren: React.Dispatch<SetStateAction<number>>
}

export default function LikeAndComment({id, setRerenderChildren}: P) {
    const user = useContext(UserContext)?.user
    const [comment, setComment] = useState("")
    const router = useRouter()

    async function handleSubmit(e: React.ChangeEvent<HTMLFormElement>) {
        e.preventDefault()
        if (comment.length < 3 || comment.length > 200) return

        let response = await fetch('/api/comments', {
            method: "POST",
            body: JSON.stringify({comment, id}),
            headers: {
                "Content-Type": "application/json"
            }
        })
        let data = await response.json()
        if (data.msg == 'ok') {
            setComment("")
            setRerenderChildren(Math.random())
        }
    }

    if (!user) {
        return (
            <div>
                <Link href={`/auth?action=login&redirect=posts/${id}`}><a><strong><em>Login</em></strong></a></Link> or <Link href={`/auth?action=login&redirect=posts/${id}`}><a><strong><em>Signup</em></strong></a></Link> to comment and like
            </div>
        )
    }
    else {
        return (
            <form className="form" style={{marginTop: '2rem', width: "100%"}} onSubmit={handleSubmit}>
                <textarea placeholder="Comment" required minLength={3} maxLength={200} style={{height: "5rem"}} value={comment} onChange={e => setComment(e.target.value)} />
                <button type="submit">Submit</button>
            </form>
        )
    }
}
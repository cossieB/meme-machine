import { JwtPayload } from "jsonwebtoken"
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import React, { useState } from "react"
import styles from '../../styles/new.module.scss';
import jwt from 'jsonwebtoken'
import { getServerSideUser } from "../../utils/getServerSideUser";
import { useRouter } from "next/router";


interface P {
    authenticated: boolean
}

export default function NewPost() {
    const [title, setTitle] = useState("")
    const [url, setUrl] = useState("")
    const [description, setDescription] = useState("")
    const [urlError, setUrlError] = useState("")
    const router = useRouter()

    function validateUrl(val: string) {
        if (/^https?:\/\/.+\.(png|jpg|webp|jpeg)$/i.test(val)) {
            setUrlError("")
            return true
        }
        else {
            setUrlError("Please provide a valid image file");
            return false
        }
    }

    async function handleSubmit(e: React.ChangeEvent<HTMLFormElement>) {
        e.preventDefault()
        if (validateUrl(url)) {
            let res = await fetch("/api/new-post", {
                method: "POST",
                body: JSON.stringify({title: title.trim(), description, url}),
                headers: {
                    "Content-Type": "application/json",
                }
            })
            let data = await res.json()
            if (data.id) router.push("/posts/"+data.id)
        }
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        let val = e.target.value
        if (e.target.id == "Image-URL") {
            setUrl(val)
            validateUrl(val)
            val == "" && setUrlError("")
        }
        else {
            e.target.id == "Title" ? setTitle(val) : setDescription(val)
        }
    }

    return (
        <>
            <h1 style={{width: '50vw', textAlign: 'center'}} className="label-header" >New Meme</h1>
        <div className={`flexCenter ${styles.form}`} style={{height: "100%"}} >
            <form onSubmit={handleSubmit} style={{ width: "50vw" }} method="POST" encType="multipart/formdata">
                <label htmlFor="Title">Title</label>
                <input type="text" placeholder="Title" id="Title" value={title} onChange={handleChange} minLength={3} maxLength={25} required />
                <div className={styles.error}></div>
                <label htmlFor="Image-URL">Image URL</label>
                <input name="url" type="text" placeholder="Image URL" autoComplete="off" id="Image-URL" value={url} onChange={handleChange} />
                <div className={styles.error}>{urlError}</div>
                <label htmlFor="Description">Description</label>
                <textarea style={{ height: "5rem" }} name="description" placeholder="Description" autoComplete="off" id="Description" value={description} onChange={handleChange} maxLength={200} />
                <div className={styles.error}></div>
                {/* <input name="file" type="file" /> */}
                <button className="submit" type="submit">Submit</button>
            </form>
        </div>
        </>
    )
}

export function getServerSideProps(context: GetServerSidePropsContext): GetServerSidePropsResult<P> {
    const user = getServerSideUser(context)
    
    if (!user) {
        return {
            redirect: {destination: "/auth", permanent: false}
        }
    }
    return {
        props: {authenticated: true}
    }
}


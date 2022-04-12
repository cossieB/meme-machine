import { useRouter } from "next/router"
import React, { SetStateAction, useState } from "react"

interface P {
    id: string,
    title: string,
    description?: string,
    image: string,
    showModal: React.Dispatch<SetStateAction<boolean>>
}

export default function(props: P) {
    const {id, title, description, image, showModal} = props
    const [newTitle, setNewTitle] = useState(title)
    const [newDescription, setNewDescription] = useState(description)
    const [error, setError] = useState("")
    const router = useRouter()

    async function handleSubmit(e: React.ChangeEvent<HTMLFormElement>) {
        e.preventDefault()
        let response = await fetch('/api/new-post', {
            method: "PUT",
            body: JSON.stringify({title: newTitle.trim(), description: newDescription, id}),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        let data = await response.json()
        if (data.msg == 'ok') router.reload()
        if (data.error) setError(data.error)
    }

    return (
        <div className="flexColumn" style={{width: '100%'}}>
            <h3>Edit Post</h3>
            <form style={{width: '80%'}} onSubmit={handleSubmit} >
                <label htmlFor="newTitle">New Title</label>
                <input type="text" name="newTitle" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} minLength={3} maxLength={25} required />
                <label htmlFor="newDescription">New Description</label>
                <textarea style={{height: '5rem', marginBottom: '1rem'}} value={newDescription} onChange={(e) => setNewDescription(e.target.value)} maxLength={200}  />
                <label htmlFor="ImageURL">Image URL</label>
                <input type="text" disabled placeholder={image} />
                <button className="submit" type="submit">Submit</button>
                <button type="button" onClick={() => showModal(false)}>Cancel</button>
            </form>
            { error && <div>{error}</div>  }
        </div>
    )
}
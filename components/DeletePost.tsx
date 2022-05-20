import router from "next/router"
import { SetStateAction, useRef, useState } from "react"

interface P {
    id: string,
    title: string
    showModal: React.Dispatch<SetStateAction<boolean>>
}

export default function DeletePost({ id, title, showModal }: P) {
    const [input, setInput] = useState("")
    const [error, setError] = useState("")

    async function deletePost() {
        let response = await fetch('/api/new-post', {
            method: "DELETE",
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({ id })
        })
        let data = await response.json()
        if (data.msg == 'ok') router.replace('/posts')
        if (data.error) setError(data.error)
    }

    return (
        <div >
            <h3>Delete Post?</h3>
            <p>This is irreversible</p>
            <p>Enter the title <strong>{title}</strong> below</p>
            <input style={{ height: '3rem' }} type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
            />
            <button className="danger" onClick={deletePost} disabled={input != title} >Delete</button>
            <button onClick={() => showModal(false)} >Cancel</button>
            { error && <div>{error}</div>  }
        </div>
    )
}
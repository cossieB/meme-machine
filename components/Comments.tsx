import { useEffect, useState } from "react"
import styles from "../styles/Posts.module.css"

interface P {
    id: string,
    rerender?: number
}

interface C {
    content: string
    date: Date
    username: string
}

export default function Comment({ id, rerender }: P) {
    const [comments, setComments] = useState<C[]>([])
    useEffect(() => {
        (async function () {
            let response = await fetch(`/api/comments/?id=${id}`)
            let data = await response.json()
            let coms: C[] = data.response.map((com: C) => ({
                content: com.content,
                date: new Date(com.date),
                username: com.username
            }))
            console.log(coms)
            setComments(coms)
        })()
    },[rerender])
    return (
        <div>
            {comments.map(comment =>
                <div key={comment.date.getTime()} className={styles.commentDiv} >
                    <div className={`${styles.partition} ${styles.flexApart}`} >
                        <div>{comment.date.toDateString()}</div>
                        <div>{comment.username}</div>
                    </div>
                    <div className={styles.partition} >{comment.content}</div>
                </div>
            )}
        </div>
    )
}
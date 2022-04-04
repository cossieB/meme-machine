import Link from "next/link";
import { useEffect, useState } from "react"
import styles from "../styles/Posts.module.css";
import {IComment} from "../utils/interfaces"

interface P {
    id: string,
    rerender?: number
}


export default function Comment({ id, rerender }: P) {
    const [comments, setComments] = useState<IComment[]>([])
    useEffect(() => {
        (async function () {
            let response = await fetch(`/api/comments/?id=${id}`)
            let data = await response.json(); 
            let coms: IComment[] = data.response.map((com: IComment) => ({
                content: com.content,
                date: new Date(com.date),
                user: com.user
            }))
            setComments(coms)
        })()
    },[rerender])
    return (
        <div>
            {comments.map(comment =>
                <div key={comment.date.getTime()} className={styles.commentDiv} >
                    <div className={`${styles.partition} ${styles.flexApart}`} >
                        <div>{comment.date.toDateString()}</div>
                        <div><Link href={`../users/${comment.user.username}`}>{comment.user.username}</Link></div>
                    </div>
                    <div className={styles.partition} >{comment.content}</div>
                </div>
            )}
        </div>
    )
}